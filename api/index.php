<?php

// Booker API
// Перехватывает остальной путь URL-адреса (после http://localhost/booker/api/) и обрабатывает его.



//////////////////////////
// Начальная подготовка //
//////////////////////////

require_once '../service/config.php';
require_once '../service/bookerlib.php';

mb_internal_encoding('utf-8');

$output = null;

//////////////////////////
// Начальная подготовка //
//////////////////////////







$request_pars = strpos($_SERVER['REQUEST_URI'], '?');
$request_path = explode('/', substr($_SERVER['REQUEST_URI'], 0, ($request_pars === false) ? null : $request_pars));

$request_method = $_SERVER['REQUEST_METHOD'];


// Далее, в зависимости от пути request_path и метода request_method выполняется требуемое клиенту действие.
switch ($request_method)
{
    case 'GET':
        if ($request_path[3] === 'books')
        {
            // Обработка запроса на получение книг в зависимости от переданных GET-параметров.
            if ($request_path[4] === 'search')
            {
                // Сбор условий для выборки и связанных таблиц соответственно.
                $qConditions = $qTables = [];


                // Обработка GET-параметров.
                foreach ($_GET as $key => $get)
                {
                    switch ($key)
                    {
                        // Ключевые слова
                        // Запрос пользователя разделяется по словам, убираются ненужные символы и преобразуются в формат для полнотекстового поиска
                        case 'k':
                            if (is_string($get))
                            {
                                $str = '*'.implode('**', explode(' ', preg_replace('/[^a-zA-Zа-яА-Я0-9\s\w№\-\'\"]/u', '', $get))).'*';
                                $qConditions[] = [ 'condition' => 'MATCH(`name`) AGAINST(? IN BOOLEAN MODE)', 'parameter' => "'$str'", ]; 
                            }
                            break;

                        // Авторы разделяются запятыми. Поиск происходит по id
                        case 'authors':
                            if (is_string($get) && $get)
                            {
                                $authors = [];
                                foreach (array_unique(explode(',', $get)) as $author)
                                {
                                    if (is_numeric($author))
                                    {
                                        $authors[] = 'ab.`author_id` = ?';
                                        $qConditions[] = [ 'parameter' => $author, ];
                                    }
                                }

                                $qConditions[] = [ 'condition' => implode(' OR ', $authors), ];
                                $qTables[] = 'LEFT JOIN `authors_of_books` ab ON ab.`book_id`=b.`id`';
                            }
                            break;

                        // Жанры разделяются запятыми. Поиск происходит по id
                        case 'genres':
                            if (is_string($get) && $get)
                            {
                                $genres = [];
                                foreach (array_unique(explode(',', $get)) as $genre)
                                {
                                    if (is_numeric($genre))
                                    {
                                        $genres[] = 'gb.`genre_id` = ?';
                                        $qConditions[] = [ 'parameter' => $genre, ];
                                    }
                                }

                                $qConditions[] = [ 'condition' => implode(' OR ', $genres), ];
                                $qTables[] = 'LEFT JOIN `genres_of_books` gb ON gb.`book_id`=b.`id`';
                            }
                            break;
                    }
                }

                try
                {
                    // Происходит подключение к базе данных, условия выборки склеиваются в $conditions с AND, выполняется запрос в БД

                    $link = mysqli_connect($host, $user, $password, $database);

                    $tables = implode(' ', array_unique($qTables));
                    $conditions = count($qConditions) ? 'WHERE '.implode(' AND ', array_map(fn($c) => "($c)", array_column($qConditions, 'condition'))) : '';
                    $query = "SELECT DISTINCT b.`id`, b.`name`, b.`description`, b.`picture_name`, (SELECT GROUP_CONCAT(CONCAT(IF(a.`surname` IS NULL, '', CONCAT(a.`surname`, ' ')), a.`name`, IF(a.`patronymic` IS NULL, '', CONCAT(' ', a.`patronymic`))) SEPARATOR ', ') FROM `authors_of_books` ab LEFT JOIN `authors` a ON a.`id`=ab.`author_id` WHERE ab.`book_id`=b.`id`) AS `authors`, (SELECT GROUP_CONCAT(g.`name` SEPARATOR ', ') FROM `genres_of_books` gb LEFT JOIN `genres` g ON g.`id`=gb.`genre_id` WHERE gb.`book_id`=b.`id`) AS `genres` FROM `books` b $tables $conditions;";
                    
                    $booksRows = libSqlQuery($link, $query, ...array_column($qConditions, 'parameter'));

                    mysqli_close($link);
                    
                    if (is_array($booksRows))
                    {
                        // Подготовка данных на отправку: полученные данные перебираются и заносятся в $output.

                        $books = [];

                        foreach ($booksRows as $book)
                        {
                            $books[] = [
                                'id' => $book['b_id'],
                                'title' => $book['b_name'],
                                'description' => $book['b_description'],
                                'authors' => $book['authors'],
                                'genres' => $book['genres'],
                                'picture' => [
                                    'url' => $book['b_picture_name'],
                                ],
                            ];
                        }

                        $output = [
                            'total' => count($booksRows),
                            'items' => $books,
                        ];

                        header("HTTP/1.1 200 OK");
                    }
                }
                catch (Exception $e)
                {
                    $output['error'] = [
                        'code' => '520',
                        'message' => 'Server error',
                        'errors' => [[
                            'message' => $e->getMessage(),
                            'reason' => 'unknownError',
                        ]],
                    ];
            
                    header("HTTP/1.1 520 Unknown Error");
                }
            }

            // Обработка запроса на получение авторов и жанров.
            if ($request_path[4] === 'filters')
            {
                try
                {
                    // Обращение в БД происходит 1 раз за счёт множественного запроса mysqli_multi_query

                    $link = mysqli_connect($host, $user, $password, $database);

                    $query = "SELECT * FROM `authors`;";
                    $query .= "SELECT * FROM `genres`;";

                    mysqli_multi_query($link, $query);

                    $authorsRows = mysqli_store_result($link); // получение всех авторов

                    mysqli_next_result($link);

                    $genresRows = mysqli_store_result($link); // получение всех жанров

                    mysqli_close($link);

                    if ($authorsRows && $genresRows)
                    {
                        // Подготовка данных на отправку: полученные данные перебираются и заносятся в $output.

                        $authors = [];
                        while($author = mysqli_fetch_assoc($authorsRows))
                        {
                            $authors[] = [
                                'id' => $author['id'],
                                'surname' => $author['surname'],
                                'name' => $author['name'],
                                'patronymic' => $author['patronymic'],
                            ];
                        }
                        
                        $genres = [];
                        while($genre = mysqli_fetch_assoc($genresRows))
                        {
                            $genres[] = [
                                'id' => $genre['id'],
                                'title' => $genre['name'],
                            ];
                        }

                        $output = [
                            'authorsList' => $authors,
                            'genresList' => $genres,
                        ];

                        header("HTTP/1.1 200 OK");
                    }
                }
                catch (Exception $e)
                {
                    $output['error'] = [
                        'code' => '520',
                        'message' => 'Server error',
                        'errors' => [[
                            'message' => $e->getMessage(),
                            'reason' => 'unknownError',
                        ]],
                    ];
            
                    header("HTTP/1.1 520 Unknown Error");
                }
            }
        }
        break;
    default:
        // Для методов кроме GET отправляем сообщение с ошибкой клиенту.

        $output['error'] = array(
            'code' => '405',
            'message' => "The method is not allowed.",
            'errors' => [[
                'message' => "The method is not allowed.",
                'reason' => 'methodNotAllowed',
            ]],
        );

        header("HTTP/1.1 405 Method Not Allowed");
}



if ($output)
{
    // Ответ клиенту передаётся в виде JSON-объекта.

    header('Content-Type: application/json; charset=utf-8');
    die (json_encode($output));
}
else if (!is_array($output))
{
    // Если путь неверный, отправлем клиенту сообщение об отсутствии искомого ресурса.

    header("HTTP/1.1 404 Not Found");
    header('Content-Type: application/json; charset=utf-8');
    die (json_encode([
        'error' => [
            'code' => '404',
            'message' => "The required resource not found.",
            'errors' => [[
                'message' => "The required resource not found.",
                'reason' => 'resourceNotFound',
            ]],
        ],
    ]));
}
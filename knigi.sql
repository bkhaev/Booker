-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Июл 21 2023 г., 12:49
-- Версия сервера: 10.4.24-MariaDB
-- Версия PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `knigi`
--

-- --------------------------------------------------------

--
-- Структура таблицы `authors`
--

CREATE TABLE `authors` (
  `id` int(11) NOT NULL,
  `surname` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `patronymic` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Таблица хранит авторов книг';

--
-- Дамп данных таблицы `authors`
--

INSERT INTO `authors` (`id`, `surname`, `name`, `patronymic`) VALUES
(1, 'Контронович', 'Александр', 'Сергеевич'),
(2, 'Лазарева', 'Молка', NULL),
(3, 'Терешкова', 'Анна', NULL),
(4, 'Вовк', 'Елена', 'Ивановна'),
(5, 'Гарднер', 'Салли', NULL),
(6, 'Ивашкин', 'Константин', 'Владимирович');

--
-- Триггеры `authors`
--
DELIMITER $$
CREATE TRIGGER `authors-empty-to-null` BEFORE INSERT ON `authors` FOR EACH ROW BEGIN
IF new.surname = '' THEN
	SET new.surname = NULL;
END IF;

IF new.patronymic = '' THEN
	SET new.patronymic = NULL;
END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Структура таблицы `authors_of_books`
--

CREATE TABLE `authors_of_books` (
  `book_id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `authors_of_books`
--

INSERT INTO `authors_of_books` (`book_id`, `author_id`) VALUES
(1, 1),
(2, 2),
(2, 3),
(3, 4),
(4, 5),
(5, 4),
(5, 6);

-- --------------------------------------------------------

--
-- Структура таблицы `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(3000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `picture_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Таблица хранит информацию о книгах';

--
-- Дамп данных таблицы `books`
--

INSERT INTO `books` (`id`, `name`, `description`, `picture_name`) VALUES
(1, 'Штормовые острова', 'Инопланетное вторжение вынудило Министерство обороны России создать особое воинское подразделение. В его состав вошел молодой старший лейтенант Дмитрий Ларин. На первом же задании Дмитрий вступает в поединок с командиром штурмового отряда инопланетного «черного корабля». Победа над противником принесла российскому офицеру неожиданный результат…', 'https://cdn.img-gorod.ru/310x500/nomenclature/26/558/2655826.jpg'),
(2, 'Космос ведьме не игрушка', 'Тебя похитили инопланетяне? Возможно, все не так ужасно, как кажется на первый взгляд. Все гораздо хуже! .Тебя заставят участвовать в запрещенном конкурсе на выживание, обзовут ведьмой и пригрозят сдать на опыты. Ведь девушки с Земли - это не просто экзотические зверушки для развлечения космических богачей, но и носители уникального генетического материала, заполучить который желает каждый. .И если бы не спасатели в лице космического эльфа, киборга Бабы-яги и капитана магического корабля, еще неизвестно, как дело бы повернулось. .Даже с учетом того, что ведьмы, пусть и ненастоящие, никогда не сдаются...', 'https://cdn.img-gorod.ru/310x500/nomenclature/26/176/2617605.jpg'),
(3, 'Неалкогольная жировая болезнь печени : руководство для практических врачей', 'Раннее выявление неалкогольной болезни печени и настойчивая коррекция ассоциированных кардиометаболических рисков в свете первичной профилактики сердечно-сосудистых заболеваний относятся сегодня к презумпции терапевта поликлиники и врача общей практики. Освещению различных аспектов формирования неалкогольной болезни печени, ее ранней диагностики и лечения в рамках терапевтической практики и посвящена эта очень нужная и своевременная книга.', 'https://cdn.img-gorod.ru/310x500/nomenclature/26/546/2654643.jpg'),
(4, 'Похититель ковров-самолетов', 'Коту Непоседе пришло очень важное письмо от самой королевы фей! Бедняжка начала угасать без своих крыльев: ещё немного - и она совсем исчезнет! Но она не может отправиться на их поиски - её ковёр-самолёт украли! А в это время в Глубоком Логе появился некто, кто хочет увезти из города все старинные ковры. Какое странное совпадение! Может быть, этот загадочный незнакомец знает, где ковёр королевы? Непоседе, Эмили и её друзьям придётся выяснить это и спасти её величество! .Салли Гарндер - всемирно известная детская писательница, обладатель Медали Карнеги и других престижных литературных наград. Её книги переведены на 22 языка и продаются миллионными тиражами! .Пятая книга серии. .Для среднего школьного возраста.', 'https://cdn.img-gorod.ru/310x500/nomenclature/27/541/2754196.jpg'),
(5, 'Гастропротекция. Руководство для практических врачей', 'Данная книга посвящена гастропротекции — ключевому вопросу современной клиники внутренних болезней. В качестве иллюстрации к этому положению можно привести следующие данные. Прежде всего высокая частота сердечно-сосудистой коморбидности, вредных факторов риска полипрогмазии и многое другое, что способствует развитию синдрома гиперацидности. В последующем нередко развитие эрозивно-язвенных повреждений желудочно-кишечного тракта, что явно усугубляет и без того негативный прогноз. В то же время врачами первичного звена эти проблемы либо не рассматриваются, либо не оцениваются, либо помощь пациентам приходит с опозданием. Ситуация осложняется еще и обширным списком рекомендуемых препаратов, в той или иной степени влияющих на секреторную функцию. Мы надеемся, что практическое руководство Е.И. Вовк и A.Л. Верткина дает современное представление о значении гастропротекции и будет полезно в первую очередь терапевтам, врачам общей практики, а также врачам всех специальностей, ведущим амбулаторный прием.', 'https://cdn.img-gorod.ru/310x500/nomenclature/26/106/2610621.jpg'),
(6, 'Э.ДС.ПВВ.Проводим время вместе:д/дет.4-5 лет', '?Эта книга содержит множество разнообразных заданий, направленных на формирование и закрепление у дошкольника знаний, умений и навыков, соответствующих возрасту 4-5 лет. Упражнения носят игровой характер, а обилие красочных иллюстраций с героями популярного мультфильма Disney \"Тачки 3\" поможет ребёнку получить от занятий массу удовольствия! .Издание предназначено для детей старшего дошкольного возраста.', 'https://cdn.img-gorod.ru/310x500/nomenclature/26/679/2667917.jpg');

--
-- Триггеры `books`
--
DELIMITER $$
CREATE TRIGGER `books-description-empty-to-null` BEFORE INSERT ON `books` FOR EACH ROW BEGIN
IF new.description = '' THEN
	SET new.description = NULL;
END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Структура таблицы `genres`
--

CREATE TABLE `genres` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Таблица хранит жанры книг';

--
-- Дамп данных таблицы `genres`
--

INSERT INTO `genres` (`id`, `name`) VALUES
(1, 'художественная литература'),
(2, 'медицина и здоровье'),
(3, 'детские книги');

-- --------------------------------------------------------

--
-- Структура таблицы `genres_of_books`
--

CREATE TABLE `genres_of_books` (
  `book_id` int(11) NOT NULL,
  `genre_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `genres_of_books`
--

INSERT INTO `genres_of_books` (`book_id`, `genre_id`) VALUES
(1, 1),
(2, 1),
(3, 2),
(4, 3),
(5, 2),
(6, 3);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `authors`
--
ALTER TABLE `authors`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `authors_of_books`
--
ALTER TABLE `authors_of_books`
  ADD PRIMARY KEY (`book_id`,`author_id`),
  ADD KEY `author_id` (`author_id`);

--
-- Индексы таблицы `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `books` ADD FULLTEXT KEY `BOOKSEARCH` (`name`);

--
-- Индексы таблицы `genres`
--
ALTER TABLE `genres`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `genres_of_books`
--
ALTER TABLE `genres_of_books`
  ADD PRIMARY KEY (`book_id`,`genre_id`),
  ADD KEY `genre_id` (`genre_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `authors`
--
ALTER TABLE `authors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT для таблицы `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT для таблицы `genres`
--
ALTER TABLE `genres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `authors_of_books`
--
ALTER TABLE `authors_of_books`
  ADD CONSTRAINT `authors_of_books_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `authors_of_books_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `genres_of_books`
--
ALTER TABLE `genres_of_books`
  ADD CONSTRAINT `genres_of_books_ibfk_1` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `genres_of_books_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

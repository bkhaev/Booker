<?php

// Вспомогательные функции



// Выполняет SQL-запрос в базу данных, используя подготовленные запросы для предотвращения SQL-инъекций
// $query - SQL-запрос с ? вместо данных
// $parameters - данные, вставляемые в запрос поочерёдно.
function libSqlQuery($link, $query, ...$parameters)
{
    $stmt = mysqli_prepare($link, $query);

    if (count($parameters))
    {
        $types = '';
        foreach($parameters as &$parameter)
        {
            if(is_int($parameter))
                $types .= 'i';
            else if (is_float($parameter))
                $types .= 'd';
            else if (is_string($parameter))
                $types .= 's';
            else if (is_bool($parameter))
            {
                $parameter = (int)$parameter;
                $types .= 'i';
            }
            else
                $types .= 'b'; //blob и unknown
        }
        mysqli_stmt_bind_param($stmt, $types, ...$parameters);
    }

    mysqli_stmt_execute($stmt);

    $result = true;
    
    switch (strtoupper(substr(trim($query, '('), 0, 4)))
    {
        // Если это запрос выборки, возвращаем массив со строками. В качестве индексов будет <имя таблицы>_<имя столбца>.
        case 'SELE':
            $resultmeta = mysqli_stmt_result_metadata($stmt);
            $columns_vars = [];
            while ($field = mysqli_fetch_field($resultmeta))
            {
                $varName = $field->table ? $field->table.'_'.$field->name : $field->name;
                $columns[] = $varName;
                $columns_vars[] = &${$varName};
            }

            mysqli_stmt_bind_result($stmt, ...$columns_vars);
            
            $rows = [];
            while (mysqli_stmt_fetch($stmt))
            {
                $row = [];
                foreach ($columns as $column)
                {
                    // echo "$column\n";
                    $row[$column] = ${$column};
                }
                $rows[] = $row;
            }

            $result = $rows;
            
            break;

        // Если это запрос вставки, возвращаем id последней вставленной строки.
        case 'INSE':
            $result = mysqli_insert_id($link);
            break;

        // Если это запрос удаления, возвращаем число удалённых строк.
        case 'DELE':
            $result = mysqli_affected_rows($link);
            break;
        default:
            break;
    }
    
    mysqli_stmt_close($stmt);
    return $result;
}



// Выполняет множественное добавление строк в базу данных, используя подготовленные запросы
function libSqlInsert($link, $query, $data)
{
    $stmt = mysqli_prepare($link, $query);

    $types = '';
    foreach($data[0] as $k => $column)
    {
        if(is_int($column))
            $types .= 'i';
        else if (is_float($column))
            $types .= 'd';
        else if (is_string($column))
            $types .= 's';
        else if (is_bool($column))
        {
            $column = (int)$column;
            $types .= 'i';
        }
        else
            $types .= 'b'; //blob и unknown
    }

    $parameters = [];
    foreach ($data[0] as $key => $parameter)
        $parameters[$key] = $parameter;
    
    mysqli_stmt_bind_param($stmt, $types, ...$parameters);
    
    foreach ($data as $insert)
    {
        foreach ($insert as $key => $parameter)
            $parameters[$key] = $parameter;
        
        mysqli_stmt_execute($stmt);
    }

    mysqli_stmt_close($stmt);
    return true;
}

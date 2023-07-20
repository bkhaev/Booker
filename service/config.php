<?php
   // Скрипт подключения к базе данных.

   $host = 'localhost';
   $database = 'knigi';
   $user = 'root';
   $password = '';
   $link = mysqli_connect($host, $user, $password, $database)
      or die("Ошибка ".mysqli_error($link));
   mysqli_close($link);
?>
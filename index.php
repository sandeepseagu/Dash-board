<?php
    include("api/database_crendtials.php");

    $dsn = "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=$DB_CHARSET";

    try {
         $pdo = new PDO($dsn, $DB_USERNAME, $DB_PASSWORD);
    } catch (\PDOException $e) {
         throw new \PDOException($e->getMessage(), (int)$e->getCode());
    }

    require 'vendor/autoload.php';

    $auth = new \Delight\Auth\Auth($pdo);

    if ($auth->isLoggedIn()) {
        header('Location: dashboard');
        exit;
    }
    else {
        header('Location: login.html');
        exit;
    }

?>
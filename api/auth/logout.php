<?php
    include(__DIR__."/get_auth.php");
    
    $auth = new \Delight\Auth\Auth($pdo);

    $auth->logOut();

    header('Location: ../../login.html');
    exit;
?>
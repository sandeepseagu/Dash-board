<?php
    include(__DIR__."/../json_headers.php");
    include(__DIR__."/get_auth.php");

    $data = [];

    // User basic data
    $userId = $auth->getUserId();
    $username = $auth->getUsername();
    $data['user_id'] = $userId;
    $data['username'] = $username;

    print json_encode($data);
?>

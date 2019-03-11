<?php
    include(__DIR__."/../json_headers.php");
    include __DIR__."/../db_connect.php";

    $store_id=$_POST['store_id'];
    $stmt = $pdo->prepare("SELECT value FROM settings where ReferenceId=:store_id and id='AllowRetrieveCard'");
    $stmt->execute(['store_id' => $store_id]);

    $result = $stmt->fetchAll();

    $data = array();

    foreach ($result as $row ) {
        $data[]= $row;  # code...
    }


    print json_encode ($data);
?>
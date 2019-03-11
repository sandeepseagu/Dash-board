<?php
    include(__DIR__."/../json_headers.php");
    include __DIR__."/../db_connect.php";

    $store_id=$_POST['store_id'];
    $machine_type=$_POST['machine_type'];
    $stmt=$pdo->prepare("SELECT * from {$machine_type} where store_id=:store_id");
    $stmt->execute(['store_id' => $store_id]);

    $result=$stmt->fetchAll();

    $response = (count($result) > 0);

    print json_encode($response);
?>
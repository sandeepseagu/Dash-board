<?php
    include(__DIR__."/../json_headers.php");
    include __DIR__."/../db_connect.php";

    $store_id=$_POST['store_id'];
    $data=array();
    $data2=array();
    $final_array=array();
    //$store_id='0001';
    $stmt1 = $pdo->prepare("SELECT value FROM settings where ReferenceId=:store_id and id='RegistrationMessage'");
    $stmt1->execute(['store_id' => $store_id]);
    $stmt2 = $pdo->prepare("SELECT value FROM settings where id='AllowRegistrationMessage' and ReferenceId=:store_id");
    $stmt2->execute(['store_id' => $store_id]);

    $result = $stmt1->fetchAll();

    foreach ($result as $row ) {
        $data[]= $row;  # code...
    }

    $result2 = $stmt2->fetchAll();
    foreach ($result2 as $row ) {
        $data2[]= $row; # code...
    }

    array_push($final_array, $data,$data2);

    print json_encode ($final_array);
?>
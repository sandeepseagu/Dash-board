<?php
    include(__DIR__."/../json_headers.php");
    include __DIR__."/../db_connect.php";

    $store_id=$_POST['store_id'];
    $value=$_POST['value'];

    $stmt = $pdo->prepare("UPDATE settings set value=:value where Id='MinCardValue' and ReferenceId=:store_id");
    $result = $stmt->execute(['value' => $value, 'store_id' => $store_id]);

    if ($result)
        $msg = "success";
    else
        $msg = "error";

    print json_encode($msg);
?>
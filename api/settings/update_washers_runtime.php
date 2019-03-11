<?php
    include(__DIR__."/../json_headers.php");
    include __DIR__."/../db_connect.php";

    $runtime =$_POST['runtime'];
    $model =$_POST['model'];
    $store_id=$_POST['store_id'];

    $stmt = $pdo->prepare("UPDATE washer SET run_time=:runtime WHERE store_id=:store_id AND model=:model");
    $result = $stmt->execute(['runtime' => $runtime, 'store_id' => $store_id, 'model' => $model]);

    if ($result)
        $msg = "success";
    else
        $msg = "error";

    print json_encode($msg);
?>
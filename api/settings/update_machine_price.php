<?php
    include(__DIR__."/../json_headers.php");
    include __DIR__."/../db_connect.php";

    $price=$_POST['price'];
    $machine=$_POST['machine'];
    $model =$_POST['model'];
    $store_id=$_POST['store_id'];

    $stmt = $pdo->prepare("UPDATE {$machine} SET price=:price where store_id=:store_id and model=:model");
    $result = $stmt->execute(['price' => $price, 'store_id' => $store_id, 'model' => $model]);

    if ($result)
        $msg = "success";
    else
        $msg = "error";

    print json_encode($msg);
?>






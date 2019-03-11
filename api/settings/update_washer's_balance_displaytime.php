<?php
    include(__DIR__."/../json_headers.php");
    include __DIR__."/../db_connect.php";

    $display_time=$_POST['display_time'];
    $store_id=$_POST['store_id'];

    $store_stmt = $pdo->prepare("SELECT * FROM washer WHERE store_id=:store_id");
    $store_stmt->execute(['store_id' => $store_id]);
    $result = $store_stmt->fetchAll();
    $store_has_washer = count($result) > 0;

    if ($store_has_washer) {
        $stmt = $pdo->prepare("UPDATE washer SET balance_display=:display_time
                               WHERE store_id=:store_id");
        $result = $stmt->execute(['display_time' => $display_time, 'store_id' => $store_id]);

        if ($result)
            $msg = "success";
        else
            $msg = "error";
    }
    else {
        $msg = "error";
    }

    print json_encode($msg);
?>
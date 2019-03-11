<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type:application/json');

    include __DIR__."/auth/get_auth.php";
    include __DIR__."/core/stores.php";

    $store_ids = get_user_stores();
    
    $store_ids_query = join(",", $store_ids);

    $stmt = $pdo->query("SELECT store_id, store_name FROM stores WHERE store_id IN ({$store_ids_query})");
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    print json_encode($result)
?>
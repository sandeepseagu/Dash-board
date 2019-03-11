<?php
    include(__DIR__."/../json_headers.php");
    include(__DIR__."/../auth/users.php");
    include(__DIR__."/../auth/get_auth.php");

    if (isSet($_POST['user_id']))
        $userId = $_POST['user_id'];
    else
        $userId = $auth->getUserId();

    $stores = getUserStores($auth, $userId);
    $stores_ids = [];
    foreach ($stores as $store) {
        array_push($stores_ids, $store['store_id']);
    }
    $stores_ids_query = join(",", $stores_ids);

    $stmt = $pdo->query("SELECT store_name, store_id FROM stores WHERE store_id IN ({$stores_ids_query})");
    $stores = $stmt->fetchAll(PDO::FETCH_ASSOC);

    print json_encode($stores);

?>
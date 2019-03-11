<?php
    include(__DIR__."/../json_headers.php");
    include(__DIR__."/../auth/users.php");
    include(__DIR__."/../auth/get_auth.php");

    $stores = getUserStores($auth, $auth->getUserId());
    $stores_ids = [];
    foreach ($stores as $store) {
        array_push($stores_ids, $store['store_id']);
    }
    $stores_ids_query = join(",", $stores_ids);

    $stmt = $pdo->query("SELECT user_id as user_id FROM users_stores WHERE store_id IN ({$stores_ids_query})");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Transform users ids into string for query
    $users_ids = [];
    foreach ($users as $user) {
        array_push($users_ids, $user['user_id']);
    }
    $users_ids_query = join(",", $users_ids);

    $stmt = $pdo->query("SELECT id as user_id, username FROM users WHERE id IN (".$users_ids_query.")");
    $usernames = $stmt->fetchAll(PDO::FETCH_ASSOC);

    print json_encode($usernames);

?>
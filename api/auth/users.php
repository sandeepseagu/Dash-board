<?php
    function getUserStores($auth, $user_id) {
        include(__DIR__."/get_auth.php");

        $stores_ids = [];

        if ($auth->admin()->doesUserHaveRole($user_id, \Delight\Auth\Role::ADMIN))
            $stmt = $pdo->query("SELECT store_id FROM stores");
        if ($auth->admin()->doesUserHaveRole($user_id, \Delight\Auth\Role::MANAGER) or $auth->admin()->doesUserHaveRole($user_id, \Delight\Auth\Role::EMPLOYEE)) {
            $stmt = $pdo->prepare("SELECT store_id
                                   FROM stores NATURAL JOIN users_stores
                                   WHERE user_id=:user_id");
            $stmt->execute(['user_id' => $user_id]);
        }


        $stores_ids = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $stores_ids;
    }
?>

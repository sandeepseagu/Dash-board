<?php
    include(__DIR__."/../json_headers.php");
    include(__DIR__."/get_auth.php");

    if (!isSet($_POST['stores']) or !$_POST['stores']) {
        $result = [];
        $result['status'] = "error";
        $result['msg'] = "User must have at least one store assigned";
    }
    else {
        $user_id = $_POST['user_id'];

        if (isSet($_POST['stores']))
            $stores_ids = $_POST['stores'];
        else
            $stores_ids = [];

        $stmt = $pdo->prepare("SELECT store_id from users_stores WHERE user_id=:user_id");
        $stmt->execute(['user_id' => $user_id]);
        $old_stores = $stmt->fetchAll();

        $old_stores_ids = [];
        foreach ($old_stores as $old_store) {
            array_push($old_stores_ids, $old_store['store_id']);
        }

        $to_delete_stores = array_diff($old_stores_ids, $stores_ids);
        $to_delete_stores_query = join(", ", $to_delete_stores);
        $new_stores = array_diff($stores_ids, $old_stores_ids);

        // Delete values wich are not in $stores
        if ($to_delete_stores) {
            $stmt = $pdo->prepare("DELETE FROM users_stores WHERE user_id=:user_id AND store_id IN ({$to_delete_stores_query})");
            $stmt->execute(['user_id' => $user_id]);
        }

        if ($new_stores) {
            // Insert new values
            $users_stores_query = "";
            foreach ($new_stores as $index => $new_store) {
                $users_stores_query .= " (".$user_id.", '".$new_store."')";
                if ($index != array_key_last($new_stores))
                    $users_stores_query .= ",";
            }

            $stmt = $pdo->prepare("INSERT INTO users_stores (user_id, store_id) VALUES{$users_stores_query}");
            $stmt->execute();
        }

        $result = [];
        $result['status'] = "success";
    }

    print json_encode($result);
?>
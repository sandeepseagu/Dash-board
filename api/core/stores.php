<?php
	function get_user_stores() {
		include __DIR__."/../auth/get_auth.php";

	    $roles = $auth->getRoles();
	    $role = reset($roles);

	    if ($role != "ADMIN") {
	        $userId = $auth->getUserId();
	        $stmt = $pdo->prepare("SELECT store_id FROM users_stores WHERE user_id=:userId");
	        $stmt->execute(['userId' => $userId]);
	    }
	    else {
	        $stmt = $pdo->query("SELECT store_id FROM stores");
	    }

	    $store_ids = [];
	    $stores = $stmt->fetchAll(PDO::FETCH_ASSOC);
		foreach ($stores as $key => $store) {
			$store_ids[] = $store['store_id'];
		}
		return $store_ids;
	}
	function get_all_stores() {
		include __DIR__."/../auth/get_auth.php";

		$store_ids = [];
        $stmt = $pdo->query("SELECT store_id FROM stores");
	    $stores = $stmt->fetchAll(PDO::FETCH_ASSOC);
		foreach ($stores as $key => $store) {
			$store_ids[] = $store['store_id'];
		}
		return $store_ids;
	}
?>
<?php
    include(__DIR__."/../json_headers.php");
    include __DIR__."/../db_connect.php";

	$store_id = $_POST['store_id'];
	$promo_type = $_POST['promo_type'];

	$result = [];

	# Get store name
	$stmt = $pdo->prepare("SELECT store_name AS store_name FROM stores s WHERE s.store_id=:store_id");
	$stmt->execute(['store_id' => $store_id]);
	$query_result = $stmt->fetch();
	$store_name = $query_result['store_name'];
	# Reset promo
	if (!is_null($store_id) and $store_id!=='') {
		if ($promo_type == 'value') {
			$stmt = $pdo->prepare("DELETE FROM store_campaigns WHERE StoreId=:store_id AND CampaignId=2");
			$stmt->execute(['store_id' => $store_id]);
			$result['status'] = "success";
			$result['msg'] = "Reset promo by cash for store ${store_name}";
		}
		else if ($promo_type == 'percentage') {
			$stmt = $pdo->prepare("DELETE FROM store_campaigns WHERE StoreId=:store_id AND CampaignId=1");
			$stmt->execute(['store_id' => $store_id]);
			$result['status'] = "success";
			$result['msg'] = "Reset promo by percentage for store ${store_name}";
		}
	}
	else {
		$result['status'] = "error";
		$result['msg'] = "You must select a store";
	}
	print json_encode($result);
?>
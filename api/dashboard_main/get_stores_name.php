<?php
    include(__DIR__."/../json_headers.php");
	include __DIR__."/../core/stores.php";
	include __DIR__."/../db_connect.php";

	if (isSet($_POST['store_ids'])) {
		$store_ids = $_POST['store_ids'];
		if ($store_ids[0] == 'all_stores') {
			$store_ids = get_user_stores();
		}
	}
	else {
		$store_ids = get_user_stores();
	}

	$store_query = "";
	if ($store_ids) {
		$store_ids_query = join("', '", $store_ids);
		$store_query = $store_query." WHERE store_id IN ('{$store_ids_query}') ";
	}

	$stmt = $pdo->prepare("SELECT store_name
						   FROM stores
						   {$store_query}");
	$stmt->execute();
	$result = $stmt->fetchAll();

	$data = array();
	foreach ($result as $row ) {
		$data[]= $row;
	}

	print json_encode($data);
?>
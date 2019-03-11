<?php
    include(__DIR__."/../json_headers.php");
    include __DIR__."/../db_connect.php";

	# Get added value (and it's trigger value)
	$stmt = $pdo->prepare("SELECT st.store_id as store_id, st.store_name as store_name,
								  sc.CampaignId as campaign, SUM(sc.MinAmount) as trigger_value,
								  SUM(sc.BonusAmount) as bonus
						   FROM store_campaigns sc RIGHT JOIN stores st ON sc.StoreId = st.store_id
						   GROUP BY st.store_id, st.store_name, sc.CampaignId
						   ORDER BY st.store_id, sc.CampaignId");
	$stmt->execute();
	$query_result = $stmt->fetchAll();

	$data=array();

	foreach ($query_result as $row ) {
		$store_id = $row['store_id'];
		unset($row['store_id']);

		if (!array_key_exists($store_id, $data))
			$data[$store_id] = array();

		$data[$store_id][] = $row;
	}

	print json_encode($data);

?>

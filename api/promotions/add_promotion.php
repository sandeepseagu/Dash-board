<?php
    include(__DIR__."/../json_headers.php");
    include __DIR__."/../db_connect.php";

	if (isSet($_POST['store']))
		$store_id = $_POST['store'];
	else
		$store_id = "";

	$value_trigger_value = $_POST['value_trigger_value'];
	$percentage_trigger_value = $_POST['percentage_trigger_value'];
	$added_value = $_POST['added_value'];
	$added_percentage = $_POST['added_percentage'];
	$result = [];
	# Get store name
	$stmt = $pdo->prepare("SELECT store_name AS store_name FROM stores s WHERE s.store_id=:store_id");
	$stmt->execute(['store_id' => $store_id]);
	$store_name = $stmt->fetch()['store_name'];
	# Add promo
	if (!is_null($store_id) and $store_id!=='') {
		if (isset($_POST['added_value_btn'])) {
			if (!is_null($added_value) and $added_value!=='' and !is_null($value_trigger_value) and $value_trigger_value!=='') {
				# First, check if there's a campaign already existant.
				$stmt = $pdo->prepare("SELECT COUNT(*) as count FROM store_campaigns sc WHERE sc.StoreId=:store_id and sc.CampaignId=2");
				$stmt->execute(['store_id' => $store_id]);
				$query_result = $stmt->fetch();
				if ($query_result['count'] == 0) {
					$stmt = $pdo->prepare("INSERT into store_campaigns(StoreId,CampaignId,MinAmount,BonusAmount) values (:store_id,2,:value_trigger_value,:added_value)");
					$stmt->execute(['store_id' => $store_id, 'value_trigger_value' => $value_trigger_value, 'added_value' => $added_value]);
					if ($stmt->rowCount() > 0) {
						$result['status'] = "success";
						$result['msg'] = "Added promo with $${added_value} bonus for each $${value_trigger_value} for store ${store_name}";
					}
				}
				else {	# If campaign already exists, update it
					$stmt = $pdo->prepare("UPDATE store_campaigns SET MinAmount=:value_trigger_value, BonusAmount=:added_value WHERE StoreId=:store_id AND CampaignId=2");
					$stmt->execute(['value_trigger_value' => $value_trigger_value, 'added_value' => $added_value, 'store_id' => $store_id]);
					$result['status'] = "success";
					$result['msg'] = "Updated promo with $${added_value} bonus for each $${value_trigger_value} for store ${store_name}";
				}
			}
			else {
				$result['status'] = "error";
				$result['msg'] = "You must set values";
			}
		}
		if (isset($_POST['added_percentage_btn'])) {
			if (!is_null($added_percentage) and $added_percentage!=='' and !is_null($percentage_trigger_value) and $percentage_trigger_value!=='') {
				# First, check if there's a campaign already existant.
				$stmt = $pdo->prepare("SELECT COUNT(*) as count FROM store_campaigns sc WHERE sc.StoreId=:store_id and sc.CampaignId=1");
				$stmt->execute(['store_id' => $store_id]);
				$query_result = $stmt->fetch();
				if ($query_result['count'] == 0) {
					$stmt = $pdo->prepare("INSERT into store_campaigns(StoreId,CampaignId,MinAmount,BonusAmount) values (:store_id,1,:percentage_trigger_value,:added_percentage)");
					$stmt->execute(['store_id' => $store_id, 'percentage_trigger_value' => $percentage_trigger_value, 'added_percentage' => $added_percentage]);
					if ($stmt->rowCount() > 0) {
						if (!isset($result['status']))
							$result['status'] = "success";
						$result['msg'] = "Added promo with ${added_percentage}% bonus for each $${percentage_trigger_value} for store ${store_name}";
					}
				}
				else {	# If campaign already exists, update it
					$stmt = $pdo->prepare("UPDATE store_campaigns SET MinAmount=:percentage_trigger_value, BonusAmount=:added_percentage WHERE StoreId=:store_id AND CampaignId=1");
					$stmt->execute(['percentage_trigger_value' => $percentage_trigger_value, 'added_percentage' => $added_percentage, 'store_id' => $store_id]);
					if (!isset($result['status']))
						$result['status'] = "success";
					$result['msg'] = "Updated promo with ${added_percentage}% bonus for each $${percentage_trigger_value} for store ${store_name}";
				}
			}
			else {
				$result['status'] = "error";
				$result['msg'] = "You must set values";
			}
		}
	}
	else {
		$result['status'] = "error";
		$result['msg'] = "You must select a store";
	}

	print json_encode($result);
?>
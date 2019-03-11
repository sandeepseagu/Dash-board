<?php
    include(__DIR__."/../json_headers.php");
    include __DIR__."/../db_connect.php";

$store_id = $_POST['store'];

# Get added value (and it's trigger value)
$stmt = $pdo->prepare("SELECT sc.MinAmount, sc.BonusAmount FROM store_campaigns sc WHERE sc.StoreId=:store_id and sc.CampaignId=2");
$stmt->execute(['store_id' => $store_id]);

$data = $stmt->fetch();
$trigger_value_value = $data['MinAmount'];
$added_value = $data['BonusAmount'];

# Get added percentage (and it's trigger value)
$stmt = $pdo->prepare("SELECT sc.MinAmount, sc.BonusAmount FROM store_campaigns sc WHERE sc.StoreId=:store_id and sc.CampaignId=1");
$stmt->execute(['store_id' => $store_id]);

$data = $stmt->fetch();
$trigger_percentage_value = $data['MinAmount'];
$added_percentage = $data['BonusAmount'];

$result = [];
$result['added_value'] = [];
$result['added_value']['trigger_value'] = $trigger_value_value;
$result['added_value']['value'] = $added_value;
$result['added_percentage'] = [];
$result['added_percentage']['trigger_value'] = $trigger_percentage_value;
$result['added_percentage']['value'] = $added_percentage;

print json_encode($result);

?>

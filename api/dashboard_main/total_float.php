<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type:application/json');

include("../database_crendtials.php");
include __DIR__."/../core/stores.php";

$mysqli= new mysqli($DB_HOST,$DB_USERNAME,$DB_PASSWORD,$DB_NAME);

if(!$mysqli){
	die("connection failed:" . $mysqli -> error );
}




$query=sprintf("SELECT SUM(balance) as current_float from main");

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
//$limit_1 = '2018-12-01';
//$limit_2 = '2019-01-15';
$query=sprintf("SELECT SUM(balance) as current_float from main".$store_query."");

//$query= sprintf("SELECT * from transactions where type_machine='Terminal' ");
$result=$mysqli->query($query);

$data=array();
foreach ($result as $row ) {
	$data[]= $row;	# code...
}





$result->close();


print json_encode($data);
?>
<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type:application/json');

include("../database_crendtials.php");
include __DIR__."/../core/stores.php";

$mysqli= new mysqli('p:'.$DB_HOST,$DB_USERNAME,$DB_PASSWORD,$DB_NAME);

if(!$mysqli){
	die("connection failed:" . $mysqli -> error );
}
$limit_1 = $_POST['start_date'];
$limit_2 = $_POST['end_date'];

$limit_3=$_POST['secondary_start_date'];
$limit_4=$_POST['secondary_end_date'];



//$limit_1 = '2019-02-01';
//$limit_2 = '2019-02-19';

//$limit_3='2019-01-01';
//$limit_4='2019-01-30';

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
	$store_query = $store_query." AND store_id IN ('{$store_ids_query}') ";
}

$query=sprintf("SELECT SUM(price) AS total_deposited from transactions WHERE DATE(time_trans)>='{$limit_1}' AND DATE(time_trans)<='{$limit_2}' and type_machine='Terminal'".$store_query."");

$result=$mysqli->query($query);

$data=array();
foreach ($result as $row ) {
	$data[]= $row;	# code...
}

$query2=sprintf("SELECT SUM(price) AS total_deposited from transactions WHERE DATE(time_trans)>='{$limit_3}' AND DATE(time_trans)<='{$limit_4}' and type_machine='Terminal'".$store_query."");

$result2=$mysqli->query($query2);

$data2=array();
foreach ($result2 as $row ) {
	$data2[]= $row;	# code...
}

$final_array=array();

array_push($final_array,$data,$data2);

$result2->close();
$result->close();


print json_encode($final_array);
?>
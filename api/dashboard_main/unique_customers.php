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

$query=sprintf("SELECT card_id FROM transactions where DATE(time_trans) >= '{$limit_1}' AND DATE(time_trans) <= '{$limit_2}' And type_machine!='Terminal'".$store_query." GROUP BY card_id; ");

$result=$mysqli->query($query);

$data=$result->num_rows;
//foreach ($result as $row ) {
//	$data[]= $row;	# code...
//}


$query2=sprintf("SELECT card_id FROM transactions where DATE(time_trans) >= '{$limit_3}' AND DATE(time_trans) <= '{$limit_4}' And type_machine!='Terminal' ".$store_query." GROUP BY card_id;");

$result2=$mysqli->query($query2);

$data2=$result2->num_rows;

$final_array=array();
$final_array[0]=$data;
$final_array[1]=$data2;

$result2->close();
$result->close();


print json_encode($final_array);
?>
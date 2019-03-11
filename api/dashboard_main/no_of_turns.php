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


$query1=sprintf("SELECT * from transactions where DATE(time_trans)>= '{$limit_1}' AND DATE(time_trans) <= '{$limit_2}' AND type_machine!='Terminal' AND type_machine!='Dryer'".$store_query."");
$query2=sprintf("SELECT * from washer");

$result1=$mysqli->query($query1);
$result2=$mysqli->query($query2);


$no_of_transactions=$result1->num_rows;
$no_of_washers=$result2->num_rows;
$avg_turns_per_washers=$no_of_transactions/$no_of_washers;




$query3=sprintf("SELECT * from transactions where DATE(time_trans)>= '{$limit_3}' AND DATE(time_trans) <= '{$limit_4}' AND type_machine!='Terminal' AND type_machine!='Dryer' ".$store_query."  ");
$query4=sprintf("SELECT * from washer");

$result3=$mysqli->query($query3);
$result4=$mysqli->query($query4);


$no_of_transactions1=$result3->num_rows;
$no_of_washers1=$result4->num_rows;
$avg_turns_per_washers1=$no_of_transactions1/$no_of_washers1;

$data=array();
array_push($data,$avg_turns_per_washers ,$avg_turns_per_washers1);

$result1->close();
$result2->close();


print json_encode($data);
?>
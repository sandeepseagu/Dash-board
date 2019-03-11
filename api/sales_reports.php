<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type:application/json');

include("database_crendtials.php");

$mysqli= new mysqli($DB_HOST,$DB_USERNAME,$DB_PASSWORD,$DB_NAME);
if(!$mysqli){
	die("connection failed:" . $mysqli -> error );
}


//$store_id='0001';
//$start_date='2018-11-14';
//$end_date='2018-12-13';

$store_id=$_POST['store'];
$start_date=$_POST['start_date'];
$end_date=$_POST['end_date'];

$final_array=array();

$query=sprintf("SELECT stores.store_name,transactions.type_machine,sum(transactions.price) as sales ,transactions.model from transactions right join stores on transactions.store_id=stores.store_id where transactions.type_machine='Washer' and transactions.store_id='{$store_id}' and Date(time_trans)>='{$start_date}' and Date(time_trans)<='{$end_date}' group by transactions.model ");
$result=$mysqli->query($query);

$data=array();

foreach($result as $row){
	$data[]=$row;
}


$query2=sprintf("SELECT stores.store_name,transactions.type_machine,sum(transactions.price) as sales ,transactions.model from transactions right join stores on transactions.store_id=stores.store_id where transactions.type_machine='Dryer' and transactions.store_id='{$store_id}' and Date(time_trans)>='{$start_date}' and Date(time_trans)<='{$end_date}' group by transactions.model ");

$result2=$mysqli->query($query2);

$data2=array();

foreach($result2 as $row){
	$data2[]=$row;
}

$query3=sprintf("SELECT stores.store_name,transactions.type_machine,sum(transactions.price) as sales, transactions.model from transactions right join stores on transactions.store_id=stores.store_id where transactions.type_machine='Vending' and transactions.store_id='{$store_id}' and Date(time_trans)>='{$start_date}' and Date(time_trans)<='{$end_date}' group by transactions.model ");
$result3=$mysqli->query($query3);
$data3=array();

foreach($result3 as $row){
	$data3[]=$row;
}

$query4=sprintf("SELECT store_name from stores where store_id='{$store_id}'");
$result4=$mysqli->query($query4);
$data4=array();
foreach($result4 as $row)
{
	$data4[]=$row;
}

array_push($final_array, $data4);
array_push($final_array, $data);
array_push($final_array,$data2);
array_push($final_array, $data3);

print json_encode($final_array);

?>
<?php

	header('Access-Control-Allow-Origin: *');
	header('Content-Type:application/json');
	include("database_crendtials.php");
	$mysqli= new mysqli($DB_HOST,$DB_USERNAME,$DB_PASSWORD,$DB_NAME);
	if(!$mysqli)
	{
		die("connection failed:" . $mysqli -> error );
	}

	$store_id=$_POST['store'];
	$start_date=$_POST['start_date'];
	$end_date=$_POST['end_date'];
	//$store_id='0001';
	//$start_date='2019-01-01';
	//$end_date='2019-01-31';
	$main_data=array();
	
	$query1=sprintf("SELECT store_name from stores where store_id='{$store_id}'");
	$result1=$mysqli->query($query1);
	$data1=array();
	foreach ($result1 as $row ) 
	{
		$data1[]= $row;	# code...
	}
	array_push($main_data, $data1);

	
	$query2=sprintf("SELECT DATE(to_date) as 'date',store_id,local_id,one,two,five,ten,twenty,fifty,hundred,total from collection_log  where store_id='{$store_id}' and Date(to_date)>='{$start_date}' and Date(to_date)<='{$end_date}'  ");
	$result2=$mysqli->query($query2);
	$data2=array();
	foreach ($result2 as $row ) 
	{
		$data2[]= $row;	# code...
	}
	array_push($main_data, $data2);
	

	$result1->close();
	$result2->close();
	$mysqli->close();

print json_encode($main_data);

?>
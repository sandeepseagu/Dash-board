<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type:application/json');

include("database_crendtials.php");

$mysqli= new mysqli($DB_HOST,$DB_USERNAME,$DB_PASSWORD,$DB_NAME);
if(!$mysqli){
	die("connection failed:" . $mysqli -> error );
}

$query=sprintf("SELECT * FROM  stores");

$result=$mysqli->query($query);

$data=array();

foreach ($result as $row ) {
	$data[] = $row;	# code...
}

$result->close();

$mysqli->close();

print json_encode($data);
?>
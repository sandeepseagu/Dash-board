<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type:application/json');

include("../database_crendtials.php");

$mysqli= new mysqli($DB_HOST,$DB_USERNAME,$DB_PASSWORD,$DB_NAME);
if(!$mysqli){
	die("connection failed:" . $mysqli -> error );
}

$query=sprintf("SELECT * FROM  stores");

$result=$mysqli->query($query);

$data=array();

$nullid='0';
$output='';

$output.='
  <option disabled selected value>  </option>';

  if(mysqli_num_rows($result)>0){
	while($row = mysqli_fetch_array($result)){
  	$output.='<option value="'.$row["store_id"].'" >  '.$row["store_name"].'  </option> ';




	}
  }
  



$result->close();

$mysqli->close();

print json_encode($output);
?>
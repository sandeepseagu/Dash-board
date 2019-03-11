<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type:application/json');

include("database_crendtials.php");

$mysqli= new mysqli($DB_HOST,$DB_USERNAME,$DB_PASSWORD,$DB_NAME);

if(!$mysqli){
    die("connection failed:" . $mysqli -> error );
}

$card_id= $_POST['card_id'];
//$card_id= '0010000387';
$query=sprintf("SELECT type_machine,price,time_trans,model,store_name from transactions right join stores on transactions.store_id=stores.store_id  where transactions.card_id='{$card_id}' limit 20 ");
$result=$mysqli->query($query);
$output='';
$output .='<table class="table table-condensed" id="washer_price_table"">
													<tr>
														<th>Time</th>
														<th>Machine Type</th>
														<th>Price</th>
														<th>Model</th>
														<th>Store</th>
													</tr>
												';

if(mysqli_num_rows($result)>0)
{
	while($row = mysqli_fetch_array($result))
	{
	$output .='<tr>
	<td>'.$row["time_trans"].'</td>
	<td>'.$row["type_machine"].'</td>
	<td>'.$row["price"].'</td>
	<td>'.$row["model"].'</td>
	<td>'.$row["store_name"].'</td></tr>';
	
	
	}
}

$query1=sprintf("SELECT balance from main where card_id='{$card_id}'");
$result1=$mysqli->query($query1);

$data=array();
foreach($result1 as $row)
{
	$data[]=$row;
}

$final_data=array();

array_push($final_data, $output);
array_push($final_data, $data);
$result->close();

$mysqli->close();

print json_encode($final_data);

?>
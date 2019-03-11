<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type:application/json');

include("database_crendtials.php");

$mysqli= new mysqli($DB_HOST,$DB_USERNAME,$DB_PASSWORD,$DB_NAME);

if(!$mysqli)
{
	die("connection failed:" . $mysqli -> error );
}

$search_query='62';
//$search_query='62';
if (is_numeric($search_query)) 
{
	
	

	$query1=sprintf("SELECT customer.c_phone as value,customer.c_name,main.card_id, customer.c_email, main.store_id, main.user_id from customer left join main on customer.main_card_id=main.card_id where customer.c_phone  like '%%%s%%'",$search_query );
	$result1=$mysqli->query($query1);
	$data=[];

	
	foreach ($result1 as $row ) 
	{
		$data[]= $row;
		//$data[]['description']="Customer Phone:".$data[]['value'];
		//echo $data[0]['value'];	# code...
	}
	for ($i = 0; $i < $result1->num_rows; $i++) {

		//$data[i]=$result1[i];
    	 $data[$i]['description']="Customer Phone:".$data[$i]['value'];
		}



	$query2=sprintf("SELECT customer.c_phone,customer.c_name,main.card_id as value, customer.c_email, main.store_id, main.user_id from customer left join main on customer.main_card_id=main.card_id where main.card_id  like '%%%s%%'",$search_query );
	$result2=$mysqli->query($query2);
	$data1=[];
	foreach ($result2 as $row ) 
	{
		$data1[]= $row;	# code...
	}
	for ($i = 0; $i < $result2->num_rows; $i++) {

		//$data[i]=$result1[i];
    	 $data1[$i]['description']="Card ID:".$data1[$i]['value'];
		}

}
$final_array=[];
$final_array=array_merge($data,$data1);


print json_encode($final_array);
//
?>
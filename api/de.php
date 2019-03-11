<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type:application/json');

include("database_crendtials.php");

$mysqli= new mysqli($DB_HOST,$DB_USERNAME,$DB_PASSWORD,$DB_NAME);
if(!$mysqli){
	die("connection failed:" . $mysqli -> error );
}
$crd='00';
$c='%'.$crd.'%';
$stmt=$mysqli->prepare("SELECT * from main where card_id LIKE ?");
$stmt->bind_param("s",$c);


$stmt->execute();
$result=$stmt->get_result();
print_r( $result);

$data=array();

$output='';
$count=2;
$data=array();

foreach($result as $row)
{
	if($count==2){
			if($row["user_id"]==null)
			{
				$row["user_id"]="not assigned";
			}
			$output.='<tr role="row" class="even"><td class="sorting_1"><a href="#" class="cards" id='.$row["card_id"].'>'.$row["card_id"].'</td><td>'.$row["c_name"].'</td> <td>'.$row["c_phone"].'</td> <td>'.$row["c_email"].'</td> <td>'.$row["store_id"].'</td> <td>'.$row["user_id"].'</td>       </tr> ';
			$count=3;
		}
		else if ($count==3)
		{	
			if($row["user_id"]==null)
			{
				$row["user_id"]="not assigned";
			}
			$output.='<tr role="row" class="odd"><td class="sorting_1"><a href="#" class="cards" id='.$row["card_id"].'>'.$row["card_id"].'</td><td>'.$row["c_name"].'</td> <td>'.$row["c_phone"].'</td> <td>'.$row["c_email"].'</td> <td>'.$row["store_id"].'</td> <td>'.$row["user_id"].'</td>       </tr> ';
			$count=2;
		}
}





print json_encode($output);




?>
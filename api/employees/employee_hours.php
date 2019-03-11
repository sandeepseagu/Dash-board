<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type:application/json');

include("../database_crendtials.php");

$mysqli= new mysqli($DB_HOST,$DB_USERNAME,$DB_PASSWORD,$DB_NAME);

if(!$mysqli){
	die("connection failed:" . $mysqli -> error );
}

$query=sprintf("SELECT user_activity.user_id, main.card_id,user_activity.time_clock_in,user_activity.time_clock_out,customer.c_name,CONCAT(SUBSTRING_INDEX(TIMEDIFF(user_activity.time_clock_out, user_activity.time_clock_in), ':', 1), 
              ' hours ', 
              SUBSTR(TIMEDIFF(user_activity.time_clock_out, user_activity.time_clock_in), INSTR(TIMEDIFF(user_activity.time_clock_out,user_activity.time_clock_in), ':')+1, 2),  
              ' minutes') as total_hours FROM main right join user_activity  on user_activity.user_id=main.user_id inner join customer on main.card_id=customer.main_card_id;");
$result=$mysqli->query($query) or die(mysqli_error($mysqli));

$data=array();

foreach ($result as $row) {
	$data[]=$row;
	# code...
}


$result->close();

$mysqli->close();
print json_encode($data);


?>
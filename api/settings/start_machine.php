<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type:application/json');

include("curl.php");

$url=$_POST['url'];
$is_valid = http_response($url);

if ($is_valid)
	$result = "success";
else
	$result = "error";

print json_encode($result);


?>
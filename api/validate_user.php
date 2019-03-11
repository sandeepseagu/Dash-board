<?php
/*header('Access-Control-Allow-Origin: *');
header('Content-Type:application/json');

include("database_crendtials.php");

$mysqli= new mysqli($DB_HOST,$DB_USERNAME,$DB_PASSWORD,$DB_NAME);
if(!$mysqli){
	die("connection failed:" . $mysqli -> error );
}

$username=$_POST['username'];
$pwd=$_POST['pin'];

//$username='sandy';
//$pwd='1234567';

$query=sprintf("SELECT  * from profiles where username='{$username}' and password='{$pwd}'");

$result=$mysqli->query($query);

$data=$result->num_rows;

if($data>0)
{
	$status=true;
}
else if ($data==0)
{
	$status=false;
}


$result->close();


$mysqli->close();

print json_encode($status);

*/
include(__DIR__."/../json_headers.php");
    include(__DIR__."/get_auth.php");


try {
    if ($auth->reconfirmPassword($_POST['password'])) {
        echo 'The user really seems to be who they claim to be';
    }
    else {
        echo 'We can\'t say if the user is who they claim to be';
    }
}
catch (\Delight\Auth\NotLoggedInException $e) {
    die('The user is not signed in');
}
catch (\Delight\Auth\TooManyRequestsException $e) {
    die('Too many requests');
}
?>
<?php


include(__DIR__."/../json_headers.php");
include(__DIR__."/get_auth.php");


    

$result=[];
try {
    $username = $auth->getUsername();
    $username= strtolower($username);

    if (strtolower($_POST['username'])==$username) 
    {
        $result['username_status']='success';

    }
    else
    {
        $result['username_status']='error';
        $result['username_error_msg']='The username is incorrect';
    }
    if ($auth->reconfirmPassword($_POST['pin'])) 
    {
       $result['password_status']='success';
        //echo 'The user really seems to be who they claim to be';
    }
    else 
    {
        $result['password_status']='error';
        $result['password_error_msg'] = 'The Password is incorrect';
        //echo 'We can\'t say if the user is who they claim to be';
    }
}
catch (\Delight\Auth\NotLoggedInException $e) {
     $result['password_status'] = 'error';
     $result['password_error_msg'] = 'The user is not signed in';
   //die('The user is not signed in');
}
catch (\Delight\Auth\TooManyRequestsException $e) {
   $result['password_status'] = 'error';
     $result['password_error_msg'] = 'Too many requests';
}
print json_encode($result);
?>
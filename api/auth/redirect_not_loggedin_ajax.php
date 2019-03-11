<?php
	include(__DIR__."/../json_headers.php");
    include(__DIR__."/get_auth.php");
	
	$response = [];
	$response['not_loggedin'] = !$auth->isLoggedIn();
	$response['redirect_url'] = "login.html";
	print json_encode($response);
?>
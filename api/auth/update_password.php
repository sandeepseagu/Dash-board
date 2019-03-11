<?php
    include(__DIR__."/../json_headers.php");
    include(__DIR__."/get_auth.php");

	try {
		if ($_POST['new_password_1'] == $_POST['new_password_2']) {
	    	$auth->changePassword($_POST['old_password'], $_POST['new_password_1']);
			$result = "success";
		}
		else
			$result = "Passwords do not match";
	}
	catch (\Delight\Auth\NotLoggedInException $e) {
		$result = "Not logged in";
	}
	catch (\Delight\Auth\InvalidPasswordException $e) {
		$result = "Invalid password(s)";
	}
	catch (\Delight\Auth\TooManyRequestsException $e) {
		$result = "Too many requests";
	}

	print json_encode($result);
?>
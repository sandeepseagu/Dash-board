<?php
	include __DIR__."/../db_connect.php";

	require __DIR__.'/../../vendor/autoload.php';
	$auth = new \Delight\Auth\Auth($pdo);
?>
<?php
	
	header('Access-Control-Allow-Origin: *');
	header('Content-Type:application/json');

	include("json_headers.php");
	include("auth/get_auth.php");
	include("database_crendtials.php");

	$mysqli= new mysqli($DB_HOST,$DB_USERNAME,$DB_PASSWORD,$DB_NAME);

	if(!$mysqli){
	    die("connection failed:" . $mysqli -> error );
	}

	$username = $auth->getUsername();//get the username from the page
    $username= strtolower($username);
   
	
	$store_id=$_POST['store'];
	$terminal_id=$_POST['terminal_id'];
	$master_pin=$_POST['pin'];
	$user_name=$_POST['username'];



	//$store_id='0001';
	//$terminal_id='1';
	//$master_pin='123';
	//$user_name='admin';

	if(strtolower($user_name)==$username)
	{
		$user_name=$username;
	}


	
	

	$output="";
	$msg=array();

	function checkforupdate($result,$output,$msg)
	{
		
		if($result==1)
		{
			$output.="Cash Counter is updated.";
			$msg[0]=1;
			return $msg;
		}
		else if ($result=='')
		{
			
			$msg[0]=0;
			return $msg;
		}
	}

	function checkforinsert($result,$output,$msg)
	{
		if($result==1)
		{
			
			$msg[1]=1;
			return $msg;
			

		}
		else if($result ==''){
			
			$msg[1]=0;
			return $msg;
			
		}
	}



	



	function send($bills_count_data,$output,$msg,$to)
	{
		foreach ($to as $recipient) 
		{
			$subject = "Collection Report";
			$txt = "Store: ".$bills_count_data[0]['store_name']."\r\nTerminal No: ".$bills_count_data[0]['idCash_counter']. " \r\nList of Bills: \r\n \r\n $1 = " .$bills_count_data[0]['one']."\r\n $2 = ".$bills_count_data[0]['two']. "\r\n $5 = ".$bills_count_data[0]['five']. "\r\n $10 =  ".$bills_count_data[0]['ten']. "\r\n $20 =  ".$bills_count_data[0]['twenty']. "\r\n $50 =  ".$bills_count_data[0]['fifty']. "\r\n $100 = ".$bills_count_data[0]['hundred']. " \r\n \r\n Collection made on  ".$bills_count_data[0]['end_date']. ""; 
			$headers = "From: system@interactivesystems.global" . "\r\n" ;
			
			if(mail($recipient,$subject,$txt,$headers))
			{
				$msg[2]=1;
			}
			else
			{

			}
		}
		
		print json_encode($msg);
	}

	$bills_count_query=$mysqli->prepare("SELECT one,two,five,ten,twenty,fifty,hundred,store_name,idCash_counter from cash_counter left join stores on stores.store_id=cash_counter.store_id where  cash_counter.store_id=? AND idCash_counter=? ");
	$bills_count_query->bind_param("dd",$store_id,$terminal_id);
	$bills_count_query->execute();
	$result=$bills_count_query->get_result();
	$bills_count_data=array();

	foreach($result as $row)
	{
		$bills_count_data[]=$row;
	}

	if (!empty($bills_count_data)) 
	{



		$start_date_query=$mysqli->prepare("SELECT to_date from collection_log where local_id=? and store_id=? order by collection_id desc LIMIT 1");
		$start_date_query->bind_param("dd",$terminal_id,$store_id);
		$start_date_query->execute();
		$start_date_result=$start_date_query->get_result();
		if($start_date_result->num_rows!=0)
		{
			$start_date=array();
			foreach ($start_date_result as $row ) 
			{
				$start_date[]= $row;	# code...
			}
			$start_date=$start_date[0]["to_date"];

		}
		else
		{
			$first_transaction_query=$mysqli->prepare("SELECT time_trans from transactions where type_machine=? and machine_id=? and store_id=? order by time_trans asc limit 1");
			$first_transaction_query->bind_param("sdd",'Terminal',$terminal_id,$store_id);
			$first_transaction_query->execute();
			$first_transaction_result=$first_transaction_query->get_result();
			$first_transaction=array();
			foreach ($first_transaction_result as $row) 
			{
				$first_transaction[]=$row;
			}
			$start_date=$first_transaction[0]["time_trans"];

		}

		
		$ones=$bills_count_data[0]["one"];
		$twos=$bills_count_data[0]["two"];
		$fives=$bills_count_data[0]["five"];
		$tens=$bills_count_data[0]["ten"];
		$twenty=$bills_count_data[0]["twenty"];
		$fifty=$bills_count_data[0]["fifty"];
		$hundred=$bills_count_data[0]["hundred"];
		$store_name=$bills_count_data[0]["store_name"];
		$term_id=$bills_count_data[0]["idCash_counter"];
		$total=$ones*1+$twos*2+$fives*5+$tens*10+$twenty*20+$fifty*50+$hundred*100;
		
		$total_collection_log=sprintf("SELECT * from collection_log");
		$ggg=$mysqli->query($total_collection_log);
		$first=array();
		foreach ($ggg as $row) 
		{
			$first[]=$row;
		}
		date_default_timezone_set('US/Eastern');
		$end_date=date("Y-m-d H:i:s");



		$post_collection_log_query=$mysqli->prepare("INSERT into collection_log(store_id,local_id,from_date,to_date,one,two,five,ten,twenty,fifty,hundred,total,user_name) values(?,?,?,?,?,?,?,?,?,?,?,?,?)");
		$post_collection_log_query->bind_param("sdssdddddddds",$store_id,$terminal_id,$start_date,$end_date,$ones,$twos,$fives,$tens,$twenty,$fifty,$hundred,$total,$user_name);
		$result=$post_collection_log_query->execute();

		$msg=checkforinsert($result,$output,$msg);


		//$post_collection_log_query=sprintf("INSERT into collection_log(store_id,local_id,from_date,to_date,one,two,five,ten,twenty,fifty,hundred,total,user_name) values ('{$store_id}','{$terminal_id}','{$start_date}','{$end_date}','{$ones}','{$twos}','{$fives}','{$tens}','{$twenty}','{$fifty}','{$hundred}','{$total}','{$user_name}') ");
		//$result=$mysqli->query($post_collection_log_query);
		
		


		$update_cash_counter_query=$mysqli->prepare("UPDATE cash_counter set one=0,two=0,five=0,ten=0,twenty=0,fifty=0,hundred=0 where idCash_counter=? and store_id=?");
		$update_cash_counter_query->bind_param('ds',$terminal_id,$store_id);
		$result1=$update_cash_counter_query->execute();

		//$update_cash_counter_query=sprintf("UPDATE cash_counter set one=0,two=0,five=0,ten=0,twenty=0,fifty=0,hundred=0 where idCash_counter='{$terminal_id}' and store_id='{$store_id}'");
		//$result1=$mysqli->query($update_cash_counter_query);
		$msg=checkforupdate($result1,$output,$msg);
		$return_array=array();
		$bills_count_data[0]['end_date']=$end_date;
		$bills_count_data[0]['user_name']=$user_name;
		//sendmail($bills_count_data,$output,$msg);

		$to=array();
		$to=['sandeep.segu50@gmail.com','lucas@interactivesystems.global'];
		
		send($bills_count_data,$output,$msg,$to);
		
		
	}
$mysqli->close();


?>
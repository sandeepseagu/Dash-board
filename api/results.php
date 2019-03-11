<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type:application/json');

include("database_crendtials.php");

$mysqli= new mysqli($DB_HOST,$DB_USERNAME,$DB_PASSWORD,$DB_NAME);
if(!$mysqli){
	die("connection failed:" . $mysqli -> error );
}


$query=$_POST['query'];
$output='';
$count=2;
//$query='63';

function checkemail($query)
{
	$find1 = strpos($query, '@');
    $find2 = strpos($query, '.');
   return ($find1 !== false && $find2 !== false && $find2 > $find1 ? true : false);
}
function checkstring($query,$mysqli,$output,$count) 
{
	
   if(preg_match("/^([a-zA-Z0-9@.' ]+)$/",$query))
   {
   		$check_email=checkemail($query);
   		

   		if($check_email==1)
   		{


   			$email_query=$mysqli->prepare("SELECT main.card_id, customer.c_name, customer.c_phone, customer.c_email, main.store_id, main.user_id  FROM customer left join main on customer.main_card_id=main.card_id where customer.c_email LIKE ?");

   			$query='%'.$query.'%';
   			$email_query->bind_param("s",$query);
   			$email_query->execute();
   			$email_result=$email_query->get_result();
   			
 		

   			
   			if (mysqli_num_rows($email_result)>0)
 			{
 				
 				
				while($row = mysqli_fetch_array($email_result))
				{
					
					if($count==2)
					{
						
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
 			}

 			print $output;
   		}

   		else{

   			$name_query=$mysqli->prepare("SELECT main.card_id, customer.c_name, customer.c_phone, customer.c_email, main.store_id, main.user_id  FROM customer left join main on customer.main_card_id=main.card_id where customer.c_name LIKE ?");

   			$query='%'.$query.'%';
   			$name_query->bind_param("s",$query);
   			$name_query->execute();
   			$name_result=$name_query->get_result();

   			if (mysqli_num_rows($name_result)>0)
 			{
 				
 				
				while($row = mysqli_fetch_array($name_result))
				{
					
					if($count==2)
					{
						
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
 			}

   		}
   		
   			
   		}

   		return $output;
   }



if(is_numeric($query))
{
	
	$query1=$mysqli->prepare("SELECT main.card_id, customer.c_name, customer.c_phone, customer.c_email, main.store_id, main.user_id  FROM customer left join main on customer.main_card_id=main.card_id where main.card_id LIKE ? ");

	$query='%'.$query.'%';
	
   	$query1->bind_param("s",$query);
   	$query1->execute();
   	$result=$query1->get_result();
   	$res=$result;


	
   	//print_r($result);
	//echo $query;
	
	$data=[];
	foreach ($result as $row1) 
	{
		$data[]=$row1;
		# code...
	}
	//print_r($data);
 	if (mysqli_num_rows($result)>0)
 	{
 	
		while($row = mysqli_fetch_array($res))
		{
			if($count==2)
			{
			
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
 	}

 	//print_r($data);

 	$query2=$mysqli->prepare("SELECT main.card_id, customer.c_name, customer.c_phone, customer.c_email, main.store_id, main.user_id  FROM customer left join main on customer.main_card_id=main.card_id where customer.c_phone LIKE ?");
 	$query='%'.$query.'%';
 	
   	$query2->bind_param("s",$query);
   	$query2->execute();
   	$result1=$query2->get_result();
   	$res=$result1;



 	

 	$data1=[];
 	$phone_array=[];
 	$index=0;
 	foreach ($result1 as $row1) 
 	{
 		$data1[]=$row1;
 	}

 	//print_r($data1);
 	
 	for($i=0;$i<count($data1);$i++)// code snippet for checking the duplicate results for phone number.
 	{
 		$bool=0;
 		for($j=0;$j<count($data);$j++)
 		{
 			if($data1[$i]['card_id']==$data[$j]['card_id'])
 			{
 				$bool=1;
 			}
 		}
 		if($bool==0)
 		{
 			$phone_array[$index]=$data1[$i];
 			$index++;
 		}
 	}
 	//print_r($phone_array);
 	//print_r($data1);

 	$phone_array_index=0;
 	if(count($phone_array)>0)
 	{
 		if($count==2)
			{
				if($phone_array[$phone_array_index]["user_id"]==null)
				{
					$phone_array[$phone_array_index]["user_id"]="not assigned";
				}
				$output.='<tr role="row" class="even"><td class="sorting_1"><a href="#" class="cards" id='.$phone_array[$phone_array_index]["card_id"].'>'.$phone_array[$phone_array_index]["card_id"].'</td><td>'.$phone_array[$phone_array_index]["c_name"].'</td> <td>'.$phone_array[$phone_array_index]["c_phone"].'</td> <td>'.$phone_array[$phone_array_index]["c_email"].'</td> <td>'.$phone_array[$phone_array_index]["store_id"].'</td> <td>'.$phone_array[$phone_array_index]["user_id"].'</td>       </tr> ';
				$count=3;
			}
			else if ($count==3)
			{	
				if($phone_array[$phone_array_index]["user_id"]==null)
				{
					$phone_array[$phone_array_index]["user_id"]="not assigned";
				}
				$output.='<tr role="row" class="odd"><td class="sorting_1"><a href="#" class="cards" id='.$phone_array[$phone_array_index]["card_id"].'>'.$phone_array[$phone_array_index]["card_id"].'</td><td>'.$phone_array[$phone_array_index]["c_name"].'</td> <td>'.$phone_array[$phone_array_index]["c_phone"].'</td> <td>'.$phone_array[$phone_array_index]["c_email"].'</td> <td>'.$phone_array[$phone_array_index]["store_id"].'</td> <td>'.$phone_array[$phone_array_index]["user_id"].'</td>       </tr> ';
				$count=2;
			}
 	}

 	print json_encode($output);
}
else{
	
	$oo=checkstring($query,$mysqli,$output,$count);
	print json_encode($oo);
}





?>
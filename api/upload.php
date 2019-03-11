<?php 


include_once('../static/third_party/getID3-1.9.16/getid3/getid3.php');
 $getID3 = new getID3;
if (!empty($_FILES)) {
  $errors= array();
         $file_name = $_FILES['file']['name'];
         $temporary = explode(".", $_FILES["file"]["name"]);
         $file_extension = end($temporary);
         $valid_extensions=array("mp4","avi","mov","mkv","m4v","mp3");
       
         if(in_array($file_extension, $valid_extensions)==FALSE)
         {
            $errors[]='Check the file_extension';
            $errormsg='Uploaded file should be a video file';
         }
           //print_r($errors);
         $file_size =$_FILES['file']['size'];
         $file_tmp =$_FILES['file']['tmp_name'];
         $file_type=$_FILES['file']['type'];

         $file = $getID3->analyze($file_tmp);


         if(empty($errors)==true)
         {
            $remote_file = '/api/'.$file_name;
            // set up basic connection
            $file_duration=$file['playtime_string'];
            $file_resolutionx=(string)$file['video']['resolution_x'];
            $file_resolutiony=(string)$file['video']['resolution_y'];
            $file_resolution= $file_resolutionx.'x'. $file_resolutiony;
            $data=array('name' => $file_name, 
                     'duration' => $file_duration, 
                     'resolution' => $file_resolution, );

            $conn_id = ftp_connect("home699333974.1and1-data.host");
            // login with username and password
            $login_result = ftp_login($conn_id, 'u90575096', 'A5348513');
            ftp_pasv($conn_id, true);
            // upload a file
            if (ftp_put($conn_id, $remote_file, $file_tmp, FTP_BINARY)) 
            {
               //print "Absolute path is: " . $file_tmp;
               $data["message"]="ok";
               //echo gettype($data);
               $datetime= date('Y-m-d H:i:s');
               $data["date_time"]=$datetime;
               print json_encode($data);
               
            } 
            else 
            {
               $data1=array(
                  "message"=>"problem with video file"
                  );
                  //print_r( $data1);
                  print json_encode($data1);
               //echo "There was a pro while uploading $file\n";
            }

            // close the connection
            ftp_close($conn_id);
         }
}


 ?>
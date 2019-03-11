<?php
    include(__DIR__."/../json_headers.php");
    include __DIR__."/../db_connect.php";

    $store = $_POST['store'];
    $washer_stmt = $pdo->prepare("SELECT * from washer where store_id=:store");
    $washer_stmt->execute(['store' => $store]);
    $dryer_stmt = $pdo->prepare("SELECT * from dryer where store_id=:store");
    $dryer_stmt->execute(['store' => $store]);

    $output = '';
    $washer_result = $washer_stmt->fetchAll();
    $dryer_result = $dryer_stmt->fetchAll();

    $output.='<select id="machines_list" style="width: 90%"    >
      <option  disabled selected value>  </option>';

    if(count($washer_result)>0){
        foreach ($washer_result as $row) {
            $output.='<option value="'.$row["local_id"].'" >  '.$row["local_id"].'';
            $output.='-';
            $output.=' '.$row["model"].' ';
            $output.='-';
            $output.='Washer</option>';
        }
    }

    if(count($dryer_result)>0){
        foreach ($dryer_result as $row) {
            $output.='<option value="'.$row["local_id"].'" >  '.$row["local_id"].'';
            $output.='-';
            $output.=' '.$row["model"].' ';
            $output.='-';
            $output.='Dryer</option>';
        }
    }
      
    $output.='</select>';

    $response = array();
    $response[0] = (count($washer_result) > 0 or count($dryer_result) > 0);
    $response[1] = $output;

    print json_encode($response);

?>
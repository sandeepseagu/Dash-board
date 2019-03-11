<?php
    include(__DIR__."/../json_headers.php");
    include __DIR__."/../db_connect.php";

    $store_id = $_POST['store_id'];
    $stmt = $pdo->prepare("SELECT model, run_time
                           FROM washer
                           WHERE store_id=:store_id
                           GROUP BY model, run_time");
    $stmt->execute(['store_id' => $store_id]);
    $result = $stmt->fetchAll();

    $output='';
    $output .='<table class="table table-condensed" style="font-size: 1.2rem;" id="washer_price_table"">
                <tr>
                    <th>Model</th>
                    <th>Current Runtime</th>
                    <th>Edit Runtime</th>
                </tr>
            ';

    $first = array();
    $main = array();  
    $curr_price = array();                            
    if(count($result)>0){
        foreach ($result as $row) {
            $output .='<tr >
            <td>'.$row["model"].'</td>
            <td id="washer_'.$row["model"].'_runtime">'.$row["run_time"].' Sec</td>
            <td><input class="settings_textbox"  id="'.$row["model"].'Runtime" type="text"></td></tr>';
            
            array_push($first,$row["model"]);
            array_push($curr_price,$row["run_time"]);
        }
    }
    array_push($main,$first,$curr_price,$output);

    print json_encode($main);
?>

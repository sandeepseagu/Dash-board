<?php
    include(__DIR__."/../json_headers.php");
    include __DIR__."/../db_connect.php";

    $store_id= $_POST['store_id'];
    $machine = $_POST['machine'];

    $stmt = $pdo->prepare("SELECT model, price from {$machine} where store_id=:store_id 
                           GROUP BY model, price");
    $stmt->execute(['store_id' => $store_id]);

    $result = $stmt->fetchAll();

    $output='';
    $output .='<table class="table table-condensed" style="font-size: 1.2rem;" id="'.$machine.'_price_table"">
                    <tr>
                        <th>Model</th>
                        <th>Price</th>
                        <th>Current Price</th>
                    </tr>
                ';
    $first = array();
    $main = array();  
    $curr_price = array();                            
    if (count($result) > 0) {
        foreach ($result as $row) {
            $output .='<tr>
            <td>'.$row["model"].'</td>
            <td id="'.$machine.'_'.$row["model"].'_price">$'.$row["price"].'</td>
            <td><input class="settings_textbox"  id="'.$row["model"].'" type="text"></td></tr>';
            
            array_push($first,$row["model"]);
            array_push($curr_price,$row["price"]);
        }
    }

    array_push($main,$first,$curr_price,$output);

    print json_encode($main);
?>

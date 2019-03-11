<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type:application/json');

    include __DIR__."/../core/stores.php";
    include __DIR__."/../db_connect.php";

    $start_date = $_POST['start_date'];
    $end_date = $_POST['end_date'];
    $machine_types = $_POST['machine_types'];

    if (isSet($_POST['store_ids'])) {
        $store_ids = $_POST['store_ids'];
        if ($store_ids[0] == 'all_stores') {
            $store_ids = get_user_stores();
        }
    }
    else {
        $store_ids = get_user_stores();
    }

    $store_query = "";
    if ($store_ids) {
        $store_ids_query = join("', '", $store_ids);
        $store_query = $store_query." AND store_id IN ('{$store_ids_query}') ";
    }

    $data = array(array());
    $i = 0;

    foreach ($machine_types as $machine_type) {
        $stmt = $pdo->prepare("SELECT SUM(price) as uses
                               FROM transactions
                               WHERE DATE(time_trans)>=:start_date AND DATE(time_trans)<=:end_date
                               AND type_machine=:machine_type
                               {$store_query}");

        $stmt->execute(['start_date' => $start_date, 'end_date' => $end_date, 'machine_type' => $machine_type]);
        $result = $stmt->fetchAll();

        foreach ($result as $row ) {
            $data[$i][] = $row;
        }

        $i = $i + 1;
    }

    $total = 0;
    foreach ($data as $i => $data_2)
        foreach ($data_2 as $j => $machine_data)
            $total = $total + $machine_data['uses'];

    foreach ($data as $i => $data_2)
        foreach ($data_2 as $j => $machine_data)
            if ($total != 0)
                $data[$i][$j] = round($machine_data['uses'] * 100 / $total);
            else
                $data[$i][$j] = 0;


    print json_encode($data);
?>




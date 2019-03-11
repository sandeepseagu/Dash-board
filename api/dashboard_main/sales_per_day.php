<?php
    include(__DIR__."/../json_headers.php");
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
        $store_query = $store_query."AND store_id IN ('{$store_ids_query}') ";
    }

    $data = array(array());
    $i = 0;

    foreach ($machine_types as $machine_type) {

        $stmt = $pdo->prepare("SELECT cast(time_trans as date) as 'date', SUM(price) as total_price
                               FROM transactions
                               WHERE DATE(time_trans)>=:start_date AND DATE(time_trans)<=:end_date
                               AND type_machine=:machine_type
                               {$store_query}
                               GROUP BY cast(time_trans as date)");
        $stmt->execute(['start_date' => $start_date, 'end_date' => $end_date, 'machine_type' => $machine_type]);

        $result = $stmt->fetchAll();

        foreach ($result as $row ) {
            $data[$i][] = $row;
        }

        $i = $i + 1;
    }
    print json_encode($data);
?>

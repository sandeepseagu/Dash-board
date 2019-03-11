<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type:application/json');

    include __DIR__."/../core/stores.php";
    include __DIR__."/../db_connect.php";

    $start_date = $_POST['start_date'];
    $end_date = $_POST['end_date'];

    $store_ids = get_user_stores();

    $store_query = "";
    if ($store_ids) {
        $store_ids_query = join("', '", $store_ids);
        $store_query = $store_query." AND store_id IN ('{$store_ids_query}') ";
    }

    $stmt = $pdo->prepare("SELECT time_trans, card_id, price, is_credit,
                                  type_machine, store_id, machine_id, model
                           FROM transactions
                           WHERE DATE(time_trans)>=:start_date AND DATE(time_trans)<=:end_date
                           {$store_query}
                           ORDER BY time_trans DESC");

    $stmt->execute(['start_date' => $start_date, 'end_date' => $end_date]);
    $result = $stmt->fetchAll();

    $data = array();
    foreach ($result as $row ) {
        $data[] = $row;
    }

    print json_encode($data);
?>
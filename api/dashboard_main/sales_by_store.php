<?php
    include(__DIR__."/../json_headers.php");
    include __DIR__."/../core/stores.php";
    include __DIR__."/../db_connect.php";

    $start_date = $_POST['start_date'];
    $end_date = $_POST['end_date'];

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
        $store_query = $store_query." AND stores.store_id IN ('{$store_ids_query}') ";
    }

    $stmt = $pdo->prepare("SELECT stores.store_name, SUM(transactions.price) AS total_sales
                           FROM transactions RIGHT JOIN stores ON transactions.store_id=stores.store_id
                           WHERE DATE(transactions.time_trans)>=:start_date
                           AND DATE(transactions.time_trans)<=:end_date
                           AND transactions.type_machine!='Terminal'
                           {$store_query}
                           GROUP BY stores.store_name");

    $stmt->execute(['start_date' => $start_date, 'end_date' => $end_date]);
    $result = $stmt->fetchAll();

    $data = array();
    foreach ($result as $row ) {
        $data[] = $row; 
    }

    $data = array($data);

    print json_encode($data);
?>
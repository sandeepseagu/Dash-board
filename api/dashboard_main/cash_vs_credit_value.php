<?php
    include(__DIR__."/../json_headers.php");
    include __DIR__."/../core/stores.php";
    include __DIR__."/../db_connect.php";


    $start_date = $_POST['start_date'];
    $end_date = $_POST['end_date'];

    // Credit data
    $stmt_credit = $pdo->prepare("SELECT SUM(price) as price
                                  FROM transactions
                                  WHERE DATE(time_trans)>=:start_date AND DATE(time_trans)<=:end_date
                                  AND is_credit=1");

    $stmt_credit->execute(['start_date' => $start_date, 'end_date' => $end_date]);
    $result_credit = $stmt_credit->fetch()['price'];

    // Cash data
    $stmt_cash = $pdo->prepare("SELECT SUM(price) as price
                                FROM transactions
                                WHERE DATE(time_trans)>=:start_date AND DATE(time_trans)<=:end_date
                                AND is_credit=0 OR is_credit IS NULL");

    $stmt_cash->execute(['start_date' => $start_date, 'end_date' => $end_date]);
    $result_cash = $stmt_cash->fetch()['price'];

    // Build response arrays
    $data = array();
    $data[0] = array('name' => 'Cash', 'value' => $result_cash);
    $data[1] = array('name' => 'Credit', 'value' => $result_credit);

    print json_encode($data);
?>




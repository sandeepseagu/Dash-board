<?php
    include(__DIR__."/get_auth.php");
    include(__DIR__."/../json_headers.php");

    $userId = $auth->getUserId();

    $stmt = $pdo->prepare("SELECT id from users WHERE username=:username");
    $stmt->execute(['username' => $_POST["username"]]);
    $username_exists = $stmt->fetch()['id'] != NULL;

    if (!$username_exists) {
        $stmt = $pdo->prepare("UPDATE users SET username=:username WHERE id=:userId");
        $stmt->execute(['username' => $_POST["username"], 'userId' => $userId]);
        if (isSet($_SESSION) and isSet($_SESSION['auth_username']))
            $_SESSION['auth_username'] = $_POST['username'];
        $result = "success";
    }
    else {
        $result = "Username already in use";
    }

    print json_encode($result);
?>

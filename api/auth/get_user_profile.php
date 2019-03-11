<?php
    include(__DIR__."/../json_headers.php");
    include(__DIR__."/get_auth.php");
    include(__DIR__."/../core/roles.php");

    $data = [];

    // User basic data
    $user_id = $auth->getUserId();
    $username = $auth->getUsername();
    $roles = $auth->getRoles();
    // Populate data
    $data['username'] = $username;
    $data['role'] = get_role_level(reset($roles));
    $data['user_id'] = $user_id;

    // User profile
    $stmt = $pdo->prepare("SELECT * from users_profiles WHERE user_id=:user_id");
    $stmt->execute(['user_id' => $user_id]);
    $profile_data = $stmt->fetch();
    unset($profile_data['user_id']);
    $data = array_merge($data, $profile_data);


    print json_encode($data);
?>

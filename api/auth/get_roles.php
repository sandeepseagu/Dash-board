<?php
    include(__DIR__."/../json_headers.php");
    include(__DIR__."/get_auth.php");

    $roles = $auth->getRoles();
    $role = reset($roles);
    $available_roles = [];
    
    if ($role == 'ADMIN' or $role == 'MANAGER') {
        $available_roles[0]['role'] = 'EMPLOYEE';
        $available_roles[0]['level'] = '3';
        $available_roles[1]['role'] = 'MANAGER';
        $available_roles[1]['level'] = '2';
    }

    if ($role == 'ADMIN') {
        $available_roles[2]['role'] = 'ADMIN';
        $available_roles[2]['level'] = '1';
    }
    
    print json_encode($available_roles);

?>
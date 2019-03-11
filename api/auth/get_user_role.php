<?php
    include(__DIR__."/../json_headers.php");
    include(__DIR__."/get_auth.php");

    $roles = $auth->getRoles();
    $role = reset($roles);

    print json_encode($role);

?>
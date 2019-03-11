<?php
    include(__DIR__."/get_auth.php");
    
    function canAccessRegister($auth) {
        return $auth->hasAnyRole(\Delight\Auth\Role::ADMIN, \Delight\Auth\Role::MANAGER);
    }
    function canAccessSettings($auth) {
        return $auth->hasAnyRole(\Delight\Auth\Role::ADMIN, \Delight\Auth\Role::MANAGER);
    }
    function canAccessCollectMoney($auth) {
        return $auth->hasAnyRole(\Delight\Auth\Role::ADMIN, \Delight\Auth\Role::MANAGER);
    }
    function canAccessCardsSearch($auth) {
        return $auth->hasAnyRole(\Delight\Auth\Role::ADMIN, \Delight\Auth\Role::MANAGER);
    }
    function canAccessVideoUpload($auth) {
        return $auth->hasAnyRole(\Delight\Auth\Role::ADMIN, \Delight\Auth\Role::MANAGER);
    }
    function canAccessReportsPage($auth) {
        return $auth->hasAnyRole(\Delight\Auth\Role::ADMIN, \Delight\Auth\Role::MANAGER);
    }
?>
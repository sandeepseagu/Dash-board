<?php
    include(__DIR__."/get_auth.php");
    include(__DIR__."/../core/file_upload.php");
    include(__DIR__."/../json_headers.php");
    include(__DIR__."/../../paths.php");

    $fields = [];
    $fields_num_names = ['user_id'];
    $fields_text_names = ['first_name', 'last_name', 'phone', 'address'];

    foreach ($fields_text_names as $field_text_name) {
        if (isSet($_POST[$field_text_name]))
            $fields[$field_text_name] = $_POST[$field_text_name];
        else
            $fields[$field_text_name] = "";
    }

    foreach ($fields_num_names as $field_num_name) {
        $fields[$field_num_name] = $_POST[$field_num_name];
    }

    $target_file_query = "";
    if (!empty($_FILES['picture']) and $_FILES['picture']['error'] != 4) { // If file is not coming empty
        $picture = $_FILES['picture'];
        if (is_real_image($picture) and check_file_size($picture)) {
            $extension = strtolower(pathinfo($picture["name"], PATHINFO_EXTENSION));
            $userId = $auth->getUserId();

            // File's filesystem dir
            $target_dir = MEDIA_ROOT."/users_profiles/pictures/";
            $target_file = $target_dir . $userId . "." . $extension;

            // File's url
            $target_url = MEDIA_URL."/users_profiles/pictures/";
            $target_file_url = $target_url . $userId . "." . $extension;
            $target_file_query = ", picture='{$target_file_url}'";
            
            upload_file($picture, $target_file);
        }
    }

    $stmt = $pdo->prepare("UPDATE users_profiles
                           SET first_name=:first_name, last_name=:last_name, phone=:phone, address=:address
                           {$target_file_query}
                           WHERE user_id=:user_id");
    $stmt->execute(['first_name' => $fields["first_name"], 'last_name' => $fields["last_name"], 'phone' => $fields["phone"], 'address' => $fields["address"], 'user_id' => $fields["user_id"]]);
    
    $result = "success";

    print json_encode($result);
?>

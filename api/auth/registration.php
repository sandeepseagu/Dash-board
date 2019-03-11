<?php
    include(__DIR__."/../json_headers.php");
    include(__DIR__."/../core/file_upload.php");
    include(__DIR__."/../../paths.php");
    try {
        if (!isSet($_POST['stores']) or !$_POST['stores']) {
            $result = "User must have at least one store assigned";
        }
        else {
            if ($_POST['password_1'] == $_POST['password_2']) {
                include(__DIR__."/get_auth.php");

                // ROLES
                if (strcasecmp($_POST['role'], 'ADMIN') == 0)
                    $role = \Delight\Auth\Role::ADMIN;
                else if (strcasecmp($_POST['role'], 'MANAGER') == 0)
                    $role = \Delight\Auth\Role::MANAGER;
                else if (strcasecmp($_POST['role'], 'EMPLOYEE') == 0)
                    $role = \Delight\Auth\Role::EMPLOYEE;

                // CREATE USER
                $userId = $auth->registerWithUniqueUsername($_POST['email'], $_POST['password_1'], $_POST['username']);
                $auth->admin()->addRoleForUserById($userId, $role);

                // ASSIGN STORES
                // User-store pairs
                if (!empty($_POST['stores'])) {
                    $user_stores = [];
                    foreach ($_POST['stores'] as $store_id) {
                        array_push($user_stores, "('".$store_id."', ".$userId.")");
                    }
                    $user_stores_query = join(", ",$user_stores);
                    $stmt = $pdo->prepare("INSERT INTO users_stores (store_id, user_id) VALUES ".$user_stores_query);
                    $stmt->execute();
                }
                // CREATE USER PROFILE
                $first_name = $_POST['first_name'];
                $last_name = $_POST['last_name'];
                $address = $_POST['address'];
                $phone = $_POST['phone'];
                $target_file = "";
                $target_file_url = "";

                if (!empty($_FILES['picture']) and $_FILES['picture']['error'] != 4) { // If file is not coming empty
                    $picture = $_FILES['picture'];
                    if (is_real_image($picture) and check_file_size($picture)) {
                        $extension = strtolower(pathinfo($picture["name"], PATHINFO_EXTENSION));

                        // File's filesystem dir
                        $target_dir = MEDIA_ROOT."/users_profiles/pictures/";
                        $target_file = $target_dir . $userId . "." . $extension;

                        // File's url
                        $target_url = MEDIA_URL."/users_profiles/pictures/";
                        $target_file_url = $target_url . $userId . "." . $extension;
                        
                        upload_file($picture, $target_file);
                    }
                }

                // Add user profile to DB
                $stmt = $pdo->prepare("INSERT INTO users_profiles (user_id, first_name, last_name, address, phone, picture) VALUES (:userId, :first_name, :last_name, :address, :phone, :target_file_url)");
                $stmt->execute(['userId' => $userId, 'first_name' => $first_name, 'last_name' => $last_name, 'address' => $address, 'phone' => $phone, 'target_file_url' => $target_file_url]);

                $result = "success";
            }
            else {
                $result = "Passwords don't match.";
            }
        }
    }
    catch (\Delight\Auth\InvalidEmailException $e) {
        $result = "The given email is invalid.";
    }
    catch (\Delight\Auth\InvalidPasswordException $e) {
        $result = "The given password is invalid";
    }
    catch (\Delight\Auth\UserAlreadyExistsException $e) {
        $result = "Email already in use.";
    }
    catch (\Delight\Auth\DuplicateUsernameException $e) {
        $result = "Username already in use.";
    }
    catch (\Delight\Auth\TooManyRequestsException $e) {
        $result = "Too many requests.";
    }
    print json_encode($result);
?>
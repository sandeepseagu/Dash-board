<?php
    try {
        include(__DIR__."/get_auth.php");
        include(__DIR__."/../json_headers.php");
        
        define("LIMIT_LOGIN_ATTEMPTS", 5);

        $ip = $_SERVER['REMOTE_ADDR'];
        $username = $_POST['username'];
        $stmt = $pdo->prepare("SELECT last_login as last_login FROM users WHERE username=:username");
        $stmt->execute(["username" => $username]);
        $user_last_login_ts = (int)$stmt->fetch()['last_login'];
        $user_last_login = gmdate("Y-m-d H:i:s",$user_last_login_ts);

        $stmt = $pdo->prepare("SELECT COUNT(*) as login_attempts FROM dashboard_accesses WHERE ip=:ip AND login_attempt>=:user_last_login");
        $stmt->execute(["ip" => $ip, "user_last_login" => $user_last_login]);
        $login_attempts = (int)$stmt->fetch()['login_attempts'];

        // Login attempt data
        $now = gmdate('Y-m-d H:i:s', time());
        $stmt = $pdo->prepare("INSERT INTO dashboard_accesses (ip, login_attempt) VALUES (:ip, :now)");
        $stmt->execute(["ip" => $ip, "now" => $now]);

        if ($login_attempts >= LIMIT_LOGIN_ATTEMPTS) { // TOO MANY LOGIN ATTEMPTS
            // CHECK RECAPTCHA
            $secretKey = "6LfBXY8UAAAAADfrU1PGSNGx1r7B-M_EhhnbAukS";
            $recaptcha = new \ReCaptcha\ReCaptcha($secretKey);
            $gRecaptchaResponse = $_POST['g-recaptcha-response'];
            $remoteIp = $ip;
            $resp = $recaptcha->verify($gRecaptchaResponse, $remoteIp);
        }

        // if captcha was successful or limit was not met, then try logging in
        if ($login_attempts < LIMIT_LOGIN_ATTEMPTS or $resp->isSuccess()) {
            $auth->loginWithUsername($_POST['username'], $_POST['password']); // LOGIN

            $result = [];
            $result['status'] = 'success';
            $result['redirect_url'] = 'dashboard';
        }
        else if (!$resp->isSuccess()) {
            $result['status'] = 'error';
            $result['error_msg'] = 'There was an error verifying recaptcha';
            //$resp->getErrorCodes()
        }
    }
    catch (\Delight\Auth\InvalidEmailException $e) {
        $result['status'] = 'error';
        $result['error_msg'] = 'Wrong email address';
    }
    catch (\Delight\Auth\UnknownUsernameException $e) {
        $result['status'] = 'error';
        $result['error_msg'] = 'Wrong username';
    }
    catch (\Delight\Auth\InvalidPasswordException $e) {
        $result['status'] = 'error';
        $result['error_msg'] = 'Wrong password';
    }
    catch (\Delight\Auth\EmailNotVerifiedException $e) {
        $result['status'] = 'error';
        $result['error_msg'] = 'Email not verified';
    }
    catch (\Delight\Auth\TooManyRequestsException $e) {
        $result['status'] = 'error';
        $result['error_msg'] = 'Too many requests';
    }
    print json_encode($result);
?>
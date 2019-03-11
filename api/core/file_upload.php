<?php
    function is_real_image($file) {
        return (getimagesize($file["tmp_name"]) != false);
    }
    function check_file_size($file) {
        return ($file["size"] <= 500000);
    }

    function target_file_exists($target_file) {
        return file_exists($target_file);
    }

    function upload_file($file, $target_file) {
        return move_uploaded_file($file["tmp_name"], $target_file);
    }
?>
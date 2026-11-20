<?php
require __DIR__ . "/../config/koneksi.php";

if($_SERVER["REQUEST_METHOD"] == "POST"){
    if(!isset($_POST["csrf_token"]) || !hash_equals($_SESSION["csrf_token"], $_POST["csrf_token"])){
        header("Location: ../profile.php");
        exit();
    }

    session_unset();
    session_destroy();
    header("Location: ../index.php");
    exit();
}

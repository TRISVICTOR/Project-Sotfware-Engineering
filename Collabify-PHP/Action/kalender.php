<?php
require __DIR__ . "/../config/koneksi.php";

if(!isset($_SESSION["id"])){
    header("Location: ../login.php");
    exit();
}

if($_SERVER["REQUEST_METHOD"] == "POST"){
    if(!isset($_POST["csrf_token"]) || !hash_equals($_SESSION["csrf_token"], $_POST["csrf_token"])){
        header("Location: ../home.php");
        exit();
    }

    $bulan = $_POST["bulan"] ?? "";

    if(preg_match('/^\d{4}-(0[1-9]|1[0-2])$/', $bulan)){
        $_SESSION["bulan_kalender"] = $bulan;
    }

    header("Location: ../home.php");
    exit();
}

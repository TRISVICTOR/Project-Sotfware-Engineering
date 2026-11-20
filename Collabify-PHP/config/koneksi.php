<?php

ini_set("session.use_strict_mode", 1);
session_set_cookie_params(["httponly" => true, "samesite" => "Lax"]);
session_start();

date_default_timezone_set("Asia/Jakarta");

function errorServer($e){
    error_log($e);
    http_response_code(500);
    echo "Terjadi kesalahan pada server. Silakan coba lagi beberapa saat lagi.";
}
set_exception_handler("errorServer");

$host = "localhost";
$user = "root";
$pass = "";
$db = "collabify_php";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("SET time_zone = '+07:00'");
} catch(PDOException $e) {
    die("Database connection failed.");
}

if(!isset($_SESSION["csrf_token"])){
    $_SESSION["csrf_token"] = bin2hex(random_bytes(32));
}

<?php
require __DIR__ . "/../config/koneksi.php";

function error($message){
    $_SESSION["trouble"] = $message;
    header("Location: ../login.php");
    exit();
}

if($_SERVER["REQUEST_METHOD"] == "POST"){
    if(!isset($_POST["csrf_token"]) || !hash_equals($_SESSION["csrf_token"], $_POST["csrf_token"])){
        error("Sesi formulir kedaluwarsa atau file terlalu besar. Silakan coba lagi.");
    }

    $email = trim($_POST["email"] ?? "");
    $password = $_POST["password"] ?? "";

    if(empty($email) || empty($password)){
        error("Email dan password wajib diisi!");
    }

    $search = $conn->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
    $search->execute([$email]);
    $data = $search->fetch(PDO::FETCH_ASSOC);

    if($data && password_verify($password, $data["password"])){
        session_regenerate_id(true);
        $_SESSION["id"] = $data["id"];
        $_SESSION["nama"] = $data["nama"];
        $_SESSION["email"] = $data["email"];
        $_SESSION["csrf_token"] = bin2hex(random_bytes(32));
        unset($_SESSION["notif_dibunyikan"]);
        header("Location: ../home.php");
        exit();
    }

    error("Email atau password salah.");
}

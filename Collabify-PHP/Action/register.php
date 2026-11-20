<?php
require __DIR__ . "/../config/koneksi.php";

function error($message){
    $_SESSION["trouble"] = $message;
    header("Location: ../signup.php");
    exit();
}

if($_SERVER["REQUEST_METHOD"] == "POST"){
    if(!isset($_POST["csrf_token"]) || !hash_equals($_SESSION["csrf_token"], $_POST["csrf_token"])){
        error("Sesi formulir kedaluwarsa atau file terlalu besar. Silakan coba lagi.");
    }

    $nama = trim($_POST["nama"] ?? "");
    $email = trim($_POST["email"] ?? "");
    $password = $_POST["password"] ?? "";
    $confirmPassword = $_POST["konfirmasi_password"] ?? "";

    if(empty($nama) || empty($email) || empty($password) || empty($confirmPassword)){
        error("Semua kolom wajib diisi!");
    }
    if(mb_strlen($nama) > 100){
        error("Nama maksimal 100 karakter!");
    }
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
        error("Format email tidak valid!");
    }
    if($password !== $confirmPassword){
        error("Password dan Confirm Password tidak sama!");
    }
    if(strlen($password) < 6){
        error("Password minimal 6 karakter!");
    }

    $checkingUser = $conn->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
    $checkingUser->execute([$email]);

    if($checkingUser->fetch()){
        error("Email sudah terdaftar.");
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $insert = $conn->prepare("INSERT INTO users(nama, email, password) VALUES(?, ?, ?)");
    $insert->execute([$nama, $email, $hash]);

    $_SESSION["success"] = "Registrasi berhasil! Silakan login.";
    header("Location: ../login.php");
    exit();
}

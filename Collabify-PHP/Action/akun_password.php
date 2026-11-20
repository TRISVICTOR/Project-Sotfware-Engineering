<?php
require __DIR__ . "/../config/koneksi.php";

if(!isset($_SESSION["id"])){
    header("Location: ../login.php");
    exit();
}

function error($message){
    $_SESSION["trouble"] = $message;
    header("Location: ../changepassword.php");
    exit();
}

if($_SERVER["REQUEST_METHOD"] == "POST"){
    if(!isset($_POST["csrf_token"]) || !hash_equals($_SESSION["csrf_token"], $_POST["csrf_token"])){
        error("Sesi formulir kedaluwarsa atau file terlalu besar. Silakan coba lagi.");
    }

    $passwordLama = $_POST["password_lama"] ?? "";
    $passwordBaru = $_POST["password_baru"] ?? "";
    $confirmPassword = $_POST["konfirmasi_password"] ?? "";

    if(empty($passwordLama)){
        error("Password lama wajib diisi!");
    }
    if(empty($passwordBaru)){
        error("Password baru wajib diisi!");
    }
    if(strlen($passwordBaru) < 6){
        error("Password baru minimal 6 karakter!");
    }
    if($passwordBaru !== $confirmPassword){
        error("Konfirmasi password tidak sama!");
    }

    $search = $conn->prepare("SELECT password FROM users WHERE id = ?");
    $search->execute([$_SESSION["id"]]);
    $data = $search->fetch(PDO::FETCH_ASSOC);

    if(!password_verify($passwordLama, $data["password"])){
        error("Password lama salah!");
    }

    $hash = password_hash($passwordBaru, PASSWORD_DEFAULT);
    $update = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
    $update->execute([$hash, $_SESSION["id"]]);

    session_unset();
    session_regenerate_id(true);
    $_SESSION["success"] = "Password berhasil diubah! Silakan login ulang.";
    header("Location: ../login.php");
    exit();
}

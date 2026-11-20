<?php
require __DIR__ . "/../config/koneksi.php";

if(!isset($_SESSION["id"])){
    header("Location: ../login.php");
    exit();
}

function error($message){
    $_SESSION["trouble"] = $message;
    header("Location: ../changeusernameemail.php");
    exit();
}

if($_SERVER["REQUEST_METHOD"] == "POST"){
    if(!isset($_POST["csrf_token"]) || !hash_equals($_SESSION["csrf_token"], $_POST["csrf_token"])){
        error("Sesi formulir kedaluwarsa atau file terlalu besar. Silakan coba lagi.");
    }

    $namaBaru = trim($_POST["nama_baru"] ?? "");
    $emailBaru = trim($_POST["email_baru"] ?? "");
    $password = $_POST["password"] ?? "";

    if(empty($namaBaru) && empty($emailBaru)){
        error("Username dan Email harus diisi");
    }
    if(mb_strlen($namaBaru) > 100){
        error("Username maksimal 100 karakter!");
    }
    if(!empty($emailBaru) && !filter_var($emailBaru, FILTER_VALIDATE_EMAIL)){
        error("Format email tidak valid!");
    }
    if(empty($password)){
        error("Password saat ini wajib diisi!");
    }

    $search = $conn->prepare("SELECT password FROM users WHERE id = ?");
    $search->execute([$_SESSION["id"]]);
    $data = $search->fetch(PDO::FETCH_ASSOC);

    if(!password_verify($password, $data["password"])){
        error("Password salah!");
    }

    if(!empty($emailBaru)){
        $checkingEmail = $conn->prepare("SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1");
        $checkingEmail->execute([$emailBaru, $_SESSION["id"]]);
        if($checkingEmail->fetch()){
            error("Email sudah dipakai akun lain!");
        }

        $update = $conn->prepare("UPDATE users SET email = ? WHERE id = ?");
        $update->execute([$emailBaru, $_SESSION["id"]]);
        $_SESSION["email"] = $emailBaru;
    }

    if(!empty($namaBaru)){
        $update = $conn->prepare("UPDATE users SET nama = ? WHERE id = ?");
        $update->execute([$namaBaru, $_SESSION["id"]]);
        $_SESSION["nama"] = $namaBaru;
    }

    $_SESSION["success"] = "Berhasil diubah!";
    header("Location: ../profile.php");
    exit();
}

<?php
require __DIR__ . "/../config/koneksi.php";

if(!isset($_SESSION["id"])){
    header("Location: ../login.php");
    exit();
}

if($_SERVER["REQUEST_METHOD"] == "POST"){
    $kembali = $_POST["kembali"] ?? "home.php";
    if(!preg_match('/^[a-z]+\.php(\?id=[0-9]+)?$/', $kembali)){
        $kembali = "home.php";
    }

    if(!isset($_POST["csrf_token"]) || !hash_equals($_SESSION["csrf_token"], $_POST["csrf_token"])){
        $_SESSION["trouble"] = "Sesi formulir kedaluwarsa atau file terlalu besar. Silakan coba lagi.";
        header("Location: ../" . $kembali);
        exit();
    }

    if(($_POST["semua"] ?? "") == "1"){
        $update = $conn->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?");
        $update->execute([$_SESSION["id"]]);
    } else {
        $update = $conn->prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?");
        $update->execute([(int)($_POST["id"] ?? 0), $_SESSION["id"]]);
    }

    header("Location: ../" . $kembali . "#notif");
    exit();
}

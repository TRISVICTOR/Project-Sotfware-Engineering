<?php
require __DIR__ . "/../config/koneksi.php";

if(!isset($_SESSION["id"])){
    header("Location: ../login.php");
    exit();
}

function error($message){
    $_SESSION["trouble"] = $message;
    header("Location: ../addfriend.php");
    exit();
}

if($_SERVER["REQUEST_METHOD"] == "POST"){
    if(!isset($_POST["csrf_token"]) || !hash_equals($_SESSION["csrf_token"], $_POST["csrf_token"])){
        error("Sesi formulir kedaluwarsa atau file terlalu besar. Silakan coba lagi.");
    }

    $temanId = (int)($_POST["friend_id"] ?? 0);

    if($temanId == $_SESSION["id"]){
        error("Tidak bisa menambahkan diri sendiri.");
    }

    $search = $conn->prepare("SELECT nama FROM users WHERE id = ?");
    $search->execute([$temanId]);
    $data = $search->fetch(PDO::FETCH_ASSOC);

    if(!$data){
        error("User tidak ditemukan.");
    }

    $user1 = min($_SESSION["id"], $temanId);
    $user2 = max($_SESSION["id"], $temanId);

    $insert = $conn->prepare("INSERT IGNORE INTO friends(user1_id, user2_id) VALUES(?, ?)");
    $insert->execute([$user1, $user2]);

    $_SESSION["success"] = "Berhasil menambahkan " . $data["nama"] . " sebagai teman!";
    header("Location: ../addfriend.php");
    exit();
}

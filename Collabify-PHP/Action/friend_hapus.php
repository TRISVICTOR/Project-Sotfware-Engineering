<?php
require __DIR__ . "/../config/koneksi.php";

if(!isset($_SESSION["id"])){
    header("Location: ../login.php");
    exit();
}

if($_SERVER["REQUEST_METHOD"] == "POST"){
    if(!isset($_POST["csrf_token"]) || !hash_equals($_SESSION["csrf_token"], $_POST["csrf_token"])){
        $_SESSION["trouble"] = "Sesi formulir kedaluwarsa atau file terlalu besar. Silakan coba lagi.";
        header("Location: ../friend.php");
        exit();
    }

    $temanId = (int)($_POST["friend_id"] ?? 0);
    $user1 = min($_SESSION["id"], $temanId);
    $user2 = max($_SESSION["id"], $temanId);

    $delete = $conn->prepare("DELETE FROM friends WHERE user1_id = ? AND user2_id = ?");
    $delete->execute([$user1, $user2]);

    $_SESSION["success"] = "Teman dihapus.";
    header("Location: ../friend.php");
    exit();
}

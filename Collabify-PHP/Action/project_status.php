<?php
require __DIR__ . "/../config/koneksi.php";
require __DIR__ . "/../config/fungsi.php";

if(!isset($_SESSION["id"])){
    header("Location: ../login.php");
    exit();
}

function error($message){
    $_SESSION["trouble"] = $message;
    header("Location: ../mytask.php");
    exit();
}

if($_SERVER["REQUEST_METHOD"] == "POST"){
    if(!isset($_POST["csrf_token"]) || !hash_equals($_SESSION["csrf_token"], $_POST["csrf_token"])){
        error("Sesi formulir kedaluwarsa atau file terlalu besar. Silakan coba lagi.");
    }

    $project = ambilProject($conn, (int)($_POST["id"] ?? 0), $_SESSION["id"]);
    $status = $_POST["status"] ?? "";

    if(!$project || $project["owner_id"] != $_SESSION["id"]){
        error("Hanya ketua project yang bisa mengubah status project.");
    }
    if($status != "active" && $status != "done"){
        error("Status tidak valid!");
    }

    $update = $conn->prepare("UPDATE projects SET status = ? WHERE id = ?");
    $update->execute([$status, $project["id"]]);

    if($status == "done"){
        $_SESSION["success"] = "Project ditandai selesai.";
    } else {
        $_SESSION["success"] = "Project diaktifkan kembali.";
    }
    header("Location: ../mytask.php");
    exit();
}

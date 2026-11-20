<?php
require __DIR__ . "/../config/koneksi.php";
require __DIR__ . "/../config/fungsi.php";

if(!isset($_SESSION["id"])){
    header("Location: ../login.php");
    exit();
}

function error($message, $location){
    $_SESSION["trouble"] = $message;
    header("Location: " . $location);
    exit();
}

if($_SERVER["REQUEST_METHOD"] == "POST"){
    $kembali = $_POST["kembali"] ?? "mytask.php";
    if(!preg_match('/^[a-z]+\.php(\?id=[0-9]+)?$/', $kembali)){
        $kembali = "mytask.php";
    }
    $kembali = "../" . $kembali;

    if(!isset($_POST["csrf_token"]) || !hash_equals($_SESSION["csrf_token"], $_POST["csrf_token"])){
        error("Sesi formulir kedaluwarsa atau file terlalu besar. Silakan coba lagi.", $kembali);
    }

    $task = ambilTask($conn, (int)($_POST["id"] ?? 0));
    $status = $_POST["status"] ?? "";

    if(!$task || !(bolehKelolaTask($task, $_SESSION["id"]) || $task["assigned_to"] == $_SESSION["id"])){
        error("Kamu tidak berhak mengubah status task ini.", $kembali);
    }
    if($status != "todo" && $status != "done"){
        error("Status tidak valid!", $kembali);
    }

    $update = $conn->prepare("UPDATE tasks SET status = ? WHERE id = ?");
    $update->execute([$status, $task["id"]]);

    if($status == "done"){
        $_SESSION["success"] = "Task ditandai selesai.";
    } else {
        $_SESSION["success"] = "Status task diperbarui.";
    }
    header("Location: " . $kembali);
    exit();
}

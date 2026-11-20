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
    if(!$task || !bolehKelolaTask($task, $_SESSION["id"])){
        error("Kamu tidak berhak menghapus task ini.", $kembali);
    }

    $select = $conn->prepare("SELECT path_file FROM submissions WHERE task_id = ?");
    $select->execute([$task["id"]]);
    $fileSubmission = $select->fetchAll(PDO::FETCH_ASSOC);

    $delete = $conn->prepare("DELETE FROM tasks WHERE id = ?");
    $delete->execute([$task["id"]]);

    hapusFile("lampiran", $task["lampiran_file"]);
    foreach($fileSubmission as $f){
        hapusFile("submission", $f["path_file"]);
    }

    $_SESSION["success"] = "Task dihapus.";
    header("Location: " . $kembali);
    exit();
}

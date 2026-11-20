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
    $search = $conn->prepare("SELECT s.id, s.user_id, s.path_file, t.project_id FROM submissions s JOIN tasks t ON t.id = s.task_id WHERE s.id = ?");
    $search->execute([(int)($_POST["id"] ?? 0)]);
    $submission = $search->fetch(PDO::FETCH_ASSOC);

    if($submission){
        $kembali = "../project.php?id=" . $submission["project_id"];
    } else {
        $kembali = "../mytask.php";
    }

    if(!isset($_POST["csrf_token"]) || !hash_equals($_SESSION["csrf_token"], $_POST["csrf_token"])){
        error("Sesi formulir kedaluwarsa atau file terlalu besar. Silakan coba lagi.", $kembali);
    }

    if(!$submission || $submission["user_id"] != $_SESSION["id"]){
        error("Kamu hanya bisa menghapus file milikmu sendiri.", $kembali);
    }

    $delete = $conn->prepare("DELETE FROM submissions WHERE id = ? AND user_id = ?");
    $delete->execute([$submission["id"], $_SESSION["id"]]);

    hapusFile("submission", $submission["path_file"]);

    $_SESSION["success"] = "File dihapus.";
    header("Location: " . $kembali);
    exit();
}

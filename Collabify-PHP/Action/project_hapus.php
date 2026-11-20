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
    $projectId = (int)($_POST["id"] ?? 0);

    if(!isset($_POST["csrf_token"]) || !hash_equals($_SESSION["csrf_token"], $_POST["csrf_token"])){
        error("Sesi formulir kedaluwarsa atau file terlalu besar. Silakan coba lagi.", "../project.php?id=" . $projectId);
    }

    $project = ambilProject($conn, $projectId, $_SESSION["id"]);
    if(!$project || $project["owner_id"] != $_SESSION["id"]){
        error("Hanya ketua project yang bisa menghapus project.", "../mytask.php");
    }

    $select = $conn->prepare("SELECT lampiran_file FROM tasks WHERE project_id = ? AND lampiran_file IS NOT NULL");
    $select->execute([$projectId]);
    $fileLampiran = $select->fetchAll(PDO::FETCH_ASSOC);

    $select = $conn->prepare("SELECT s.path_file FROM submissions s JOIN tasks t ON t.id = s.task_id WHERE t.project_id = ?");
    $select->execute([$projectId]);
    $fileSubmission = $select->fetchAll(PDO::FETCH_ASSOC);

    $delete = $conn->prepare("DELETE FROM projects WHERE id = ?");
    $delete->execute([$projectId]);

    foreach($fileLampiran as $f){
        hapusFile("lampiran", $f["lampiran_file"]);
    }
    foreach($fileSubmission as $f){
        hapusFile("submission", $f["path_file"]);
    }

    $_SESSION["success"] = 'Project "' . $project["nama"] . '" dihapus.';
    header("Location: ../mytask.php");
    exit();
}

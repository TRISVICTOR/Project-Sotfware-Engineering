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
    $halamanForm = "../editproject.php?id=" . $projectId;

    if(!isset($_POST["csrf_token"]) || !hash_equals($_SESSION["csrf_token"], $_POST["csrf_token"])){
        error("Sesi formulir kedaluwarsa atau file terlalu besar. Silakan coba lagi.", $halamanForm);
    }

    $project = ambilProject($conn, $projectId, $_SESSION["id"]);
    if(!$project || $project["owner_id"] != $_SESSION["id"]){
        error("Hanya ketua project yang bisa mengubah project.", "../mytask.php");
    }

    $nama = trim($_POST["nama"] ?? "");
    $deadline = $_POST["deadline"] ?? "";

    if(empty($nama)){
        error("Nama project wajib diisi!", $halamanForm);
    }
    if(mb_strlen($nama) > 150){
        error("Nama project maksimal 150 karakter!", $halamanForm);
    }
    if(empty($deadline) || strtotime($deadline) === false){
        error("Deadline wajib diisi!", $halamanForm);
    }
    $deadlineBerubah = strtotime($deadline) != strtotime($project["deadline"]);
    if($deadlineBerubah && strtotime($deadline) <= time()){
        error("Deadline baru harus setelah waktu sekarang!", $halamanForm);
    }
    $deadline = date("Y-m-d H:i:s", strtotime($deadline));

    $update = $conn->prepare("UPDATE projects SET nama = ?, deadline = ? WHERE id = ?");
    $update->execute([$nama, $deadline, $projectId]);

    if($deadlineBerubah){
        $delete = $conn->prepare("DELETE FROM notifications WHERE project_id = ? AND tipe IN ('deadline_24jam', 'deadline_12jam')");
        $delete->execute([$projectId]);
    }

    $_SESSION["success"] = "Project berhasil diperbarui!";
    header("Location: ../project.php?id=" . $projectId);
    exit();
}

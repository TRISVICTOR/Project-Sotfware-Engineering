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
    $projectId = (int)($_POST["project_id"] ?? 0);
    $kembali = "../project.php?id=" . $projectId;

    if(!isset($_POST["csrf_token"]) || !hash_equals($_SESSION["csrf_token"], $_POST["csrf_token"])){
        error("Sesi formulir kedaluwarsa atau file terlalu besar. Silakan coba lagi.", $kembali);
    }

    $project = ambilProject($conn, $projectId, $_SESSION["id"]);
    if(!$project || $project["owner_id"] != $_SESSION["id"]){
        error("Hanya ketua project yang bisa mengeluarkan anggota.", "../mytask.php");
    }

    $userId = (int)($_POST["user_id"] ?? 0);

    if($userId == $project["owner_id"]){
        error("Ketua tidak bisa dikeluarkan dari project.", $kembali);
    }
    if(!cekAnggota($conn, $projectId, $userId)){
        error("User tersebut bukan anggota project.", $kembali);
    }

    $conn->beginTransaction();

    $update = $conn->prepare("UPDATE tasks SET assigned_to = ? WHERE project_id = ? AND assigned_to = ?");
    $update->execute([$project["owner_id"], $projectId, $userId]);

    $delete = $conn->prepare("DELETE FROM project_members WHERE project_id = ? AND user_id = ?");
    $delete->execute([$projectId, $userId]);

    $conn->commit();

    $_SESSION["success"] = "Anggota dikeluarkan. Assignment miliknya dialihkan ke ketua.";
    header("Location: " . $kembali);
    exit();
}

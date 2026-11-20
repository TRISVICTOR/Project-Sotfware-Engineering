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
        error("Hanya ketua project yang bisa mengundang anggota.", "../mytask.php");
    }

    $email = trim($_POST["email"] ?? "");

    $search = $conn->prepare("SELECT id, nama FROM users WHERE email = ? LIMIT 1");
    $search->execute([$email]);
    $data = $search->fetch(PDO::FETCH_ASSOC);

    if(!$data){
        error("User dengan email tersebut tidak ditemukan.", $kembali);
    }
    if(cekAnggota($conn, $projectId, $data["id"])){
        error($data["nama"] . " sudah menjadi anggota project.", $kembali);
    }

    $conn->beginTransaction();

    $insert = $conn->prepare("INSERT INTO project_members(project_id, user_id) VALUES(?, ?)");
    $insert->execute([$projectId, $data["id"]]);

    $pesan = mb_substr('Kamu ditambahkan ke project "' . $project["nama"] . '" oleh ' . $_SESSION["nama"], 0, 255);
    $insert = $conn->prepare("INSERT INTO notifications(user_id, tipe, pesan, project_id) VALUES(?, 'project_invite', ?, ?)");
    $insert->execute([$data["id"], $pesan, $projectId]);

    $conn->commit();

    $_SESSION["success"] = $data["nama"] . " ditambahkan ke project.";
    header("Location: " . $kembali);
    exit();
}

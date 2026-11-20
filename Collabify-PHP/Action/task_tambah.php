<?php
require __DIR__ . "/../config/koneksi.php";

if(!isset($_SESSION["id"])){
    header("Location: ../login.php");
    exit();
}

function error($message){
    $_SESSION["trouble"] = $message;
    header("Location: ../addtask.php");
    exit();
}

if($_SERVER["REQUEST_METHOD"] == "POST"){
    if(!isset($_POST["csrf_token"]) || !hash_equals($_SESSION["csrf_token"], $_POST["csrf_token"])){
        error("Sesi formulir kedaluwarsa atau file terlalu besar. Silakan coba lagi.");
    }

    $judul = trim($_POST["judul"] ?? "");
    $tipe = $_POST["tipe"] ?? "";
    $deadline = $_POST["deadline"] ?? "";

    if(empty($judul)){
        error("Nama task wajib diisi!");
    }
    if(mb_strlen($judul) > 150){
        error("Nama task maksimal 150 karakter!");
    }
    if($tipe != "personal" && $tipe != "group"){
        error("Tipe task tidak valid!");
    }
    if(empty($deadline) || strtotime($deadline) === false){
        error("Deadline wajib diisi!");
    }
    if(strtotime($deadline) <= time()){
        error("Deadline sudah lewat");
    }

    $deadline = date("Y-m-d H:i:s", strtotime($deadline));

    if($tipe == "personal"){
        $insert = $conn->prepare("INSERT INTO tasks(judul, deadline, created_by, assigned_to) VALUES(?, ?, ?, ?)");
        $insert->execute([$judul, $deadline, $_SESSION["id"], $_SESSION["id"]]);

        $_SESSION["success"] = "Task berhasil dibuat!";
        header("Location: ../mytask.php");
        exit();
    }

    $conn->beginTransaction();

    $insert = $conn->prepare("INSERT INTO projects(nama, deadline, owner_id) VALUES(?, ?, ?)");
    $insert->execute([$judul, $deadline, $_SESSION["id"]]);
    $projectId = $conn->lastInsertId();

    $insert = $conn->prepare("INSERT INTO project_members(project_id, user_id) VALUES(?, ?)");
    $insert->execute([$projectId, $_SESSION["id"]]);

    $conn->commit();

    $_SESSION["success"] = "Project dibuat! Undang anggota lalu bagikan assignment.";
    header("Location: ../project.php?id=" . $projectId);
    exit();
}

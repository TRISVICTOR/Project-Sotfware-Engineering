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
        error("Hanya ketua project yang bisa membuat assignment.", "../mytask.php");
    }

    $judul = trim($_POST["judul"] ?? "");
    $assignedTo = (int)($_POST["assigned_to"] ?? 0);
    $deadline = $_POST["deadline"] ?? "";

    if(empty($judul)){
        error("Nama assignment wajib diisi!", $kembali);
    }
    if(mb_strlen($judul) > 150){
        error("Nama assignment maksimal 150 karakter!", $kembali);
    }
    if($assignedTo == 0){
        error("Pilih orang yang bertanggung jawab!", $kembali);
    }
    if(!cekAnggota($conn, $projectId, $assignedTo)){
        error("Orang yang dipilih bukan anggota project!", $kembali);
    }
    if(empty($deadline) || strtotime($deadline) === false){
        error("Deadline wajib diisi!", $kembali);
    }
    if(strtotime($deadline) <= time()){
        error("Deadline sudah lewat", $kembali);
    }
    $deadline = date("Y-m-d H:i:s", strtotime($deadline));

    $lampiranNama = null;
    $lampiranFile = null;

    if(isset($_FILES["lampiran"]) && $_FILES["lampiran"]["error"] != UPLOAD_ERR_NO_FILE){
        $file = $_FILES["lampiran"];

        if($file["error"] != UPLOAD_ERR_OK){
            error("Upload file gagal (maksimal 10 MB).", $kembali);
        }
        if($file["size"] == 0){
            error("File kosong (0 byte). Pilih file yang ada isinya.", $kembali);
        }
        if($file["size"] > 10*1024*1024){
            error("Ukuran file maksimal 10 MB.", $kembali);
        }

        $fileExtension = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
        $allowed = ["jpg", "jpeg", "png", "pdf", "doc", "docx", "xls", "xlsx"];
        if(!in_array($fileExtension, $allowed)){
            error("Tipe file tidak diizinkan. Gunakan: " . implode(", ", $allowed) . ".", $kembali);
        }

        $storedName = bin2hex(random_bytes(16)) . "." . $fileExtension;
        if(!move_uploaded_file($file["tmp_name"], __DIR__ . "/../assets/uploads/lampiran/" . $storedName)){
            error("Gagal menyimpan file di server.", $kembali);
        }

        $lampiranNama = basename($file["name"]);
        $lampiranFile = $storedName;
    }

    try{
        $conn->beginTransaction();

        $insert = $conn->prepare("INSERT INTO tasks(project_id, judul, deadline, created_by, assigned_to, lampiran_nama, lampiran_file)
                                  VALUES(?, ?, ?, ?, ?, ?, ?)");
        $insert->execute([$projectId, $judul, $deadline, $_SESSION["id"], $assignedTo, $lampiranNama, $lampiranFile]);
        $taskId = $conn->lastInsertId();

        if($assignedTo != $_SESSION["id"]){
            $pesan = mb_substr('Kamu ditugaskan pada task: "' . $judul . '" di project "' . $project["nama"] . '"', 0, 255);
            $insert = $conn->prepare("INSERT INTO notifications(user_id, tipe, pesan, task_id) VALUES(?, 'task_assigned', ?, ?)");
            $insert->execute([$assignedTo, $pesan, $taskId]);
        }

        $conn->commit();
    }catch(PDOException $e){
        $conn->rollBack();
        hapusFile("lampiran", $lampiranFile);
        error("Gagal membuat assignment.", $kembali);
    }

    $_SESSION["success"] = "Assignment berhasil dibuat!";
    header("Location: " . $kembali);
    exit();
}

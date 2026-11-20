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
    $taskId = (int)($_POST["id"] ?? 0);
    $halamanForm = "../edittask.php?id=" . $taskId;

    if(!isset($_POST["csrf_token"]) || !hash_equals($_SESSION["csrf_token"], $_POST["csrf_token"])){
        error("Sesi formulir kedaluwarsa atau file terlalu besar. Silakan coba lagi.", $halamanForm);
    }

    $task = ambilTask($conn, $taskId);
    if(!$task || !bolehKelolaTask($task, $_SESSION["id"])){
        error("Kamu tidak berhak mengubah task ini.", "../mytask.php");
    }
    $isGroup = $task["project_id"] != null;

    $judul = trim($_POST["judul"] ?? "");
    $deadline = $_POST["deadline"] ?? "";
    if($isGroup){
        $assignedTo = (int)($_POST["assigned_to"] ?? 0);
    } else {
        $assignedTo = $task["assigned_to"];
    }

    if(empty($judul)){
        error("Nama task wajib diisi!", $halamanForm);
    }
    if(mb_strlen($judul) > 150){
        error("Nama task maksimal 150 karakter!", $halamanForm);
    }
    if(empty($deadline) || strtotime($deadline) === false){
        error("Deadline wajib diisi!", $halamanForm);
    }
    $deadlineBerubah = strtotime($deadline) != strtotime($task["deadline"]);
    if($deadlineBerubah && strtotime($deadline) <= time()){
        error("Deadline baru harus setelah waktu sekarang!", $halamanForm);
    }
    if($isGroup && !cekAnggota($conn, $task["project_id"], $assignedTo)){
        error("Orang yang dipilih bukan anggota project!", $halamanForm);
    }
    $deadline = date("Y-m-d H:i:s", strtotime($deadline));

    $lampiranNama = $task["lampiran_nama"];
    $lampiranFile = $task["lampiran_file"];
    $fileLama = null;

    if($isGroup && isset($_FILES["lampiran"]) && $_FILES["lampiran"]["error"] != UPLOAD_ERR_NO_FILE){
        $file = $_FILES["lampiran"];

        if($file["error"] != UPLOAD_ERR_OK){
            error("Upload file gagal (maksimal 10 MB).", $halamanForm);
        }
        if($file["size"] == 0){
            error("File kosong (0 byte). Pilih file yang ada isinya.", $halamanForm);
        }
        if($file["size"] > 10*1024*1024){
            error("Ukuran file maksimal 10 MB.", $halamanForm);
        }

        $fileExtension = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
        $allowed = ["jpg", "jpeg", "png", "pdf", "doc", "docx", "xls", "xlsx"];
        if(!in_array($fileExtension, $allowed)){
            error("Tipe file tidak diizinkan. Gunakan: " . implode(", ", $allowed) . ".", $halamanForm);
        }

        $storedName = bin2hex(random_bytes(16)) . "." . $fileExtension;
        if(!move_uploaded_file($file["tmp_name"], __DIR__ . "/../assets/uploads/lampiran/" . $storedName)){
            error("Gagal menyimpan file di server.", $halamanForm);
        }

        $fileLama = $lampiranFile;
        $lampiranNama = basename($file["name"]);
        $lampiranFile = $storedName;
    } elseif($isGroup && ($_POST["hapus_lampiran"] ?? "") == "1"){
        $fileLama = $lampiranFile;
        $lampiranNama = null;
        $lampiranFile = null;
    }

    try{
        $conn->beginTransaction();

        $update = $conn->prepare("UPDATE tasks SET judul = ?, deadline = ?, assigned_to = ?, lampiran_nama = ?, lampiran_file = ?
                                  WHERE id = ?");
        $update->execute([$judul, $deadline, $assignedTo, $lampiranNama, $lampiranFile, $taskId]);

        if($deadlineBerubah){
            $delete = $conn->prepare("DELETE FROM notifications WHERE task_id = ? AND tipe IN ('deadline_24jam', 'deadline_12jam')");
            $delete->execute([$taskId]);
        }

        if($isGroup && $assignedTo != $task["assigned_to"] && $assignedTo != $_SESSION["id"]){
            $pesan = mb_substr('Kamu ditugaskan pada task: "' . $judul . '" di project "' . $task["nama_project"] . '"', 0, 255);
            $insert = $conn->prepare("INSERT INTO notifications(user_id, tipe, pesan, task_id) VALUES(?, 'task_assigned', ?, ?)");
            $insert->execute([$assignedTo, $pesan, $taskId]);
        }

        $conn->commit();
    }catch(PDOException $e){
        $conn->rollBack();
        if($lampiranFile != $task["lampiran_file"]){
            hapusFile("lampiran", $lampiranFile);
        }
        error("Gagal menyimpan perubahan.", $halamanForm);
    }

    hapusFile("lampiran", $fileLama);

    $_SESSION["success"] = "Task berhasil diperbarui!";
    if($isGroup){
        header("Location: ../project.php?id=" . $task["project_id"]);
    } else {
        header("Location: ../mytask.php");
    }
    exit();
}

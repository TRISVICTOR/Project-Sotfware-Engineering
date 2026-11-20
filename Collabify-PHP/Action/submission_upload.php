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
    $task = ambilTask($conn, (int)($_POST["task_id"] ?? 0));

    if($task && $task["project_id"] != null){
        $kembali = "../project.php?id=" . $task["project_id"];
    } else {
        $kembali = "../mytask.php";
    }

    if(!isset($_POST["csrf_token"]) || !hash_equals($_SESSION["csrf_token"], $_POST["csrf_token"])){
        error("Sesi formulir kedaluwarsa atau file terlalu besar. Silakan coba lagi.", $kembali);
    }

    if(!$task || $task["project_id"] == null || $task["assigned_to"] != $_SESSION["id"]){
        error("Kamu hanya bisa mengunggah file untuk assignment milikmu sendiri.", $kembali);
    }

    $file = $_FILES["file"] ?? null;

    if(!$file || $file["error"] == UPLOAD_ERR_NO_FILE){
        error("Pilih file terlebih dahulu.", $kembali);
    }
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
    $allowed = ["jpg", "jpeg", "png", "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "zip", "rar"];
    if(!in_array($fileExtension, $allowed)){
        error("Tipe file tidak diizinkan.", $kembali);
    }

    $storedName = bin2hex(random_bytes(16)) . "." . $fileExtension;
    if(!move_uploaded_file($file["tmp_name"], __DIR__ . "/../assets/uploads/submission/" . $storedName)){
        error("Gagal menyimpan file di server.", $kembali);
    }

    try{
        $insert = $conn->prepare("INSERT INTO submissions(task_id, user_id, nama_file, path_file) VALUES(?, ?, ?, ?)");
        $insert->execute([$task["id"], $_SESSION["id"], basename($file["name"]), $storedName]);
    }catch(PDOException $e){
        hapusFile("submission", $storedName);
        error("Gagal menyimpan data file.", $kembali);
    }

    $_SESSION["success"] = "File berhasil diupload!";
    header("Location: " . $kembali);
    exit();
}

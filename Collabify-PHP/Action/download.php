<?php
require __DIR__ . "/../config/koneksi.php";
require __DIR__ . "/../config/fungsi.php";

if(!isset($_SESSION["id"])){
    header("Location: ../login.php");
    exit();
}

$jenis = $_GET["jenis"] ?? "";
$id = (int)($_GET["id"] ?? 0);
$data = null;

if($jenis == "lampiran"){
    $search = $conn->prepare("SELECT lampiran_nama AS nama, lampiran_file AS file, project_id FROM tasks WHERE id = ?");
    $search->execute([$id]);
    $data = $search->fetch(PDO::FETCH_ASSOC);
} elseif($jenis == "submission"){
    $search = $conn->prepare("SELECT s.nama_file AS nama, s.path_file AS file, t.project_id
                              FROM submissions s JOIN tasks t ON t.id = s.task_id WHERE s.id = ?");
    $search->execute([$id]);
    $data = $search->fetch(PDO::FETCH_ASSOC);
}

if(!$data || $data["file"] == null || $data["project_id"] == null || !cekAnggota($conn, $data["project_id"], $_SESSION["id"])){
    http_response_code(404);
    die("File tidak ditemukan atau kamu tidak punya akses.");
}

$path = __DIR__ . "/../assets/uploads/" . $jenis . "/" . basename($data["file"]);
if(!is_file($path)){
    http_response_code(404);
    die("File tidak ditemukan.");
}

$namaAscii = preg_replace('/[^A-Za-z0-9._ -]/', "_", $data["nama"]);
header("Content-Type: application/octet-stream");
header('Content-Disposition: attachment; filename="' . $namaAscii . '"; filename*=UTF-8\'\'' . rawurlencode($data["nama"]));
header("Content-Length: " . filesize($path));
header("X-Content-Type-Options: nosniff");
readfile($path);
exit();

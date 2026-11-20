<?php
require __DIR__ . "/../config/koneksi.php";
require __DIR__ . "/../config/fungsi.php";

header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store");

if(!isset($_SESSION["id"])){
    http_response_code(401);
    echo json_encode(["error" => "Sesi berakhir, silakan login ulang."]);
    exit();
}

$kembali = $_GET["kembali"] ?? "home.php";
if(!preg_match('/^[a-z]+\.php(\?id=[0-9]+)?$/', $kembali)){
    $kembali = "home.php";
}

cekDeadline($conn);
$notifikasi = ambilNotifikasi($conn, $_SESSION["id"]);

echo json_encode([
    "belum_dibaca" => hitungBelumDibaca($conn, $_SESSION["id"]),
    "bunyikan" => cekBunyi($notifikasi),
    "html" => htmlNotifikasi($notifikasi, $kembali),
]);

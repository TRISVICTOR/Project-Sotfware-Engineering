<?php

if(!isset($conn)){
    http_response_code(404);
    exit();
}

require_once __DIR__ . "/config/fungsi.php";

cekDeadline($conn);
$notifikasi = ambilNotifikasi($conn, $_SESSION["id"]);
$jumlahBelumDibaca = hitungBelumDibaca($conn, $_SESSION["id"]);
$bunyikan = cekBunyi($notifikasi);

$halamanIni = basename($_SERVER["SCRIPT_NAME"]);
if(isset($_GET["id"])){
    $halamanIni .= "?id=" . (int)$_GET["id"];
}
?>
<div class="notif" id="notif"
     data-bunyikan="<?= $bunyikan ? "1" : "0" ?>"
     data-polling="Action/cek_notifikasi.php"
     data-kembali="<?= htmlspecialchars($halamanIni) ?>">

  <!-- Tombol Lonceng -->
  <button type="button" class="notif-bell" aria-label="Notifikasi">
    🔔
    <span class="notif-badge" <?= $jumlahBelumDibaca == 0 ? "hidden" : "" ?>>
      <?= $jumlahBelumDibaca > 99 ? "99+" : $jumlahBelumDibaca ?>
    </span>
  </button>

  <!-- Overlay penutup dropdown -->
  <div class="notif-overlay" hidden></div>

  <!-- Dropdown -->
  <div class="notif-dropdown" hidden>
    <div class="notif-header">
      <span>Notifikasi</span>
      <form method="POST" action="Action/notifikasi_baca.php" class="notif-baca-semua" <?= $jumlahBelumDibaca == 0 ? "hidden" : "" ?>>
        <input type="hidden" name="csrf_token" value="<?= $_SESSION["csrf_token"] ?>">
        <input type="hidden" name="semua" value="1">
        <input type="hidden" name="kembali" value="<?= htmlspecialchars($halamanIni) ?>">
        <button type="submit">Tandai semua dibaca</button>
      </form>
    </div>
    <div class="notif-list">
      <?= htmlNotifikasi($notifikasi, $halamanIni) ?>
    </div>
  </div>

  <audio id="notif-audio" src="assets/audio/notifikasi.mp3" preload="auto"></audio>
</div>

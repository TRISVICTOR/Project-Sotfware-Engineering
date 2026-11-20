<?php

if(!isset($conn)){
    http_response_code(404);
    exit();
}

$namaHari = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
$namaBulan = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

$bulanDipilih = $_SESSION["bulan_kalender"] ?? date("Y-m");
$tahun = (int)substr($bulanDipilih, 0, 4);
$bulan = (int)substr($bulanDipilih, 5, 2);

$awalBulan = mktime(0, 0, 0, $bulan, 1, $tahun);
$hariPertama = (int)date("w", $awalBulan);
$jumlahHari = (int)date("t", $awalBulan);
$hariIni = date("Y-m-d");
$bulanSebelum = date("Y-m", mktime(0, 0, 0, $bulan - 1, 1, $tahun));
$bulanSesudah = date("Y-m", mktime(0, 0, 0, $bulan + 1, 1, $tahun));

$agendaPerTanggal = [];
foreach($agenda as $item){
    $tanggal = date("Y-m-d", strtotime($item["deadline"]));
    $agendaPerTanggal[$tanggal][] = $item;
}
?>
<div class="calendar">

  <!-- Header -->
  <div class="cal-header">
    <div class="cal-month-label">
      <span class="month-title"><?= $namaBulan[$bulan - 1] ?> <?= $tahun ?></span>
      <span class="month-arrow">›</span>
    </div>
    <div class="cal-nav">
      <!-- Ganti bulan: POST ke Action/kalender.php (bulan disimpan di session) -->
      <form action="Action/kalender.php" method="POST">
        <input type="hidden" name="csrf_token" value="<?= $_SESSION["csrf_token"] ?>">
        <input type="hidden" name="bulan" value="<?= $bulanSebelum ?>">
        <button type="submit" aria-label="Bulan sebelumnya">‹</button>
      </form>
      <form action="Action/kalender.php" method="POST">
        <input type="hidden" name="csrf_token" value="<?= $_SESSION["csrf_token"] ?>">
        <input type="hidden" name="bulan" value="<?= $bulanSesudah ?>">
        <button type="submit" aria-label="Bulan berikutnya">›</button>
      </form>
    </div>
  </div>

  <!-- Grid -->
  <div class="cal-grid">
    <?php foreach($namaHari as $h): ?>
      <div class="day-label"><?= $h ?></div>
    <?php endforeach; ?>

    <?php for($i = 0; $i < $hariPertama; $i++): ?>
      <div></div>
    <?php endfor; ?>

    <?php for($d = 1; $d <= $jumlahHari; $d++):
        $tanggal = sprintf("%04d-%02d-%02d", $tahun, $bulan, $d);
        $items = $agendaPerTanggal[$tanggal] ?? [];

        $kelasHari = "day";
        if($tanggal == $hariIni){
            $kelasHari .= " today selected";
        }

        $isGroup = false;
        $judulHari = [];
        if(count($items) > 0){
            $isGroup = $items[0]["tipe"] == "group";
            $kelasHari .= $isGroup ? " task-group" : " task-personal";
            foreach($items as $it){
                $judulHari[] = $it["judul"] . " (" . $it["tipe"] . ")";
            }
        }
    ?>
      <div class="<?= $kelasHari ?>"
           title="<?= htmlspecialchars(implode(", ", $judulHari)) ?>"
           style="cursor: <?= $isGroup ? "pointer" : "default" ?>"
           <?php if($isGroup): ?>data-href="<?= htmlspecialchars($items[0]["link"]) ?>"<?php endif; ?>><?= $d ?></div>
    <?php endfor; ?>
  </div>

  <!-- Time -->
  <div class="cal-time">
    <span class="time-label">Time</span>
    <div class="time-right">
      <span class="time-value"><?= date("g:i") ?></span>
      <div class="ampm-toggle">
        <button type="button" class="<?= date("A") == "AM" ? "active" : "" ?>">AM</button>
        <button type="button" class="<?= date("A") == "PM" ? "active" : "" ?>">PM</button>
      </div>
    </div>
  </div>

  <!-- Legend -->
  <div style="display: flex; gap: 12px; margin-top: 10px; justify-content: center; font-size: 0.7rem;">
    <div style="display: flex; align-items: center; gap: 4px;">
      <span style="width: 10px; height: 10px; border-radius: 50%; background: #22c55e; display: inline-block;"></span>
      <span>Personal</span>
    </div>
    <div style="display: flex; align-items: center; gap: 4px;">
      <span style="width: 10px; height: 10px; border-radius: 50%; background: #a855f7; display: inline-block;"></span>
      <span>Group</span>
    </div>
  </div>

</div>

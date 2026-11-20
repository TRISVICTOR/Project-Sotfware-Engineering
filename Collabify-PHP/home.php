<?php
require __DIR__ . "/config/koneksi.php";
require __DIR__ . "/config/fungsi.php";

if(!isset($_SESSION["id"])){
    header("Location: login.php");
    exit();
}

$agenda = [];
foreach(ambilAgenda($conn, $_SESSION["id"]) as $item){
    if($item["status"] != "done"){
        $agenda[] = $item;
    }
}
$tigaTeratas = array_slice($agenda, 0, 3);

$judulHalaman = "Home";
$halaman = "home";
include __DIR__ . "/layout_dashboard_atas.php";
?>
<h1 class="welcome">Welcome, <?= htmlspecialchars($_SESSION["nama"]) ?>!</h1>

<!-- data-refresh-saat-aktif: halaman dimuat ulang saat tab browser aktif lagi (app.js bagian 9) -->
<div class="dashboard" data-refresh-saat-aktif>

  <!-- TASK CARD -->
  <div class="task-card">
    <h2>Your Task</h2>

    <?php foreach($tigaTeratas as $item): ?>
      <?php $prioritas = prioritas($item["deadline"], $item["status"]); ?>
      <div class="task-item"
           <?php if($item["link"] != ""): ?>data-href="<?= htmlspecialchars($item["link"]) ?>"<?php endif; ?>
           style="cursor: <?= $item["link"] != "" ? "pointer" : "default" ?>;">
        <div class="task-left">
          <h4><?= htmlspecialchars($item["judul"]) ?></h4>
          <?php if($item["tipe"] == "group"): ?>
            <span style="font-size: 0.75rem; color: #6366f1; margin-left: 8px;"><?= htmlspecialchars($item["subjudul"]) ?></span>
          <?php endif; ?>
        </div>
        <div class="task-right">
          <p class="date"><?= formatTanggal($item["deadline"]) ?></p>
          <div class="task-tags">
            <span class="type <?= $item["tipe"] ?>"><?= $item["tipe"] == "group" ? "Group" : "Personal" ?></span>
            <span class="priority <?= $prioritas["class"] ?>"><?= $prioritas["label"] ?></span>
          </div>
        </div>
      </div>
    <?php endforeach; ?>
  </div>

  <!-- CALENDAR -->
  <div class="calendar-box">
    <h2 class="calendar-title">Calendar</h2>
    <?php include __DIR__ . "/komponen_kalender.php"; ?>
  </div>

</div>
<?php include __DIR__ . "/layout_dashboard_bawah.php"; ?>

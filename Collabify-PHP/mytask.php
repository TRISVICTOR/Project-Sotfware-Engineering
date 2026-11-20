<?php
require __DIR__ . "/config/koneksi.php";
require __DIR__ . "/config/fungsi.php";

if(!isset($_SESSION["id"])){
    header("Location: login.php");
    exit();
}

$agenda = ambilAgenda($conn, $_SESSION["id"]);

$judulHalaman = "My Task";
$halaman = "mytask";
include __DIR__ . "/layout_dashboard_atas.php";
?>
<h1 class="welcome">Welcome, <?= htmlspecialchars($_SESSION["nama"]) ?>!</h1>

<!-- data-refresh-saat-aktif: halaman dimuat ulang saat tab browser aktif lagi (app.js bagian 9) -->
<div class="task-cardMyTask" data-refresh-saat-aktif>

  <div class="task-headerMyTask">
    <h2>Your Task</h2>
    <button type="button" class="new-task-btn" data-href="addtask.php">+ New Task</button>
  </div>

  <?php foreach($agenda as $item): ?>
    <?php
    $prioritas = prioritas($item["deadline"], $item["status"], "MyTask");
    $isGroup = $item["tipe"] == "group";
    $selesai = $item["status"] == "done";
    $milikSaya = $item["created_by"] == $_SESSION["id"];
    ?>
    <div class="task-itemMyTask"
         <?php if($isGroup): ?>data-href="<?= htmlspecialchars($item["link"]) ?>"<?php endif; ?>
         style="cursor: <?= $isGroup ? "pointer" : "default" ?>; opacity: <?= $selesai ? "0.6" : "1" ?>;">

      <div class="task-leftMyTask">
        <h4 style="text-decoration: <?= $selesai ? "line-through" : "none" ?>;"><?= htmlspecialchars($item["judul"]) ?></h4>
        <?php if($isGroup): ?>
          <span style="font-size: 0.75rem; color: #6366f1; margin-left: 8px;"><?= htmlspecialchars($item["subjudul"]) ?></span>
        <?php endif; ?>
      </div>

      <div class="task-rightMyTask">
        <p class="dateMyTask"><?= formatTanggal($item["deadline"]) ?></p>
        <div class="task-tagsMyTask">
          <span class="type <?= $isGroup ? "groupMyTask" : "personalMyTask" ?>"><?= $isGroup ? "Group" : "Personal" ?></span>
          <span class="priority <?= $prioritas["class"] ?>"><?= $prioritas["label"] ?></span>
        </div>

        <div class="aksi-task">
          <?php if($item["jenis"] == "task"): ?>
            <!-- Task yang ditugaskan ke saya: boleh tandai selesai / batal -->
            <form action="Action/task_status.php" method="POST">
              <input type="hidden" name="csrf_token" value="<?= $_SESSION["csrf_token"] ?>">
              <input type="hidden" name="id" value="<?= $item["id"] ?>">
              <input type="hidden" name="status" value="<?= $selesai ? "todo" : "done" ?>">
              <input type="hidden" name="kembali" value="mytask.php">
              <?php if($selesai): ?>
                <button type="submit" class="btn-aksi btn-abu">↺ Batal Selesai</button>
              <?php else: ?>
                <button type="submit" class="btn-aksi btn-hijau">✓ Selesai</button>
              <?php endif; ?>
            </form>

            <?php if(!$isGroup && $milikSaya): ?>
              <!-- Tugas individu: edit & hapus (assignment group dikelola ketua di halaman project) -->
              <button type="button" class="btn-aksi btn-ungu" data-href="edittask.php?id=<?= $item["id"] ?>">Edit</button>
              <form action="Action/task_hapus.php" method="POST" data-konfirmasi="Hapus task &quot;<?= htmlspecialchars($item["judul"]) ?>&quot;?">
                <input type="hidden" name="csrf_token" value="<?= $_SESSION["csrf_token"] ?>">
                <input type="hidden" name="id" value="<?= $item["id"] ?>">
                <input type="hidden" name="kembali" value="mytask.php">
                <button type="submit" class="btn-aksi btn-merah">Hapus</button>
              </form>
            <?php endif; ?>

          <?php elseif($milikSaya): ?>
            <!-- Project milik saya (ketua): tandai project selesai / aktif lagi -->
            <form action="Action/project_status.php" method="POST">
              <input type="hidden" name="csrf_token" value="<?= $_SESSION["csrf_token"] ?>">
              <input type="hidden" name="id" value="<?= $item["id"] ?>">
              <input type="hidden" name="status" value="<?= $selesai ? "active" : "done" ?>">
              <?php if($selesai): ?>
                <button type="submit" class="btn-aksi btn-abu">↺ Aktifkan Lagi</button>
              <?php else: ?>
                <button type="submit" class="btn-aksi btn-hijau">✓ Selesai</button>
              <?php endif; ?>
            </form>
          <?php endif; ?>
        </div>
      </div>
    </div>
  <?php endforeach; ?>

</div>
<?php include __DIR__ . "/layout_dashboard_bawah.php"; ?>

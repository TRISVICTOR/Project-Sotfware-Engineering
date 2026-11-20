<?php
require __DIR__ . "/config/koneksi.php";
require __DIR__ . "/config/fungsi.php";

if(!isset($_SESSION["id"])){
    header("Location: login.php");
    exit();
}

$task = ambilTask($conn, (int)($_GET["id"] ?? 0));

if(!$task || !bolehKelolaTask($task, $_SESSION["id"])){
    $_SESSION["trouble"] = "Task tidak ditemukan atau kamu tidak berhak mengubahnya.";
    header("Location: mytask.php");
    exit();
}

$isGroup = $task["project_id"] != null;
if($isGroup){
    $kembali = "project.php?id=" . $task["project_id"];

    $select = $conn->prepare("SELECT u.id, u.nama FROM project_members pm JOIN users u ON u.id = pm.user_id
                              WHERE pm.project_id = ? ORDER BY u.nama");
    $select->execute([$task["project_id"]]);
    $anggota = $select->fetchAll(PDO::FETCH_ASSOC);
} else {
    $kembali = "mytask.php";
    $anggota = [];
}

$judulHalaman = "Edit Task";
include __DIR__ . "/layout_atas.php";
?>
<div class="addTaskPage">

  <img src="assets/img/AddtaskBG.png" alt="bg" class="BackGround-logo">

  <form class="addTaskWrapper wrapper-tinggi" action="Action/task_edit.php" method="POST" enctype="multipart/form-data">
    <input type="hidden" name="csrf_token" value="<?= $_SESSION["csrf_token"] ?>">
    <input type="hidden" name="id" value="<?= $task["id"] ?>">

    <img src="assets/img/Arrow.png" alt="back" class="arrow-back" data-href="<?= $kembali ?>">

    <img src="assets/img/LOGOWB.png" alt="logo" class="addtask-logo">

    <h2 class="titleAddTask" style="width: auto;">Edit <?= $isGroup ? "Assignment" : "Task" ?></h2>

    <div style="min-height: 24px; margin-bottom: 4px; width: 100%;">
      <?php
      if(isset($_SESSION["trouble"])){
          echo '<p style="color: red; font-size: 0.85rem; margin: 0 0 0 50px;">' . htmlspecialchars($_SESSION["trouble"]) . '</p>';
          unset($_SESSION["trouble"]);
      }
      ?>
    </div>

    <label class="label-form" for="judul">Nama task</label>
    <input type="text" id="judul" name="judul" class="input-fieldAddTask" maxlength="150" value="<?= htmlspecialchars($task["judul"]) ?>">

    <?php if($isGroup): ?>
      <label class="label-form" for="assigned_to">Ditugaskan ke</label>
      <select id="assigned_to" name="assigned_to" class="input-fieldAddTask">
        <?php foreach($anggota as $a): ?>
          <option value="<?= $a["id"] ?>" <?= $a["id"] == $task["assigned_to"] ? "selected" : "" ?>><?= htmlspecialchars($a["nama"]) ?></option>
        <?php endforeach; ?>
      </select>
    <?php endif; ?>

    <label class="label-form" for="deadline">Deadline</label>
    <input type="datetime-local" id="deadline" name="deadline" class="input-fieldAddTask" value="<?= date("Y-m-d\TH:i", strtotime($task["deadline"])) ?>">


    <?php if($isGroup): ?>
      <label class="label-form" for="lampiran">File referensi (opsional, maks 10 MB)</label>
      <?php if($task["lampiran_file"] != null): ?>
        <p class="info-lampiran">
          Saat ini: <a href="Action/download.php?jenis=lampiran&amp;id=<?= $task["id"] ?>"><?= htmlspecialchars($task["lampiran_nama"]) ?></a>
          <label><input type="checkbox" name="hapus_lampiran" value="1"> hapus file</label>
        </p>
      <?php endif; ?>
      <input type="file" id="lampiran" name="lampiran" class="input-fieldAddTask" style="font-size: 0.9rem;"
             accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx">
    <?php endif; ?>

    <button type="submit" class="create-btn">Save Task</button>
  </form>

</div>
<?php include __DIR__ . "/layout_bawah.php"; ?>

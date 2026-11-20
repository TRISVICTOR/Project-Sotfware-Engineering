<?php
require __DIR__ . "/config/koneksi.php";
require __DIR__ . "/config/fungsi.php";

if(!isset($_SESSION["id"])){
    header("Location: login.php");
    exit();
}

$project = ambilProject($conn, (int)($_GET["id"] ?? 0), $_SESSION["id"]);

if(!$project || $project["owner_id"] != $_SESSION["id"]){
    $_SESSION["trouble"] = "Hanya ketua project yang bisa mengubah project.";
    header("Location: mytask.php");
    exit();
}

$judulHalaman = "Edit Project";
include __DIR__ . "/layout_atas.php";
?>
<div class="addTaskPage">

  <img src="assets/img/AddtaskBG.png" alt="bg" class="BackGround-logo">

  <form class="addTaskWrapper wrapper-tinggi" action="Action/project_edit.php" method="POST">
    <input type="hidden" name="csrf_token" value="<?= $_SESSION["csrf_token"] ?>">
    <input type="hidden" name="id" value="<?= $project["id"] ?>">

    <img src="assets/img/Arrow.png" alt="back" class="arrow-back" data-href="project.php?id=<?= $project["id"] ?>">

    <img src="assets/img/LOGOWB.png" alt="logo" class="addtask-logo">

    <h2 class="titleAddTask" style="width: auto;">Edit Project</h2>

    <div style="min-height: 24px; margin-bottom: 4px; width: 100%;">
      <?php
      if(isset($_SESSION["trouble"])){
          echo '<p style="color: red; font-size: 0.85rem; margin: 0 0 0 50px;">' . htmlspecialchars($_SESSION["trouble"]) . '</p>';
          unset($_SESSION["trouble"]);
      }
      ?>
    </div>

    <label class="label-form" for="nama">Nama project</label>
    <input type="text" id="nama" name="nama" class="input-fieldAddTask" maxlength="150" value="<?= htmlspecialchars($project["nama"]) ?>">

    <label class="label-form" for="deadline">Deadline keseluruhan</label>
    <input type="datetime-local" id="deadline" name="deadline" class="input-fieldAddTask" value="<?= date("Y-m-d\TH:i", strtotime($project["deadline"])) ?>">

    <button type="submit" class="create-btn">Save Project</button>
  </form>

</div>
<?php include __DIR__ . "/layout_bawah.php"; ?>

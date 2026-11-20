<?php
require __DIR__ . "/config/koneksi.php";

if(!isset($_SESSION["id"])){
    header("Location: login.php");
    exit();
}

$judulHalaman = "Add Task";
include __DIR__ . "/layout_atas.php";
?>
<div class="addTaskPage">

  <img src="assets/img/AddtaskBG.png" alt="logo" class="BackGround-logo">

  <form class="addTaskWrapper" action="Action/task_tambah.php" method="POST">
    <input type="hidden" name="csrf_token" value="<?= $_SESSION["csrf_token"] ?>">

    <img src="assets/img/Arrow.png" alt="back" class="arrow-back" data-href="home.php">

    <img src="assets/img/LOGOWB.png" alt="logo" class="addtask-logo">

    <h2 class="titleAddTask">Add Task</h2>

    <!-- Pesan error -->
    <div style="min-height: 24px; margin-bottom: 4px; width: 100%;">
      <?php
      if(isset($_SESSION["trouble"])){
          echo '<p style="color: red; font-size: 0.85rem; margin: 0 0 0 50px;">' . htmlspecialchars($_SESSION["trouble"]) . '</p>';
          unset($_SESSION["trouble"]);
      }
      ?>
    </div>

    <!-- Nama Task -->
    <input type="text" name="judul" placeholder="Task Name" class="input-fieldAddTask" maxlength="150">

    <!-- Tipe Task: Group = membuat project tim, kamu jadi ketuanya -->
    <select name="tipe" class="input-fieldAddTask">
      <option value="personal">Personal</option>
      <option value="group">Group</option>
    </select>

    <!-- Deadline -->
    <input type="datetime-local" name="deadline" class="input-fieldAddTask">

    <button type="submit" class="create-btn">Create Task</button>
  </form>

</div>
<?php include __DIR__ . "/layout_bawah.php"; ?>

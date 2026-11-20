<?php
require __DIR__ . "/config/koneksi.php";

if(!isset($_SESSION["id"])){
    header("Location: login.php");
    exit();
}

$judulHalaman = "Change Username & Email";
include __DIR__ . "/layout_atas.php";
?>
<div class="ChangeUsernameEmailPage">

  <img src="assets/img/AddtaskBG.png" alt="bg" class="BackGround-logo">

  <form class="ChangeUsernameEmail-wrapper wrapper-tinggi" action="Action/akun_profil.php" method="POST">
    <input type="hidden" name="csrf_token" value="<?= $_SESSION["csrf_token"] ?>">

    <img src="assets/img/Arrow.png" alt="back" class="arrow-back" data-href="profile.php">

    <img src="assets/img/LOGOWB.png" alt="logo" class="ChangeUsernameEmail-logo">

    <h2 class="titleChangeUsernameEmail">Change Username &amp; Email</h2>

    <!-- Pesan error -->
    <div style="min-height: 24px; margin-bottom: 8px; width: 100%;">
      <?php
      if(isset($_SESSION["trouble"])){
          echo '<p style="color: red; font-size: 0.85rem; margin: 0 0 0 50px;">' . htmlspecialchars($_SESSION["trouble"]) . '</p>';
          unset($_SESSION["trouble"]);
      }
      ?>
    </div>

    <input type="text" name="nama_baru" placeholder="Username Baru"
           class="input-fieldChangeUsernameEmail" maxlength="100">

    <input type="email" name="email_baru" placeholder="Email Baru"
           class="input-fieldChangeUsernameEmail">

    <input type="password" name="password" placeholder="Password Saat Ini"
           class="input-fieldChangeUsernameEmail" autocomplete="current-password" data-lihat-password>

    <button type="submit" class="create-btn">Save Changes</button>
  </form>
</div>
<?php include __DIR__ . "/layout_bawah.php"; ?>

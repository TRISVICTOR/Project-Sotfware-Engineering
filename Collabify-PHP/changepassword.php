<?php
require __DIR__ . "/config/koneksi.php";

if(!isset($_SESSION["id"])){
    header("Location: login.php");
    exit();
}

$judulHalaman = "Change Password";
include __DIR__ . "/layout_atas.php";
?>
<div class="ChangePasswordPage">

  <img src="assets/img/AddtaskBG.png" alt="bg" class="BackGround-logo">

  <form class="ChangePassword-wrapper" action="Action/akun_password.php" method="POST">
    <input type="hidden" name="csrf_token" value="<?= $_SESSION["csrf_token"] ?>">

    <img src="assets/img/Arrow.png" alt="back" class="arrow-back" data-href="profile.php">

    <img src="assets/img/LOGOWB.png" alt="logo" class="ChangePassword-logo">

    <h2 class="titleChangePassword">Change Password</h2>

    <!-- Pesan error -->
    <div style="min-height: 24px; margin-bottom: 8px; width: 100%;">
      <?php
      if(isset($_SESSION["trouble"])){
          echo '<p style="color: red; font-size: 0.85rem; margin: 0 0 0 50px;">' . htmlspecialchars($_SESSION["trouble"]) . '</p>';
          unset($_SESSION["trouble"]);
      }
      ?>
    </div>

    <input type="password" name="password_lama" placeholder="Old Password"
           class="input-fieldChangePassword" autocomplete="current-password" data-lihat-password>

    <input type="password" name="password_baru" id="password_baru" placeholder="New Password (min. 6 karakter)"
           class="input-fieldChangePassword" autocomplete="new-password" data-lihat-password>

    <input type="password" name="konfirmasi_password" placeholder="Confirm New Password"
           class="input-fieldChangePassword" autocomplete="new-password"
           data-cocokkan="#password_baru" data-pesan="#konfirmasi-error" data-lihat-password>

    <!-- Error konfirmasi real-time (app.js) -->
    <div style="min-height: 20px; margin-top: -8px; margin-bottom: 8px; width: 100%;">
      <p id="konfirmasi-error" style="color: red; font-size: 0.8rem; margin: 0 0 0 50px;" hidden>⚠️ Password tidak sama!</p>
    </div>

    <button type="submit" class="create-btn">Save Password</button>
  </form>

</div>
<?php include __DIR__ . "/layout_bawah.php"; ?>

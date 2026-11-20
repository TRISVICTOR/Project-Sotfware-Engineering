<?php
require __DIR__ . "/config/koneksi.php";

if(isset($_SESSION["id"])){
    header("Location: home.php");
    exit();
}

$judulHalaman = "Sign Up";
include __DIR__ . "/layout_atas.php";
?>
<div class="Signup-container">

  <img src="assets/img/TanamanLogin.png" class="Signup-plant" alt="decor">

  <div class="Signup-card">

    <img src="assets/img/LOGOWB.png" class="Signup-logo" alt="collabify">

    <h2>Sign Up</h2>

    <!-- Error utama — minHeight agar form tidak geser -->
    <div style="min-height: 24px; margin-bottom: 4px;">
      <?php
      if(isset($_SESSION["trouble"])){
          echo '<p style="color: red; font-size: 0.85rem; margin: 0; text-align: center;">' . htmlspecialchars($_SESSION["trouble"]) . '</p>';
          unset($_SESSION["trouble"]);
      }
      ?>
    </div>

    <form class="Signup-form" action="Action/register.php" method="POST">
      <input type="hidden" name="csrf_token" value="<?= $_SESSION["csrf_token"] ?>">

      <div class="input-group">
        <img src="assets/img/logoOrang.png" alt="nama icon" class="email-icon">
        <input type="text" name="nama" placeholder="Name" class="Signup-input" maxlength="100" autocomplete="name">
      </div>

      <div class="input-group">
        <img src="assets/img/EmailIcon.png" alt="email icon" class="PutEmail-icon">
        <input type="email" name="email" placeholder="Email" class="Signup-input" autocomplete="email">
      </div>

      <div class="input-group">
        <img src="assets/img/Gembok.png" alt="password icon" class="password-icon">
        <input type="password" name="password" id="password" placeholder="Password" class="Signup-input" autocomplete="new-password" data-lihat-password>
      </div>

      <div class="input-group">
        <img src="assets/img/Gembok.png" alt="password icon" class="password-icon">
        <input type="password" name="konfirmasi_password" placeholder="Confirm Password" class="Signup-input"
               autocomplete="new-password" data-cocokkan="#password" data-pesan="#konfirmasi-error" data-lihat-password>
      </div>

      <!-- Error confirm password (dicek app.js saat mengetik) -->
      <div style="min-height: 20px; margin-top: -8px; margin-bottom: 4px;">
        <p id="konfirmasi-error" style="color: red; font-size: 0.8rem; margin: 0;" hidden>⚠️ Password tidak sama!</p>
      </div>

      <button type="submit" class="Signup-button">Sign Up</button>
    </form>

    <p class="login-text">
      Already have an account?
      <span class="signup-link" data-href="login.php">Login</span>
    </p>

  </div>

</div>
<?php include __DIR__ . "/layout_bawah.php"; ?>

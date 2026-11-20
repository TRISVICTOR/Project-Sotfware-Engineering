<?php
require __DIR__ . "/config/koneksi.php";

if(isset($_SESSION["id"])){
    header("Location: home.php");
    exit();
}

$judulHalaman = "Log In";
include __DIR__ . "/layout_atas.php";
?>
<div class="login-container">

  <img src="assets/img/TanamanLogin.png" class="login-plant" alt="decor">

  <div class="login-card">

    <img src="assets/img/LOGOWB.png" class="login-logo" alt="collabify">

    <h2>Log In</h2>

    <?php
    if(isset($_SESSION["trouble"])){
        echo '<p style="color: red; font-size: 0.85rem; margin-bottom: 8px;">' . htmlspecialchars($_SESSION["trouble"]) . '</p>';
        unset($_SESSION["trouble"]);
    }
    if(isset($_SESSION["success"])){
        echo '<p style="color: #22c55e; font-size: 0.85rem; margin-bottom: 8px;">' . htmlspecialchars($_SESSION["success"]) . '</p>';
        unset($_SESSION["success"]);
    }
    ?>

    <form class="login-form" action="Action/login.php" method="POST">
      <input type="hidden" name="csrf_token" value="<?= $_SESSION["csrf_token"] ?>">

      <div class="input-group">
        <img src="assets/img/logoOrang.png" alt="email icon" class="email-icon">
        <input type="email" name="email" placeholder="Email" class="login-input" autocomplete="email">
      </div>

      <div class="input-group">
        <img src="assets/img/Gembok.png" alt="password icon" class="password-icon">
        <input type="password" name="password" placeholder="Password" class="login-input" autocomplete="current-password" data-lihat-password>
      </div>

      <button type="submit" class="login-button">Log In</button>
    </form>

    <p class="signup-text">
      Don't have an account?
      <span class="signup-link" data-href="signup.php">Sign Up</span>
    </p>

  </div>

</div>
<?php include __DIR__ . "/layout_bawah.php"; ?>

<?php
require __DIR__ . "/config/koneksi.php";
require __DIR__ . "/config/fungsi.php";

if(!isset($_SESSION["id"])){
    header("Location: login.php");
    exit();
}

$judulHalaman = "Profile";
$halaman = "profile";
include __DIR__ . "/layout_dashboard_atas.php";
?>
<h1 class="welcomeProfile"><?= htmlspecialchars($_SESSION["nama"]) ?>'s Profile</h1>

<div class="profile-card">

  <!-- Foto & Nama -->
  <div class="profile-avatar-section">
    <div class="profile-avatar">
      <img src="assets/img/ProfilePicture.png" alt="profile status" class="profile-status">
    </div>
    <h2><?= htmlspecialchars($_SESSION["nama"]) ?></h2>
  </div>

  <div class="profile-card-header">
    <button type="button" class="change-password-btn" data-href="changepassword.php">🔒 Change Password</button>
  </div>

  <!-- Ruang pesan (pesan ditampilkan sebagai toast) -->
  <div style="min-height: 24px; margin-bottom: 8px; text-align: center;"></div>

  <div class="profile-info">

    <div class="profile-info-row">
      <span class="profile-label">Username</span>
      <div class="profile-value-row">
        <span class="profile-value"><?= htmlspecialchars($_SESSION["nama"]) ?></span>
        <button type="button" class="change-btn" data-href="changeusernameemail.php">Change</button>
      </div>
    </div>

    <div class="profile-info-row">
      <span class="profile-label">Email</span>
      <div class="profile-value-row">
        <span class="profile-value"><?= htmlspecialchars($_SESSION["email"]) ?></span>
        <button type="button" class="change-btn" data-href="changeusernameemail.php">Change</button>
      </div>
    </div>

  </div>

  <!-- Tombol Logout (POST + token, supaya tidak bisa dipicu lewat link dari situs lain) -->
  <form action="Action/logout.php" method="POST">
    <input type="hidden" name="csrf_token" value="<?= $_SESSION["csrf_token"] ?>">
    <button type="submit" class="logout-btn">🚪 Logout</button>
  </form>
</div>
<?php include __DIR__ . "/layout_dashboard_bawah.php"; ?>

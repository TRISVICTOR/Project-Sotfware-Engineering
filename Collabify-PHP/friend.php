<?php
require __DIR__ . "/config/koneksi.php";
require __DIR__ . "/config/fungsi.php";

if(!isset($_SESSION["id"])){
    header("Location: login.php");
    exit();
}

$cari = trim($_GET["q"] ?? "");
$semuaTeman = ambilTeman($conn, $_SESSION["id"]);

$teman = [];
foreach($semuaTeman as $t){
    if($cari == "" || stripos($t["nama"], $cari) !== false){
        $teman[] = $t;
    }
}
$kelasKartu = ["FriendLeft", "FriendMiddle", "FriendRight"];

$judulHalaman = "Friend";
$halaman = "friend";
include __DIR__ . "/layout_dashboard_atas.php";
?>
<h1 class="welcome">Welcome, <?= htmlspecialchars($_SESSION["nama"]) ?>!</h1>

<!-- data-refresh-saat-aktif: halaman dimuat ulang saat tab browser aktif lagi (app.js bagian 9) -->
<div class="task-cardFriend" data-refresh-saat-aktif>

  <div class="task-headerFriend">
    <h2>Your Friend</h2>
    <!-- Cari: ketik nama lalu tekan Enter -->
    <form class="searchFriend-wrapper" action="friend.php" method="GET">
      <img src="assets/img/KacaPembesar.png" alt="search" class="search-iconFriend">
      <input type="text" name="q" placeholder="Search Friend" class="search-inputFriend" value="<?= htmlspecialchars($cari) ?>">
    </form>
  </div>

  <?php if($cari != "" && count($teman) == 0): ?>
    <p style="color: #888; font-size: 0.9rem; padding: 12px;">Tidak ada teman dengan nama "<?= htmlspecialchars($cari) ?>".</p>
  <?php endif; ?>

  <div class="FriendList">
    <?php foreach($teman as $i => $t): ?>
      <div class="<?= $kelasKartu[$i % 3] ?>">
        <img src="assets/img/Cowo.png" alt="friend" class="BoyGirl-Icon">
        <div class="friend-info">
          <h4><?= htmlspecialchars($t["nama"]) ?></h4>
          <p style="font-size: 0.75rem; color: #aaa; margin-left: 10px;"><?= htmlspecialchars($t["email"]) ?></p>
        </div>
        <form class="form-hapus-teman" action="Action/friend_hapus.php" method="POST"
              data-konfirmasi="Hapus <?= htmlspecialchars($t["nama"]) ?> dari daftar teman?">
          <input type="hidden" name="csrf_token" value="<?= $_SESSION["csrf_token"] ?>">
          <input type="hidden" name="friend_id" value="<?= $t["id"] ?>">
          <button type="submit" class="btn-hapus-teman" title="Hapus teman">✕</button>
        </form>
      </div>
    <?php endforeach; ?>
  </div>

</div>
<?php include __DIR__ . "/layout_dashboard_bawah.php"; ?>

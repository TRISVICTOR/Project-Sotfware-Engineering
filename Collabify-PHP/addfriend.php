<?php
require __DIR__ . "/config/koneksi.php";

if(!isset($_SESSION["id"])){
    header("Location: login.php");
    exit();
}

$cari = trim($_GET["q"] ?? "");
$id = $_SESSION["id"];

$sql = "SELECT u.id, u.nama,
               EXISTS(SELECT 1 FROM friends f
                      WHERE f.user1_id = LEAST(u.id, ?) AND f.user2_id = GREATEST(u.id, ?)) AS is_teman
        FROM users u
        WHERE u.id <> ?";
$params = [$id, $id, $id];

if($cari != ""){
    $pola = "%" . addcslashes($cari, "%_\\") . "%";
    $sql .= " AND (u.email = ? OR u.nama LIKE ?)";
    $params[] = $cari;
    $params[] = $pola;
}

$select = $conn->prepare($sql . " ORDER BY u.created_at DESC LIMIT 100");
$select->execute($params);
$daftarUser = $select->fetchAll(PDO::FETCH_ASSOC);

$judulHalaman = "Add Friend";
$halaman = "addfriend";
include __DIR__ . "/layout_dashboard_atas.php";
?>
<h1 class="AddFriend">Add Friend</h1>

<div class="task-cardAddFriend">

  <!-- SEARCH -->
  <div class="task-headerAddFriend">
    <form class="searchAddFriend-wrapper" action="addfriend.php" method="GET">
      <img src="assets/img/KacaPembesar.png" alt="search" class="search-iconAddFriend">
      <input type="text" name="q" placeholder="Cari nama / email lengkap..." class="search-inputAddFriend" value="<?= htmlspecialchars($cari) ?>">
      <button type="submit"
              style="padding: 6px 14px; border-radius: 12px; border: none; background: #6366f1; color: white; cursor: pointer; margin-left: -63px; font-size: 0.65rem; white-space: nowrap; flex-shrink: 0;">
        Cari
      </button>
    </form>
  </div>

  <!-- LIST USER -->
  <div class="AddFriendList" style="flex-wrap: wrap; padding: 10px;">
    <?php foreach($daftarUser as $u): ?>
      <div class="AddFriendLeft" style="justify-content: space-between; padding-right: 10px;">

        <!-- Avatar + Nama -->
        <div style="display: flex; align-items: center;">
          <img src="assets/img/Cowo.png" alt="avatar" class="BoyGirl-Icon">
          <div class="Addfriend-info">
            <h4><?= htmlspecialchars($u["nama"]) ?></h4>
          </div>
        </div>

        <!-- Tombol tambah / sudah teman -->
        <?php if($u["is_teman"] == 1): ?>
          <span style="font-size: 0.75rem; color: #22c55e; font-weight: 600;">✓ Teman</span>
        <?php else: ?>
          <form action="Action/friend_tambah.php" method="POST">
            <input type="hidden" name="csrf_token" value="<?= $_SESSION["csrf_token"] ?>">
            <input type="hidden" name="friend_id" value="<?= $u["id"] ?>">
            <button type="submit"
                    style="padding: 4px 12px; border-radius: 10px; border: none; background: #6366f1; color: white; cursor: pointer; font-size: 0.8rem;">
              + Add
            </button>
          </form>
        <?php endif; ?>
      </div>
    <?php endforeach; ?>

    <?php if($cari != "" && count($daftarUser) == 0): ?>
      <p style="color: #aaa; font-size: 0.85rem; padding: 8px;">User tidak ditemukan.</p>
    <?php endif; ?>
  </div>

</div>
<?php include __DIR__ . "/layout_dashboard_bawah.php"; ?>

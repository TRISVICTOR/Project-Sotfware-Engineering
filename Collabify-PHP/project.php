<?php
require __DIR__ . "/config/koneksi.php";
require __DIR__ . "/config/fungsi.php";

if(!isset($_SESSION["id"])){
    header("Location: login.php");
    exit();
}

$projectId = (int)($_GET["id"] ?? 0);
$project = ambilProject($conn, $projectId, $_SESSION["id"]);

if(!$project){
    $_SESSION["trouble"] = "Project tidak ditemukan atau kamu bukan anggotanya.";
    header("Location: mytask.php");
    exit();
}

$isKetua = $project["owner_id"] == $_SESSION["id"];
$halamanIni = "project.php?id=" . $projectId;

$select = $conn->prepare("SELECT u.id, u.nama, u.email
                          FROM project_members pm JOIN users u ON u.id = pm.user_id
                          WHERE pm.project_id = ?
                          ORDER BY u.id = ? DESC, u.nama");
$select->execute([$projectId, $project["owner_id"]]);
$anggota = $select->fetchAll(PDO::FETCH_ASSOC);

$select = $conn->prepare("SELECT t.*, u.nama AS nama_assignee
                          FROM tasks t JOIN users u ON u.id = t.assigned_to
                          WHERE t.project_id = ?
                          ORDER BY t.assigned_to = ? DESC, t.deadline");
$select->execute([$projectId, $_SESSION["id"]]);
$assignment = $select->fetchAll(PDO::FETCH_ASSOC);

$assignmentSaya = [];
foreach($assignment as $t){
    if($t["assigned_to"] == $_SESSION["id"]){
        $assignmentSaya[] = $t;
    }
}

$select = $conn->prepare("SELECT s.*, u.nama AS nama_user, t.judul AS judul_task
                          FROM submissions s
                          JOIN tasks t ON t.id = s.task_id
                          JOIN users u ON u.id = s.user_id
                          WHERE t.project_id = ?
                          ORDER BY s.created_at DESC, s.id DESC");
$select->execute([$projectId]);
$submission = $select->fetchAll(PDO::FETCH_ASSOC);

$saranTeman = [];
if($isKetua){
    $idAnggota = array_column($anggota, "id");
    foreach(ambilTeman($conn, $_SESSION["id"]) as $t){
        if(!in_array($t["id"], $idAnggota)){
            $saranTeman[] = $t;
        }
    }
}

$statusProject = prioritas($project["deadline"], $project["status"] == "done" ? "done" : "todo");

$judulHalaman = "Group Project";
$halaman = "project";
include __DIR__ . "/layout_dashboard_atas.php";
?>

<!-- Judul Group + Deadline keseluruhan.
     data-refresh-saat-aktif: halaman dimuat ulang saat tab browser aktif lagi (app.js bagian 9) -->
<div class="group-header" data-refresh-saat-aktif>
  <h2 class="group-title"><?= htmlspecialchars($project["nama"]) ?></h2>
  <!-- div, bukan <p>: <form> di dalam <p> membuat browser menutup <p> lebih awal -->
  <div class="group-overall-deadline">
    📅 Deadline keseluruhan: <strong><?= formatTanggal($project["deadline"]) ?></strong>
    <span class="priority <?= $statusProject["class"] ?>"><?= $statusProject["label"] ?></span>
    · Ketua: <strong><?= htmlspecialchars($project["nama_ketua"]) ?></strong>
    <?php if($isKetua): ?>
      <span class="aksi-ketua">
        <button type="button" class="btn-aksi kecil btn-ungu" data-href="editproject.php?id=<?= $projectId ?>">Edit Project</button>
        <form action="Action/project_hapus.php" method="POST"
              data-konfirmasi="Hapus project ini beserta semua assignment dan file submission-nya?">
          <input type="hidden" name="csrf_token" value="<?= $_SESSION["csrf_token"] ?>">
          <input type="hidden" name="id" value="<?= $projectId ?>">
          <button type="submit" class="btn-aksi kecil btn-merah">Hapus Project</button>
        </form>
      </span>
    <?php endif; ?>
  </div>
</div>

<!-- LAYOUT 2 KOLOM -->
<div class="assignment-layout">

  <!-- KIRI — List Assignment -->
  <div class="assignment-list-box">
    <h3 class="box-title">Assignment</h3>

    <?php if(count($assignment) == 0): ?>
      <p style="color: #aaa; font-size: 0.85rem;">Belum ada assignment.</p>
    <?php endif; ?>

    <?php foreach($assignment as $t): ?>
      <?php
      $selesai = $t["status"] == "done";
      $milikSaya = $t["assigned_to"] == $_SESSION["id"];
      $label = prioritas($t["deadline"], $t["status"]);
      ?>
      <div class="assignment-item" style="opacity: <?= $selesai ? "0.6" : "1" ?>;">
        <div class="assignment-item-left">
          <img src="assets/img/Cowo.png" alt="avatar" class="assignment-avatar">
          <span class="assignment-item-name"><?= htmlspecialchars($t["nama_assignee"]) ?><?= $milikSaya ? " (Saya)" : "" ?></span>
        </div>
        <div class="assignment-item-right">
          <p class="assignment-item-title" style="text-decoration: <?= $selesai ? "line-through" : "none" ?>;"><?= htmlspecialchars($t["judul"]) ?></p>
          <p class="assignment-item-date">
            <?= formatTanggal($t["deadline"]) ?>
            <?php if($label["class"] == "tag-overdue"): ?>
              <span class="priority tag-overdue">Overdue</span>
            <?php endif; ?>
          </p>
          <div class="aksi-task">
            <?php if($isKetua || $milikSaya): ?>
              <form action="Action/task_status.php" method="POST">
                <input type="hidden" name="csrf_token" value="<?= $_SESSION["csrf_token"] ?>">
                <input type="hidden" name="id" value="<?= $t["id"] ?>">
                <input type="hidden" name="status" value="<?= $selesai ? "todo" : "done" ?>">
                <input type="hidden" name="kembali" value="<?= $halamanIni ?>">
                <button type="submit" class="btn-aksi kecil <?= $selesai ? "btn-abu" : "btn-hijau" ?>"><?= $selesai ? "↺ Batal" : "✓ Selesai" ?></button>
              </form>
            <?php endif; ?>
            <?php if($isKetua): ?>
              <button type="button" class="btn-aksi kecil btn-ungu" data-href="edittask.php?id=<?= $t["id"] ?>">Edit</button>
              <form action="Action/task_hapus.php" method="POST" data-konfirmasi="Hapus assignment &quot;<?= htmlspecialchars($t["judul"]) ?>&quot;?">
                <input type="hidden" name="csrf_token" value="<?= $_SESSION["csrf_token"] ?>">
                <input type="hidden" name="id" value="<?= $t["id"] ?>">
                <input type="hidden" name="kembali" value="<?= $halamanIni ?>">
                <button type="submit" class="btn-aksi kecil btn-merah">Hapus</button>
              </form>
            <?php endif; ?>
          </div>
        </div>
        <?php if($t["lampiran_file"] != null): ?>
          <a href="Action/download.php?jenis=lampiran&amp;id=<?= $t["id"] ?>" title="<?= htmlspecialchars($t["lampiran_nama"]) ?>">
            <img src="assets/img/SendFile.png" alt="file" class="assignment-file-icon" style="cursor: pointer;">
          </a>
        <?php else: ?>
          <img src="assets/img/SendFile.png" alt="file" class="assignment-file-icon" style="opacity: 0.25;">
        <?php endif; ?>
      </div>
    <?php endforeach; ?>
  </div>

  <!-- KANAN — Form Tambah Assignment (ketua) + Anggota -->
  <div class="assignment-form-box">

    <?php if($isKetua): ?>
      <form action="Action/assignment_tambah.php" method="POST" enctype="multipart/form-data">
        <input type="hidden" name="csrf_token" value="<?= $_SESSION["csrf_token"] ?>">
        <input type="hidden" name="project_id" value="<?= $projectId ?>">

        <h3 class="box-title">Add Assignment</h3>

        <div class="form-input-group">
          <img src="assets/img/PlusIcon.png" alt="plus" class="form-icon">
          <input type="text" name="judul" placeholder="Describe detail assignment" class="form-input" maxlength="150">
        </div>

        <h3 class="box-title" style="margin-top: 14px;">Add Person</h3>

        <div class="form-input-group">
          <img src="assets/img/logoOrang.png" alt="person" class="form-icon">
          <select name="assigned_to" class="form-input">
            <option value="">Select a team member</option>
            <?php foreach($anggota as $a): ?>
              <option value="<?= $a["id"] ?>"><?= htmlspecialchars($a["nama"]) ?><?= $a["id"] == $_SESSION["id"] ? " (Saya)" : "" ?></option>
            <?php endforeach; ?>
          </select>
        </div>

        <h3 class="box-title" style="margin-top: 14px;">Add Deadline</h3>

        <div class="form-input-group">
          <img src="assets/img/Deadline.png" alt="deadline" class="form-icon">
          <input type="datetime-local" name="deadline" class="form-input">
        </div>

        <div class="form-input-group" style="margin-top: 10px;">
          <img src="assets/img/SendFile.png" alt="file" class="form-icon">
          <input type="file" name="lampiran" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                 class="form-input" style="font-size: 0.82rem;">
        </div>

        <button type="submit" class="create-assignment-btn">Create Assignment</button>
      </form>
    <?php endif; ?>

    <h3 class="box-title" style="margin-top: <?= $isKetua ? "18px" : "0" ?>;">Team Members (<?= count($anggota) ?>)</h3>

    <?php if($isKetua): ?>
      <!-- Undang anggota: ketik email, atau pilih dari saran teman -->
      <form class="form-undang" action="Action/anggota_tambah.php" method="POST">
        <input type="hidden" name="csrf_token" value="<?= $_SESSION["csrf_token"] ?>">
        <input type="hidden" name="project_id" value="<?= $projectId ?>">
        <div class="form-input-group">
          <img src="assets/img/logoOrang.png" alt="person" class="form-icon">
          <input type="email" name="email" list="saran-teman" placeholder="Invite member by email" class="form-input" required>
        </div>
        <button type="submit" class="btn-aksi kecil btn-ungu" style="margin-top: 0;">Invite</button>
      </form>
      <datalist id="saran-teman">
        <?php foreach($saranTeman as $t): ?>
          <option value="<?= htmlspecialchars($t["email"]) ?>"><?= htmlspecialchars($t["nama"]) ?></option>
        <?php endforeach; ?>
      </datalist>
    <?php endif; ?>

    <ul class="anggota-list">
      <?php foreach($anggota as $a): ?>
        <li>
          <img src="assets/img/Cowo.png" alt="avatar" class="assignment-avatar" style="width: 24px; height: 24px;">
          <span class="anggota-info">
            <?= htmlspecialchars($a["nama"]) ?>
            <?php if($a["id"] == $project["owner_id"]): ?><span class="badge-ketua">Ketua</span><?php endif; ?>
            <span class="anggota-email"><?= htmlspecialchars($a["email"]) ?></span>
          </span>
          <?php if($isKetua && $a["id"] != $project["owner_id"]): ?>
            <form action="Action/anggota_hapus.php" method="POST"
                  data-konfirmasi="Keluarkan <?= htmlspecialchars($a["nama"]) ?> dari project? Assignment miliknya dialihkan ke ketua.">
              <input type="hidden" name="csrf_token" value="<?= $_SESSION["csrf_token"] ?>">
              <input type="hidden" name="project_id" value="<?= $projectId ?>">
              <input type="hidden" name="user_id" value="<?= $a["id"] ?>">
              <button type="submit" class="btn-aksi kecil btn-merah" style="margin-top: 0;">Keluarkan</button>
            </form>
          <?php endif; ?>
        </li>
      <?php endforeach; ?>
    </ul>
  </div>
</div>

<!-- SUBMISSION -->
<div class="submission-board">
  <h3 class="box-title">Submission</h3>

  <!-- Upload: hanya untuk assignment yang ditugaskan ke saya -->
  <?php if(count($assignmentSaya) > 0): ?>
    <form class="submission-upload" action="Action/submission_upload.php" method="POST" enctype="multipart/form-data">
      <input type="hidden" name="csrf_token" value="<?= $_SESSION["csrf_token"] ?>">
      <select name="task_id" required>
        <?php foreach($assignmentSaya as $t): ?>
          <option value="<?= $t["id"] ?>"><?= htmlspecialchars($t["judul"]) ?></option>
        <?php endforeach; ?>
      </select>
      <input type="file" name="file" required>
      <button type="submit" class="btn-upload">Upload</button>
    </form>
  <?php else: ?>
    <p class="teks-kosong" style="margin-bottom: 10px;">Kamu belum punya assignment di project ini, jadi belum bisa upload file.</p>
  <?php endif; ?>

  <!-- List file -->
  <?php if(count($submission) == 0): ?>
    <p class="teks-kosong">Belum ada file yang diupload.</p>
  <?php endif; ?>

  <?php foreach($submission as $s): ?>
    <div class="submission-item">
      <div>
        <p class="nama-file"><?= htmlspecialchars($s["nama_file"]) ?></p>
        <p class="info-file">
          oleh <?= htmlspecialchars($s["nama_user"]) ?> · untuk "<?= htmlspecialchars($s["judul_task"]) ?>" ·
          <?= date("j/n/Y, H.i.s", strtotime($s["updated_at"])) ?>
        </p>
      </div>
      <div class="submission-aksi">
        <a class="btn-download" href="Action/download.php?jenis=submission&amp;id=<?= $s["id"] ?>">Download</a>
        <?php if($s["user_id"] == $_SESSION["id"]): ?>
          <!-- Ganti file: pilih file baru, form langsung terkirim -->
          <form action="Action/submission_ganti.php" method="POST" enctype="multipart/form-data">
            <input type="hidden" name="csrf_token" value="<?= $_SESSION["csrf_token"] ?>">
            <input type="hidden" name="id" value="<?= $s["id"] ?>">
            <label class="btn-ganti">Ganti<input type="file" name="file" hidden data-autosubmit></label>
          </form>
          <form action="Action/submission_hapus.php" method="POST" data-konfirmasi="Hapus file &quot;<?= htmlspecialchars($s["nama_file"]) ?>&quot;?">
            <input type="hidden" name="csrf_token" value="<?= $_SESSION["csrf_token"] ?>">
            <input type="hidden" name="id" value="<?= $s["id"] ?>">
            <button type="submit" class="btn-hapus-file">Hapus</button>
          </form>
        <?php endif; ?>
      </div>
    </div>
  <?php endforeach; ?>
</div>
<?php include __DIR__ . "/layout_dashboard_bawah.php"; ?>

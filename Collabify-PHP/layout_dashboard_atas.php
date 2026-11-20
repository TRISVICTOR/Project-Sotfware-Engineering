<?php

if(!isset($conn)){
    http_response_code(404);
    exit();
}

$tataLetak = [
    "home"      => ["page" => "homepage",      "wrapper" => "home-wrapper",       "navbar" => "navbarHome",       "logo" => "logoHome",       "plant" => "plant"],
    "mytask"    => ["page" => "mytaskpage",    "wrapper" => "mytask-wrapper",     "navbar" => "navbarMyTask",     "logo" => "logoMyTask",     "plant" => "plantMyTask"],
    "friend"    => ["page" => "Friendpage",    "wrapper" => "friend-wrapper",     "navbar" => "navbarFriend",     "logo" => "logoFriend",     "plant" => "plantMyTask"],
    "addfriend" => ["page" => "AddFriendpage", "wrapper" => "Addfriend-wrapper",  "navbar" => "navbarAddFriend",  "logo" => "logoFriend",     "plant" => "plantMyTask"],
    "project"   => ["page" => "Assignmentpage","wrapper" => "Assignment-wrapper", "navbar" => "navbarAssignment", "logo" => "logoAssignment", "plant" => "plantMyTask"],
    "profile"   => ["page" => "profilepage",   "wrapper" => "profile-wrapper",    "navbar" => "navbarProfile",    "logo" => "logoProfile",    "plant" => "plant"],
];
$kelas = $tataLetak[$halaman];

include __DIR__ . "/layout_atas.php";
?>
<div class="<?= $kelas["page"] ?>">
  <div class="<?= $kelas["wrapper"] ?>">

    <!-- NAVBAR -->
    <div class="<?= $kelas["navbar"] ?>">
      <div class="<?= $kelas["logo"] ?>">
        <img src="assets/img/LOGOWB.png" alt="logo">
      </div>
      <div class="nav-buttons">
        <button type="button" class="add-task" data-href="addtask.php">Add Task</button>
        <button type="button" class="add-friend" data-href="addfriend.php">Add Friend</button>
        <?php include __DIR__ . "/komponen_notifikasi.php"; ?>
      </div>
    </div>

    <!-- HEADER BACKGROUND -->
    <div class="header-background">
      <img src="assets/img/GroupBackground.png" alt="people">
    </div>

    <div class="main-container">

      <!-- SIDEBAR -->
      <div class="sidebar">
        <ul>
          <li data-href="home.php" class="<?= $halaman == "home" ? "active" : "" ?>">
            <img src="assets/img/Home.png" alt="home"> Home
          </li>
          <li data-href="mytask.php" class="<?= $halaman == "mytask" ? "active" : "" ?>">
            <img src="assets/img/MyTask.png" alt="task"> My Task
          </li>
          <li data-href="friend.php" class="<?= $halaman == "friend" ? "active" : "" ?>">
            <img src="assets/img/Friend.png" alt="friend"> Friend
          </li>
          <li data-href="profile.php" class="sidebar-profile <?= $halaman == "profile" ? "active" : "" ?>">
            <img src="assets/img/profile.png" alt="profile"> Profile
          </li>
        </ul>
      </div>

      <!-- CONTENT -->
      <div class="content">

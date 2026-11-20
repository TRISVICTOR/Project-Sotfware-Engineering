<?php
require __DIR__ . "/config/koneksi.php";

$judulHalaman = "Welcome";
include __DIR__ . "/layout_atas.php";
?>
<div class="page-container">

  <!-- Navbar -->
  <nav class="navbar">
    <div class="logo">
      <img src="assets/img/LOGOWB.png" alt="collabify">
    </div>

    <ul class="menu">
      <li data-href="index.php" style="cursor: pointer;">Home</li>
      <li data-href="information.php#about" style="cursor: pointer;">About Us</li>
      <li data-href="information.php#features" style="cursor: pointer;">Features</li>
      <li data-href="information.php#contact" style="cursor: pointer;">Contact</li>
    </ul>

    <div class="auth-buttons">
      <button type="button" class="login" data-href="login.php">Log In</button>
      <button type="button" class="signup" data-href="signup.php">Sign Up</button>
    </div>
  </nav>

  <!-- HERO -->
  <section class="hero">
    <div class="hero-text">
      <h1>Welcome To Collabify</h1>
      <p>Your ultimate collaboration platform.</p>

      <div class="hero-buttons">
        <button type="button" class="start" data-href="signup.php">Get Started</button>
        <button type="button" class="learn" data-href="information.php#about">Learn More</button>
      </div>
    </div>

    <div class="hero-img">
      <img src="assets/img/GambarKerjasama.png" alt="collaboration">
    </div>
  </section>

  <!-- FEATURES -->
  <section class="features">
    <img src="assets/img/TanamanPageawal.png" class="decor-bottom" alt="decor">

    <div class="features-header">
      <h2>All-In-One Collaboration Platform</h2>
      <p>Everything your team needs in one place</p>
    </div>

    <div class="feature-cards">
      <div class="card">
        <div class="card-icon">
          <img src="assets/img/TaskIcon.png" alt="Task Management">
        </div>
        <div class="card-text">
          <h3>Task Management</h3>
          <p>Organize and manage your tasks efficiently.</p>
        </div>
      </div>

      <div class="card">
        <div class="card-icon">
          <img src="assets/img/ProjectTrakingIcon.png" alt="Task Tracking">
        </div>
        <div class="card-text">
          <h3>Task Tracking</h3>
          <p class="task-text">Track progress and deadline effortlessly.</p>
        </div>
      </div>

      <div class="card">
        <div class="card-icon file-icon">
          <img src="assets/img/FileSharing.png" alt="File Sharing">
        </div>
        <div class="card-text">
          <h3>File Sharing</h3>
          <p class="file-text">Easily share and collaborate on task.</p>
        </div>
      </div>
    </div>
  </section>

</div>
<?php include __DIR__ . "/layout_bawah.php"; ?>

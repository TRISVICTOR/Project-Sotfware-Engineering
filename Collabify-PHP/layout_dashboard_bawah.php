<?php
if(!isset($conn)){
    http_response_code(404);
    exit();
}
?>
      </div><!-- /.content -->
    </div><!-- /.main-container -->
  </div><!-- /wrapper -->

  <img src="assets/img/TanamanPageHome.png" alt="plant" class="<?= $kelas["plant"] ?>">
</div>

<?php
if(isset($_SESSION["trouble"])){
    echo '<div class="flash-toast flash-error" role="status">' . htmlspecialchars($_SESSION["trouble"]) . '</div>';
    unset($_SESSION["trouble"]);
}
if(isset($_SESSION["success"])){
    echo '<div class="flash-toast flash-sukses" role="status">' . htmlspecialchars($_SESSION["success"]) . '</div>';
    unset($_SESSION["success"]);
}

include __DIR__ . "/layout_bawah.php";
?>

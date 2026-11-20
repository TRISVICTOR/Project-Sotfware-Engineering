<?php
if(!isset($conn)){
    http_response_code(404);
    exit();
}
?>
</div>
<!-- ?v= waktu terakhir file diubah, supaya browser tidak memakai app.js lama dari cache -->
<script src="assets/js/app.js?v=<?= filemtime(__DIR__ . "/assets/js/app.js") ?>"></script>
</body>
</html>

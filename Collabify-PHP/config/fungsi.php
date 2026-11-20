<?php

function formatTanggal($datetime){
    $namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    $waktu = strtotime($datetime);
    return date("j", $waktu) . " " . $namaBulan[date("n", $waktu) - 1] . " " . date("Y", $waktu) . " pukul " . date("H.i", $waktu);
}

function prioritas($deadline, $status, $akhiran = ""){
    if($status == "done"){
        return ["label" => "Selesai", "class" => "tag-selesai"];
    }

    $sisaJam = (strtotime($deadline) - time()) / 3600;

    if($sisaJam < 0){
        return ["label" => "Overdue", "class" => "tag-overdue"];
    }
    if($sisaJam <= 24){
        return ["label" => "High Priority", "class" => "high" . $akhiran];
    }
    if($sisaJam <= 72){
        return ["label" => "Medium Priority", "class" => "medium" . $akhiran];
    }
    return ["label" => "Low Priority", "class" => "low" . $akhiran];
}

function ambilProject($conn, $projectId, $userId){
    $search = $conn->prepare("SELECT p.*, u.nama AS nama_ketua
                              FROM projects p
                              JOIN project_members pm ON pm.project_id = p.id AND pm.user_id = ?
                              JOIN users u ON u.id = p.owner_id
                              WHERE p.id = ?");
    $search->execute([$userId, $projectId]);
    $data = $search->fetch(PDO::FETCH_ASSOC);

    if(!$data){
        return null;
    }
    return $data;
}

function cekAnggota($conn, $projectId, $userId){
    $search = $conn->prepare("SELECT 1 FROM project_members WHERE project_id = ? AND user_id = ?");
    $search->execute([$projectId, $userId]);

    if($search->fetch()){
        return true;
    }
    return false;
}

function ambilTask($conn, $taskId){
    $search = $conn->prepare("SELECT t.*, p.nama AS nama_project, p.owner_id
                              FROM tasks t
                              LEFT JOIN projects p ON p.id = t.project_id
                              WHERE t.id = ?");
    $search->execute([$taskId]);
    $data = $search->fetch(PDO::FETCH_ASSOC);

    if(!$data){
        return null;
    }
    return $data;
}

function bolehKelolaTask($task, $userId){
    if($task["project_id"] == null){
        return $task["created_by"] == $userId;
    }
    return $task["owner_id"] == $userId;
}

function ambilTeman($conn, $userId){
    $search = $conn->prepare("SELECT u.id, u.nama, u.email
                              FROM friends f
                              JOIN users u ON u.id = IF(f.user1_id = ?, f.user2_id, f.user1_id)
                              WHERE f.user1_id = ? OR f.user2_id = ?
                              ORDER BY u.nama");
    $search->execute([$userId, $userId, $userId]);
    return $search->fetchAll(PDO::FETCH_ASSOC);
}

function ambilAgenda($conn, $userId){
    $search = $conn->prepare("SELECT 'task' AS jenis, t.id, t.judul, t.deadline, t.status,
                                     t.project_id, p.nama AS nama_project, t.created_by
                              FROM tasks t
                              LEFT JOIN projects p ON p.id = t.project_id
                              WHERE t.assigned_to = ?
                                AND (p.id IS NULL OR p.status <> 'done')
                              UNION ALL
                              SELECT 'project', p.id, p.nama, p.deadline, p.status,
                                     p.id, p.nama, p.owner_id
                              FROM projects p
                              JOIN project_members pm ON pm.project_id = p.id
                              WHERE pm.user_id = ?
                                AND (p.owner_id = ?
                                     OR NOT EXISTS (SELECT 1 FROM tasks t2
                                                    WHERE t2.project_id = p.id AND t2.assigned_to = ?))
                              ORDER BY status = 'done', deadline");
    $search->execute([$userId, $userId, $userId, $userId]);

    $agenda = [];
    foreach($search->fetchAll(PDO::FETCH_ASSOC) as $item){
        if($item["project_id"] == null){
            $item["tipe"] = "personal";
            $item["link"] = "";
            $item["subjudul"] = "";
        } else {
            $item["tipe"] = "group";
            $item["link"] = "project.php?id=" . $item["project_id"];
            if($item["jenis"] == "project"){
                $item["subjudul"] = "Group Project";
            } else {
                $item["subjudul"] = "Project: " . $item["nama_project"];
            }
        }
        $agenda[] = $item;
    }
    return $agenda;
}

function cekDeadline($conn){
    $aturan = [
        ["deadline_24jam", 12, 24, "⏰"],
        ["deadline_12jam", 0, 12, "🚨"],
    ];

    foreach($aturan as $a){
        $tipe = $a[0];
        $dari = $a[1];
        $sampai = $a[2];
        $ikon = $a[3];

        $insert = $conn->prepare("INSERT INTO notifications(user_id, tipe, pesan, task_id)
                                  SELECT t.assigned_to, ?, LEFT(CONCAT(?, ' Deadline task \"', t.judul, '\" kurang dari ', ?, ' jam lagi!'), 255), t.id
                                  FROM tasks t
                                  LEFT JOIN projects p ON p.id = t.project_id
                                  WHERE t.status <> 'done'
                                    AND (p.id IS NULL OR p.status <> 'done')
                                    AND t.deadline >  NOW() + INTERVAL ? HOUR
                                    AND t.deadline <= NOW() + INTERVAL ? HOUR
                                    AND NOT EXISTS (SELECT 1 FROM notifications n
                                                    WHERE n.task_id = t.id AND n.user_id = t.assigned_to AND n.tipe = ?)");
        $insert->execute([$tipe, $ikon, $sampai, $dari, $sampai, $tipe]);

        $insert = $conn->prepare("INSERT INTO notifications(user_id, tipe, pesan, project_id)
                                  SELECT pm.user_id, ?, LEFT(CONCAT(?, ' Deadline project \"', p.nama, '\" kurang dari ', ?, ' jam lagi!'), 255), p.id
                                  FROM projects p
                                  JOIN project_members pm ON pm.project_id = p.id
                                  WHERE p.status <> 'done'
                                    AND p.deadline >  NOW() + INTERVAL ? HOUR
                                    AND p.deadline <= NOW() + INTERVAL ? HOUR
                                    AND NOT EXISTS (SELECT 1 FROM notifications n
                                                    WHERE n.project_id = p.id AND n.task_id IS NULL
                                                      AND n.user_id = pm.user_id AND n.tipe = ?)");
        $insert->execute([$tipe, $ikon, $sampai, $dari, $sampai, $tipe]);
    }
}

function ambilNotifikasi($conn, $userId){
    $select = $conn->prepare("SELECT id, tipe, pesan, is_read, created_at FROM notifications
                              WHERE user_id = ? ORDER BY id DESC LIMIT 50");
    $select->execute([$userId]);
    return $select->fetchAll(PDO::FETCH_ASSOC);
}

function hitungBelumDibaca($conn, $userId){
    $select = $conn->prepare("SELECT COUNT(*) FROM notifications WHERE user_id = ? AND is_read = 0");
    $select->execute([$userId]);
    return (int)$select->fetchColumn();
}

function cekBunyi($notifikasi){
    $idTerbaru = 0;
    foreach($notifikasi as $n){
        if($n["is_read"] == 0 && $n["id"] > $idTerbaru){
            $idTerbaru = (int)$n["id"];
        }
    }

    $sudahDibunyikan = $_SESSION["notif_dibunyikan"] ?? 0;
    if($idTerbaru > $sudahDibunyikan){
        $_SESSION["notif_dibunyikan"] = $idTerbaru;
        return true;
    }
    return false;
}

function htmlNotifikasi($notifikasi, $kembali){
    if(count($notifikasi) == 0){
        return '<div class="notif-kosong">Tidak ada notifikasi</div>';
    }

    $ikon = ["deadline_24jam" => "⏰", "deadline_12jam" => "🚨", "task_assigned" => "📋", "project_invite" => "👥"];
    $label = ["deadline_24jam" => "Deadline 24 Jam", "deadline_12jam" => "Deadline 12 Jam", "task_assigned" => "Task Baru", "project_invite" => "Project Baru"];
    $namaBulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

    $html = "";
    foreach($notifikasi as $n){
        $kelas = "notif-item";
        if($n["tipe"] == "deadline_12jam"){
            $kelas .= " notif-urgent";
        }
        if($n["is_read"] == 0){
            $kelas .= " notif-belum";
        }

        $waktu = strtotime($n["created_at"]);
        $tanggal = date("j", $waktu) . " " . $namaBulan[date("n", $waktu) - 1] . " " . date("H.i", $waktu);

        $isi = '<span class="notif-ikon">' . $ikon[$n["tipe"]] . '</span>'
             . '<span class="notif-isi">'
             . '<span class="notif-label">' . $label[$n["tipe"]] . '</span>'
             . '<span class="notif-pesan">' . htmlspecialchars($n["pesan"]) . '</span>'
             . '<span class="notif-waktu">' . $tanggal . '</span>'
             . '</span>';

        if($n["is_read"] == 1){
            $html .= '<div class="' . $kelas . '">' . $isi . '</div>';
        } else {
            $html .= '<form method="POST" action="Action/notifikasi_baca.php">'
                   . '<input type="hidden" name="csrf_token" value="' . $_SESSION["csrf_token"] . '">'
                   . '<input type="hidden" name="id" value="' . (int)$n["id"] . '">'
                   . '<input type="hidden" name="kembali" value="' . htmlspecialchars($kembali) . '">'
                   . '<button type="submit" class="' . $kelas . '">' . $isi . '<span class="notif-titik"></span></button>'
                   . '</form>';
        }
    }
    return $html;
}

function hapusFile($folder, $namaFile){
    if($namaFile == null){
        return;
    }
    $path = __DIR__ . "/../assets/uploads/" . $folder . "/" . basename($namaFile);
    if(is_file($path)){
        unlink($path);
    }
}

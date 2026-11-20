-- =====================================================================
-- Collabify (PHP Native + MySQL) — skema database
-- Target : MariaDB 10.4 (XAMPP) / MySQL 8
-- Impor  : phpMyAdmin > tab "Import" di level SERVER (bukan di dalam
--          database), pilih file ini, klik "Go". Database
--          `collabify_php` dibuat otomatis.
-- PERINGATAN: menjalankan ulang file ini MENGHAPUS seluruh data di
--          database `collabify_php`.
-- =====================================================================
--
-- Evaluasi skema lama (database `collabify`, dibuat Sequelize):
--
-- * users          : DIPERTAHANKAN. 40 UNIQUE KEY duplikat pada `email`
--                    (efek sequelize.sync berulang) dibuang, sisa 1.
-- * friends        : DISEDERHANAKAN. Dulu 1 pertemanan = 2 baris (A->B &
--                    B->A) dengan kolom `status` yang selalu 'accepted'.
--                    Sekarang 1 baris per pasangan (user1_id < user2_id),
--                    tanpa id/status. Tabel tetap diperlukan karena
--                    pertemanan adalah relasi many-to-many yang dibuat
--                    user lewat tombol "Add Friend".
-- * groupprojects  : DIGANTI `projects`. Deadline keseluruhan disimpan
--                    di sini (dulu disimpan sebagai task "utama" yang
--                    judulnya sama dengan nama group). Kolom `deskripsi`
--                    yang selalu otomatis "Group project: ..." dibuang.
-- * groupmembers   : DIGANTI `project_members`. Kolom `role` dibuang;
--                    ketua cukup ditentukan oleh projects.owner_id.
--                    Anggota tidak lagi dimasukkan otomatis dari seluruh
--                    daftar teman, melainkan diundang oleh ketua.
-- * tasks          : DIPERTAHANKAN. `group_id` -> `project_id`
--                    (NULL = tugas individu); kolom `tipe` dibuang karena
--                    bisa diturunkan dari project_id; `deskripsi` (tidak
--                    pernah dipakai UI) dibuang; lampiran menyimpan nama
--                    asli + nama file tersimpan.
-- * submissions    : DIUBAH. Dulu terikat ke group (ada baris yatim
--                    group_id=29 yang group-nya sudah tidak ada). Sekarang
--                    terikat ke TASK, jadi jelas file milik pekerjaan siapa.
-- * notifications  : DIPERTAHANKAN sebagai riwayat alarm H-24/H-12.
--                    Tipe 'friend_request' (tidak pernah dipakai) dibuang,
--                    tipe 'project_invite' ditambah. Bisa mengacu ke task
--                    atau ke deadline keseluruhan project.
--
-- Semua tabel kini memakai FOREIGN KEY + ON DELETE CASCADE, sehingga
-- menghapus project/task/user tidak meninggalkan data yatim.
-- =====================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS `collabify_php`
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `collabify_php`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `notifications`, `submissions`, `tasks`,
                     `project_members`, `projects`, `friends`, `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- users: akun pengguna
-- ---------------------------------------------------------------------
CREATE TABLE `users` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama`       VARCHAR(100) NOT NULL,
  `email`      VARCHAR(255) NOT NULL,
  `password`   VARCHAR(255) NOT NULL,
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------------
-- friends: satu baris per pasangan teman (berlaku dua arah)
-- ---------------------------------------------------------------------
CREATE TABLE `friends` (
  `user1_id`   INT UNSIGNED NOT NULL,
  `user2_id`   INT UNSIGNED NOT NULL,
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user1_id`, `user2_id`),
  KEY `idx_friends_user2` (`user2_id`),
  CONSTRAINT `chk_friends_urutan` CHECK (`user1_id` < `user2_id`),
  CONSTRAINT `fk_friends_user1` FOREIGN KEY (`user1_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_friends_user2` FOREIGN KEY (`user2_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------------
-- projects: proyek tim; owner_id = ketua / pembuat project
-- ---------------------------------------------------------------------
CREATE TABLE `projects` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama`       VARCHAR(150) NOT NULL,
  `deadline`   DATETIME     NOT NULL,
  `status`     ENUM('active','done') NOT NULL DEFAULT 'active',
  `owner_id`   INT UNSIGNED NOT NULL,
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_projects_owner` (`owner_id`),
  KEY `idx_projects_deadline` (`status`, `deadline`),
  CONSTRAINT `fk_projects_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------------
-- project_members: anggota project (ketua juga tercatat di sini)
-- ---------------------------------------------------------------------
CREATE TABLE `project_members` (
  `project_id` INT UNSIGNED NOT NULL,
  `user_id`    INT UNSIGNED NOT NULL,
  `joined_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`, `user_id`),
  KEY `idx_members_user` (`user_id`),
  CONSTRAINT `fk_members_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_members_user`    FOREIGN KEY (`user_id`)    REFERENCES `users` (`id`)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------------
-- tasks: tugas individu (project_id NULL) & assignment project
-- ---------------------------------------------------------------------
CREATE TABLE `tasks` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_id`    INT UNSIGNED NULL DEFAULT NULL,
  `judul`         VARCHAR(150) NOT NULL,
  `deadline`      DATETIME     NOT NULL,
  `status`        ENUM('todo','done') NOT NULL DEFAULT 'todo',
  `created_by`    INT UNSIGNED NOT NULL,
  `assigned_to`   INT UNSIGNED NOT NULL,
  `lampiran_nama` VARCHAR(255) NULL DEFAULT NULL,
  `lampiran_file` VARCHAR(64)  NULL DEFAULT NULL,
  `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tasks_assigned` (`assigned_to`, `deadline`),
  KEY `idx_tasks_project` (`project_id`),
  KEY `idx_tasks_creator` (`created_by`),
  KEY `idx_tasks_deadline` (`status`, `deadline`),
  CONSTRAINT `fk_tasks_project`  FOREIGN KEY (`project_id`)  REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tasks_creator`  FOREIGN KEY (`created_by`)  REFERENCES `users` (`id`)    ON DELETE CASCADE,
  CONSTRAINT `fk_tasks_assignee` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------------
-- submissions: file hasil kerja anggota untuk task yang ditugaskan
-- ---------------------------------------------------------------------
CREATE TABLE `submissions` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `task_id`    INT UNSIGNED NOT NULL,
  `user_id`    INT UNSIGNED NOT NULL,
  `nama_file`  VARCHAR(255) NOT NULL,
  `path_file`  VARCHAR(64)  NOT NULL,
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_submissions_task` (`task_id`),
  KEY `idx_submissions_user` (`user_id`),
  CONSTRAINT `fk_submissions_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_submissions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------------
-- notifications: riwayat alarm H-24/H-12 & pemberitahuan lain
--   task_id terisi    -> tentang task tertentu
--   project_id terisi -> tentang project (undangan / deadline keseluruhan)
-- ---------------------------------------------------------------------
CREATE TABLE `notifications` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`    INT UNSIGNED NOT NULL,
  `tipe`       ENUM('deadline_24jam','deadline_12jam','task_assigned','project_invite') NOT NULL,
  `pesan`      VARCHAR(255) NOT NULL,
  `task_id`    INT UNSIGNED NULL DEFAULT NULL,
  `project_id` INT UNSIGNED NULL DEFAULT NULL,
  `is_read`    TINYINT(1)   NOT NULL DEFAULT 0,
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notif_user` (`user_id`, `is_read`),
  KEY `idx_notif_task` (`task_id`, `tipe`),
  KEY `idx_notif_project` (`project_id`, `tipe`),
  CONSTRAINT `fk_notif_user`    FOREIGN KEY (`user_id`)    REFERENCES `users` (`id`)    ON DELETE CASCADE,
  CONSTRAINT `fk_notif_task`    FOREIGN KEY (`task_id`)    REFERENCES `tasks` (`id`)    ON DELETE CASCADE,
  CONSTRAINT `fk_notif_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

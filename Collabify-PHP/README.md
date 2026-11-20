# Collabify (PHP Native + MySQL)

Versi PHP dari Collabify (sebelumnya React + Node.js). Berjalan langsung di Apache + MySQL (XAMPP), tanpa Node.js.

## Cara menjalankan

1. Salin folder `Collabify-PHP` ke dalam DocumentRoot Apache (default XAMPP: `C:\xampp\htdocs`; cek baris `DocumentRoot` di `C:\xampp\apache\conf\httpd.conf`).
2. Jalankan **Apache** dan **MySQL** dari XAMPP Control Panel.
3. Buka phpMyAdmin → tab **Import** (di level server, jangan pilih database dulu) → pilih `database/collabify.sql` → **Go**. Database `collabify_php` dibuat otomatis.
4. Jika user/password MySQL bukan `root` tanpa password, ubah `config/koneksi.php`.
5. Buka `http://localhost/Collabify-PHP/`, lalu daftar akun lewat **Sign Up**.

## Struktur folder

| Lokasi | Isi |
|---|---|
| `*.php` (root) | Halaman. Konversi dari `src/pages/*.jsx`. |
| `layout_*.php`, `komponen_*.php` | Bagian yang dipakai bersama: kerangka halaman, lonceng notifikasi, kalender. Tidak bisa dibuka langsung lewat URL. |
| `config/koneksi.php` | `session_start()`, koneksi PDO MySQL (`$conn`), zona waktu, dan pembuatan token CSRF. Di-require semua halaman & Action. |
| `config/fungsi.php` | Fungsi yang dipakai di banyak file: `formatTanggal`, `prioritas`, `ambilProject`, `ambilTask`, `bolehKelolaTask`, `cekAnggota`, `ambilTeman`, `ambilAgenda`, `cekDeadline` (alarm H-24/H-12), notifikasi, `hapusFile`. |
| `Action/` | Proses form (`<form action="Action/..." method="POST">`). Pola setiap file: cek login → `if($_SERVER["REQUEST_METHOD"] == "POST")` → cek `csrf_token` → validasi → query → pesan lewat `$_SESSION["trouble"]` / `$_SESSION["success"]` → `header("Location: ...")`. |
| `assets/css/` | CSS asli React tanpa diubah, ditambah `collabify-php.css` untuk elemen baru. |
| `assets/img/`, `assets/audio/`, `assets/js/app.js` | Gambar, suara alarm, dan JavaScript ringan. |
| `assets/uploads/` | File lampiran & submission. Akses langsung diblokir `.htaccess`; unduh lewat `Action/download.php`. |
| `database/collabify.sql` | Skema database, berisi catatan evaluasi tabel lama. |

## Hak akses

| Aksi | Ketua project | Anggota | Bukan anggota |
|---|---|---|---|
| Lihat project & semua assignment | ✓ | ✓ | ✗ |
| Buat / edit / hapus assignment | ✓ | ✗ | ✗ |
| Tandai assignment selesai | semua | miliknya | ✗ |
| Upload / ganti / hapus submission | miliknya | miliknya | ✗ |
| Download lampiran & submission | ✓ | ✓ | ✗ |
| Undang / keluarkan anggota, edit / hapus project | ✓ | ✗ | ✗ |

Tugas individu (Personal) hanya bisa dilihat dan dikelola pembuatnya.

## Alarm deadline H-24 & H-12

PHP tidak menjalankan proses latar seperti `node-cron` di versi Node.js. Pengecekan dijalankan dengan cara lain:

- Setiap kali halaman dimuat, `cekDeadline()` membuat notifikasi untuk task/project yang deadline-nya tinggal ≤ 24 jam atau ≤ 12 jam. Setiap alarm hanya dibuat sekali per penerima.
- Selama halaman terbuka, `app.js` memanggil `Action/cek_notifikasi.php` tiap 30 detik untuk memperbarui badge, daftar, dan bunyi alarm.
- Browser memblokir suara sebelum pengguna berinteraksi dengan halaman. Jika diblokir, alarm diputar saat klik atau tekan tombol pertama.
- Jika deadline diubah, riwayat alarm task/project tersebut direset agar alarm berbunyi lagi untuk deadline baru.

Task yang melewati deadline **tidak dihapus**. Task diberi label **Overdue** dan bisa dihapus manual oleh pemilik/ketua.

## Keamanan yang diterapkan

- Semua query memakai PDO prepared statement.
- Password di-hash dengan `password_hash()` (bcrypt).
- Sesi: `session_regenerate_id()` saat login, cookie `HttpOnly` + `SameSite=Lax`, strict mode.
- Setiap Action hanya diproses jika `REQUEST_METHOD` adalah POST (membuka URL Action lewat link/GET tidak mengubah data).
- Token CSRF di setiap form POST, dicek dengan `hash_equals()` (menolak form palsu dari situs lain).
- Semua output dari user/database di-escape dengan `htmlspecialchars()`.
- Upload: whitelist ekstensi, maks 10 MB, nama file acak, folder tidak bisa diakses langsung, unduhan dicek hak aksesnya.
- Redirect "kembali" hanya ke halaman lokal (mencegah open redirect).
- Pesan login gagal dibuat generik agar email terdaftar tidak bocor.

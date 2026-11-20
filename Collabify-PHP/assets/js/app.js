/*
 * app.js — JavaScript ringan Collabify (PHP).
 * Semua data & aturan bisnis diproses PHP; file ini hanya untuk:
 *  1. Navigasi klik (pengganti navigate() React)  5. Jam kalender & toggle AM/PM
 *  2. Konfirmasi sebelum hapus                    6. Lonceng notifikasi, alarm & polling 30 detik
 *  3. Cek "Confirm Password" saat mengetik         7. Toast pesan hilang otomatis
 *  4. Scroll halus halaman Information            8. Tombol ikon mata untuk melihat password
 *                                                  9. Refresh data halaman saat tab aktif lagi
 */
(function () {
  'use strict';

  /* 1. NAVIGASI ------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-href]');
    if (!el) return;
    var interaktif = e.target.closest('a, button, input, select, textarea, label, form');
    if (interaktif && interaktif !== el && el.contains(interaktif)) return;
    window.location.href = el.getAttribute('data-href');
  });

  /* 2. KONFIRMASI ----------------------------------------------------- */
  document.addEventListener('submit', function (e) {
    var pesan = e.target.getAttribute('data-konfirmasi');
    if (pesan && !window.confirm(pesan)) e.preventDefault();
  });

  document.querySelectorAll('input[data-autosubmit]').forEach(function (input) {
    input.addEventListener('change', function () {
      if (input.files.length) input.form.submit();
    });
  });

  /* 3. CONFIRM PASSWORD ----------------------------------------------- */
  document.querySelectorAll('[data-cocokkan]').forEach(function (konfirmasi) {
    var asli = document.querySelector(konfirmasi.getAttribute('data-cocokkan'));
    var pesan = document.querySelector(konfirmasi.getAttribute('data-pesan'));
    if (!asli || !pesan) return;
    var cek = function () {
      pesan.hidden = konfirmasi.value === '' || konfirmasi.value === asli.value;
    };
    konfirmasi.addEventListener('input', cek);
    asli.addEventListener('input', cek);
  });

  /* 4. SCROLL HALUS (information.php) --------------------------------- */
  document.querySelectorAll('[data-scroll]').forEach(function (el) {
    el.addEventListener('click', function () {
      var target = document.getElementById(el.getAttribute('data-scroll'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
  if (document.querySelector('.ApplicationInformation') && window.location.hash) {
    setTimeout(function () {
      var target = document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  /* 5. KALENDER: JAM & AM/PM ------------------------------------------ */
  var jam = document.querySelector('.calendar .time-value');
  if (jam) {
    var tampilkanJam = function () {
      var now = new Date();
      jam.textContent = (now.getHours() % 12 || 12) + ':' + String(now.getMinutes()).padStart(2, '0');
    };
    tampilkanJam();
    setInterval(tampilkanJam, 1000);

    document.querySelectorAll('.ampm-toggle button').forEach(function (btn, _, semua) {
      btn.addEventListener('click', function () {
        semua.forEach(function (b) { b.classList.toggle('active', b === btn); });
      });
    });
  }

  /* 6. NOTIFIKASI & ALARM --------------------------------------------- */
  var notif = document.getElementById('notif');
  if (notif) {
    var tombol = notif.querySelector('.notif-bell');
    var badge = notif.querySelector('.notif-badge');
    var dropdown = notif.querySelector('.notif-dropdown');
    var overlay = notif.querySelector('.notif-overlay');
    var bacaSemua = notif.querySelector('.notif-baca-semua');
    var daftar = notif.querySelector('.notif-list');
    var audio = document.getElementById('notif-audio');

    var bukaTutup = function (buka) {
      dropdown.hidden = !buka;
      overlay.hidden = !buka;
    };
    tombol.addEventListener('click', function () { bukaTutup(dropdown.hidden); });
    overlay.addEventListener('click', function () { bukaTutup(false); });

    if (window.location.hash === '#notif') {
      bukaTutup(true);
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    var bunyikan = function () {
      audio.currentTime = 0;
      var main = audio.play();
      if (!main || !main.catch) return;
      main.catch(function () {
        var sekali = function () {
          document.removeEventListener('pointerdown', sekali);
          document.removeEventListener('keydown', sekali);
          audio.play().catch(function () {});
        };
        document.addEventListener('pointerdown', sekali);
        document.addEventListener('keydown', sekali);
      });
    };
    if (notif.getAttribute('data-bunyikan') === '1') bunyikan();

    var perbarui = function () {
      var alamat = notif.getAttribute('data-polling') + '?kembali=' + encodeURIComponent(notif.getAttribute('data-kembali'));
      fetch(alamat, { credentials: 'same-origin', headers: { Accept: 'application/json' } })
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (data) {
          if (!data) return;
          badge.textContent = data.belum_dibaca > 99 ? '99+' : data.belum_dibaca;
          badge.hidden = data.belum_dibaca === 0;
          bacaSemua.hidden = data.belum_dibaca === 0;
          daftar.innerHTML = data.html;
          if (data.bunyikan) bunyikan();
        })
        .catch(function () { /* jaringan putus: coba lagi di putaran berikutnya */ });
    };
    setInterval(perbarui, 30000);
  }

  /* 7. TOAST ---------------------------------------------------------- */
  var toast = document.querySelector('.flash-toast');
  if (toast) {
    setTimeout(function () { toast.classList.add('hilang'); }, 4000);
  }

  /* 8. LIHAT PASSWORD ------------------------------------------------- */
  var ikonMata =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>' +
    '<line class="garis-coret" x1="3" y1="3" x2="21" y2="21"/></svg>';

  document.querySelectorAll('input[data-lihat-password]').forEach(function (input) {
    var tombol = document.createElement('button');
    tombol.type = 'button';
    tombol.className = 'toggle-password';
    tombol.title = 'Tampilkan password';
    tombol.setAttribute('aria-label', 'Tampilkan password');
    tombol.innerHTML = ikonMata;

    if (input.parentElement.classList.contains('input-group')) {
      input.after(tombol);
    } else {
      var bungkus = document.createElement('div');
      bungkus.className = 'password-wrapper';
      input.before(bungkus);
      bungkus.appendChild(input);
      bungkus.appendChild(tombol);
    }

    tombol.addEventListener('click', function () {
      var tampilkan = input.type === 'password';
      input.type = tampilkan ? 'text' : 'password';
      tombol.classList.toggle('terlihat', tampilkan);
      var label = tampilkan ? 'Sembunyikan password' : 'Tampilkan password';
      tombol.title = label;
      tombol.setAttribute('aria-label', label);
    });
  });

  /* 9. REFRESH SAAT TAB AKTIF LAGI ------------------------------------ */
  if (document.querySelector('[data-refresh-saat-aktif]')) {
    var sedangMengisiForm = false;
    var tandaiMengisi = function (e) {
      if (e.target.closest('form')) sedangMengisiForm = true;
    };
    document.addEventListener('input', tandaiMengisi);
    document.addEventListener('change', tandaiMengisi);

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible' && !sedangMengisiForm) {
        window.location.reload();
      }
    });
  }
})();

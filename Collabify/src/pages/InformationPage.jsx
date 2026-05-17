import React from "react"
import "../styles/InformationPage.css"
import { useNavigate } from "react-router-dom"
import { useEffect, useRef } from "react";

import logo from "../assets/LOGOWB.png"
import whatapp from "../assets/Whatapp.png"
import email from "../assets/Email.png"
import website from "../assets/Website.png"

function InformationPage() {
  const navigate = useNavigate()
  const contentRef = useRef(null);

  useEffect(() => {
    contentRef.current?.scrollTo(0,0);
  }, []);

  return (
    <div className="page-containerInformation">

      {/* Navbar */}
      <nav className="navbarInformation">
        <div className="logoInformation">
          <img src={logo} alt="collabify"/>
        </div>

        <ul className="menuInformation">
          <li onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>Home</li>
          <li onClick={() => navigate("/information")} style={{ cursor: 'pointer' }}>About Us</li>
          <li onClick={() => navigate("/information")} style={{ cursor: 'pointer' }}>Features</li>
          <li onClick={() => navigate("/information")} style={{ cursor: 'pointer' }}>Contact</li>
        </ul>

        <div className="auth-buttonsInformation">
          <button className="loginInformation" onClick={() => navigate("/login")}>
            Log In
          </button>
          <button className="signupInformation" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>

      </nav>

      <div className="ApplicationInformation" ref={contentRef}>

        <section className="info-section">
          <h1 className="info-title">About Us</h1>
          <p className="info-desc">
            Collabify adalah platform manajemen tugas yang dirancang untuk membantu individu dan tim dalam mengelola deadline dengan lebih efektif. Kami percaya bahwa tidak ada tugas yang terlewat jika ada sistem yang tepat untuk mengingatkanmu.
          </p>
          <p className="info-desc">
            Dengan Collabify, kamu bisa memantau semua tugasmu dalam satu tempat, mulai dari tugas pribadi hingga tugas kelompok bersama teman-temanmu. Kami hadir untuk memastikan kamu selalu selangkah lebih maju dari deadline.
          </p>
          <p className="info-desc">
            Collabify lahir dari keresahan nyata, betapa seringnya tugas terlupakan bukan karena malas, tapi karena tidak ada sistem yang mengingatkan tepat waktu. Kami membangun Collabify sebagai solusi yang sederhana namun powerful untuk masalah itu. Berawal dari kebutuhan mahasiswa dan pelajar yang sering kewalahan menghadapi banyaknya tugas, Collabify kini hadir sebagai teman setia dalam setiap perjalanan belajarmu.
          </p>
          <p className="info-desc">
            Di Collabify, kamu tidak hanya bisa membuat tugas pribadi, tapi juga berkolaborasi dalam group task bersama teman-temanmu. Setiap anggota tim bisa mendapatkan assignment masing-masing, memantau progress, dan mengumpulkan hasil kerja langsung di platform. Tidak perlu lagi bolak-balik aplikasi chat hanya untuk koordinasi tugas kelompok, semuanya sudah tersedia di satu tempat.
          </p>
          <p className="info-desc">
            Sistem notifikasi alarm kami akan secara otomatis mengingatkanmu saat deadline tinggal 24 jam dan 12 jam lagi, sehingga kamu selalu punya waktu untuk mempersiapkan diri sebelum terlambat. Dengan prioritas tugas yang otomatis diurutkan berdasarkan kedekatan deadline, kamu bisa langsung fokus pada hal yang paling mendesak tanpa perlu berpikir panjang.
          </p>
          <p className="info-desc">
            Kami juga memahami bahwa kolaborasi yang baik membutuhkan komunikasi yang jelas. Oleh karena itu, fitur group task di Collabify memungkinkan kamu untuk meng-assign tugas ke anggota tim tertentu, melampirkan file referensi, serta menerima dan mengunduh hasil submission dari setiap anggota, semua dalam satu halaman yang rapi dan mudah dipahami.
          </p>
          <p className="info-desc">
            Keamanan dan kemudahan akses adalah prioritas kami. Dengan sistem login yang aman dan manajemen akun yang fleksibel, kamu bisa mengubah username, email, maupun password kapan saja sesuai kebutuhan. Data tugasmu tersimpan dengan aman dan bisa diakses dari mana saja.
          </p>
          <p className="info-desc">
            Kami berkomitmen untuk terus berkembang dan menghadirkan fitur-fitur baru yang membantu produktivitasmu. Bergabunglah bersama ribuan pengguna yang sudah merasakan manfaat Collabify dan mulailah kelola tugasmu dengan lebih cerdas hari ini. Karena di Collabify, tidak ada deadline yang terlewat.
          </p>
        </section>

        <section className="info-section feature-section">
          <h1 className="info-title">Features</h1>
          <div className="feature-grid">
            <div className="feature-card">
              <span className="feature-icon">🔔</span>
              <h3>Alarm Deadline</h3>
              <p>Notifikasi otomatis berbunyi saat deadline tugasmu tinggal 24 jam dan 12 jam lagi. Tidak ada lagi alasan lupa!</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📋</span>
              <h3>Task Priority</h3>
              <p>Tugas ditampilkan berdasarkan prioritas secara otomatis. Semakin dekat deadline, semakin tinggi prioritasnya.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">👥</span>
              <h3>Group Task</h3>
              <p>Buat tugas kelompok dan assign anggota tim sesuai tanggung jawab masing-masing, lengkap dengan deadline per tugas.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📎</span>
              <h3>File Submission</h3>
              <p>Upload dan download hasil pengerjaan tugas kelompok langsung di dalam platform. Semua file tersimpan rapi.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🤝</span>
              <h3>Add Friend</h3>
              <p>Tambahkan teman dan ajak mereka berkolaborasi dalam group task. Kerja tim jadi lebih terstruktur.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">👤</span>
              <h3>Personal & Group Task</h3>
              <p>Kelola tugas pribadi dan tugas kelompok dalam satu dashboard yang sama. Semua terorganisir dengan baik.</p>
            </div>
          </div>
        </section>

        <section className="info-section Contact-section">
          <h1 className="info-title">Contact</h1>
          <p className="info-desc">Punya pertanyaan atau saran? Jangan ragu untuk menghubungi tim Collabify.</p>
          <div className="contact-list">

            <div className="contact-item">
              <span className="contact-icon">
                <img src={email} alt="Email" className="email-iconAboutUs"/>
              </span>
              <div>
                <p className="contact-label">Email</p>
                <p className="contact-value">support@collabify.app</p>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-icon">
                <img src={whatapp} alt="WhatsApp" className="whatsapp-icon"/>
              </span>
              <div>
                <p className="contact-label">WhatsApp</p>
                <p className="contact-value">+62 812-3456-7890</p>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-icon Website">
                <img src={website} alt="Website" className="website-icon"/>
              </span>
              <div>
                <p className="contact-label">Website</p>
                <p className="contact-value">www.collabify.app</p>
              </div>
            </div>
          </div>
        </section>

        <div style={{ height: '40px' }}/>
      </div>
    </div>
  )
}

export default InformationPage;
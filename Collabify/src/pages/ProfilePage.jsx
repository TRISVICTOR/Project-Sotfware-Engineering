import React, { useState } from "react";
import "../styles/ProfilePage.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateAkun } from "../api/authApi";

import logo from "../assets/LOGOWB.png"
import plant from "../assets/TanamanPageHome.png"
import people from "../assets/GroupBackground.png"
import home from "../assets/Home.png"
import Mytask from "../assets/MyTask.png"
import Friend from "../assets/Friend.png"
import orang from "../assets/logoOrang.png"
import profilePicture from "../assets/profile.png"
import profileStatus from "../assets/ProfilePicture.png"
import NotificationSound from '../component/NotificationSound';

function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Edit name
  const [editNama, setEditNama] = useState(false);
  const [namaBaru, setNamaBaru] = useState('');

  // Edit email
  const [editEmail, setEditEmail] = useState(false);
  const [emailBaru, setEmailBaru] = useState('');
  const [passwordVerifEmail, setPasswordVerifEmail] = useState('');

  // Edit password
  const [editPassword, setEditPassword] = useState(false);
  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasiPassword, setKonfirmasiPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Simpan perubahan email
  const handleSimpanEmail = async () => {
    setError(''); setSuccess('');
    if (!emailBaru.trim()) { setError('Email baru wajib diisi!'); return; }
    if (!passwordVerifEmail) { setError('Password wajib diisi untuk verifikasi!'); return; }
    try {
      setLoading(true);
      await updateAkun({ email: emailBaru, passwordLama: passwordVerifEmail });
      setSuccess('Email berhasil diubah! Silakan login ulang.');
      setTimeout(() => { logout(); navigate('/login'); }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSimpanPassword = async () => {
    setError(''); setSuccess('');
    if (!passwordLama) { setError('Password lama wajib diisi!'); return; }
    if (!passwordBaru) { setError('Password baru wajib diisi!'); return; }
    if (passwordBaru.length < 6) { setError('Password baru minimal 6 karakter!'); return; }
    if (passwordBaru !== konfirmasiPassword) { setError('Konfirmasi password tidak sama!'); return; }
    try {
      setLoading(true);
      await updateAkun({ password: passwordBaru, passwordLama });
      setSuccess('Password berhasil diubah! Silakan login ulang.');
      setTimeout(() => { logout(); navigate('/login'); }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profilepage">
      <div className="profile-wrapper">

        {/* NAVBAR */}
        <div className="navbarProfile">
          <div className="logoProfile">
            <img src={logo} alt="logo"/>
          </div>
          <div className="nav-buttons">
            <button className="add-task" onClick={() => navigate("/addtask")}>Add Task</button>
            <button className="add-friend" onClick={() => navigate("/addfriend")}>Add Friend</button>
            <NotificationSound />
          </div>
        </div>

        {/* HEADER BACKGROUND */}
        <div className="header-background">
          <img src={people} alt="people"/>
        </div>

        <div className="main-container">

          {/* SIDEBAR */}
          <div className="sidebar">
            <ul>
              <li onClick={() => navigate("/home")} className={location.pathname.toLowerCase() === "/home" ? "active" : ""}>
                <img src={home} alt="home"/> Home
              </li>
              <li onClick={() => navigate("/mytask")} className={location.pathname.toLowerCase() === "/mytask" ? "active" : ""}>
                <img src={Mytask} alt="task"/> My Task
              </li>
              <li onClick={() => navigate("/friend")} className={location.pathname.toLowerCase() === "/friend" ? "active" : ""}>
                <img src={Friend} alt="friend"/> Friend
              </li>
              <li onClick={() => navigate("/profile")} className={`sidebar-profile ${location.pathname.toLowerCase() === "/profile" ? "active" : ""}`}>
                <img src={profilePicture} alt="profile"/> Profile
              </li>
            </ul>
          </div>

          {/* CONTENT */}
          <div className="content">
            <h1 className="welcomeProfile">{user?.nama || 'User'}'s Profile</h1>

            <div className="profile-card">

              {/* Foto & Nama */}
              <div className="profile-avatar-section">
                <div className="profile-avatar">
                  <img src={profileStatus} alt="profile status" className="profile-status"/>
                </div>
                <h2>{user?.nama || 'User'}</h2>
              </div>

              <div className="profile-card-header">
                <button className="change-password-btn" onClick={() => navigate('/changepassword')}>
                  🔒 Change Password
                </button>
              </div>

              <div style={{ minHeight: '24px', marginBottom: '8px', textAlign: 'center' }}>
                {error && <p style={{ color: 'red', fontSize: '0.85rem', margin: 0 }}>{error}</p>}
                {success && <p style={{ color: '#22c55e', fontSize: '0.85rem', margin: 0 }}>{success}</p>}
              </div>

              <div className="profile-info">

                {/* ── NAMA ── */}
                <div className="profile-info-row">
                  <span className="profile-label">Username</span>
                  {editNama ? (
                    <div className="profile-edit-inline">
                      <input
                        type="text"
                        className="profile-input-inline"
                        placeholder="Nama baru"
                        value={namaBaru}
                        onChange={(e) => setNamaBaru(e.target.value)}
                      />
                      <button className="btn-simpan" onClick={async () => {
                        setError(''); setSuccess('');
                        if (!namaBaru.trim()) { setError('Nama baru wajib diisi!'); return; }
                        try {
                          setLoading(true);
                          await updateAkun({ nama: namaBaru, passwordLama: 'skip' });
                          setSuccess('Nama berhasil diubah!');
                          setEditNama(false);
                          setNamaBaru('');
                        } catch (err) {
                          setError(err.message);
                        } finally { setLoading(false); }
                      }} disabled={loading}>
                        {loading ? '...' : 'Simpan'}
                      </button>
                      <button className="btn-batal" onClick={() => { setEditNama(false); setNamaBaru(''); setError(''); }}>
                        Batal
                      </button>
                    </div>
                  ) : (
                    <div className="profile-value-row">
                      <span className="profile-value">{user?.nama || '-'}</span>
                      <button className="change-btn" onClick={() => navigate('/changeusernameemail', { state: { mode: 'nama' } })}>
                        Change
                      </button>
                    </div>
                  )}
                </div>

                {/* ── EMAIL ── */}
                <div className="profile-info-row">
                  <span className="profile-label">Email</span>
                  {editEmail ? (
                    <div className="profile-edit-inline">
                      <input
                        type="email"
                        className="profile-input-inline"
                        placeholder="Email baru"
                        value={emailBaru}
                        onChange={(e) => setEmailBaru(e.target.value)}
                      />
                      <input
                        type="password"
                        className="profile-input-inline"
                        placeholder="Password untuk verifikasi"
                        value={passwordVerifEmail}
                        onChange={(e) => setPasswordVerifEmail(e.target.value)}
                      />
                      <button className="btn-simpan" onClick={handleSimpanEmail} disabled={loading}>
                        {loading ? '...' : 'Simpan'}
                      </button>
                      <button className="btn-batal" onClick={() => { setEditEmail(false); setEmailBaru(''); setPasswordVerifEmail(''); setError(''); }}>
                        Batal
                      </button>
                    </div>
                  ) : (
                    <div className="profile-value-row">
                      <span className="profile-value">{user?.email || '-'}</span>
                      <button className="change-btn" onClick={() => navigate('/changeusernameemail', { state: { mode: 'email' } })}>
                        Change
                      </button>
                    </div>
                  )}
                </div>

                {/* ── CHANGE PASSWORD FORM ── */}
                {editPassword && (
                  <div className="profile-info-row" style={{ flexDirection: 'column', gap: '10px' }}>
                    <span className="profile-label" style={{ color: '#6366f1', fontWeight: '600' }}>Ubah Password</span>
                    <input type="password" className="profile-input" placeholder="Password lama"
                      value={passwordLama} onChange={(e) => setPasswordLama(e.target.value)} />
                    <input type="password" className="profile-input" placeholder="Password baru (min. 6 karakter)"
                      value={passwordBaru} onChange={(e) => setPasswordBaru(e.target.value)} />
                    <input type="password" className="profile-input" placeholder="Konfirmasi password baru"
                      value={konfirmasiPassword} onChange={(e) => setKonfirmasiPassword(e.target.value)} />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button className="btn-simpan" style={{ flex: 1, padding: '10px' }} onClick={handleSimpanPassword} disabled={loading}>
                        {loading ? 'Menyimpan...' : '💾 Simpan Password'}
                      </button>
                      <button className="btn-batal" style={{ flex: 1, padding: '10px' }} onClick={() => { setEditPassword(false); setError(''); }}>
                        Batal
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Tombol Logout */}
              <button className="logout-btn" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          </div>

        </div>

        <img src={plant} alt="plant" className="plant"/>
      </div>
    </div>
  );
}

export default ProfilePage;
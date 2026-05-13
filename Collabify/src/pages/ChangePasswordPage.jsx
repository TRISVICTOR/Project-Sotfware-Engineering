import React, { useState } from "react";
import "../styles/ChangePasswordPage.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateAkun } from "../api/authApi";

import logo from "../assets/LOGOWB.png"
import BackgroundAddTask from "../assets/AddtaskBG.png"
import arrow from "../assets/arrow.png"

function ChangePasswordPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasiPassword, setKonfirmasiPassword] = useState('');
  const [konfirmasiError, setKonfirmasiError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSimpan = async () => {
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
    <div className="ChangePasswordPage">

      <img src={BackgroundAddTask} alt="bg" className="BackGround-logo"/>

      <div className="ChangePassword-wrapper">

        <img src={arrow} alt="back" className="arrow-back" onClick={() => navigate('/profile')}/>

        <img src={logo} alt="logo" className="ChangePassword-logo"/>

        <h2 className="titleChangePassword">Change Password</h2>

        {/* Pesan error & sukses */}
        <div style={{ minHeight: '24px', marginBottom: '8px', width: '100%' }}>
          {error && <p style={{ color: 'red', fontSize: '0.85rem', margin: 0 }}>{error}</p>}
          {success && <p style={{ color: '#22c55e', fontSize: '0.85rem', margin: 0 }}>{success}</p>}
        </div>

        {/* Old Password */}
        <input
          type="password"
          placeholder="Old Password"
          className="input-fieldChangePassword"
          value={passwordLama}
          onChange={(e) => setPasswordLama(e.target.value)}
        />

        {/* New Password */}
        <input
          type="password"
          placeholder="New Password (min. 6 karakter)"
          className="input-fieldChangePassword"
          value={passwordBaru}
          onChange={(e) => setPasswordBaru(e.target.value)}
        />

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm New Password"
          className="input-fieldChangePassword"
          value={konfirmasiPassword}
          onChange={(e) => {
            setKonfirmasiPassword(e.target.value);
            if (e.target.value !== passwordBaru) {
              setKonfirmasiError('Password tidak sama!');
            } else {
              setKonfirmasiError('');
            }
          }}
        />

        {/* Error konfirmasi real-time */}
        <div style={{ minHeight: '20px', marginTop: '-8px', marginBottom: '8px', width: '100%' }}>
          {konfirmasiError && (
            <p style={{ color: 'red', fontSize: '0.8rem', margin: 0 }}>⚠️ {konfirmasiError}</p>
          )}
        </div>

        <button
          className="create-btn"
          onClick={handleSimpan}
          disabled={loading}
        >
          {loading ? 'Menyimpan...' : 'Save Password'}
        </button>

      </div>

    </div>
  );
}

export default ChangePasswordPage;
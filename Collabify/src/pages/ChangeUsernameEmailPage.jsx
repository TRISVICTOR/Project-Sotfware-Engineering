import React, { useState } from "react";
import "../styles/ChangeUsernameEmailPage.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateAkun } from "../api/authApi";

import logo from "../assets/LOGOWB.png"
import BackgroundAddTask from "../assets/AddtaskBG.png"
import arrow from "../assets/arrow.png"

function ChangeUsernameEmailPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [usernameBaru, setUsernameBaru] = useState('');
  const [emailBaru, setEmailBaru] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSimpan = async () => {
    setError(''); setSuccess('');

    if (!usernameBaru.trim() && !emailBaru.trim()) {
      setError('Isi minimal Username baru atau Email baru!');
      return;
    }

    try {
      setLoading(true);
      await updateAkun({
        ...(usernameBaru.trim() && { nama: usernameBaru }),
        ...(emailBaru.trim() && { email: emailBaru }),
        passwordLama: 'skip',
      });

      setSuccess('Berhasil diubah!');
      setTimeout(() => { navigate('/profile'); }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ChangeUsernameEmailPage">

      <img src={BackgroundAddTask} alt="bg" className="BackGround-logo"/>

      <div className="ChangeUsernameEmail-wrapper">

        <img src={arrow} alt="back" className="arrow-back" onClick={() => navigate('/profile')}/>

        <img src={logo} alt="logo" className="ChangeUsernameEmail-logo"/>

        <h2 className="titleChangeUsernameEmail">Change Username & Email</h2>

        {/* Pesan error & sukses */}
        <div style={{ minHeight: '24px', marginBottom: '8px', width: '100%' }}>
          {error && <p style={{ color: 'red', fontSize: '0.85rem', margin: 0 }}>{error}</p>}
          {success && <p style={{ color: '#22c55e', fontSize: '0.85rem', margin: 0 }}>{success}</p>}
        </div>

        {/* Username Baru */}
        <input
          type="text"
          placeholder="Username Baru"
          className="input-fieldChangeUsernameEmail"
          value={usernameBaru}
          onChange={(e) => setUsernameBaru(e.target.value)}
        />

        {/* Email Baru */}
        <input
          type="email"
          placeholder="Email Baru"
          className="input-fieldChangeUsernameEmail"
          value={emailBaru}
          onChange={(e) => setEmailBaru(e.target.value)}
        />

        <button
          className="create-btn"
          onClick={handleSimpan}
          disabled={loading}
        >
          {loading ? 'Menyimpan...' : 'Save Changes'}
        </button>

      </div>
    </div>
  );
}

export default ChangeUsernameEmailPage;
import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import { register as registerApi } from "../api/authApi";

import "../styles/SignUpPage.css"
import logo from "../assets/LOGOWB.png"
import plant from "../assets/TanamanLogin.png"
import namaIcon from "../assets/logoOrang.png"
import emailIcon from "../assets/EmailIcon.png"
import passwordIcon from "../assets/Gembok.png"

function SignUpPage() {
  const navigate = useNavigate();

  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (!nama || !email || !password || !confirmPassword) {
      setError('Semua kolom wajib diisi!');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password dan Confirm Password tidak sama!');
      return;
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter!');
      return;
    }

    try {
      setLoading(true);
      await registerApi(nama, email, password);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Signup-container">

      <img src={plant} className="Signup-plant" alt="decor" />

      <div className="Signup-card">

        <img src={logo} className="Signup-logo" alt="collabify"/>

        <h2>Sign Up</h2>

        {/* Error utama — pakai minHeight agar form tidak geser */}
        <div style={{ minHeight: '24px', marginBottom: '4px' }}>
          {error && (
            <p style={{ color: 'red', fontSize: '0.85rem', margin: 0, textAlign: 'center' }}>
              {error}
            </p>
          )}
        </div>

        <form className="Signup-form" onSubmit={handleSignUp}>

          <div className="input-group">
            <img src={namaIcon} alt="nama icon" className="email-icon"/>
            <input
              type="text"
              placeholder="Name"
              className="Signup-input"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
          </div>

          <div className="input-group">
            <img src={emailIcon} alt="email icon" className="PutEmail-icon"/>
            <input
              type="email"
              placeholder="Email"
              className="Signup-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <img src={passwordIcon} alt="password icon" className="password-icon"/>
            <input
              type="password"
              placeholder="Password"
              className="Signup-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="input-group">
            <img src={passwordIcon} alt="password icon" className="password-icon"/>
            <input
              type="password"
              placeholder="Confirm Password"
              className="Signup-input"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                // Cek real-time saat diketik
                if (e.target.value !== password) {
                  setConfirmError('Password tidak sama!');
                } else {
                  setConfirmError('');
                }
              }}
            />
          </div>

          {/* Error confirm password — minHeight agar form tidak geser */}
          <div style={{ minHeight: '20px', marginTop: '-8px', marginBottom: '4px' }}>
            {confirmError && (
              <p style={{ color: 'red', fontSize: '0.8rem', margin: 0 }}>
                ⚠️ {confirmError}
              </p>
            )}
          </div>

          <button className="Signup-button" disabled={loading}>
            {loading ? 'Memuat...' : 'Sign Up'}
          </button>

        </form>

        <p className="login-text">
          Already have an account?
          <span className="signup-link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>

      </div>

    </div>
  )
}

export default SignUpPage
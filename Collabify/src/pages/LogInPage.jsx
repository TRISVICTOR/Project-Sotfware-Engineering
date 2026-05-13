import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as loginApi } from "../api/authApi";

import "../styles/LoginPage.css"
import logo from "../assets/LOGOWB.png"
import plant from "../assets/TanamanLogin.png"
import emailIcon from "../assets/logoOrang.png"
import passwordIcon from "../assets/Gembok.png"

function LogInPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan password wajib diisi!');
      return;
    }

    try {
      setLoading(true);
      const data = await loginApi(email, password);
      login(data.token, data.user); // simpan ke AuthContext
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <img src={plant} className="login-plant" alt="decor" />

      <div className="login-card">

        <img src={logo} className="login-logo" alt="collabify"/>

        <h2>Log In</h2>

        {/* Pesan error */}
        {error && (
          <p style={{ color: 'red', fontSize: '0.85rem', marginBottom: '8px' }}>
            {error}
          </p>
        )}

        <form className="login-form" onSubmit={handleLogin}>

          <div className="input-group">
            <img src={emailIcon} alt="email icon" className="email-icon"/>
            <input
              type="email"
              placeholder="Email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <img src={passwordIcon} alt="password icon" className="password-icon"/>
            <input
              type="password"
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="login-button" disabled={loading}>
            {loading ? 'Memuat...' : 'Log In'}
          </button>

        </form>

        <p className="signup-text">
          Don't have an account?
          <span className="signup-link" onClick={() => navigate("/signup")}>
            Sign Up
          </span>
        </p>

      </div>

    </div>
  )
}

export default LogInPage
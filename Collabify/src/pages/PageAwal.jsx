import React from "react"
import "../styles/PageAwal.css"
import { useNavigate } from "react-router-dom"

import logo from "../assets/LOGOWB.png"
import hero from "../assets/GambarKerjasama.png"
import task from "../assets/TaskIcon.png"
import tracking from "../assets/ProjectTrakingIcon.png"
import file from "../assets/FileSharing.png"
import plant from "../assets/TanamanPageawal.png"

function PageAwal() {
  const navigate = useNavigate()

  return (
    <div className="page-container">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="collabify"/>
        </div>

        <ul className="menu">
          <li>Home</li>
          <li>About Us</li>
          <li>Features</li>
          <li>Contact</li>
        </ul>

        <div className="auth-buttons">
          <button className="login" onClick={() => navigate("/login")}>
            Log In
          </button>
          <button className="signup" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-text">
          <h1>Welcome To Collabify</h1>
          <p>Your ultimate collaboration platform.</p>

          <div className="hero-buttons">
            {/* Get Started langsung ke signup */}
            <button className="start" onClick={() => navigate("/signup")}>
              Get Started
            </button>
            <button className="learn">Learn More</button>
          </div>
        </div>

        <div className="hero-img">
          <img src={hero} alt="collaboration"/>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <img src={plant} className="decor-bottom" alt="decor"/>

        <div className="features-header">
          <h2>All-In-One Collaboration Platform</h2>
          <p>Everything your team needs in one place</p>
        </div>

        <div className="feature-cards">
          <div className="card">
            <div className="card-icon">
              <img src={task} alt="Task Management"/>
            </div>
            <div className="card-text">
              <h3>Task Management</h3>
              <p>Organize and manage your tasks efficiently.</p>
            </div>
          </div>

          <div className="card">
            <div className="card-icon">
              <img src={tracking} alt="Task Tracking"/>
            </div>
            <div className="card-text">
              <h3>Task Tracking</h3>
              <p className="task-text">Track progress and deadline effortlessly.</p>
            </div>
          </div>

          <div className="card">
            <div className="card-icon file-icon">
              <img src={file} alt="File Sharing"/>
            </div>
            <div className="card-text">
              <h3>File Sharing</h3>
              <p className="file-text">Easily share and collaborate on task.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default PageAwal
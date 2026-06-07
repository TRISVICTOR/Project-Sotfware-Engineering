import React from "react"
import "../styles/InformationPage.css"
import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom"

import logo from "../assets/LOGOWB.png"
import whatapp from "../assets/Whatapp.png"
import email from "../assets/Email.png"
import website from "../assets/Website.png"

function InformationPage() {
  const navigate = useNavigate()
  const contentRef = useRef(null);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    contentRef.current?.scrollTo(0,0);
  }, []);

  useEffect(() => {
    if (location.hash) {

      setTimeout(() => {
        const el = document.getElementById(location.hash.replace("#", ""));
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      contentRef.current?.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="page-containerInformation">

      {/* Navbar */}
      <nav className="navbarInformation">
        <div className="logoInformation">
          <img src={logo} alt="collabify"/>
        </div>

        <ul className="menuInformation">
          <li onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>Home</li>
          <li onClick={() => scrollToSection("about")} style={{ cursor: 'pointer' }}>About Us</li>
          <li onClick={() => scrollToSection("features")} style={{ cursor: 'pointer' }}>Features</li>
          <li onClick={() => scrollToSection("contact")} style={{ cursor: 'pointer' }}>Contact</li>
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

        <section className="info-section" id="about">
          <h1 className="info-title">About Us</h1>
          <p className="info-desc">
            Collabify is a task management platform designed to help individuals and teams manage deadlines more effectively. We believe that no task is missed if there is a proper system to remind you.
          </p>
          <p className="info-desc">
            With Collabify, you can monitor all your tasks in one place, from personal tasks to group tasks with your friends. We are here to make sure you are always one step ahead of the deadline.
          </p>
          <p className="info-desc">
            Collabify was born out of a real concern, how often tasks are forgotten not because of laziness, but because there is no system that reminds on time. We built Collabify as a simple yet powerful solution to that problem. Starting from the needs of students who are often overwhelmed by the many tasks, Collabify now comes as a faithful companion in every part of your learning journey.
          </p>
          <p className="info-desc">
            At Collabify, you can not only create personal tasks, but also collaborate on group tasks with your friends. Each team member can get their own assignments, monitor progress, and submit their work directly on the platform. No more going back and forth between chat applications just to coordinate group tasks; everything is available in one place.
          </p>
          <p className="info-desc">
            Our alarm notification system will automatically remind you when your deadline is just 24 hours and 12 hours away, ensuring you always have time to prepare before missing the deadline. With task priorities automatically sorted based on proximity to the deadline, you can focus directly on the most urgent tasks without having to think too much.
          </p>
          <p className="info-desc">
            We also understand that good collaboration requires clear communication. That's why the group task feature in Collabify allows you to assign tasks to specific team members, attach reference files, and receive and download submission results from each member, all in one neat and easy-to-understand page.
          </p>
          <p className="info-desc">
            Security and ease of access are our top priorities. With a secure login system and flexible account management, you can change your username, email, or password at any time according to your needs. Your tasks are stored securely and can be accessed from anywhere.
          </p>
          <p className="info-desc">
            We are committed to continuous improvement and bringing you new features that enhance your productivity. Join thousands of users who have already experienced the benefits of Collabify and start managing your tasks more intelligently today. Because at Collabify, there are no missed deadlines.
          </p>
        </section>

        <section className="info-section feature-section" id="features">
          <h1 className="info-title">Features</h1>
          <div className="feature-grid">
            <div className="feature-card">
              <span className="feature-icon">🔔</span>
              <h3>Alarm Deadline</h3>
              <p>Automatic notifications sound when your assignment deadline is 24 hours and 12 hours away. No more excuses for forgetting!</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📋</span>
              <h3>Task Priority</h3>
              <p>Tasks are displayed based on priority automatically. The closer the deadline, the higher the priority.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">👥</span>
              <h3>Group Task</h3>
              <p>Assign group tasks to specific team members and manage deadlines for each task.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📎</span>
              <h3>File Submission</h3>
              <p>Upload and download group task submission results directly within the platform. All files are stored neatly.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🤝</span>
              <h3>Add Friend</h3>
              <p>Add friends and invite them to collaborate on group tasks. Teamwork becomes more structured.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">👤</span>
              <h3>Personal & Group Task</h3>
              <p>Manage personal and group tasks in the same dashboard. Everything is well-organized.</p>
            </div>
          </div>
        </section>

        <section className="info-section Contact-section" id="contact">
          <h1 className="info-title">Contact</h1>
          <p className="info-desc">Have questions or suggestions? Don't hesitate to contact the Collabify team.</p>
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
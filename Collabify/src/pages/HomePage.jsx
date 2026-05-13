import React, { useEffect, useState } from "react";
import "../styles/HomePage.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyTasks } from "../api/taskApi";

import logo from "../assets/LOGOWB.png"
import plant from "../assets/TanamanPageHome.png"
import people from "../assets/GroupBackground.png"
import home from "../assets/Home.png"
import Mytask from "../assets/MyTask.png"
import Friend from "../assets/Friend.png"
import Calendar from "../component/Calender"
import profilePicture from "../assets/profile.png"
import NotificationSound from '../component/NotificationSound';

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getMyTasks()
      .then(data => setTasks(data.slice(0, 3)))
      .catch(err => console.error('Gagal ambil task:', err))
      .finally(() => setLoading(false));
  }, [location]);

  const formatDeadline = (dateStr) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getPriority = (deadline) => {
    const sisaJam = (new Date(deadline) - new Date()) / (1000 * 60 * 60);
    if (sisaJam <= 24) return { label: 'High Priority',   className: 'high' };
    if (sisaJam <= 72) return { label: 'Medium Priority', className: 'medium' };
    return              { label: 'Low Priority',    className: 'low' };
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="homepage">
      <div className="home-wrapper">

        {/* NAVBAR */}
        <div className="navbarHome">
          <div className="logoHome">
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

            <h1 className="welcome">Welcome, {user?.nama || 'User'}!</h1>

            <div className="dashboard">

              {/* TASK CARD */}
              <div className="task-card">
                <h2>Your Task</h2>

                {loading && (
                  <p style={{ color: '#888', fontSize: '0.9rem' }}>Memuat task...</p>
                )}

                {!loading && tasks.length === 0 && (
                  <p style={{ color: '#888', fontSize: '0.9rem', marginLeft: '16px' }}>
                    Belum ada task. Yuk tambah task!
                  </p>
                )}

                {!loading && tasks.map(task => {
                  const priority = getPriority(task.deadline);
                  return (
                    <div
                      className="task-item"
                      key={task.id}
                      onClick={() => {
                        if (task.tipe === 'group' && task.group_id) {
                          navigate('/groupproject', { state: { groupId: task.group_id } });
                        }
                      }}
                      style={{ cursor: task.tipe === 'group' ? 'pointer' : 'default' }}
                    >
                      <div className="task-left">
                        <h4>{task.judul}</h4>
                        {task.tipe === 'group' && (
                          <span style={{ fontSize: '0.75rem', color: '#6366f1', marginLeft: '8px' }}>
                            Group Description
                          </span>
                        )}
                      </div>
                      <div className="task-right">
                        <p className="date">{formatDeadline(task.deadline)}</p>
                        <div className="task-tags">
                          <span className={`type ${task.tipe}`}>
                            {task.tipe === 'group' ? 'Group' : 'Personal'}
                          </span>
                          <span className={`priority ${priority.className}`}>
                            {priority.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>

              {/* CALENDAR */}
              <div className="calendar-box">
                <h2 className="calendar-title">Calendar</h2>
                <Calendar />
              </div>

            </div>
          </div>

        </div>

        <img src={plant} alt="plant" className="plant"/>

      </div>
    </div>
  );
}

export default HomePage;
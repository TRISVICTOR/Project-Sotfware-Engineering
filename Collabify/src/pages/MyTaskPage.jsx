import React, { useEffect, useState } from "react";
import "../styles/MyTaskPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyTasks, updateTask, deleteTask } from "../api/taskApi";
import { deleteGroup } from "../api/groupApi";

import logo from "../assets/LOGOWB.png"
import plant from "../assets/TanamanPageHome.png"
import people from "../assets/GroupBackground.png"
import home from "../assets/Home.png"
import Mytask from "../assets/MyTask.png"
import Friend from "../assets/Friend.png"
import profilePicture from "../assets/profile.png"
import NotificationSound from '../component/NotificationSound';

function PageMyTask() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = () => {
      getMyTasks()
        .then(data => setTasks(data))
        .catch(err => console.error('Gagal ambil task:', err))
        .finally(() => setLoading(false));
    };

    fetchTasks();

    const interval = setInterval(fetchTasks, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatDeadline = (dateStr) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getPriority = (deadline) => {
    const sisaJam = (new Date(deadline) - new Date()) / (1000 * 60 * 60);
    if (sisaJam <= 24)  return { label: 'High Priority',   className: 'highMyTask' };
    if (sisaJam <= 72)  return { label: 'Medium Priority', className: 'mediumMyTask' };
    return               { label: 'Low Priority',    className: 'lowMyTask' };
  };

  const handleTaskClick = (task) => {
    if (task.tipe === 'group' && task.group_id) {
      navigate('/groupproject', { state: { groupId: task.group_id } });
    }
  };

  const handleSelesai = async (e, task) => {
    e.stopPropagation();
    try {
      if (task.tipe === 'group' && task.group_id) {
        await deleteGroup(task.group_id);
        setTasks(prev => prev.filter(t => t.group_id !== task.group_id));
      } else {
        await deleteTask(task.id);
        setTasks(prev => prev.filter(t => t.id !== task.id));
      }
    } catch (err) {
      console.error('Gagal hapus task:', err);
    }
  };

  return (
    <div className="mytaskpage">
      <div className="mytask-wrapper">

        {/* NAVBAR */}
        <div className="navbarMyTask">
          <div className="logoMyTask">
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

            <div className="task-cardMyTask">

              <div className="task-headerMyTask">
                <h2>Your Task</h2>
                <button className="new-task-btn" onClick={() => navigate("/addtask")}>+ New Task</button>
              </div>

              {/* Loading */}
              {loading && (
                <p style={{ color: '#888', fontSize: '0.9rem', padding: '12px' }}>
                  Memuat task...
                </p>
              )}

              {/* Tidak ada task */}
              {!loading && tasks.length === 0 && (
                <p style={{ color: '#888', fontSize: '0.9rem', padding: '12px' }}>
                  Belum ada task. Klik "+ New Task" untuk menambahkan!
                </p>
              )}

              {/* List task dari API */}
              {!loading && tasks.map(task => {
                const priority = getPriority(task.deadline);
                const isGroup = task.tipe === 'group';

                return (
                  <div
                    key={task.id}
                    className="task-itemMyTask"
                    onClick={() => handleTaskClick(task)}
                    style={{ cursor: isGroup ? 'pointer' : 'default' }}
                  >
                    <div className="task-leftMyTask">
                      <h4>{task.judul}</h4> {/* ✅ hapus textDecoration isDone */}
                      {isGroup && (
                        <span style={{ fontSize: '0.75rem', color: '#6366f1', marginLeft: '8px' }}>
                          Group Description
                        </span>
                      )}
                    </div>

                    <div className="task-rightMyTask">
                      <p className="dateMyTask">{formatDeadline(task.deadline)}</p>
                      <div className="task-tagsMyTask">
                        <span className={`type ${isGroup ? 'groupMyTask' : 'personalMyTask'}`}>
                          {isGroup ? 'Group' : 'Personal'}
                        </span>
                        <span className={`priority ${priority.className}`}>
                          {priority.label}
                        </span>
                      </div>

                      {/* ✅ Tombol selesai hanya untuk yang membuat task */}
                      {String(task.created_by) === String(user?.id) && (
                        <button
                          onClick={(e) => handleSelesai(e, task)}
                          style={{
                            marginTop: '6px', fontSize: '0.75rem',
                            padding: '3px 10px', borderRadius: '12px',
                            border: '1px solid #22c55e', color: '#22c55e',
                            background: 'transparent', cursor: 'pointer'
                          }}
                        >
                          ✓ Selesai
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

        </div>
      </div>

      <img src={plant} alt="plant" className="plantMyTask"/>
    </div>
  );
}

export default PageMyTask;
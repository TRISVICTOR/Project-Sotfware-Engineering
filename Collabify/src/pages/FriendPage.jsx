import React, { useState, useEffect } from "react";
import "../styles/FriendPage.css";
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext";
import { getFriends } from "../api/friendApi";

import logo from "../assets/LOGOWB.png"
import plant from "../assets/TanamanPageHome.png"
import people from "../assets/GroupBackground.png"
import home from "../assets/Home.png"
import Mytask from "../assets/MyTask.png"
import Friend from "../assets/Friend.png"
import cowo from "../assets/Cowo.png"
import searchFriend from "../assets/kacaPembesar.png"
import profilePicture from "../assets/profile.png"
import NotificationSound from '../component/NotificationSound';

function PageFriend() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFriends()
      .then(data => setFriends(data))
      .catch(err => console.error('Gagal ambil teman:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredFriends = friends.filter(f =>
    f.nama?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="Friendpage">
      <div className="friend-wrapper">

        <div className="navbarFriend">
          <div className="logoFriend">
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

          <div className="content">

            <h1 className="welcome">Welcome, {user?.nama || 'User'}!</h1>

            <div className="task-cardFriend">

              <div className="task-headerFriend">
                <h2>Your Friend</h2>
                <div className="searchFriend-wrapper">
                  <img src={searchFriend} alt="search" className="search-iconFriend" />
                  <input
                    type="text"
                    placeholder="Search Friend"
                    className="search-inputFriend"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Loading */}
              {loading && (
                <p style={{ color: '#888', fontSize: '0.9rem', padding: '12px' }}>
                  Memuat teman...
                </p>
              )}

              {/* Tidak ada teman */}
              {!loading && friends.length === 0 && (
                <p style={{ color: '#888', fontSize: '0.9rem', padding: '12px' }}>
                  Belum ada teman. Klik "Add Friend" untuk mencari teman!
                </p>
              )}

              {/* List teman dari API */}
              {!loading && (
                <div className="FriendList">
                  {filteredFriends.map((f, index) => (
                    <div key={f.id}
                      className={index % 3 === 0 ? "FriendLeft" : index % 3 === 1 ? "FriendMiddle" : "FriendRight"}>
                      <img src={cowo} alt="friend" className="BoyGirl-Icon"/>
                      <div className="friend-info">
                        <h4>{f.nama || `User #${f.friend_id}`}</h4>  {/* ← pakai f.nama */}
                        <p style={{ fontSize: '0.75rem', color: '#aaa', marginLeft: '10px' }}>{f.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <img src={plant} alt="plant" className="plantMyTask"/>
    </div>
  );
}

export default PageFriend;
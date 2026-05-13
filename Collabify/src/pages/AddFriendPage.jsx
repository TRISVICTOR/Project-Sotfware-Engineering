import React, { useState, useEffect } from "react";
import "../styles/AddFriendPage.css";
import { useNavigate, useLocation } from "react-router-dom"
import { sendFriendRequest, getFriends } from "../api/friendApi";

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

function AddPageFriend() {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [randomUsers, setRandomUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [message, setMessage] = useState('');
  const [addedIds, setAddedIds] = useState([]); // track siapa yang sudah ditambah

  // Ambil user acak & daftar teman saat halaman dibuka
  useEffect(() => {
    // Ambil user acak
    fetch('http://localhost:5000/api/auth/users/random', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setRandomUsers(data))
      .catch(err => console.error('Gagal ambil user acak:', err));

    // Ambil daftar teman yang sudah ada
    getFriends()
      .then(data => {
        const friendIds = data.map(f => f.friend_id);
        setAddedIds(friendIds);
      })
      .catch(err => console.error('Gagal ambil friends:', err));
  }, []);

  // Cari user berdasarkan email
  const handleSearch = async () => {
    if (!search.trim()) {
      setSearchResult(null);
      return;
    }
    setMessage('');
    setSearchResult(null);
    setLoadingSearch(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/search?email=${search}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSearchResult(data);
    } catch (err) {
      setMessage(err.message || 'User tidak ditemukan.');
    } finally {
      setLoadingSearch(false);
    }
  };

  // Tambah teman (langsung accepted)
  const handleTambah = async (friendId) => {
    try {
      await sendFriendRequest(friendId);
      setAddedIds(prev => [...prev, friendId]);
      setSearchResult(null);
      setSearch('');
    } catch (err) {
      setMessage(err.message);
    }
  };

  // List yang ditampilkan: kalau search ada hasil → tampil hasil, kalau tidak → tampil acak
  const displayList = searchResult ? [searchResult] : randomUsers;

  return (
    <div className="AddFriendpage">
      <div className="Addfriend-wrapper">

        <div className="navbarAddFriend">
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
            <h1 className="AddFriend">Add Friend</h1>

            {/* Pesan notifikasi */}
            {message && (
              <p style={{ color: '#6366f1', fontSize: '0.85rem', marginBottom: '4px', marginLeft: '-48px' }}>
                {message}
              </p>
            )}

            <div className="task-cardAddFriend">

              {/* SEARCH */}
              <div className="task-headerAddFriend">
                <div className="searchAddFriend-wrapper">
                  <img src={searchFriend} alt="search" className="search-iconAddFriend" />
                  <input
                    type="text"
                    placeholder="Cari email teman..."
                    className="search-inputAddFriend"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      if (!e.target.value.trim()) setSearchResult(null); // reset kalau kosong
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button
                    onClick={handleSearch}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '12px',
                      border: 'none',
                      background: '#6366f1',
                      color: 'white',
                      cursor: 'pointer',
                      marginLeft: '-63px',
                      fontSize: '0.65rem',
                      whiteSpace: 'nowrap', /* ← agar teks tidak wrap */
                      flexShrink: 0,        /* ← agar tombol tidak mengecil */
                    }}
                  >
                    {loadingSearch ? '...' : 'Cari'}
                  </button>
                </div>
              </div>

              {/* LIST USER */}
              <div className="AddFriendList" style={{ flexWrap: 'wrap', padding: '10px' }}>
                {displayList.map(u => {
                  const sudahTeman = addedIds.includes(u.id);
                  return (
                    <div key={u.id} className="AddFriendLeft"
                      style={{ justifyContent: 'space-between', paddingRight: '10px' }}>

                      {/* Avatar + Nama */}
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={cowo} alt="avatar" className="BoyGirl-Icon"/>
                        <div className="Addfriend-info">
                          <h4>{u.nama}</h4>
                          <p style={{ fontSize: '0.7rem', color: '#aaa', marginLeft: '10px' }}>
                            {u.email}
                          </p>
                        </div>
                      </div>

                      {/* Tombol tambah / sudah teman */}
                      {sudahTeman ? (
                        <span style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: '600' }}>
                          ✓ Teman
                        </span>
                      ) : (
                        <button
                          onClick={() => handleTambah(u.id)}
                          style={{
                            padding: '4px 12px', borderRadius: '10px',
                            border: 'none', background: '#6366f1',
                            color: 'white', cursor: 'pointer', fontSize: '0.8rem'
                          }}
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  );
                })}

                {/* Kalau search tapi tidak ketemu */}
                {search && !searchResult && !loadingSearch && (
                  <p style={{ color: '#aaa', fontSize: '0.85rem', padding: '8px' }}>
                    {message || 'User tidak ditemukan.'}
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      <img src={plant} alt="plant" className="plantMyTask"/>
    </div>
  );
}

export default AddPageFriend;
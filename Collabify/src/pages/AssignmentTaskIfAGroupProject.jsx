import React, { useState, useEffect } from "react";
import "../styles/AssignmentTaskIfAGroupProject.css";
import { useNavigate, useLocation } from "react-router-dom";
import { getGroupById, addMember } from "../api/groupApi";
import { getFriends } from "../api/friendApi";
import { createTask, uploadFileLampiran, updateTask } from "../api/taskApi";
import { useAuth } from "../context/AuthContext";

import logo from "../assets/LOGOWB.png"
import plant from "../assets/TanamanPageHome.png"
import people from "../assets/GroupBackground.png"
import home from "../assets/Home.png"
import Mytask from "../assets/MyTask.png"
import Friend from "../assets/Friend.png"
import cowo from "../assets/Cowo.png"
import plus from "../assets/PlusIcon.png"
import orang from "../assets/logoOrang.png"
import deadlineIcon from "../assets/Deadline.png"
import SendFile from "../assets/SendFIle.png"
import profilePicture from "../assets/profile.png"
import NotificationSound from '../component/NotificationSound';

function AssignmentTaskIfAGroupProject() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const groupId = location.state?.groupId;

  const [group, setGroup] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deadlineKeseluruhan, setDeadlineKeseluruhan] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [uploadingSubmission, setUploadingSubmission] = useState(false);

  // Form
  const [judulAssignment, setJudulAssignment] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [deadlineAssignment, setDeadlineAssignment] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loadingCreate, setLoadingCreate] = useState(false);

  useEffect(() => {
    if (!groupId) return;
    Promise.all([getGroupById(groupId), getFriends()])
      .then(async ([groupData, friendData]) => {
        setGroup(groupData.group);
        setFriends(friendData);

        const currentMemberIds = groupData.members.map(m => m.user_id);
        for (const f of friendData) {
          const friendId = f.friend_id;
          if (friendId && !currentMemberIds.includes(friendId)) {
            try {
              await addMember(groupId, friendId);
              currentMemberIds.push(friendId);
            } catch (err) {}
          }
        }

        const updatedGroup = await getGroupById(groupId);
        setMembers(updatedGroup.members);

        const taskUtama = updatedGroup.tasks.find(
          t => t.judul === groupData.group.nama_group
        );
        const assignmentSaja = updatedGroup.tasks.filter(
          t => t.judul !== groupData.group.nama_group
        );

        // ← sorting di sini
        assignmentSaja.sort((a, b) => {
          const aUrut = String(a.assigned_to) === String(user?.id) ? 0 : 1;
          const bUrut = String(b.assigned_to) === String(user?.id) ? 0 : 1;
          return aUrut - bUrut;
        });

        if (taskUtama) setDeadlineKeseluruhan(taskUtama.deadline);
        setTasks(assignmentSaja);
      })
      .catch(err => console.error('Gagal ambil data group:', err))
      .finally(() => setLoading(false));
  }, [groupId]);

  const formatDeadline = (dateStr) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const fetchSubmissions = async () => {
    if (!groupId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/submissions/${groupId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      console.error('Gagal ambil submissions:', err);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [groupId]);

  const handleUploadSubmission = async () => {
    if (!submissionFile) return;
    setUploadingSubmission(true);
    try {
      const formData = new FormData();
      formData.append('file', submissionFile);
      const res = await fetch(`http://localhost:5000/api/submissions/${groupId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });
      if (!res.ok) throw new Error('Gagal upload');
      setSubmissionFile(null);
      fetchSubmissions(); // refresh list
    } catch (err) {
      console.error('Upload gagal:', err);
    } finally {
      setUploadingSubmission(false);
    }
  };

  const getNama = (userId) => {
    if (String(userId) === String(user?.id)) return user?.nama || 'Saya';
    const friend = friends.find(f => String(f.friend_id) === String(userId));
    return friend?.nama || `User #${userId}`;
  };

  const handleSelesaiAssignment = async (taskId) => {
    try {
      await updateTask(taskId, { status: 'done' });
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'done' } : t));
    } catch (err) {
      console.error('Gagal update assignment:', err);
    }
  };

  const handleCreateAssignment = async () => {
    setError(''); setSuccessMsg('');

    if (!judulAssignment.trim()) { setError('Nama assignment wajib diisi!'); return; }
    if (!assignedTo) { setError('Pilih orang yang bertanggung jawab!'); return; }
    if (!deadlineAssignment) { setError('Deadline wajib diisi!'); return; }

    try {
      setLoadingCreate(true);

      const newTask = await createTask({
        judul: judulAssignment,
        tipe: 'group',
        deadline: deadlineAssignment,
        assigned_to: parseInt(assignedTo),
        group_id: groupId,
      });

      if (selectedFile && newTask.task?.id) {
        await uploadFileLampiran(newTask.task.id, selectedFile);
      }

      // Refresh dengan filter yang sama
      const updatedGroup = await getGroupById(groupId);
      const assignmentSaja = updatedGroup.tasks.filter(
        t => t.judul !== group?.nama_group
      );

      assignmentSaja.sort((a, b) => {
        const aUrut = String(a.assigned_to) === String(user?.id) ? 0 : 1;
        const bUrut = String(b.assigned_to) === String(user?.id) ? 0 : 1;
        return aUrut - bUrut;
      });

      setTasks(assignmentSaja);

      // Reset form
      setJudulAssignment('');
      setAssignedTo('');
      setDeadlineAssignment('');
      setSelectedFile(null);
      setSuccessMsg('Assignment berhasil dibuat!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleDeleteSubmission = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/submissions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchSubmissions();
    } catch (err) {
      console.error('Gagal hapus:', err);
    }
  };

  if (!groupId) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Group tidak ditemukan.</p>
        <button onClick={() => navigate('/mytask')}>Kembali ke MyTask</button>
      </div>
    );
  }

  console.log('Members state saat render:', members);

  return (
    <div className="Assignmentpage">
      <div className="Assignment-wrapper">

        {/* NAVBAR */}
        <div className="navbarAssignment">
          <div className="logoAssignment">
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

            {/* Judul Group + Deadline keseluruhan */}
            <div className="group-header">
              <h2 className="group-title">
                {loading ? 'Memuat...' : group?.nama_group || 'Group Project'}
              </h2>
              {deadlineKeseluruhan && (
                <p className="group-overall-deadline">
                  📅 Deadline keseluruhan: <strong>{formatDeadline(deadlineKeseluruhan)}</strong>
                </p>
              )}
            </div>

            {/* LAYOUT 2 KOLOM */}
            <div className="assignment-layout">

              {/* KIRI — List Assignment */}
              <div className="assignment-list-box">
                <h3 className="box-title">Assignment</h3>

                {loading && <p style={{ color: '#888', fontSize: '0.9rem' }}>Memuat...</p>}

                {!loading && tasks.length === 0 && (
                  <p style={{ color: '#aaa', fontSize: '0.85rem' }}>
                    Belum ada assignment.
                  </p>
                )}

                {!loading && tasks.map(task => (
                  <div className="assignment-item" key={task.id}
                    style={{ opacity: task.status === 'done' ? 0.6 : 1 }}>
                    <div className="assignment-item-left">
                      <img src={cowo} alt="avatar" className="assignment-avatar"/>
                      <span className="assignment-item-name">{getNama(task.assigned_to)}</span>
                    </div>
                    <div className="assignment-item-right">
                      {/* ✅ Coret kalau done */}
                      <p className="assignment-item-title"
                        style={{ textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>
                        {task.judul}
                      </p>
                      <p className="assignment-item-date">{formatDeadline(task.deadline)}</p>
                      {/* ✅ Tombol selesai — hanya tampil kalau belum done */}
                      {task.status !== 'done' && (
                        <button
                          onClick={() => handleSelesaiAssignment(task.id)}
                          style={{
                            marginTop: '4px', fontSize: '0.72rem',
                            padding: '2px 8px', borderRadius: '10px',
                            border: '1px solid #22c55e', color: '#22c55e',
                            background: 'transparent', cursor: 'pointer'
                          }}
                        >
                          ✓ Selesai
                        </button>
                      )}
                    </div>
                    {task.file_lampiran ? (
                      <a href={`http://localhost:5000${task.file_lampiran}`} target="_blank" rel="noreferrer">
                        <img src={SendFile} alt="file" className="assignment-file-icon" style={{ cursor: 'pointer' }}/>
                      </a>
                    ) : (
                      <img src={SendFile} alt="file" className="assignment-file-icon" style={{ opacity: 0.25 }}/>
                    )}
                  </div>
                ))}
              </div>

              {/* KANAN — Form Tambah Assignment */}
              <div className="assignment-form-box">

                <h3 className="box-title">Add Assignment</h3>

                <div style={{ minHeight: '20px', marginBottom: '8px' }}>
                  {error && <p style={{ color: 'red', fontSize: '0.82rem', margin: 0 }}>{error}</p>}
                  {successMsg && <p style={{ color: '#22c55e', fontSize: '0.82rem', margin: 0 }}>{successMsg}</p>}
                </div>

                <div className="form-input-group">
                  <img src={plus} alt="plus" className="form-icon"/>
                  <input
                    type="text"
                    placeholder="Describe detail assignment"
                    className="form-input"
                    value={judulAssignment}
                    onChange={(e) => setJudulAssignment(e.target.value)}
                  />
                </div>

                <h3 className="box-title" style={{ marginTop: '14px' }}>Add Person</h3>

                <div className="form-input-group">
                  <img src={orang} alt="person" className="form-icon"/>
                  <select
                    className="form-input"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                  >
                    <option value="">Select a team member</option>
                    {friends.map(f => (
                      <option key={f.friend_id} value={f.friend_id}>
                        {f.nama || f.email || `User #${f.friend_id}`}
                      </option>
                    ))}
                  </select>
                </div>

                <h3 className="box-title" style={{ marginTop: '14px' }}>Add Deadline</h3>

                <div className="form-input-group">
                  <img src={deadlineIcon} alt="deadline" className="form-icon"/>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={deadlineAssignment}
                    onChange={(e) => setDeadlineAssignment(e.target.value)}
                  />
                </div>

                <div className="form-input-group" style={{ marginTop: '10px' }}>
                  <img src={SendFile} alt="file" className="form-icon"/>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                    className="form-input"
                    style={{ fontSize: '0.82rem' }}
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                </div>

                <button
                  className="create-assignment-btn"
                  onClick={handleCreateAssignment}
                  disabled={loadingCreate}
                >
                  {loadingCreate ? 'Membuat...' : 'Create Assignment'}
                </button>

              </div>
            </div>

            {/* SUBMISSION */}
            <div className="submission-board">
              <h3 className="box-title">Submission</h3>

              {/* Upload */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px' }}>
                <input
                  type="file"
                  onChange={(e) => setSubmissionFile(e.target.files[0])}
                  style={{ fontSize: '0.82rem' }}
                />
                <button
                  onClick={handleUploadSubmission}
                  disabled={!submissionFile || uploadingSubmission}
                  style={{
                    padding: '6px 16px', borderRadius: '10px', border: 'none',
                    background: '#6366f1', color: 'white', cursor: 'pointer',
                    fontSize: '0.82rem', whiteSpace: 'nowrap'
                  }}
                >
                  {uploadingSubmission ? 'Uploading...' : 'Upload'}
                </button>
              </div>

              {/* List file */}
              {submissions.length === 0 && (
                <p style={{ color: '#aaa', fontSize: '0.85rem' }}>Belum ada file yang diupload.</p>
              )}
              {submissions.map(s => (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 12px', borderRadius: '8px', background: '#f5f5f5',
                  border: '1px solid #ddd', marginBottom: '8px'
                }}>
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '0.88rem', margin: 0 }}>{s.nama_file}</p>
                    <p style={{ fontSize: '0.75rem', color: '#888', margin: 0 }}>
                      oleh {s.nama_user} · {new Date(s.createdAt).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a
                      href={`http://localhost:5000${s.path_file}`}
                      download={s.nama_file}
                      style={{
                        padding: '4px 12px', borderRadius: '8px', background: '#22c55e',
                        color: 'white', fontSize: '0.78rem', textDecoration: 'none'
                      }}
                    >
                      Download
                    </a>
                    {String(s.user_id) === String(user?.id) && (
                      <button
                        onClick={() => handleDeleteSubmission(s.id)}
                        style={{
                          padding: '4px 10px', borderRadius: '8px', border: '1px solid #ef4444',
                          color: '#ef4444', background: 'transparent', cursor: 'pointer', fontSize: '0.78rem'
                        }}
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <img src={plant} alt="plant" className="plantMyTask"/>
    </div>
  );
}

export default AssignmentTaskIfAGroupProject;
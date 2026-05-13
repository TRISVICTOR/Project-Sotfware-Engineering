import React, { useState } from "react";
import "../styles/AddTaskPage.css";
import { useNavigate } from "react-router-dom";
import { createTask } from "../api/taskApi";
import { createGroup } from "../api/groupApi";

import logo from "../assets/LOGOWB.png"
import BackgroundAddTask from "../assets/AddtaskBG.png"
import arrow from "../assets/arrow.png"

function AddTaskPage() {
  const navigate = useNavigate();

  const [judulTask, setJudulTask] = useState('');
  const [tipe, setTipe] = useState('personal');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateTask = async () => {
    setError('');

    if (!judulTask.trim()) {
      setError('Nama task wajib diisi!');
      return;
    }
    if (!deadline) {
      setError('Deadline wajib diisi!');
      return;
    }

    try {
      setLoading(true);

      if (tipe === 'group') {
        // Auto buat group baru dengan nama sama seperti task
        const groupData = await createGroup({
          nama_group: judulTask,
          deskripsi: `Group project: ${judulTask}`,
        });

        // Buat task yang terhubung ke group baru
        await createTask({
          judul: judulTask,
          tipe: 'group',
          deadline,
          group_id: groupData.group.id,
        });

      } else {
        // Personal task
        await createTask({
          judul: judulTask,
          tipe: 'personal',
          deadline,
        });
      }

      navigate('/mytask');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addTaskPage">

      <img src={BackgroundAddTask} alt="logo" className="BackGround-logo"/>

      <div className="addTaskWrapper">

        <img src={arrow} alt="back" className="arrow-back" onClick={() => navigate(-1)} />

        <img src={logo} alt="logo" className="addtask-logo" />

        <h2 className="titleAddTask">Add Task</h2>

        {/* Pesan error */}
        <div style={{ minHeight: '24px', marginBottom: '4px', width: '100%' }}>
          {error && (
            <p style={{ color: 'red', fontSize: '0.85rem', margin: 0 }}>
              {error}
            </p>
          )}
        </div>

        {/* Nama Task */}
        <input
          type="text"
          placeholder="Task Name"
          className="input-fieldAddTask"
          value={judulTask}
          onChange={(e) => setJudulTask(e.target.value)}
        />

        {/* Tipe Task */}
        <select
          className="input-fieldAddTask"
          value={tipe}
          onChange={(e) => setTipe(e.target.value)}
        >
          <option value="personal">Personal</option>
          <option value="group">Group</option>
        </select>

        {/* Info kalau Group */}
        {tipe === 'group' && (
          <p style={{
            fontSize: '0.8rem',
            color: '#6366f1',
            marginBottom: '8px',
            marginTop: '-4px'
          }}>
          </p>
        )}

        {/* Deadline */}
        <input
          type="datetime-local"
          className="input-fieldAddTask"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <button
          className="create-btn"
          onClick={handleCreateTask}
          disabled={loading}
        >
          {loading ? 'Membuat Task...' : 'Create Task'}
        </button>

      </div>

    </div>
  );
}

export default AddTaskPage;
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Buat task baru (personal atau group)
exports.createTask = async (req, res) => {
  try {
    const { judul, deskripsi, tipe, deadline, assigned_to, group_id } = req.body;

    const task = await Task.create({
      judul, deskripsi, tipe, deadline,
      created_by: req.user.id,
      assigned_to: tipe === 'group' ? (assigned_to || req.user.id) : req.user.id,
      group_id: tipe === 'group' ? group_id : null,
    });

    // Kirim notifikasi ke orang yang ditugaskan (jika group)
    if (tipe === 'group' && assigned_to && assigned_to !== req.user.id) {
      await Notification.create({
        user_id: assigned_to,
        pesan: `Kamu ditugaskan pada task: "${judul}"`,
        tipe: 'task_assigned',
        task_id: task.id,
      });
    }

    res.status(201).json({ message: 'Task berhasil dibuat!', task });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Ambil semua task milik user (MyTask page)
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { assigned_to: req.user.id },
      order: [['deadline', 'ASC']],
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Ambil 1 task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task tidak ditemukan.' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task tidak ditemukan.' });

    await task.update(req.body);
    res.json({ message: 'Task diupdate!', task });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Hapus task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task tidak ditemukan.' });

    await task.destroy();
    res.json({ message: 'Task dihapus.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
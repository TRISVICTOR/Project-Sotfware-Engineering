const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/auth');
const Task = require('../models/Task');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/Tasks/'); // ← huruf T kapital sesuai foldermu
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg','image/png','image/jpg','application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Tipe file tidak diizinkan!'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/task/:taskId', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Tidak ada file.' });
    const task = await Task.findByPk(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task tidak ditemukan.' });
    await task.update({ file_lampiran: `/uploads/tasks/${req.file.filename}` });
    res.json({ message: 'File berhasil diupload!', url: `/uploads/tasks/${req.file.filename}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
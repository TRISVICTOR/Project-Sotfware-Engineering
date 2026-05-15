const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const Submission = require('../models/Submission');
const User = require('../models/User');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.use(authMiddleware);

// Upload submission
router.post('/:groupId', upload.single('file'), async (req, res) => {
  try {
    const submission = await Submission.create({
      group_id: req.params.groupId,
      user_id: req.user.id,
      nama_file: req.file.originalname,
      path_file: `/uploads/${req.file.filename}`,
    });
    res.json({ message: 'File berhasil diupload!', submission });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Ambil semua submission milik group
router.get('/:groupId', async (req, res) => {
  try {
    const submissions = await Submission.findAll({
      where: { group_id: req.params.groupId },
      order: [['createdAt', 'DESC']],
    });

    // Ambil nama user tiap submission
    const result = await Promise.all(submissions.map(async (s) => {
      const user = await User.findByPk(s.user_id, { attributes: ['nama'] });
      return { ...s.toJSON(), nama_user: user?.nama || `User #${s.user_id}` };
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Hapus submission (hanya milik sendiri)
router.delete('/:id', async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Tidak ditemukan.' });
    if (submission.user_id !== req.user.id) return res.status(403).json({ message: 'Bukan milikmu.' });
    await submission.destroy();
    res.json({ message: 'Submission dihapus.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
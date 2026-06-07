const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);

router.get('/search', authMiddleware, async (req, res) => {
  try {
    const User = require('../models/User');
    const { email } = req.query;
    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'nama', 'email']
    });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/update', authMiddleware, async (req, res) => {
  try {
    const User = require('../models/User');
    const bcrypt = require('bcryptjs');
    const { email, password, passwordLama } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan.' });

    const isMatch = await bcrypt.compare(passwordLama, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Password lama salah!' });

    const updateData = {};

    if (email && email !== user.email) {
      const emailExist = await User.findOne({ where: { email } });
      if (emailExist) return res.status(400).json({ message: 'Email sudah dipakai akun lain!' });
      updateData.email = email;
    }

    if (password) {
      if (password.length < 6) return res.status(400).json({ message: 'Password baru minimal 6 karakter!' });
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (req.body.nama) updateData.nama = req.body.nama;

    await user.update(updateData);
    res.json({ message: 'Akun berhasil diupdate!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/users/random', authMiddleware, async (req, res) => {
  try {
    const User = require('../models/User');
    const { Op } = require('sequelize');
    const users = await User.findAll({
      where: { id: { [Op.ne]: req.user.id } },
      attributes: ['id', 'nama', 'email'],
      order: [['createdAt', 'DESC']],
      limit: 100,
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Register
exports.register = async (req, res) => {
  try {
    const { nama, email, password } = req.body;

    const userExist = await User.findOne({ where: { email } });
    if (userExist) return res.status(400).json({ message: 'Email sudah terdaftar.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ nama, email, password: hashedPassword });

    res.status(201).json({ message: 'Registrasi berhasil!', user: { id: user.id, nama: user.nama, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Email tidak ditemukan.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Password salah.' });

    const token = jwt.sign(
      { id: user.id, nama: user.nama, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ message: 'Login berhasil!', token, user: { id: user.id, nama: user.nama, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Ambil profil sendiri
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
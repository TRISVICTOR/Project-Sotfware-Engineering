const Friend = require('../models/Friend');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Kirim permintaan pertemanan
exports.sendRequest = async (req, res) => {
  try {
    const { friend_id } = req.body;

    if (friend_id === req.user.id)
      return res.status(400).json({ message: 'Tidak bisa menambahkan diri sendiri.' });

    const sudahAda = await Friend.findOne({
      where: { user_id: req.user.id, friend_id }
    });
    if (sudahAda)
      return res.status(400).json({ message: 'Sudah berteman!' });

    // Langsung accepted tanpa perlu konfirmasi
    await Friend.create({ user_id: req.user.id, friend_id, status: 'accepted' });
    // Buat juga relasi sebaliknya agar dua arah
    await Friend.create({ user_id: friend_id, friend_id: req.user.id, status: 'accepted' });

    res.json({ message: 'Berhasil menambahkan teman!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Terima atau tolak permintaan
exports.respondRequest = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' atau 'rejected'
    const request = await Friend.findByPk(req.params.id);

    if (!request) return res.status(404).json({ message: 'Permintaan tidak ditemukan.' });

    await request.update({ status });
    res.json({ message: `Permintaan ${status === 'accepted' ? 'diterima' : 'ditolak'}.` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Ambil semua teman
exports.getFriends = async (req, res) => {
  try {
    const User = require('../models/User');
    const friends = await Friend.findAll({
      where: { user_id: req.user.id, status: 'accepted' }
    });

    // Ambil detail nama & email tiap teman
    const friendDetails = await Promise.all(
      friends.map(async (f) => {
        const user = await User.findByPk(f.friend_id, {
          attributes: ['id', 'nama', 'email']
        });
        return { ...f.toJSON(), nama: user?.nama, email: user?.email };
      })
    );

    res.json(friendDetails);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Ambil permintaan pertemanan masuk
exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await Friend.findAll({
      where: { friend_id: req.user.id, status: 'pending' }
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
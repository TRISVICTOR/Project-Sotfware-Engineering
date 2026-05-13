const Notification = require('../models/Notification');

// Ambil semua notifikasi milik user
exports.getNotifications = async (req, res) => {
  try {
    const notifs = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Tandai 1 notifikasi sudah dibaca
exports.markAsRead = async (req, res) => {
  try {
    await Notification.update(
      { is_read: true },
      { where: { id: req.params.id, user_id: req.user.id } }
    );
    res.json({ message: 'Notifikasi ditandai sudah dibaca.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Tandai semua notifikasi sudah dibaca
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { is_read: true },
      { where: { user_id: req.user.id } }
    );
    res.json({ message: 'Semua notifikasi sudah dibaca.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
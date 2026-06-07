const Notification = require('../models/Notification');

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
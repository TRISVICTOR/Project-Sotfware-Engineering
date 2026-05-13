const express = require('express');
const router = express.Router();
const { createTask, getMyTasks, getTaskById, updateTask, deleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/', createTask);
router.get('/my', getMyTasks);

router.post('/test-notif', async (req, res) => {
  const Notification = require('../models/Notification');
  await Notification.create({
    user_id: req.user.id,
    pesan: '⏰ Test notifikasi deadline 24 jam!',
    tipe: 'deadline_24jam',
    task_id: null,
  });
  res.json({ message: 'Notif test dibuat!' });
});

router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
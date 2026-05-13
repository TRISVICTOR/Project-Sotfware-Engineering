const cron = require('node-cron');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const { Op } = require('sequelize');

const startDeadlineChecker = () => {

  // ─── Notifikasi 24 & 12 jam (cek setiap 1 menit) ───────────────
  cron.schedule('* * * * *', async () => {
    const sekarang = new Date();

    // 24 jam: window ±1 menit
    const jam24Mulai = new Date(sekarang.getTime() + (23 * 60 + 59) * 60 * 1000);
    const jam24Akhir = new Date(sekarang.getTime() + (24 * 60 + 1) * 60 * 1000);
    const tasks24Jam = await Task.findAll({
      where: { deadline: { [Op.between]: [jam24Mulai, jam24Akhir] }, status: { [Op.ne]: 'done' } },
    });
    for (const task of tasks24Jam) {
      const sudahAda = await Notification.findOne({
        where: { task_id: task.id, tipe: 'deadline_24jam' }, // ✅ tanpa batasan waktu
      });
      if (!sudahAda) {
        await Notification.create({
          user_id: task.assigned_to,
          pesan: `⏰ Deadline task "${task.judul}" kurang dari 24 jam lagi!`,
          tipe: 'deadline_24jam', task_id: task.id,
        });
        console.log(`🔔 Notif 24jam dikirim untuk task "${task.judul}"`);
      }
    }

    // 12 jam: window ±1 menit
    const jam12Mulai = new Date(sekarang.getTime() + (11 * 60 + 59) * 60 * 1000);
    const jam12Akhir = new Date(sekarang.getTime() + (12 * 60 + 1) * 60 * 1000);
    const tasks12Jam = await Task.findAll({
      where: { deadline: { [Op.between]: [jam12Mulai, jam12Akhir] }, status: { [Op.ne]: 'done' } },
    });
    for (const task of tasks12Jam) {
      const sudahAda = await Notification.findOne({
        where: { task_id: task.id, tipe: 'deadline_12jam' }, // ✅ tanpa batasan waktu
      });
      if (!sudahAda) {
        await Notification.create({
          user_id: task.assigned_to,
          pesan: `🚨 Deadline task "${task.judul}" kurang dari 12 jam lagi!`,
          tipe: 'deadline_12jam', task_id: task.id,
        });
        console.log(`🔔 Notif 12jam dikirim untuk task "${task.judul}"`);
      }
    }
  });

  // ─── AUTO HAPUS task expired (cek setiap 10 detik) ─────────────
  cron.schedule('*/10 * * * * *', async () => {
    const sekarang = new Date();
    const tasksExpired = await Task.findAll({
      where: { deadline: { [Op.lt]: sekarang }, status: { [Op.ne]: 'done' } },
    });
    for (const task of tasksExpired) {
      await Notification.destroy({ where: { task_id: task.id } });
      await task.destroy();
      console.log(`🗑️ Task "${task.judul}" dihapus karena melewati deadline`);
    }
  });

  console.log('✅ Deadline checker aktif');
};

module.exports = startDeadlineChecker;
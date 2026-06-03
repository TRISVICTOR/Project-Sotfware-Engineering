const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const sequelize = require('./src/config/db');
const startDeadlineChecker = require('./src/utils/deadlineChecker');

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/tasks', require('./src/routes/tasks'));
app.use('/api/groups', require('./src/routes/groups'));
app.use('/api/friends', require('./src/routes/friends'));
app.use('/api/notifications', require('./src/routes/notifications'));
app.use('/api/upload', require('./src/routes/upload'));
app.use('/api/submissions', require('./src/routes/submissions'));

// Koneksi Database
sequelize.sync({ force: false })  // ✅ Ganti alter: true dengan force: false
  .then(() => {
    console.log('✅ MySQL terhubung & tabel siap!');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server berjalan di port ${process.env.PORT}`);
      startDeadlineChecker();
    });
  })
  .catch(err => console.error('❌ Gagal koneksi MySQL:', err));
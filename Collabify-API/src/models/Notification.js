const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pesan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipe: {
    type: DataTypes.ENUM('deadline_24jam', 'deadline_12jam', 'friend_request', 'task_assigned'),
    allowNull: false,
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  task_id: {
    type: DataTypes.INTEGER,
    defaultValue: null,
  },
}, { timestamps: true });

module.exports = Notification;
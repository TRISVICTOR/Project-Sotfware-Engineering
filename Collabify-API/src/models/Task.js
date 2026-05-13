const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  judul: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deskripsi: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
  tipe: {
    type: DataTypes.ENUM('personal', 'group'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('todo', 'in_progress', 'done'),
    defaultValue: 'todo',
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  assigned_to: {
    type: DataTypes.INTEGER,
    defaultValue: null,
  },
  group_id: {
    type: DataTypes.INTEGER,
    defaultValue: null,
  },
  file_lampiran: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
}, { timestamps: true });

module.exports = Task;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const GroupProject = sequelize.define('GroupProject', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nama_group: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deskripsi: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, { timestamps: true });

const GroupMember = sequelize.define('GroupMember', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('owner', 'member'),
    defaultValue: 'member',
  },
}, { timestamps: true });

module.exports = { GroupProject, GroupMember };
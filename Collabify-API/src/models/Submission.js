const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Submission = sequelize.define('Submission', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  group_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  nama_file: { type: DataTypes.STRING, allowNull: false },
  path_file: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: true });

module.exports = Submission;
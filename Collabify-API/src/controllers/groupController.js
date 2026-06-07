const { GroupProject, GroupMember } = require('../models/GroupProject');
const Task = require('../models/Task');
const User = require('../models/User');

exports.createGroup = async (req, res) => {
  try {
    const { nama_group, deskripsi } = req.body;

    const group = await GroupProject.create({
      nama_group, deskripsi,
      created_by: req.user.id,
    });

    await GroupMember.create({ group_id: group.id, user_id: req.user.id, role: 'owner' });

    res.status(201).json({ message: 'Group berhasil dibuat!', group });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMyGroups = async (req, res) => {
  try {
    const memberships = await GroupMember.findAll({ where: { user_id: req.user.id } });
    const groupIds = memberships.map(m => m.group_id);
    const groups = await GroupProject.findAll({ where: { id: groupIds } });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const group = await GroupProject.findByPk(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group tidak ditemukan.' });

    const members = await GroupMember.findAll({ where: { group_id: group.id } });
    const tasks = await Task.findAll({ where: { group_id: group.id } });

    const membersWithDetail = await Promise.all(
      members.map(async (m) => {
        const user = await User.findByPk(m.user_id, {
          attributes: ['id', 'nama', 'email']
        });
        return { ...m.toJSON(), nama: user?.nama, email: user?.email };
      })
    );

    res.json({ group, members: membersWithDetail, tasks });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { user_id } = req.body;
    const group_id = req.params.id;

    const sudahAda = await GroupMember.findOne({
      where: { group_id, user_id }
    });
    if (sudahAda) {
      return res.json({ message: 'User sudah ada di group.' });
    }

    await GroupMember.create({ group_id, user_id, role: 'member' });
    res.json({ message: 'Anggota berhasil ditambahkan!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    await GroupMember.destroy({
      where: { group_id: req.params.id, user_id: req.params.userId }
    });
    res.json({ message: 'Anggota dihapus dari group.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const group_id = req.params.id;
    
    await Task.destroy({ where: { group_id } });
    
    await GroupMember.destroy({ where: { group_id } });
    
    await GroupProject.destroy({ where: { id: group_id } });
    
    res.json({ message: 'Group dan semua task dihapus.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
const express = require('express');
const router = express.Router();
const { createGroup, getMyGroups, getGroupById, addMember, removeMember, deleteGroup } = require('../controllers/groupController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/', createGroup);
router.get('/my', getMyGroups);
router.get('/:id', getGroupById);
router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);
router.delete('/:id', deleteGroup);

module.exports = router;
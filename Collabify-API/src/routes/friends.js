const express = require('express');
const router = express.Router();
const { sendRequest, respondRequest, getFriends, getPendingRequests } = require('../controllers/friendController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/request', sendRequest);
router.put('/request/:id', respondRequest);
router.get('/', getFriends);
router.get('/pending', getPendingRequests);

module.exports = router;
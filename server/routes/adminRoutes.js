const express = require('express');
const { getStats } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/stats', protectAdmin, getStats);

module.exports = router;

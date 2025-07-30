const express = require('express');
const router = express.Router();

const { adminLogin, getStats } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/adminMiddleware');

// ✅ تسجيل الدخول
router.post('/login', adminLogin);

// ✅ الإحصائيات (محمية)
router.get('/stats', protectAdmin, getStats);

module.exports = router;

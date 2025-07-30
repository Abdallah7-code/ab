const express = require('express');
const router = express.Router();

const { adminLogin, getStats } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/adminMiddleware');
const Technician = require('../models/technicianModel'); // 👈 تأكد من وجود هذا الاستيراد

// ✅ تسجيل الدخول
router.post('/login', adminLogin);

// ✅ الإحصائيات (محمية)
router.get('/stats', protectAdmin, getStats);

// ✅ جلب الفنيين
router.get('/technicians', protectAdmin, async (req, res) => {
  try {
    console.log('✅ GET /api/admin/technicians');
    const technicians = await Technician.find();
    res.status(200).json({ technicians });
  } catch (error) {
    console.error('❌ Error fetching technicians:', error);
    res.status(500).json({ message: 'فشل في تحميل الفنيين' });
  }
});

module.exports = router;

// server/routes/authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// توليد توكن JWT
const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// تسجيل مستخدم جديد (يمكن حصرها على admins أو فتحها للعموم حسب اختيارك)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // تأكد من عدم وجود مستخدم بنفس الإيميل
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'الإيميل مستخدم مسبقاً' });

    const user = await User.create({ name, email, password, role });
    const token = signToken(user._id, user.role);

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في التسجيل', error: err.message });
  }
});

// تسجيل الدخول
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'الرجاء إدخال الإيميل وكلمة المرور' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });

    const isCorrect = await user.correctPassword(password);
    if (!isCorrect) return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });

    const token = signToken(user._id, user.role);
    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في تسجيل الدخول', error: err.message });
  }
});

module.exports = router;

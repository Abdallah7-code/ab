const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const AppError = require('../utils/appError');

const adminLogin = async (req, res, next) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return next(new AppError('البريد الإلكتروني غير صحيح', 401));
  }

  // ✅ المقارنة الصحيحة
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return next(new AppError('كلمة المرور غير صحيحة', 401));
  }

  const token = jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: '90d' }
  );

  res.status(200).json({
    success: true,
    token,
    data: {
      id: admin._id,
      email: admin.email,
      role: admin.role
    }
  });
};

const getStats = async (req, res) => {
  res.status(200).json({
    users: 100,
    technicians: 50,
    services: 30
  });
};

module.exports = {
  adminLogin,
  getStats
};

// server/controllers/adminController.js

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const AppError = require('../utils/appError');

const adminLogin = async (req, res, next) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (!admin || admin.password !== password) {
    return next(new AppError('بيانات الدخول غير صحيحة', 401));
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
      role: admin.role,
      email: admin.email
    }
  });
};

// ✅ يجب التصدير بهذا الشكل
module.exports = {
  adminLogin
};

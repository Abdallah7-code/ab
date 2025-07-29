// server/models/Admin.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'كلمة المرور مطلوبة'],
    minlength: [6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل']
  }
});

// تشفير كلمة المرور قبل الحفظ
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// مقارنة كلمة المرور المدخلة مع المشفرة
adminSchema.methods.correctPassword = async function (candidatePassword, adminPassword) {
  return await bcrypt.compare(candidatePassword, adminPassword);
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;

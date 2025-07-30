const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'كلمة المرور مطلوبة'],
    minlength: 6,
  },
  role: {
    type: String,
    default: 'admin',
  }
});

// قبل حفظ المسؤول، نقوم بتشفير كلمة المرور
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('Admin', adminSchema);

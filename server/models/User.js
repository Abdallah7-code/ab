const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'يرجى إدخال الاسم']
  },
  email: {
    type: String,
    required: [true, 'يرجى إدخال البريد الإلكتروني'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'يرجى إدخال كلمة المرور'],
    minlength: 6,
    select: false // لإخفاء كلمة المرور عند جلب المستخدم
  },
  role: {
    type: String,
    enum: ['admin', 'customer'],
    default: 'customer'
  }
});

// 🔐 تشفير كلمة المرور قبل الحفظ
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // لا تشفر إذا لم تتغير
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);

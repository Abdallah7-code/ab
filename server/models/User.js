const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'الاسم مطلوب'],
    trim: true,
    maxlength: [50, 'الاسم لا يمكن أن يتجاوز 50 حرفًا']
  },
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'بريد إلكتروني غير صالح'],
    maxlength: [100, 'البريد الإلكتروني لا يمكن أن يتجاوز 100 حرف']
  },
  password: {
    type: String,
    required: [true, 'كلمة المرور مطلوبة'],
    minlength: [8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'],
    select: false // لا تُرجَع كلمة المرور عند الاستعلام
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  role: {
    type: String,
    enum: ['admin', 'technician', 'customer'],
    default: 'customer'
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(v);
      },
      message: 'رقم هاتف غير صالح'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Middleware لتشفير كلمة المرور
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000; // تأخير ثانية لتجنب مشاكل التوكن
  next();
});

// Middleware عند تحديث كلمة المرور
userSchema.pre('findOneAndUpdate', async function(next) {
  if (this._update.password) {
    this._update.password = await bcrypt.hash(this._update.password, 12);
    this._update.passwordChangedAt = Date.now();
  }
  next();
});

// مقارنة كلمات المرور
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// التحقق إذا تم تغيير كلمة المرور بعد إصدار التوكن
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// إنشاء توكن إعادة تعيين كلمة المرور
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 دقائق
  
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
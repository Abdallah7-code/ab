const jwt = require('jsonwebtoken');
const User = require('../server/models/User'); // تأكد من المسار حسب هيكل مجلداتك
const dotenv = require('dotenv');
dotenv.config(); // تحميل متغيرات البيئة

// 🔐 إنشاء التوكن
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// 📩 تسجيل مستخدم جديد
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // التحقق من عدم تكرار الإيميل
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'البريد الإلكتروني مستخدم بالفعل'
      });
    }

    // إنشاء مستخدم
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer'
    });

    const token = signToken(user._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// 🔐 تسجيل دخول
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // التحقق من وجود القيم
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور'
      });
    }

    // البحث عن المستخدم
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'البريد الإلكتروني غير صحيح'
      });
    }

    // التحقق من صحة كلمة المرور
    const isMatch = await user.correctPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'fail',
        message: 'كلمة المرور غير صحيحة'
      });
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err.message
    });
  }
};

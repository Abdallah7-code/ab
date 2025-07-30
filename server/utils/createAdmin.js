require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin'); // تأكد من صحة المسار

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    const email = 'admin1@example.com';
    const password = 'Test@2025';

    // حذف المسؤول إذا كان موجودًا مسبقًا
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      await Admin.deleteOne({ email });
      console.log('🗑️ Existing admin deleted');
    }

    // إنشاء كلمة مرور مشفّرة
    const hashedPassword = await bcrypt.hash(password, 12);

    // إنشاء مسؤول جديد
    const admin = new Admin({
      name: 'مدير النظام',
      email,
      password: hashedPassword,
      role: 'admin',
    });

    await admin.save();
    console.log('✅ Admin created successfully');
    process.exit();
  })
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });

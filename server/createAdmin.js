require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
 // تأكد من أن هذا المسار صحيح ويؤدي إلى موديل المسؤول

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ Connected to MongoDB');

  const email = 'admin@example.com'; // غيّر الإيميل إذا أردت
  const password = '123456'; // غيّر الباسورد لأمان أعلى

  // تحقق هل يوجد مسؤول بنفس البريد
  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    console.log('⚠️ Admin already exists');
    process.exit();
  }

  // إنشاء مسؤول جديد
  const hashedPassword = await bcrypt.hash(password, 12);
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

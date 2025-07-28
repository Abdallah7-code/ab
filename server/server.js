require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


// إنشاء تطبيق Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.path}`);
  next();
});

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes - تأكد من أن الملفات التالية تُصدر Router صحيح
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/technicians', require('./routes/technicianRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Route للاختبار
app.get('/', (req, res) => {
  res.send('🚀 Server is running!');
});

// تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

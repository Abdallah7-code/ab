const express = require('express');
const router = express.Router();
const Technician = require('../models/Technician');
const { authorize } = require('../middlewares/authorize');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/appError');

// 1. استخدام asyncHandler لتبسيط معالجة الأخطاء
// 2. إضافة صلاحيات لكل endpoint
// 3. تحسين استجابة الأخطاء

// ✅ إضافة فني (مخصص للمسؤول فقط)
router.post(
  '/',
  authorize('manage_technicians'), // الصلاحية المطلوبة
  asyncHandler(async (req, res, next) => {
    const { name, specialty, email, phone } = req.body;
    
    // التحقق من البريد الإلكتروني المكرر
    const existingTech = await Technician.findOne({ email });
    if (existingTech) {
      return next(new AppError('البريد الإلكتروني مسجل مسبقاً', 400));
    }

    const newTech = await Technician.create({ 
      name, 
      specialty, 
      email, 
      phone,
      addedBy: req.user.id // تسجيل المسؤول الذي أضاف الفني
    });

    res.status(201).json({
      success: true,
      data: newTech
    });
  })
);

// ✅ جلب كل الفنيين (مسموح للجميع مع فلترة حسب الصلاحيات)
router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    // بناء query بناءً على صلاحية المستخدم
    let query = Technician.find();
    
    // إذا كان مستخدم عادي، لا يعرض إلا الفنيين المتاحين
    if (req.user.role === 'customer') {
      query = query.where('isAvailable').equals(true);
    }
    
    // إذا كان فني، لا يعرض بيانات حساسة
    if (req.user.role === 'technician') {
      query = query.select('-__v -createdAt');
    }

    const techs = await query;

    res.json({
      success: true,
      count: techs.length,
      data: techs
    });
  })
);

router.post(
  '/:id/reviews',
  authorize('rate_technicians'), // للعملاء فقط
  asyncHandler(async (req, res, next) => {
    const { rating, comment } = req.body;
    const tech = await Technician.findById(req.params.id);
    
    if (!tech) {
      return next(new AppError('الفني غير موجود', 404));
    }

    tech.reviews.push({
      user: req.user.id,
      rating,
      comment
    });

    // تحديث متوسط التقييم
    tech.rating = tech.reviews.reduce((acc, item) => item.rating + acc, 0) / tech.reviews.length;
    
    await tech.save();
    
    res.status(201).json({
      success: true,
      data: tech.reviews
    });
  })
);

module.exports = router;
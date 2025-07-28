// ملف جديد bookingRoutes.js
router.post(
  '/',
  authorize('create_orders'),
  asyncHandler(async (req, res, next) => {
    const { technicianId, date, problemDescription } = req.body;
    
    const tech = await Technician.findById(technicianId);
    if (!tech || !tech.isAvailable) {
      return next(new AppError('الفني غير متاح حالياً', 400));
    }

    const booking = await Booking.create({
      user: req.user.id,
      technician: technicianId,
      date,
      problemDescription,
      status: 'pending'
    });

    // إرسال إشعار للفني
    await sendNotificationToTechnician(tech._id, booking._id);

    res.status(201).json({
      success: true,
      data: booking
    });
  })
);
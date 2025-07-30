const Technician = require('../models/Technician');
const AppError = require('../utils/appError');

exports.createTechnician = async (req, res, next) => {
  try {
    const technician = await Technician.create(req.body);
    res.status(201).json({
      success: true,
      data: technician
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllTechnicians = async (req, res, next) => {
  try {
    const technicians = await Technician.find()
      .populate('user', 'name email')
      .populate('services', 'name description price');
    res.status(200).json({
      success: true,
      count: technicians.length,
      data: technicians
    });
  } catch (err) {
    next(err);
  }
};

exports.updateTechnician = async (req, res, next) => {
  try {
    const technician = await Technician.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!technician) return next(new AppError('الفني غير موجود', 404));

    res.status(200).json({ success: true, data: technician });
  } catch (err) {
    next(err);
  }
};

exports.deleteTechnician = async (req, res, next) => {
  try {
    const technician = await Technician.findByIdAndDelete(req.params.id);
    if (!technician) return next(new AppError('الفني غير موجود', 404));

    res.status(200).json({ success: true, message: 'تم حذف الفني' });
  } catch (err) {
    next(err);
  }
};

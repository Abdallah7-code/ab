// routes/statsRoutes.js
const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/adminAuth');

const User = require('../models/User');
const Technician = require('../models/Technician');
const Service = require('../models/Service');

router.get('/api/admin/stats', adminAuth, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const technicianCount = await Technician.countDocuments();
    const serviceCount = await Service.countDocuments();

    res.json({
      success: true,
      data: {
        users: userCount,
        technicians: technicianCount,
        services: serviceCount,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
});

module.exports = router;

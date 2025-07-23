const express = require('express');
const router = express.Router();
const Technician = require('../models/Technician');

// ✅ إضافة فني
router.post('/', async (req, res) => {
  try {
    const { name, specialty, email, phone } = req.body;
    const newTech = new Technician({ name, specialty, email, phone });
    await newTech.save();
    res.status(201).json(newTech);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ جلب كل الفنيين
router.get('/', async (req, res) => {
  try {
    const techs = await Technician.find();
    res.json(techs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
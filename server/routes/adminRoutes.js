const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.post('/login', adminLogin); // POST /api/admin/login

module.exports = router;

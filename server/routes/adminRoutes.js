const express = require('express');
const { adminLogin } = require('../adminController');

const router = express.Router();

router.post('/login', adminLogin); // POST /api/admin/login

module.exports = router;

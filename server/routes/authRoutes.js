const express = require('express');
const router = express.Router();

// مثال على مسار تسجيل دخول
router.post('/login', (req, res) => {
  res.json({ message: 'Login route working' });
});

module.exports = router;

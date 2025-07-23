const jwt = require('jsonwebtoken');
const config = require('../config/db');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        status: 'fail', 
        message: 'الرجاء تسجيل الدخول' 
      });
    }

    const decoded = await jwt.verify(token, config.secretOrKey);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: 'توكن غير صالح'
    });
  }
};
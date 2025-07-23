const jwt = require('jsonwebtoken');
const User = require('../server/models/User');
const config = require('../config/db');

const signToken = id => {
  return jwt.sign({ id }, config.secretOrKey, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const user = await User.create({
      name,
      email,
      password,
      role: req.body.role || 'customer'
    });

    const token = signToken(user._id);
    
    res.status(201).json({
      status: 'success',
      token,
      data: { user }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      throw new Error('Please provide email and password');
    }
    
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new Error('Incorrect email or password');
    }
    
    const token = signToken(user._id);
    
    res.status(200).json({
      status: 'success',
      token,
      data: { user }
    });
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err.message
    });
  }
};
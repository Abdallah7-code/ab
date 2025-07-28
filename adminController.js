const jwt = require('jsonwebtoken');

const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  // بيانات تسجيل دخول ثابتة مؤقتًا (يمكنك لاحقًا سحبها من DB)
  if (username === 'admin' && password === 'super123') {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    return res.status(200).json({ token });
  } else {
    return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
  }
};

module.exports = { adminLogin };

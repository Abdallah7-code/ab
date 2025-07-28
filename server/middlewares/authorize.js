const { checkPermission } = require('../config/roles');

module.exports = (requiredPermission) => {
  return (req, res, next) => {
    // 1. التحقق من وجود المستخدم
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'غير مصرح بالوصول - يرجى تسجيل الدخول' 
      });
    }

    // 2. التحقق من الصلاحية
    const hasPermission = checkPermission(req.user.role, requiredPermission);
    
    if (!hasPermission) {
      return res.status(403).json({ 
        success: false,
        message: 'ليس لديك صلاحية للقيام بهذا الإجراء' 
      });
    }

    next();
  };
};
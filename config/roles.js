module.exports = {
  roles: {
    admin: {
      permissions: [
        'manage_users',
        'manage_technicians',
        'manage_services',
        'view_reports',
        'edit_any_content'
      ]
    },
    technician: {
      permissions: [
        'manage_own_profile',
        'view_assigned_orders',
        'update_order_status',
        'upload_work_reports'
      ]
    },
    customer: {
      permissions: [
        'manage_own_profile',
        'create_orders',
        'view_own_orders',
        'rate_technicians'
      ]
    }
  },

  // دالة للتحقق من الصلاحيات
  checkPermission: (role, requiredPermission) => {
    const rolePermissions = this.roles[role]?.permissions || [];
    return rolePermissions.includes(requiredPermission);
  }
};
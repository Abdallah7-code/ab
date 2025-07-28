// في utils/notifications.js
const sendNotification = async (userId, message) => {
  const user = await User.findById(userId);
  if (user.fcmToken) {
    await admin.messaging().send({
      token: user.fcmToken,
      notification: {
        title: 'إشعار جديد',
        body: message
      }
    });
  }
  
  // حفظ الإشعار في قاعدة البيانات
  await Notification.create({
    user: userId,
    message,
    read: false
  });
};
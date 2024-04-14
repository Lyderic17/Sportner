const Notification = require('../../models/notifications.model');
const { io } = require('../../server');


async function getNotifications(req, res){
  try {
    const userId = req.params.userId;
    console.log( req.params.userId, "should get here");
    const notifications = await Notification.find({ senderId: userId }).sort({ createdAt: -1 });
    console.log(notifications," notiffffy")
    //io.emit('notifications', { message: 'New notifications available' });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

async function markNotificationAsRead(req, res){
  try {
    const notificationId = req.params.notificationId;
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    notification.read = true;
    await notification.save();
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

async function deleteNotification(req, res){
  try {
    const notificationId = req.params.notificationId;
    const notification = await Notification.findById(notificationId);
    console.log(notification)
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    await notification.deleteOne();
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { deleteNotification,markNotificationAsRead, getNotifications}
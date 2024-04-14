const express = require('express');
const router = express.Router();
const notificationsController = require('../../controller/likes/notificationsController');

router.get('/:userId', notificationsController.getNotifications);
router.put('/:notificationId/read', notificationsController.markNotificationAsRead);
router.delete('/delete/:notificationId', notificationsController.deleteNotification);

module.exports = router;

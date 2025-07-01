const express = require("express");
const router = express.Router();
const notificationController = require("../../controllers/Notification/Mail_And_Web_Notification-controller");

router.post("/send-notifications", notificationController.sendCourseAndQuizNotifications);
router.post("/my-notifications", notificationController.getNotificationsByUserId);

module.exports = router;

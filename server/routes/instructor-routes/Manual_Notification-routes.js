const express = require("express");
const { sendNotificationToUser, sendNotificationToAllUsers, getNotificationsByEmail} = require("../../controllers/instructor-controller/Manual_Notification-controller");
const { authentication } = require("../../middleware/auth-middleware")
const router = express.Router();

// Endpoint to send email and web notifications
router.post("/send-to-user", sendNotificationToUser);
router.post("/send-to-all", sendNotificationToAllUsers);
// router.get("/email-notification", authentication, getNotificationsByEmail);

module.exports = router;

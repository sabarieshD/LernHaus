const express = require("express");
const { sendManualNotifications } = require("../../controllers/instructor-controller/Manual_Notification-controller");
const router = express.Router();

// Endpoint to send email and web notifications
router.post("/send-manualNotifications", sendManualNotifications);

module.exports = router;

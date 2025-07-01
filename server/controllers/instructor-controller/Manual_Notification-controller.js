const nodemailer = require("nodemailer");
const User = require("../../models/User"); // User model
const Notification = require("../../models/Manual_Notification"); // Notification model

// Email sending function
const sendEmailNotification = async (email, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: `Email sent to ${email}` };
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error);
    return { success: false, message: `Error sending email to ${email}` };
  }
};

// Web notification function (Unchanged)
const sendWebNotification = async (recipientId, title, message) => {
  try {
    const notification = new Notification({
      recipientId,
      type: "General",
      title: title,
      message: message,
    });

    await notification.save();
    return { success: true, message: "Web notification sent successfully" };
  } catch (error) {
    console.error("Error sending web notification:", error);
    return { success: false, message: "Error sending web notification" };
  }
};

// Send notification to an **individual user**
exports.sendNotificationToUser = async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "Email, subject, and message are required.",
    });
  }

  try {
    const user = await User.findOne({ userEmail: email }, "_id userEmail");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const emailResult = await sendEmailNotification(user.userEmail, subject, message);
    const webNotificationResult = await sendWebNotification(user._id, subject, message);

    return res.status(200).json({
      success: emailResult.success && webNotificationResult.success,
      message: "Notification sent to the user successfully.",
    });
  } catch (error) {
    console.error("Error sending notification to user:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while sending notification.",
    });
  }
};

// Send notifications to **all users**
exports.sendNotificationToAllUsers = async (req, res) => {
  const { subject, message } = req.body;

  if (!subject || !message) {
    return res.status(400).json({
      success: false,
      message: "Both subject and message are required.",
    });
  }

  try {
    // Fetch all users from the database
    const users = await User.find({}, "_id userEmail");

    if (!users.length) {
      return res.status(404).json({ success: false, message: "No users found." });
    }

    const emailPromises = users.map((user) =>
      sendEmailNotification(user.userEmail, subject, message)
    );

    const webNotificationPromises = users.map((user) =>
      sendWebNotification(user._id, subject, message)
    );

    const emailResults = await Promise.all(emailPromises);
    const webNotificationResults = await Promise.all(webNotificationPromises);

    // Count successful emails and web notifications
    const emailSuccessCount = emailResults.filter((result) => result.success).length;
    const webSuccessCount = webNotificationResults.filter((result) => result.success).length;

    return res.status(200).json({
      success: true,
      message: `Emails sent to ${emailSuccessCount} users, and web notifications sent to ${webSuccessCount} users.`,
    });
  } catch (error) {
    console.error("Error sending notifications:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while sending notifications.",
    });
  }
};


exports.getNotificationsByEmail = async (req, res) => {
  try {
    const email = req.query.email || req.user?.email; // Fallback to query param
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    console.log("Fetching notifications for:", email); // Debugging

    const notifications = await Notification.find({ recipientEmail: email })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching notifications.",
    });
  }
};

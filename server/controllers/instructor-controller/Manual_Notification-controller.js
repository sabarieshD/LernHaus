const nodemailer = require("nodemailer");
const Notification = require("../../models/Manual_Notification");

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
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Error sending email" };
  }
};

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

exports.sendManualNotifications = async (req, res) => {
  const { email, recipientId, subject, message } = req.body;

  if (!email || !recipientId || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields (email, recipientId, subject, message) are required.",
    });
  }

  try {
    const emailResult = await sendEmailNotification(email, subject, message);
    const webNotificationResult = await sendWebNotification(recipientId, subject, message);

    if (emailResult.success && webNotificationResult.success) {
      return res.status(200).json({
        success: true,
        message: "Email and web notification sent successfully.",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Error sending notifications.",
      });
    }
  } catch (error) {
    console.error("Error during notification sending:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during notification sending",
    });
  }
};

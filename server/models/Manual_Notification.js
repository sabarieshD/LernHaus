const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming the recipient is a user
      required: true,
    },
    type: {
      type: String,
      enum: ["General", "Reminder", "Alert", "Info"], // You can add more types as needed
      default: "General",
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false, // To track if the notification has been read
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Manual_Notification", notificationSchema);

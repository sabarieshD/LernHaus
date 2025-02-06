const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["Course", "Quiz", "Assignment", "General"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "type",
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    frequency: {
      type: String,
      enum: ["Immediate", "Daily", "Weekly", "Monthly"], // Predefined options for frequency
      default: "Immediate", // Default to "Immediate" if not set
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);

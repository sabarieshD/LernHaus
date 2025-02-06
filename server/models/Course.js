const mongoose = require("mongoose");

const LectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, 
  },
  videoUrl: {
    type: String,
    required: true, 
  },
  public_id: {
    type: String,
    required: true, 
  },
  freePreview: {
    type: Boolean,
    default: false, 
  },
});

const CourseSchema = new mongoose.Schema({
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  instructorName: {
    type: String,
    required: true, 
  },
  date: {
    type: Date,
    default: Date.now, 
  },
  title: {
    type: String,
    required: true, 
    unique: true, 
  },
  category: {
    type: String,
    required: true, 
  },
  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"], 
    required: true,
  },
  primaryLanguage: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    required: true, 
  },
  image: {
    type: String, 
    default: "",
  },
  welcomeMessage: {
    type: String,
    default: "Welcome to the course!", 
  },
  pricing: {
    type: Number,
    required: true,
    min: 0, 
  },
  objectives: {
    type: String,
    default: "",
  },
  students: [
    {
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
      },
      studentName: {
        type: String,
        required: true,
      },
      studentEmail: {
        type: String,
        required: true,
      },
      paidAmount: {
        type: Number,
        default: 0, 
      },
    },
  ],
  curriculum: {
    type: [LectureSchema],
    default: [], 
  },
  isPublished: {
    type: Boolean,
    default: false, 
  },
  lastNotificationSent: {
    type: Date,
    default: null, 
  },
});

module.exports = mongoose.model("Course", CourseSchema);

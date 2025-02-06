const mongoose = require("mongoose");

const courseReviewSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course", 
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  rating: {
    type: Number, 
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String, 
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CourseReview", courseReviewSchema);

const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz.questions", 
    required: true,
  },
  answer: {
    type: String, 
    required: true,
  },
  isCorrect: {
    type: Boolean, 
    required: true,
  },
  pointsEarned: {
    type: Number, 
    required: true,
    default: 0,
  },
});

const quizSubmissionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz", 
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", 
      required: true,
    },
    responses: {
      type: [responseSchema], 
      required: true,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    totalScore: {
      type: Number, 
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    feedback: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("QuizSubmission", quizSubmissionSchema);

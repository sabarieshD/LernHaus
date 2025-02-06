const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth-middleware");
const quizController = require("../../controllers/student-controller/quizzes-controller");

// Route to fetch quiz details
router.get("/:quizId", authMiddleware, quizController.getQuiz);

// Route to submit quiz answers
router.post("/:quizId/submit", authMiddleware, quizController.submitQuizAnswers);

module.exports = router;

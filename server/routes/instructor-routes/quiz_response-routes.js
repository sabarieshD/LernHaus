const express = require("express");
const router = express.Router();
const quizController = require("../../controllers/student-controller/Quiz-response-controller");
const authMiddleware = require("../../middleware/auth-middleware");

// Route to get all results for a student
router.get("/results", authMiddleware, quizController.getAllResultsForStudent); //passed

// Route to get results for a specific course
router.get("/results/course/:courseId", authMiddleware, quizController.getResultsForSpecificCourse); //passed

// Route to get result for a specific quiz
router.get("/results/quiz/:quizId", authMiddleware, quizController.getResultForSpecificQuiz); //passed

router.get('/results/:studentId/:quizId', authMiddleware, quizController.getQuizResultsForStudent);

router.get("/results/student/:studentId", quizController.getAllQuizResultsForStudent);

module.exports = router;

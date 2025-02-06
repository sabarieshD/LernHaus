const express = require("express");
const {
  addNewCourse,
  getAllCourses,
  getCourseDetailsByID,
  updateCourseByID,
  getCourseBoughtById,
} = require("../../controllers/instructor-controller/course-controller");

const {
  createQuiz,
  assignTiming,
  getUpcomingQuiz,
  evaluateQuiz,
  updateQuestions,
  deleteQuiz
} = require("../../controllers/instructor-controller/Quiz-controller");
const authMiddleware = require("../../middleware/auth-middleware");

const router = express.Router();

router.post("/add", addNewCourse);
router.get("/get", getAllCourses);
router.get("/get/details/:id", getCourseDetailsByID);
router.get("/get/students-details/:courseId", getCourseBoughtById);
router.put("/update/:id", updateCourseByID);

router.post("/", authMiddleware, createQuiz); //passed
router.put("/:id/timing", authMiddleware, assignTiming); //passed
router.get('/quizzes/upcoming', getUpcomingQuiz); //passed
//Evaluation is done during quiz submission by the student
router.put("/:id/questions", authMiddleware, updateQuestions);  //--need to work upon this --//
router.delete("/:id", authMiddleware, deleteQuiz); //passed

module.exports = router;

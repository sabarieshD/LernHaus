const express = require("express");
const {
  getCurrentCourseProgress,
  markCurrentLectureAsViewed,
  resetCurrentCourseProgress,
  downloadCertificate
} = require("../../controllers/student-controller/course-progress-controller");

const { getCourseAndStudentName } = require("../../controllers/student-controller/courseName_StudentName-controller");
const router = express.Router();

// Existing routes
router.get("/get/:userId/:courseId", getCurrentCourseProgress);
router.post("/mark-lecture-viewed", markCurrentLectureAsViewed);
router.post("/reset-progress", resetCurrentCourseProgress);

// New route for downloading the certificate
router.get("/download-certificate/:userId/:courseId", downloadCertificate);

router.get("/course/:courseId/student/:userId", getCourseAndStudentName);

module.exports = router;

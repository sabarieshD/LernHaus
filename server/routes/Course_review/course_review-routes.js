const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth-middleware");
const courseReviewController = require("../../controllers/Course_Review/course_review-controller");


router.get("/", courseReviewController.getOverallReviewsForAllCourses);
// Add a new review
router.post("/add", courseReviewController.addReview); // passed

// Get all reviews for a course
router.get("/:courseId", courseReviewController.getReviewsForCourse);  // passed

router.get("/:courseId/review", courseReviewController.getOverallReview); // passed

// Update a review
router.put("/:reviewId", authMiddleware, courseReviewController.updateReview); //passed

// Delete a review
router.delete("/:reviewId", authMiddleware, courseReviewController.deleteReview); // passed

module.exports = router;

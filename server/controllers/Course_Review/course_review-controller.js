const mongoose = require("mongoose");
const CourseReview = require("../../models/course_review");
const Course = require("../../models/Course");


exports.addReview = async (req, res) => {
    try {
      const { courseId, rating, review, studentId } = req.body;

  
      if (!studentId) {
        return res.status(400).json({ message: "Student ID is required and missing in the request." });
      }
  
      const existingReview = await CourseReview.findOne({ courseId, studentId });
      if (existingReview) {
        return res.status(400).json({ message: "You have already reviewed this course." });
      }
  
      const newReview = new CourseReview({
        courseId: new mongoose.Types.ObjectId(courseId), 
        studentId: new mongoose.Types.ObjectId(studentId), 
        rating,
        review,
      });
  
      await newReview.save();
  
      res.status(201).json({ message: "Review added successfully", review: newReview });
    } catch (error) {
      res.status(500).json({ message: "Failed to add review", error: error.message });
    }
  };


exports.getReviewsForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
  
      const reviews = await CourseReview.find({ courseId })
        .populate("studentId", "name email") 
        .sort({ createdAt: -1 }); 
  
      if (reviews.length === 0) {
        return res.status(404).json({ message: "No reviews found for this course." });
      }
  
      res.status(200).json({ message: "Reviews fetched successfully", reviews });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
    }
  };

  
  exports.getOverallReviewsForAllCourses = async (req, res) => {
    try {
      // Aggregate reviews to calculate average ratings and total reviews for each course
      const reviews = await CourseReview.aggregate([
        {
          $group: {
            _id: "$courseId", // Group by courseId
            averageRating: { $avg: "$rating" }, // Calculate average rating
            totalReviews: { $sum: 1 }, // Count total reviews
          },
        },
        {
          $lookup: {
            from: "courses", // MongoDB collection name for courses
            localField: "_id", // courseId from CourseReview
            foreignField: "_id", // _id field in Course
            as: "courseDetails", // Field name for joined data
          },
        },
        {
          $unwind: "$courseDetails", // Deconstruct the array
        },
        {
          $project: {
            courseId: "$_id",
            title: "$courseDetails.title",
            category: "$courseDetails.category",
            averageRating: { $round: ["$averageRating", 2] }, // Round to 2 decimal places
            totalReviews: 1,
          },
        },
      ]);
  
      // Check if no reviews found
      if (reviews.length === 0) {
        return res.status(404).json({ message: "No reviews found for any course." });
      }
  
      // Respond with aggregated results
      res.status(200).json({
        message: "Overall reviews fetched successfully",
        reviews,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch overall reviews", error: error.message });
    }
  };
  

  
exports.updateReview = async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { rating, review } = req.body;
      const studentId = req.user.id;
  
      const updatedReview = await CourseReview.findOneAndUpdate(
        { _id: reviewId, studentId },
        { rating, review },
        { new: true } 
      );
  
      if (!updatedReview) {
        return res.status(404).json({ message: "Review not found or unauthorized." });
      }
  
      res.status(200).json({ message: "Review updated successfully", review: updatedReview });
    } catch (error) {
      res.status(500).json({ message: "Failed to update review", error: error.message });
    }
  };

exports.deleteReview = async (req, res) => {
    try {
      const { reviewId } = req.params;
      const studentId = req.user.id;
  
      const deletedReview = await CourseReview.findOneAndDelete({ _id: reviewId, studentId });
  
      if (!deletedReview) {
        return res.status(404).json({ message: "Review not found or unauthorized." });
      }
  
      res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete review", error: error.message });
    }
  };

exports.getOverallReview = async (req, res) => {
    try {
      const { courseId } = req.params;
  
      const result = await CourseReview.aggregate([
        { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
        {
          $group: {
            _id: "$courseId",
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ]);
  
      if (result.length === 0) {
        return res.status(404).json({ message: "No reviews found for this course." });
      }
  
      res.status(200).json({
        message: "Overall review fetched successfully",
        averageRating: result[0].averageRating.toFixed(2),
        totalReviews: result[0].totalReviews,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch overall review", error: error.message });
    }
  };
  

  

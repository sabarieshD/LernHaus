const mongoose = require("mongoose");
const Course = require("../../models/Course"); // Adjust path based on project structure
const User = require("../../models/User"); // Adjust path based on project structure

const getCourseAndStudentName = async (req, res) => {
    try {
      const { courseId, userId } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid courseId or userId." });
      }
  
      const course = await Course.findById(courseId).select("title");
      if (!course) {
        return res.status(404).json({ message: "Course not found." });
      }
  
      const user = await User.findById(userId).select("userName");
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      res.status(200).json({
        courseName: course.title,
        studentName: user.userName,
      });
    } catch (error) {
      console.error("Error fetching course or student details:", error);
      res.status(500).json({ message: "Error fetching course or student details.", error });
    }
  };
  
  module.exports = { getCourseAndStudentName };
  

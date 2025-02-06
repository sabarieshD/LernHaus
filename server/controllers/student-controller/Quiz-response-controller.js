const QuizResult = require("../../models/Quiz_responses");
const mongoose = require("mongoose");


exports.getAllQuizResultsForStudent = async (req, res) => {
  try {
    console.log("before studentId");
    const { studentId } = req.params;
    console.log("received studentId", studentId);
    // Validate if studentId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid Student ID format." });
    }

    // Fetch quiz results
    const quizResults = await QuizResult.find({ studentId })
      .populate("quizId", "title description")  
      .populate("courseId", "name")
      .sort({ submittedAt: -1 });

    if (!quizResults.length) {
      return res.status(200).json({
        message: "No quiz submissions found for this student.",
        submissionFound: false,
      });
    }

    res.status(200).json({
      message: "Quiz results fetched successfully.",
      count: quizResults.length,
      results: quizResults,
    });
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    res.status(500).json({
      message: "Failed to fetch quiz results",
      error: error.message,
    });
  }
};




exports.getAllResultsForStudent = async (req, res) => {
  try {
    const studentId = req.user.id; 

    const results = await QuizResult.find({ studentId })
      .populate("quizId", "title description")
      .populate("courseId", "name") 
      .sort({ submittedAt: -1 }); 

    if (!results || results.length === 0) {
      return res.status(200).json({
        message: "No quiz submission found for this student.",
        submissionFound: false,  // You can also return 0 here if you prefer
      });
    }

    res.status(200).json({ 
      message: "Results fetched successfully", 
      count: results.length, 
      results 
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch results", error: error.message });
  }
};

exports.getResultsForSpecificCourse = async (req, res) => {
  try {
    const studentId = req.user.id; 
    const { courseId } = req.params; 

    const results = await QuizResult.find({ studentId, courseId })
      .populate("quizId", "title description") 
      .sort({ submittedAt: -1 }); 

    if (!results || results.length === 0) {
      return res.status(200).json({
        message: "No quiz submission found for this student.",
        submissionFound: false,  // You can also return 0 here if you prefer
      });
    }

    res.status(200).json({ 
      message: "Results fetched successfully", 
      count: results.length, 
      results 
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch results", error: error.message });
  }
};

exports.getResultForSpecificQuiz = async (req, res) => {
  try {
    const studentId = req.user.id; 
    const { quizId } = req.params; 

    const result = await QuizResult.findOne({ studentId, quizId })
      .populate("courseId", "name") 
      .populate("quizId", "title description"); 

    if (!result) {
      return res.status(200).json({
        message: "No quiz submission found for this student.",
        submissionFound: false,  // You can also return 0 here if you prefer
      });
    }

    res.status(200).json({ 
      message: "Result fetched successfully", 
      result 
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch result", error: error.message });
  }
};


exports.getQuizResultsForStudent = async (req, res) => {
  try {
    const { studentId, quizId } = req.params;

    // Check if a quiz submission exists for the student and quiz
    const quizSubmission = await QuizResult.findOne({
      studentId: new mongoose.Types.ObjectId(studentId),
      quizId: new mongoose.Types.ObjectId(quizId),
    });

    // Return true if submission is found, false otherwise
    if (quizSubmission) {
      return res.status(200).json({
        submissionFound: true,  // Submission exists
      });
    } else {
      return res.status(200).json({
        submissionFound: false,  // No submission found
      });
    }
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    return res.status(500).json({
      submissionFound: false,  // Return false in case of an error
      message: "Failed to fetch quiz results",
      error: error.message,
    });
  }
};


const Quiz = require("../../models/Quiz");


exports.createQuiz = async (req, res) => {
  try {
    const { title, description, questions, startTime, endTime, courseId, createdBy } = req.body;

    const quiz = new Quiz({
      title,
      description,
      questions,
      startTime,
      endTime,
      courseId,
      createdBy, 
    });
    console.log(createdBy);
    await quiz.save();
    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    res.status(500).json({ message: "Failed to create quiz", error: error.message });
  }
};


exports.assignTiming = async (req, res) => {
  try {
    const { startTime, endTime } = req.body;

    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { startTime, endTime },
      { new: true }
    );

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json({ message: "Timing assigned successfully", quiz });
  } catch (error) {
    res.status(500).json({ message: "Failed to assign timing", error: error.message });
  }
};

exports.getUpcomingQuiz = async (req, res) => {
    try {
      const currentTime = new Date();
  
      const quizzes = await Quiz.find({
        endTime: { $gt: currentTime },
      }).sort({ startTime: 1 }); 
  
      console.log("Fetched quizzes:", quizzes);
  
      if (quizzes.length === 0) {
        return res.status(404).json({ message: "No upcoming quizzes found" });
      }
  
      res.status(200).json({ 
        message: "Upcoming quizzes found", 
        count: quizzes.length, 
        quizzes 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quizzes", error: error.message });
    }
  };
  
  
  exports.evaluateQuiz = async (req, res) => {
    try {
      const quizId = req.body.quizId || req.params.quizId;
      const { answers } = req.body;  
  
      if (!quizId) {
        return res.status(400).json({ message: "Quiz ID is required" });
      }
  
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
  
      let score = 0;
  
      quiz.questions.forEach((question) => {
        const userAnswer = answers[question._id]; 
        if (userAnswer && userAnswer === question.correctAnswer) {
          score += question.points;  
        }
      });
  
      res.status(200).json({ message: "Quiz evaluated successfully", score });
    } catch (error) {
      res.status(500).json({ message: "Failed to evaluate quiz", error: error.message });
    }
  };
  

exports.updateQuestions = async (req, res) => {
    try {
      const { questions } = req.body; 
      const quiz = await Quiz.findById(req.params.id);
  
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
  
      questions.forEach((updatedQuestion) => {
        const question = quiz.questions.id(updatedQuestion._id);
        if (question) {
          question.text = updatedQuestion.text || question.text;
          question.type = updatedQuestion.type || question.type;
          question.correctAnswer = updatedQuestion.correctAnswer || question.correctAnswer;
          question.points = updatedQuestion.points || question.points;
  
          if (updatedQuestion.options) {
            question.options = updatedQuestion.options;
          }
        }
      });
  
      await quiz.save(); 
  
      res.status(200).json({ message: "Questions updated successfully", quiz });
    } catch (error) {
      res.status(500).json({ message: "Failed to update questions", error: error.message });
    }
  };
  
  
  

exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete quiz", error: error.message });
  }
};

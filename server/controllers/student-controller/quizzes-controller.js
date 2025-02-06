const Quiz = require("../../models/Quiz");
const QuizSubmission = require("../../models/Quiz_responses");
const QuizParticipation = require("../../models/Quiz_responses_notification");


exports.getQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const now = new Date();
    if (quiz.startTime > now || quiz.endTime < now) {
      return res.status(400).json({ message: "Quiz is not currently active." });
    }

    const quizData = {
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions.map((question) => ({
        text: question.text,
        type: question.type,
        options: question.options, 
      })),
    };

    res.status(200).json({ quiz: quizData });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch quiz", error: error.message });
  }
};



exports.submitQuizAnswers = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers, studentId, courseId } = req.body;

    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({ message: "Answers are required." });
    }

    // Find the quiz by ID
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }

    // Validate quiz timing
    const currentTime = new Date();
    if (quiz.startTime > currentTime || quiz.endTime < currentTime) {
      return res.status(400).json({ message: "Quiz is not currently active." });
    }

    // Calculate the score and prepare responses
    let score = 0;
    const totalScore = quiz.questions.reduce((sum, q) => sum + q.points, 0);

    const responses = quiz.questions.map((question) => {
      const userAnswer = answers[question._id]; // Match user answer with question ID
      const isCorrect = userAnswer && userAnswer === question.correctAnswer; // Check correctness

      if (isCorrect) {
        score += question.points; // Increment score for correct answers
      }

      return {
        questionId: question._id,
        answer: userAnswer || "", // Default to an empty string if no answer provided
        isCorrect,
        pointsEarned: isCorrect ? question.points : 0,
      };
    });

    // Save quiz submission
    const quizSubmission = new QuizSubmission({
      studentId,
      quizId,
      courseId,
      responses,
      score,
      totalScore,
    });

    await quizSubmission.save();

    // Check if participation already exists
    const existingParticipation = await QuizParticipation.findOne({ studentId, quizId, courseId });
    if (!existingParticipation) {
      // Save participation in QuizParticipation DB
      const quizParticipation = new QuizParticipation({
        studentId,
        quizId,
        courseId,
      });
      await quizParticipation.save();
    }

    res.status(200).json({
      message: "Quiz submitted and evaluated successfully.",
      score,
      totalScore,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit quiz.",
      error: error.message,
    });
  }
};

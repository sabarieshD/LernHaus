const nodemailer = require('nodemailer');
const axios = require('axios');
const moment = require('moment');
const ManualNotification = require('../../models/Manual_Notification')

const getNotificationsByUserId = async (req, res) => {
  try {
    const { id } = req.body;

    // Validate input
    if (!id) {
      return res.status(400).json({ 
        success: false,
        message: "User ID is required in request body" 
      });
    }

    // No need to find user first if recipientId matches directly
    const notifications = await ManualNotification.find({
      recipientId: id // Directly use the ID from request
    })
    .sort({ createdAt: -1 })
    .lean();

    return res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });

  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message 
    });
  }
};

const sendEmailNotification = async (studentEmail, title, message) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,  // Your email
      pass: process.env.EMAIL_PASS,  // Your email password or app-specific password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,  // Sender address
    to: studentEmail,              // Receiver address
    subject: title,                // Subject line
    text: message,                 // Email body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to: ${studentEmail}`);
  } catch (error) {
    console.error(`Error sending email to ${studentEmail}:`, error);
    throw new Error('Failed to send email notification');
  }
};

const sendCourseAndQuizNotifications = async (req, res) => {
  try {
    const now = moment();
    const notificationsSent = [];

    // Fetch upcoming quizzes
    const quizzesResponse = await axios.get("http://localhost:5000/instructor/course/quizzes/upcoming");

    // Log the entire response data to check its structure
    console.log("Quizzes Response:", quizzesResponse.data);

    // Use quizzesResponse.data.quizzes to get the quizzes array
    const quizzes = quizzesResponse.data.quizzes;

    // Ensure quizzes is an array
    if (!Array.isArray(quizzes)) {
      return res.status(500).json({ message: "Invalid response format for quizzes" });
    }

    if (quizzes.length === 0) {
      return res.status(404).json({ message: "No upcoming quizzes found" });
    }

    for (let quiz of quizzes) {
      const quizEndTime = moment(quiz.endTime);
      const timeDifference = quizEndTime.diff(now, 'hours');

      if (timeDifference >= 0) {
        const quizMessage = `Reminder: The quiz for the course "${quiz.courseTitle}" is coming up soon. Don't forget to submit it before ${quizEndTime.format("MMMM Do YYYY, h:mm:ss a")}.`;

        // Fetch students' details using courseId
        const courseResponse = await axios.get(`http://localhost:5000/instructor/course/get/students-details/${quiz.courseId}`);
        const students = courseResponse.data.data; // Assuming the students are in the "data" field

        // Check if students is an array
        if (!Array.isArray(students)) {
          console.log(`No students found for quiz: ${quiz.title}`);
          continue;
        }

        if (students.length === 0) {
          console.log(`No students found for quiz: ${quiz.title}`);
          continue;
        }

        // Iterate through each student and send the notification
        for (let student of students) {
          const { studentEmail, studentId } = student;

          if (!studentEmail) {
            console.log(`No email found for student ID: ${studentId}`);
            continue;
          }

          // Send email notification irrespective of quiz completion status
          await sendEmailNotification(studentEmail, `Upcoming Quiz: ${quiz.title}`, quizMessage);

          notificationsSent.push({
            studentEmail,
            studentId,
            quizTitle: quiz.title,
            courseTitle: quiz.courseTitle,
            message: quizMessage,
          });
        }
      }
    }

    res.status(200).json({
      message: 'Notifications sent successfully',
      notifications: notificationsSent,
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ error: 'An error occurred while sending notifications' });
  }
};

module.exports = {getNotificationsByUserId, sendCourseAndQuizNotifications};
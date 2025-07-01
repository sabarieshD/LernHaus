require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
// const cookieSession = require("cookie-session");
const session = require("express-session");
const { createServer } = require("http");
const { Server } = require("socket.io");

// Route imports
const authRoutes = require("./routes/auth-routes/index");
const mediaRoutes = require("./routes/instructor-routes/media-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const manualNotificationsRoutes = require("./routes/instructor-routes/Manual_Notification-routes");
const QuizResponseRoutes = require("./routes/instructor-routes/quiz_response-routes");
const studentViewCourseRoutes = require("./routes/student-routes/course-routes");
const studentViewOrderRoutes = require("./routes/student-routes/order-routes");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");
const studentQuizsRoutes = require("./routes/student-routes/quiz-routes");
const CourseReviewRoutes = require("./routes/Course_review/course_review-routes");
const DiscussionForumRoutes = require("./routes/Discussion_Forum/Discussion_Forum-routes");
const NotificationRoutes = require("./routes/Notification-routes/Notification");

// Passport configuration
// require("./config/passport"); 

const app = express();
const server = createServer(app); // Use HTTP server for Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB is connected"))
  .catch((e) => console.log(e));

  
// Middleware configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credientials: true,
  })
);
app.use(express.json());

// app.use(
// 	cookieSession({
// 		name: "session",
// 		keys: ["cyberwolve"],
// 		maxAge: 24 * 60 * 60 * 100,
// 	})
// );

app.use(
  session({
    secret: "your-secret-key", // Replace with a secure key
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Attach `io` to `req` for broadcasting events from controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Route config
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/instructor/notification", manualNotificationsRoutes);
app.use("/student/QuizResponse", QuizResponseRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/order", studentViewOrderRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);
app.use("/student/quiz", studentQuizsRoutes);
app.use("/courseReview", CourseReviewRoutes);
app.use("/discussion", DiscussionForumRoutes);
app.use("/notification", NotificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});


io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("discussionMessage", (data) => {
    console.log("New discussion message:", data);
    io.emit("discussionMessage", data); // Broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});

const CourseProgress = require("../../models/CourseProgress");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

const markCurrentLectureAsViewed = async (req, res) => {
  try {
    const { userId, courseId, lectureId } = req.body;

    let progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress) {
      progress = new CourseProgress({
        userId,
        courseId,
        lecturesProgress: [
          {
            lectureId,
            viewed: true,
            dateViewed: new Date(),
          },
        ],
      });
      await progress.save();
    } else {
      const lectureProgress = progress.lecturesProgress.find(
        (item) => item.lectureId === lectureId
      );

      if (lectureProgress) {
        lectureProgress.viewed = true;
        lectureProgress.dateViewed = new Date();
      } else {
        progress.lecturesProgress.push({
          lectureId,
          viewed: true,
          dateViewed: new Date(),
        });
      }
      await progress.save();
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const allLecturesViewed =
      progress.lecturesProgress.length === course.curriculum.length &&
      progress.lecturesProgress.every((item) => item.viewed);

    if (allLecturesViewed) {
      progress.completed = true;
      progress.completionDate = new Date();

      await progress.save();
    }

    res.status(200).json({
      success: true,
      message: "Lecture marked as viewed",
      data: progress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const studentPurchasedCourses = await StudentCourses.findOne({ userId });

    const isCurrentCoursePurchasedByCurrentUserOrNot =
      studentPurchasedCourses?.courses?.findIndex(
        (item) => item.courseId === courseId
      ) > -1;

    if (!isCurrentCoursePurchasedByCurrentUserOrNot) {
      return res.status(200).json({
        success: true,
        data: {
          isPurchased: false,
        },
        message: "You need to purchase this course to access it.",
      });
    }

    const currentUserCourseProgress = await CourseProgress.findOne({
      userId,
      courseId,
    });

    if (
      !currentUserCourseProgress ||
      currentUserCourseProgress?.lecturesProgress?.length === 0
    ) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "No progress found, you can start watching the course",
        data: {
          courseDetails: course,
          progress: [],
          isPurchased: true,
        },
      });
    }

    const courseDetails = await Course.findById(courseId);

    res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: currentUserCourseProgress.lecturesProgress,
        completed: currentUserCourseProgress.completed,
        completionDate: currentUserCourseProgress.completionDate,
        isPurchased: true,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};


const resetCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const progress = await CourseProgress.findOne({ userId, courseId });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found!",
      });
    }

    progress.lecturesProgress = [];
    progress.completed = false;
    progress.completionDate = null;

    await progress.save();

    res.status(200).json({
      success: true,
      message: "Course progress has been reset",
      data: progress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const Progress = require("../../models/CourseProgress");
const axios = require("axios");


const downloadCertificate = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const courseAndStudentResponse = await axios.get(`http://localhost:5000/student/course-progress/course/${courseId}/student/${userId}`);
    const { courseName, studentName } = courseAndStudentResponse.data;

    if (!courseName || !studentName) {
      return res.status(404).json({ message: "Course or student details not found." });
    }

    const progress = await Progress.findOne({ userId, courseId });
    if (!progress || !progress.completed) {
      return res.status(400).json({ message: "Course not completed. Certificate cannot be generated." });
    }

    const { completionDate, lecturesProgress } = progress;
    const certificateId = `CERT-${courseId}-${userId}-${Date.now()}`;

    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margins: { top: 30, left: 30, right: 30, bottom: 30 },
    });

    const filePath = path.join(__dirname, `temp-certificate-${certificateId}.pdf`);
    const logoPath = path.join(__dirname, "../../asserts/image.png");
    const signaturePath = path.join(__dirname, "../../asserts/sign-removebg.png");

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#f7f9fc");

    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke("#c5c5c5");

    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 40, 40, { width: 100 });
    }

    doc.font("Helvetica-Bold")
      .fontSize(40)
      .fillColor("#333")
      .text("Course Completion Certificate", 0, 100, { align: "center" });

    doc.moveDown(2)
      .fontSize(24)
      .font("Helvetica")
      .text("Awarded to:", { align: "center" })
      .moveDown(0)
      .fontSize(28)
      .font("Helvetica-Bold")
      .fillColor("#0073e6")
      .text(studentName, { align: "center" });

    doc.moveDown(1)
      .fontSize(20)
      .font("Helvetica")
      .fillColor("#333")
      .text("For successfully completing the course:", { align: "center" })
      .moveDown(0.5)
      .fontSize(24)
      .font("Helvetica-Bold")
      .text(courseName, { align: "center" });

    doc.moveDown(1)
      .fontSize(16)
      .font("Helvetica")
      .fillColor("#555")
      .text(`Completion Date: ${completionDate.toDateString()}`, { align: "center" })
      .text(`Certificate ID: ${certificateId}`, { align: "center" });

    doc.moveDown(1)
      .fontSize(18)
      .font("Helvetica")
      .fillColor("#333")
      .text(`Lectures Completed: ${lecturesProgress.filter((l) => l.viewed).length}`, { align: "center" });

    doc.moveTo(doc.page.width - 180, doc.page.height - 120) 
      .font("Helvetica-Bold")
      .fontSize(18)
      .fillColor("#333")
      .text("Authorized Signature", { align: "right" });

    if (fs.existsSync(signaturePath)) {
      doc.image(signaturePath, doc.page.width - 180, doc.page.height - 100, { width: 100 });
    }

    doc.end();

    writeStream.on("finish", () => {
      res.download(filePath, "certificate.pdf", (err) => {
        if (err) {
          console.error("Error downloading file:", err);
        }
        fs.unlinkSync(filePath); 
      });
    });
  } catch (error) {
    console.error("Error generating certificate:", error);
    res.status(500).json({ message: "Error generating certificate.", error });
  }
};


module.exports = {
  markCurrentLectureAsViewed,
  getCurrentCourseProgress,
  resetCurrentCourseProgress,
  downloadCertificate,
};

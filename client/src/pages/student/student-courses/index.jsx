import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentBoughtCoursesService, getCurrentCourseProgressService } from "@/services";
import { Watch, Download, Star } from "lucide-react"; 
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StudentCoursesPage() {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } = useContext(StudentContext);
  const navigate = useNavigate();
  const [courseCompletionStatus, setCourseCompletionStatus] = useState({});
  const [courseAndStudentDetails, setCourseAndStudentDetails] = useState({});
  const [reviewData, setReviewData] = useState({}); // To manage review inputs
  const [submittedReviews, setSubmittedReviews] = useState({}); // Track submitted reviews

  // Fetch student's bought courses
  async function fetchStudentBoughtCourses() {
    const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
    if (response?.success) {
      setStudentBoughtCoursesList(response?.data);
    }
  }

  // Fetch course progress status using the provided service
  async function fetchCourseProgress(studentId, courseId) {
    try {
      const response = await getCurrentCourseProgressService(studentId, courseId);
      if (response?.data?.completed) {
        setCourseCompletionStatus((prevStatus) => ({
          ...prevStatus,
          [courseId]: true,
        }));
      } else {
        setCourseCompletionStatus((prevStatus) => ({
          ...prevStatus,
          [courseId]: false,
        }));
      }
    } catch (error) {
      console.error("Error fetching course progress:", error);
    }
  }

  // Fetch course and student names
  async function fetchCourseAndStudentNames(courseId, studentId) {
    try {
      const response = await axios.get(`http://localhost:5000/student/course-progress/course/${courseId}/student/${studentId}`);
      if (response?.data) {
        setCourseAndStudentDetails((prevDetails) => ({
          ...prevDetails,
          [courseId]: {
            courseName: response.data.courseName,
            studentName: response.data.studentName,
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching course and student details:", error);
    }
  }

  // Download certificate
  async function handleDownloadCertificate(studentId, courseId) {
    try {
      // Fetch course and student names before downloading the certificate
      await fetchCourseAndStudentNames(courseId, studentId);

      const { courseName, studentName } = courseAndStudentDetails[courseId] || {};

      if (!courseName || !studentName) {
        console.error("Course or student name not found!");
        return;
      }

      const response = await axios({
        url: `http://localhost:5000/student/course-progress/download-certificate/${studentId}/${courseId}`,
        method: "GET",
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${studentName}_Certificate_${courseName}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the certificate:", error);
    }
  }

  async function handleReviewSubmit(courseId, studentId) {
    const review = reviewData[courseId];
    
    if (review?.rating && review?.review) {
      try {
        // Check if the review already exists
        const checkReviewResponse = await axios.get(`http://localhost:5000/courseReview/`);
        const reviews = checkReviewResponse?.data?.reviews || [];
        const existingReview = reviews.find(
          (rev) => rev.courseId === courseId && rev.studentId === studentId
        );
  
        let response;
  
        if (existingReview) {
          // If review exists, update it using PUT
          console.log("Updating existing review");
          response = await axios.put(`http://localhost:5000/courseReview/${existingReview?.reviewId}`, {
            rating: review.rating,
            review: review.review,
          });
        } else {
          // If no review, create a new one using POST
          console.log("Creating new review");
          response = await axios.post("http://localhost:5000/courseReview/add", {
            courseId,
            studentId,
            rating: review.rating,
            review: review.review,
          });
        }
  
        // Log the response for debugging purposes
        console.log("Review submission response:", response);
  
        // Check for success in response data (adjust this based on your backend response structure)
        if (response?.data?.success) {
          // Update the submittedReviews state to reflect the successful submission
          setSubmittedReviews((prev) => ({
            ...prev,
            [courseId]: true,
          }));
          // Optionally, you can also update the reviewData state here if you want to reflect the new review immediately
          setReviewData((prev) => ({
            ...prev,
            [courseId]: { rating: review.rating, review: review.review },
          }));
        } else {
          // If no success in response, handle failure
          console.error("Review submission failed:", response?.data);
        }
      } catch (error) {
        console.error("Error handling review:", error.response?.data || error.message);
        alert("An error occurred while submitting the review. Please try again.");
      }
    } else {
      alert("Please provide a rating and a review.");
    }
  }

  // Handle star rating change
  function handleStarRatingChange(courseId, rating) {
    setReviewData((prev) => ({
      ...prev,
      [courseId]: { ...prev[courseId], rating },
    }));
  }

  useEffect(() => {
    fetchStudentBoughtCourses();
  }, []);

  useEffect(() => {
    studentBoughtCoursesList.forEach((course) => {
      fetchCourseProgress(auth?.user?._id, course?.courseId);
    });
  }, [studentBoughtCoursesList]);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
          studentBoughtCoursesList.map((course) => (
            <Card key={course.id} className="flex flex-col">
              <CardContent className="p-4 flex-grow">
                <img
                  src={course?.courseImage}
                  alt={course?.title}
                  className="h-52 w-full object-cover rounded-md mb-4"
                />
                <h3 className="font-bold mb-1">{course?.title}</h3>
                <p className="text-sm text-gray-700 mb-2">{course?.instructorName}</p>

                {/* Review Section */}
                {submittedReviews[course?.courseId] ? (
                  <p className="text-sm text-green-500">Review Submitted</p>
                ) : (
                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-6 w-6 cursor-pointer ${reviewData[course?.courseId]?.rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                            onClick={() => handleStarRatingChange(course?.courseId, star)}
                            disabled={submittedReviews[course?.courseId]} // Disable if review submitted
                          />
                        ))}
                      </div>
                    </div>
                    <textarea
                      placeholder="Write a review"
                      value={reviewData[course?.courseId]?.review || ""}
                      onChange={(e) => setReviewData((prev) => ({
                        ...prev,
                        [course?.courseId]: { ...prev[course?.courseId], review: e.target.value },
                      }))}
                      className="mt-2 w-full p-2 border rounded-md"
                      disabled={submittedReviews[course?.courseId]} // Disable if review submitted
                    ></textarea>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button
                  onClick={() => navigate(`/course-progress/${course?.courseId}`)}
                  className="flex-1"
                >
                  <Watch className="mr-2 h-4 w-4" />
                  Start Watching
                </Button>
                {courseCompletionStatus[course?.courseId] && (
                  <Button
                    onClick={() =>
                      handleDownloadCertificate(auth?.user?._id, course?.courseId)
                    }
                    className="flex-1"
                    variant="secondary"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Certificate
                  </Button>
                )}
                {/* Hide the Submit Review button and review section if the review is already submitted */}
                {!submittedReviews[course?.courseId] && (
                  <Button
                    onClick={() => handleReviewSubmit(course?.courseId, auth?.user?._id)}
                    className="flex-1"
                    variant="outline"
                  >
                    Submit Review
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))
        ) : (
          <h1 className="text-3xl font-bold">No Courses found</h1>
        )}
      </div>
    </div>
  );
}

export default StudentCoursesPage;

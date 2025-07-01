import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const server_url = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses and reviews in parallel
        const [coursesResponse, reviewsResponse] = await Promise.all([
          axios.get(`${server_url}/student/course/get`),
          axios.get(`${server_url}/courseReview/`)
        ]);

        setCourses(coursesResponse.data.data);
        setReviews(reviewsResponse.data.reviews);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCourseNavigate = (courseId) => {
    navigate(`/course/details/${courseId}`);
  };

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>{error}</p>;

  // Merge course data with reviews
  const mergedCourses = courses.map(course => {
    const courseReview = reviews.find(review => review.courseId === course._id) || {};
    return {
      ...course,
      averageRating: courseReview.averageRating,
      totalReviews: courseReview.totalReviews
    };
  });

  return (
    <div className="courses">
      <h1 style={{ fontSize: "45px", fontWeight: "bolder", marginBottom: "2%" }}>
        Discover Popular Courses
      </h1>
      <div className="course-list">
        {mergedCourses.length > 0 ? (
          mergedCourses.map((course) => (
            <div
              key={course._id}
              className="course-card"
              onClick={() => handleCourseNavigate(course._id)}
              style={{ cursor: "pointer" }}
            >
              {course.image && (
                <img
                  src={course.image}
                  alt={course.title}
                  className="course-image"
                />
              )}
              <div className="course-info-container" style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="course-reviews" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {(
                    <>
                      <span className="rating">{course.averageRating ? course.averageRating : 0}★</span>
                      <span className="review-count">({course.totalReviews? course.totalReviews : 0} reviews)</span>
                    </>
                  )}
                </div>
                <div className="course-price">
                  <span className="price">${course.pricing}</span>
                </div>
              </div>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="card-bottom">
                <span>{course.level}</span>
                <span>{course.primaryLanguage}</span>
                <span>90+ hours</span>
              </div>
              <br/>
            </div>
          ))
        ) : (
          <p>No courses available.</p>
        )}
      </div>
    </div>
  );
};

export default Courses;
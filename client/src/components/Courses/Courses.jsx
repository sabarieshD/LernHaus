import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]); // Default to an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/student/course/get");
        console.log(response.data.data);
        const coursesData = response.data.data;
        setCourses(coursesData);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle navigation to course details
  const handleCourseNavigate = (courseId) => {
    navigate(`/course/details/${courseId}`); // Navigate to course details page
  };

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="courses">
      <h1 style={{ fontSize: "45px", fontWeight: "bolder", marginBottom: "2%" }}>
        Discover Popular Courses
      </h1>
      <div className="course-list">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course._id}
              className="course-card"
              onClick={() => handleCourseNavigate(course._id)} // Add click handler
              style={{ cursor: "pointer" }} // Add pointer cursor
            >
              {course.image && (
                <img
                  src={course.image}
                  alt={course.title}
                  className="course-image"
                />
              )}
              <p className="price">${course.pricing}</p>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="card-bottom">
                <span>{course.level}</span>
                <span>{course.primaryLanguage}</span>
                <span>90+ hours</span>
              </div>
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

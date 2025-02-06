import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from "chart.js";
import "./CourseStatus.css"
// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const CourseStatus = () => {
  const [studentId, setStudentId] = useState(sessionStorage.getItem("studentId") || "");
  const [completedCourses, setCompletedCourses] = useState(0);
  const [ongoingCourses, setOngoingCourses] = useState(0);
  const droppedCourses = 10;
  const refundCourses = 7;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) {
      console.error("Student ID not found in session storage.");
      return;
    }

    fetch(`http://localhost:5000/student/courses-bought/get/${studentId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          fetchProgressData(data.data);
        } else {
          console.error("Invalid API response format:", data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setLoading(false);
      });
  }, [studentId]);

  const fetchProgressData = async (courses) => {
    let completed = 0;
    let ongoing = 0;

    for (let course of courses) {
      try {
        const response = await fetch(`http://localhost:5000/student/course-progress/get/${studentId}/${course.courseId}`);
        const progress = await response.json();

        if (progress && progress.success) {
          if (progress.data.completed) {
            completed++;
          } else {
            ongoing++;
          }
        }
      } catch (error) {
        console.error(`Error fetching progress for course ${course.courseId}:`, error);
      }
    }

    setCompletedCourses(completed);
    setOngoingCourses(ongoing);
    setLoading(false);
  };

  const totalCourses = completedCourses + ongoingCourses + droppedCourses + refundCourses;

  const calculatePercentage = (count) => ((count / totalCourses) * 100).toFixed(1) + "%";

  const data = [
    {
      label: "Completed Courses",
      percentage: calculatePercentage(completedCourses),
      count: `${completedCourses} Courses`,
      color: "text-green-500",
    },
    {
      label: "Dropped Courses",
      percentage: calculatePercentage(droppedCourses),
      count: "10 Courses", // Hardcoded
      color: "text-blue-500",
    },
    {
      label: "On-going Courses",
      percentage: calculatePercentage(ongoingCourses),
      count: `${ongoingCourses} Courses`,
      color: "text-red-500",
    },
  ];

  const pieOptions = {
    plugins: {
      legend: {
        position: "top", // Keeps labels to the right
        align: "centre", // Aligns them at the top/start
        labels: {
          boxWidth: 10, // Adjusts the size of the color box
          padding: 10, // Adds spacing between labels
          usePointStyle: true, // Makes legend markers circular
        },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };
  
  
  const pieData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        data: data.map(item => parseInt(item.count.split(' ')[0])),
        backgroundColor: ['#10b981', '#3b82f6', '#6b7280', '#ef4444'],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="course-status-container">
      <div className="course-status-header">
        <h2 className="course-status-title">Course Status</h2>
      </div>
      {loading ? (
        <p>Loading course status...</p>
      ) : (
        <div className="course-status-content">
          <div className="course-status-content">
            <div className="course-status-labels">
              <ul className="course-status-list">
                {data.map((item, index) => (
                  <li key={index} className="course-status-item">
                    <div className="course-status-item-label">
                      <span className={`course-status-item-color ${item.color}`}></span>
                      <p className="course-status-item-text">{item.label}</p>
                    </div>
                    <div className="flex items-center gap-4" style={{ justifyContent: "flex-start", width: "100%" }}>
                      <span
                        className={`course-status-item-percentage ${item.color}`}
                        style={{
                          marginLeft: "3%",
                          minWidth: "70px", // Increased width to account for all values
                          textAlign: "right", // Aligns numbers consistently to the right
                          display: "inline-block",
                          fontVariantNumeric: "tabular-nums", // Ensures monospaced numeric digits
                        }}
                      >
                        {item.percentage}
                      </span>
                      <span className="course-status-item-count">{item.count}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="course-status-chart-container" >
            <div className="course-status-chart-placeholder">
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseStatus;
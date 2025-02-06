import React, { useEffect, useState } from "react";

const EnrolledCourses = () => {
  const [studentId, setStudentId] = useState(sessionStorage.getItem("studentId") || "");
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [filter, setFilter] = useState("");
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
          setCourses(data.data);
          setFilteredCourses(data.data);
          fetchProgressData(data.data);
        } else {
          console.error("Invalid API response format:", data);
          setCourses([]);
          setFilteredCourses([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setLoading(false);
      });
  }, [studentId]);

  const fetchProgressData = async (courses) => {
    let progressMap = {};
    for (let course of courses) {
      try {
        const response = await fetch(`http://localhost:5000/student/course-progress/get/${studentId}/${course.courseId}`);
        const progress = await response.json();

        if (progress && progress.success) {
          const { completed, completionDate } = progress.data;
          progressMap[course.courseId] = {
            completed,
            completionDate: completionDate || "Not Completed",
          };
        }
      } catch (error) {
        console.error(`Error fetching progress for course ${course.courseId}:`, error);
      }
    }
    setProgressData(progressMap);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setFilteredCourses(
      courses.filter((course) =>
        course.title.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  if (!studentId) {
    return <p className="text-red-500 text-center">Error: Student ID not found.</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-[90%] mx-auto mb-6">
      <h2 className="text-xl font-semibold text-center mb-4">Enrolled Courses</h2>

      <input
        type="text"
        placeholder="Filter by title..."
        value={filter}
        onChange={handleFilterChange}
        className="border p-2 rounded w-full my-2"
      />

      {loading ? (
        <p className="text-gray-500 text-center">Loading courses...</p>
      ) : (
        <div className="overflow-x-auto">
          {/* Table Layout for Larger Screens */}
          <table className="w-full mt-4 border-collapse hidden md:table">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="p-3 text-center">Course Title</th>
                <th className="p-3 text-center">Instructor</th>
                <th className="p-3 text-center">Enrollment Date</th>
                <th className="p-3 text-center">Completion Status</th>
                <th className="p-3 text-center">Completion Date</th>
                <th className="p-3 text-center">Course Image</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course, index) => {
                const progress = progressData[course.courseId] || { completed: false, completionDate: "Not Completed" };

                return (
                  <tr key={index} className="border-t text-center">
                    <td className="p-3">{course.title}</td>
                    <td className="p-3">{course.instructorName}</td>
                    <td className="p-3">{new Date(course.dateOfPurchase).toLocaleDateString()}</td>
                    <td className={`p-3 font-semibold ${progress.completed ? "text-green-600" : "text-red-500"}`}>
                      {progress.completed ? "Completed" : "Not Completed"}
                    </td>
                    <td className="p-3">{progress.completionDate !== "Not Completed" ? new Date(progress.completionDate).toLocaleDateString() : "N/A"}</td>
                    <td className="p-3">
                      <img src={course.courseImage} alt={course.title} className="w-12 h-12 rounded-md mx-auto" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobile View - Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredCourses.map((course, index) => {
              const progress = progressData[course.courseId] || { completed: false, completionDate: "Not Completed" };

              return (
                <div key={index} className="border rounded-lg p-4 shadow-sm flex flex-col items-center gap-y-2">
                  <img src={course.courseImage} alt={course.title} className="w-16 h-16 rounded-md" />
                  <div className="text-center">
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-gray-500">Instructor: {course.instructorName}</p>
                    <p className="text-sm text-gray-500">Enrollment: {new Date(course.dateOfPurchase).toLocaleDateString()}</p>
                    <p className={`text-sm font-semibold ${progress.completed ? "text-green-600" : "text-red-500"}`}>
                      {progress.completed ? "Completed" : "Not Completed"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Completion: {progress.completionDate !== "Not Completed" ? new Date(progress.completionDate).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;

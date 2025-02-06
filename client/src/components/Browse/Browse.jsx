import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Browse.css";

const Browse = () => {
  const navigate = useNavigate(); // Initialize navigate

  const categories = [
    { name: "Art & Craft", count: "264+ Courses" },
    { name: "Business", count: "367+ Courses" },
    { name: "Development", count: "232+ Courses" },
    { name: "Life Style", count: "156+ Courses" },
    { name: "Marketing", count: "259+ Courses" },
    { name: "Health & Fitness", count: "197+ Courses" },
    { name: "Data Science", count: "312+ Courses" },
    { name: "Technology", count: "283+ Courses" },
  ];

  const handleBrowseAll = () => {
    navigate("/courses");
  };

  return (
    <>
      <div className="app">
        <section className="categories">
          <h1>
            <span style={{ color: "black" }}>Browse By </span>
            <span>Top Category</span>
          </h1>
          <div className="category-list">
            {categories.map((category, index) => (
              <div key={index} className="category-card">
                <h3>{category.name}</h3>
                <p>{category.count}</p>
              </div>
            ))}
          </div>
          <button className="browse-all" onClick={handleBrowseAll}>
            Browse All →
          </button>
        </section>
      </div>
    </>
  );
};

export default Browse;

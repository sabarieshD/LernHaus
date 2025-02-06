import React from 'react';
import './Features.css';

const Features = () => {
  return (
    <div className="features-container" >
      <div className="features-card">
        <div className="features-image-section">
          <div className="badge">
            <img
              src="src\assets\features.png" // Replace with actual image
              alt="student"
            />
          </div>
        </div>
        <div className="features-content-section">
          <p style={{color:'orange'}}>What's New</p>
          <h2>Master the skills to drive your career</h2>
          <p className="description">
            Education is the most powerful weapon which you can use to change the world. Leadership is not about a title or a designation. It’s about impact, influence, inspiration.
          </p>
          <ul className="features-list">
            <li>🌟 Build skills your way, from labs to courses</li>
            <li>✅ Get certified with 100+ courses</li>
            <li>☁️ Keep up with the latest in cloud</li>
            <li>📚 Stay motivated with engaging instructors</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Features;

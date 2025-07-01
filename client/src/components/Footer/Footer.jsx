import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-column">
          <h3 className="logo"><span>LMS</span></h3>
          <p>A learning platform based on practical knowledge.</p>
          <div className="social-icons">
            <a href="#" aria-label="Facebook">
              <img className="linkedin" src="src\assets\linkedin.png"/>
            </a>
            <a href="#" aria-label="Twitter">
              <img className="linkedin" src="src\assets\instagram.png"/>
            </a>
            <a href="#" aria-label="Instagram">
            <img className="linkedin" src="src\assets\twitter.png"/>
            </a>
          </div>
        </div>
        <div className="footer-column">
          <h4>About Us</h4>
          <ul>
            <li><a href="#">Instructors</a></li>
            <li><a href="#">Our Event</a></li>
            <li><a href="#">Courses List</a></li>
            <li><a href="#">Instructor Registration</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Resources</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Courses</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Flexible Learning</h4>
          <img
            src="../../assets/Globe_Map.png" // Replace with your world map image URL
            alt="World map"
          />
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 - All Rights Reserved</p>
        <ul>
          <li><a href="#">Terms And Condition</a></li>
          <li><a href="#">Claim</a></li>
          <li><a href="#">Privacy & Policy</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;

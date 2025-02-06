import React, { useState } from "react";
import logo from "../../assets/navbar-logo.png"; // Ensure the correct path
import "./Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <a href="/" className="navbar-logo">
          <img src={logo} alt="Logo" />
        </a>

        {/* Hamburger Menu */}
        <div className="menu-icon" onClick={toggleMenu}>
          <span className={isOpen ? "line open" : "line"}></span>
          <span className={isOpen ? "line open" : "line"}></span>
          <span className={isOpen ? "line open" : "line"}></span>
        </div>

        {/* Links */}
        <ul className={isOpen ? "nav-links active" : "nav-links"}>
          <li><a href="#home">Home</a></li>
          <li><a href="#explore">Explore Courses</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#my-courses">My Courses</a></li>
          <li><a href="#notifications">Notifications</a></li>
          <li><a href="#profile">Profile</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

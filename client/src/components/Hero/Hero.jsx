import React from "react";
import "./Hero.css";


const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>
            <span>Stay curious and explore the world around you</span>
          </h1>
          <p>
            Discover amazing places, learn new skills, and grow with top-notch courses and experiences.
          </p>
          <button className="hero-button">Get Started</button>
        </div>
        <div className="hero-image">
          <img
            src="src\assets\Hero_img.png"
            alt="Hero Visual"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;

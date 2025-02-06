import React from 'react';
import './Usp.css'; // Make sure to import the CSS file

const Usp = () => {
  return (
    <>
    <p style={{color:"rgb(253, 82, 8)", textAlign: 'center', fontSize:'large', marginTop:'10%'}}>Guaranteed Success</p>
    <h1 style={{fontSize:'45px', fontWeight:'bolder'}}>Why You Choose Us?</h1>
    <div className="card-container">
      <div className="card">
        <img src="src\assets\image.png" alt="Card 1" className="card-image" />
        <div className="card-text">
          <h4>Notification & Email</h4>
          <p>Receive timely updates through notification and emails. Stay informed about your course progress, deadlines, and important announcements.</p>
        </div>
      </div>

      <div className="card">
        <img src="src\assets\certification.png" alt="Card 2" className="card-image" />
        <div className="card-text">
          <h4>Certification</h4>
          <p>Receive recognized certificates upon course completion to showcase your skills, build expertise, and enhance your career opportunities.</p>
        </div>
      </div>

      <div className="card">
        <img src="src\assets\offline.png" alt="Card 3" className="card-image" />
        <div className="card-text">
          <h4>Offline Learning</h4>
          <p>Unlock your potential with offline courses designed to foster hands-on learning and develop a strong corporate culture, empowering you to thrive in the workplace.</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Usp;

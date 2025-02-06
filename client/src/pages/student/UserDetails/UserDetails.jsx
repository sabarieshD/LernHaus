import React, { useEffect, useState } from "react";
import axios from "axios"; 
import ProfileCard from "../../../components/ProfileCard/ProfileCard";
import StatsCard from "../../../components/StatsCard/StatsCard";
import ScoresCard from "../../../components/ScoresCard/ScoresCard";
import PaymentMethods from "../../../components/PaymentMethods/PaymentMethods";
import PaymentHistory from "../../../components/PaymentHistory/PaymentHistory";
import "./UserDetails.css";
import EnrolledCourses from "../../../components/EnrolledCourses/EnrolledCourses";
import CourseStatus from "../../../components/CourseStatus/CourseStatus";

const UserDetails = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve the email from sessionStorage
        const email = sessionStorage.getItem("userEmail");
    
        if (!email) {
          throw new Error("Email not found in sessionStorage");
        }
    
        // Send the email as part of the URL path, not as a query parameter
        const response = await axios.get(`http://localhost:5000/auth/view-details/${email}`);
        
        // console.log(response.data);
        // Store the fetched user data
        setUserData(response.data); 
      } catch (err) {
        console.error("Axios error:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false); 
      }
    };
    
    fetchData(); 
  }, []); 

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  console.log(userData);

  return (
    <>
    <div className="whole-wrap">
      <div className="user-details-container">
        <div style={{display:'flex', flexDirection:'column'}} className="top-section">
          <div className="profile-card-wrapper">
            <ProfileCard user={userData} />
          </div>
          <div className="stats-scores-wrapper">
            <StatsCard />
          </div>
          <div className="p1">
            <PaymentMethods />
          </div>
        </div>
        
        <div className="score-card">
          <ScoresCard />
          <CourseStatus/>
        </div>
      </div>
      <div className="bottom-section">
      </div>        
      <div className="p2"><EnrolledCourses /></div>
      <div className="p3"><PaymentHistory/></div>
    </div>
    </>
  );
};

export default UserDetails;

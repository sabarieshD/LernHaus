import React from "react";
import "./ProfileCard.css";

const ProfileCard = ({ user }) => {
  console.log("from profile card" ,user);
  sessionStorage.setItem('studentId', user.data._id);
  return (
    <div className="profile-card">
      <img
        src="src\assets\User.png" // Replace with user.profilePicture if available
        alt="User"
        className="profile-picture"
      />
      <div className="profile-info">
        <p>
          <b>Name:</b> <span>{user.data.userName || "NA"}</span> <br />
          <b>Email:</b> <span>{user.data.userEmail || "NA"}</span> <br />
          <b>Role:</b> <span>{user.data.role || "NA"}</span> <br />
          <b>Mobile No:</b> <span>{user.data.whatsappNumber || "NA"}</span> <br />
          <b>Domain Of Interest:</b> <span>{user.data.domainOfInterest || "NA"}</span> <br />
          <b>College:</b> <span>{user.data.collegeName || "NA"}</span> <br />
          <b>Department:</b> <span>{user.data.department || "NA"}</span>
        </p>
      </div>

    </div>
  );
};

export default ProfileCard;

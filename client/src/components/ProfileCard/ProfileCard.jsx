import React, { useState } from "react";
import "./ProfileCard.css";

const ProfileCard = ({ user, setUser }) => {
  console.log("from profile card", user);
  sessionStorage.setItem("studentId", user?.data?._id);

  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ ...user?.data });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const token = sessionStorage.getItem("accessToken");
    console.log(token);
    if (!token) {
      alert("User is not authenticated. Please log in again.");
      return;
    }
  
    console.log("Sending Token:", token); // Log the token being sent
  
    try {
      const response = await fetch(`http://localhost:5000/auth/update-details`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });
  
      console.log("Response Status:", response.status); // Log status code
  
      if (!response.ok) {
        throw new Error("Failed to update user details");
      }
  
      setSuccessMessage("✅ Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Update failed. Please try again.");
    }
  };
  

  return (
    <div className="profile-card">
      <img src="src/assets/User.png" alt="User" className="profile-picture" />

      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="profile-info">
        {isEditing ? (
          <>
            <input type="text" name="userName" value={updatedUser.userName} onChange={handleChange} />
            <input type="email" name="userEmail" value={updatedUser.userEmail} onChange={handleChange} />
            <input type="text" name="whatsappNumber" value={updatedUser.whatsappNumber} onChange={handleChange} />
            <input type="text" name="domainOfInterest" value={updatedUser.domainOfInterest} onChange={handleChange} />
            <input type="text" name="collegeName" value={updatedUser.collegeName} onChange={handleChange} />
            <input type="text" name="department" value={updatedUser.department} onChange={handleChange} />
            <button onClick={handleUpdate} className="save-btn">Save</button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
          </>
        ) : (
          <p>
            <b>Name:</b> <span>{user?.data?.userName || "NA"}</span> <br />
            <b>Email:</b> <span>{user?.data?.userEmail || "NA"}</span> <br />
            <b>Role:</b> <span>{user?.data?.role || "NA"}</span> <br />
            <b>Mobile No:</b> <span>{user?.data?.whatsappNumber || "NA"}</span> <br />
            <b>Domain Of Interest:</b> <span>{user?.data?.domainOfInterest || "NA"}</span> <br />
            <b>College:</b> <span>{user?.data?.collegeName || "NA"}</span> <br />
            <b>Department:</b> <span>{user?.data?.department || "NA"}</span>
          </p>
        )}
      </div>

      {!isEditing && (
        <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
      )}
    </div>
  );
};

export default ProfileCard;

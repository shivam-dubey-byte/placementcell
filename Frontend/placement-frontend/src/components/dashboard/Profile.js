import React, { useState, useEffect } from "react";
import "../../styles/profile.css";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    profilePicture: "https://via.placeholder.com/150",
    year: "3",
    semester: "6",
    cgpa: "8.5",
    activeBacklog: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState(null);

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing localStorage user data:", error);
      }
    }
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prevUser) => ({
          ...prevUser,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("Profile updated successfully!");
    setIsEditing(false);
    setProfilePictureFile(null);

    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(user));
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>Profile</h2>
          {message && (
            <div className={`message ${message.includes("success") ? "success" : "error"}`}>
              {message}
            </div>
          )}
        </div>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="profile-picture-upload">
              <label htmlFor="profilePicture">
                <img src={user.profilePicture} alt="Profile" className="profile-picture" />
                <span className="upload-text">Change Photo</span>
              </label>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                onChange={handleProfilePictureChange}
                className="d-none"
                accept="image/*"
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" value={user.name} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={user.email} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input type="tel" id="phone" name="phone" value={user.phone} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="year">Year</label>
              <input type="number" id="year" name="year" value={user.year} onChange={handleInputChange} min="1" max="4" />
            </div>
            <div className="form-group">
              <label htmlFor="semester">Semester</label>
              <input type="number" id="semester" name="semester" value={user.semester} onChange={handleInputChange} min="1" max="8" />
            </div>
            <div className="form-group">
              <label htmlFor="cgpa">CGPA</label>
              <input type="number" id="cgpa" name="cgpa" value={user.cgpa} onChange={handleInputChange} step="0.01" min="0" max="10" />
            </div>
            <div className="form-group checkbox-group">
              <input type="checkbox" id="activeBacklog" name="activeBacklog" checked={user.activeBacklog} onChange={handleInputChange} />
              <label htmlFor="activeBacklog">Active Backlog</label>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-save">Save Changes</button>
              <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="profile-picture-container">
              <img src={user.profileImg} alt="Profile" className="profile-picture" />
            </div>
            <div className="info-group">
              <span className="info-label">Name:</span>
              <span className="info-value">{user.name}</span>
            </div>
            <div className="info-group">
              <span className="info-label">Email:</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-group">
              <span className="info-label">Phone:</span>
              <span className="info-value">{user.phone}</span>
            </div>
            <div className="info-group">
              <span className="info-label">Year:</span>
              <span className="info-value">{user.year}</span>
            </div>
            <div className="info-group">
              <span className="info-label">Semester:</span>
              <span className="info-value">{user.semester}</span>
            </div>
            <div className="info-group">
              <span className="info-label">CGPA:</span>
              <span className="info-value">{user.cgpa}</span>
            </div>
            <div className="info-group">
              <span className="info-label">Active Backlog:</span>
              <span className="info-value">{user.activeBacklog ? "Yes" : "No"}</span>
            </div>
            <button onClick={() => setIsEditing(true)} className="btn-edit">
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

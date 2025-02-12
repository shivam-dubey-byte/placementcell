import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = ({ userType }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  // Role-based sidebar links
  const adminLinks = [
    { name: "Dashboard", icon: "📊" },
    { name: "Manage Students", icon: "👨‍🎓" },
    { name: "Approve NOC", icon: "✅" },
    { name: "Approve LOR", icon: "📝" },
    { name: "Send Emails", icon: "📧" },
    { name: "Manage Admins", icon: "👨‍💼" },
    { name: "File Manager", icon: "📁" },
  ];

  const studentLinks = [
    { name: "Dashboard", icon: "📊" },
    { name: "Apply for NOC", icon: "📄" },
    { name: "Apply for LOR", icon: "📝" },
    { name: "Upload Resume", icon: "📤" },
    { name: "Profile", icon: "👤" },
    { name: "Settings", icon: "⚙️" },
  ];

  const sidebarLinks = userType === "admin" ? adminLinks : studentLinks;

  // Automatically handle sidebar state on window resize
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 768;
      setIsMobile(isMobileView);
      if (isMobileView) {
        setIsSidebarOpen(false); // Collapse sidebar on mobile/tablet
      } else {
        setIsSidebarOpen(true); // Open sidebar on desktop
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial state based on screen size

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redirect to login if user is not logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.role) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className={`dashboard-sidebar ${isSidebarOpen ? "open" : "collapsed"}`}>
        {/* Cross button inside the sidebar */}
        {isMobile && isSidebarOpen && (
          <button
            className="dashboard-sidebar-close"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        )}
        <div className="dashboard-sidebar-content">
          <ul className="dashboard-sidebar-links">
            {sidebarLinks.map((item, index) => (
              <li key={index} className="dashboard-sidebar-item">
                <span className="dashboard-sidebar-icon">{item.icon}</span>
                <span className="dashboard-sidebar-text">{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className={`dashboard-main-content ${isSidebarOpen && isMobile ? "shifted" : ""}`}>
        {/* Toggle button for mobile/tablet */}
        {isMobile && !isSidebarOpen && (
          <button
            className="dashboard-sidebar-toggle"
            onClick={() => setIsSidebarOpen(true)}
          >
            ☰
          </button>
        )}
        <h2>{userType === "admin" ? "Admin Dashboard" : "Student Dashboard"}</h2>
        <p>Welcome! Manage your tasks efficiently.</p>
        {/* Add role-specific content here */}
        {userType === "admin" && (
          <div className="dashboard-content">
            <h3>Admin Features</h3>
            <ul>
              <li>Manage Students</li>
              <li>Approve NOC/LOR</li>
              <li>Send Emails</li>
            </ul>
          </div>
        )}
        {userType === "student" && (
          <div className="dashboard-content">
            <h3>Student Features</h3>
            <ul>
              <li>Apply for NOC/LOR</li>
              <li>Upload Resume</li>
              <li>Update Profile</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
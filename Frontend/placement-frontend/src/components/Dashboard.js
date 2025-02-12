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
      {/* Toggle button for mobile/tablet */}
      {isMobile && !isSidebarOpen && (
        <button
          className="dashboard-sidebar-toggle"
          onClick={() => setIsSidebarOpen(true)}
        >
          ☰
        </button>
      )}
      {/* Main Content */}
      <div className={`dashboard-main-content ${isSidebarOpen && isMobile ? "shifted" : ""}`}>
        <br />
        <h2>{userType === "admin" ? "Admin Dashboard" : "Student Dashboard"}</h2>
        <p>Welcome! Manage your tasks efficiently.</p>

        {/* Admin-specific content */}
        {userType === "admin" && (
          <div className="dashboard-content">
            <h3>Admin Features</h3>
            <ul>
              <li>Manage Students: View, add, or remove student records.</li>
              <li>Approve NOC/LOR: Review and approve NOC and LOR requests.</li>
              <li>Send Emails: Send bulk emails to students or specific groups.</li>
              <li>Manage Admins: Add or remove other admin users.</li>
              <li>File Manager: Upload, download, or manage files.</li>
            </ul>

            <h3>Recent Activities</h3>
            <div className="recent-activities">
              <p>📅 Approved 5 NOC requests today.</p>
              <p>📧 Sent emails to 10 students about upcoming deadlines.</p>
              <p>📁 Uploaded new guidelines for NOC applications.</p>
            </div>

            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <button className="action-button">Approve Pending Requests</button>
              <button className="action-button">Send Reminder Emails</button>
              <button className="action-button">Generate Reports</button>
            </div>
          </div>
        )}

        {/* Student-specific content */}
        {userType === "student" && (
          <div className="dashboard-content">
            <h3>Student Features</h3>
            <ul>
              <li>Apply for NOC/LOR: Submit requests for NOC or LOR.</li>
              <li>Upload Resume: Upload and update your resume.</li>
              <li>Update Profile: Edit your personal and academic details.</li>
              <li>Check Application Status: Track the status of your NOC/LOR requests.</li>
              <li>View Notifications: Stay updated with important announcements.</li>
            </ul>

            <h3>Your Applications</h3>
            <div className="applications">
              <p>📄 NOC Application: <span className="status">Pending</span></p>
              <p>📝 LOR Application: <span className="status">Approved</span></p>
            </div>

            <h3>Upcoming Deadlines</h3>
            <div className="deadlines">
              <p>📅 NOC Submission Deadline: 15th October 2023</p>
              <p>📅 LOR Submission Deadline: 20th October 2023</p>
            </div>

            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <button className="action-button">Apply for NOC</button>
              <button className="action-button">Apply for LOR</button>
              <button className="action-button">Upload Resume</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
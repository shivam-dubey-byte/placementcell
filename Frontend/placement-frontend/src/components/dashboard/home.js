import React from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ userType }) => {
  const navigate = useNavigate();
  return (
    <>
      {/* Main Content */}
      {/*<div className={`dashboard-main-content ${isSidebarOpen && isMobile ? "shifted" : ""}`}>*/}
        
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
              <button className="action-button"onClick={() => navigate("/dashboard/manage-admins")}>Manage Admins</button>
              <button className="action-button"onClick={() => navigate("/dashboard/send-emails")}>Send Reminder Emails</button>
              <button className="action-button"onClick={() => navigate("/dashboard/apply-lor")}>Generate Reports</button>
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
              <button className="action-button" onClick={() => navigate("/dashboard/apply-noc")}>Apply for NOC</button>
              <button className="action-button" onClick={() => navigate("/dashboard/apply-lor")}>Apply for LOR</button>
              <button className="action-button" onClick={() => navigate("/dashboard/upload-resume")}>Upload Resume</button>
            </div>
          </div>
        )}
      {/*</div>*/}
      </>
  );
};

export default Home;

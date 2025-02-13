import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Sidebar.css";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, userType, isMobile }) => {
  // Define Sidebar Links
  const adminLinks = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Manage Students", path: "/dashboard/manage-students", icon: "👨‍🎓" },
    { name: "Approve NOC", path: "/dashboard/approve-noc", icon: "✅" },
    { name: "Approve LOR", path: "/dashboard/approve-lor", icon: "📝" },
    { name: "Send Emails", path: "/dashboard/send-emails", icon: "📧" },
    { name: "Manage Admins", path: "/dashboard/manage-admins", icon: "👨‍💼" },
    { name: "File Manager", path: "/dashboard/file-manager", icon: "📁" },
  ];

  const studentLinks = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Apply for NOC", path: "/dashboard/apply-noc", icon: "📄" },
    { name: "Apply for LOR", path: "/dashboard/apply-lor", icon: "📝" },
    { name: "Upload Resume", path: "/dashboard/upload-resume", icon: "📤" },
    { name: "Profile", path: "/dashboard/profile", icon: "👤" },
    { name: "Settings", path: "/dashboard/settings", icon: "⚙️" },
  ];

  const sidebarLinks = userType === "admin" ? adminLinks : studentLinks;

  return (
    <div className={`dashboard-sidebar ${isSidebarOpen ? "open" : "collapsed"}`}>
      {/* Close Button (Only in Mobile View) */}
      {isMobile && isSidebarOpen && (
        <button className="dashboard-sidebar-close" onClick={() => setIsSidebarOpen(false)}>
          ✕
        </button>
      )}
      
      {/* Sidebar Links */}
      <div className="dashboard-sidebar-content">
        <ul className="dashboard-sidebar-links">
          {sidebarLinks.map((item, index) => (
            <li key={index} className="dashboard-sidebar-item">
              <Link to={item.path} className="dashboard-sidebar-link">
                <span className="dashboard-sidebar-icon">{item.icon}</span>
                <span className="dashboard-sidebar-link-text">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

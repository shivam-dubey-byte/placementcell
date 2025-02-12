import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Fetch user role from local storage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user.role) {
      setUserType(user.role);
    }
  }, []);

  if (!userType) return <h2>Loading Dashboard...</h2>; // Prevent rendering until role is loaded

  // Role-based navigation
  const adminLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/students", label: "Manage Students" },
    { path: "/noc-requests", label: "Approve NOC" },
    { path: "/lor-requests", label: "Approve LOR" },
    { path: "/email", label: "Send Emails" },
    { path: "/admins", label: "Manage Admins" },
    { path: "/files", label: "File Manager" },
  ];

  const studentLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/apply-noc", label: "Apply for NOC" },
    { path: "/apply-lor", label: "Apply for LOR" },
    { path: "/resume", label: "Upload Resume" },
    { path: "/profile", label: "Profile" },
    { path: "/settings", label: "Settings" },
  ];

  const sidebarLinks = userType === "admin" ? adminLinks : studentLinks;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className={`dashboard-sidebar ${isSidebarOpen ? "open" : "collapsed"}`}>
        <button className="dashboard-toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          ☰
        </button>
        <ul className="dashboard-nav-links">
          {sidebarLinks.map((link, index) => (
            <li key={index}>
              <Link to={link.path}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="dashboard-main-content">
        <h2>{userType === "admin" ? "Admin Dashboard" : "Student Dashboard"}</h2>
        <p>Welcome! Manage your tasks efficiently.</p>
      </div>

      {/* Scoped Styles */}
      <style>{`
        .dashboard-layout {
          display: flex;
          height: 100vh;
        }

        .dashboard-sidebar {
          width: 250px;
          background: #2c3e50;
          color: white;
          padding: 20px;
          transition: width 0.3s;
        }

        .dashboard-sidebar.collapsed {
          width: 60px;
          overflow: hidden;
        }

        .dashboard-toggle-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          margin-bottom: 20px;
        }

        .dashboard-nav-links li {
          list-style: none;
          padding: 10px;
        }

        .dashboard-nav-links li a {
          color: white;
          text-decoration: none;
          display: block;
        }

        .dashboard-main-content {
          flex-grow: 1;
          padding: 20px;
          background: #f4f4f4;
        }
      `}</style>
    </div>
  );
}

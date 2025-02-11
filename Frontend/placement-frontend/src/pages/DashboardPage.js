import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : "collapsed"}`}>
        <button className="toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>☰</button>
        <ul className="nav-links">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h2>Dashboard Overview</h2>
        <p>Welcome! Here you can see the analytics and reports.</p>
      </div>

      {/* Styles */}
      <style>{`
        .dashboard-container {
          display: flex;
          height: 100vh;
        }

        .sidebar {
          width: 250px;
          background: #2c3e50;
          color: white;
          padding: 20px;
          transition: width 0.3s;
        }

        .sidebar.collapsed {
          width: 60px;
          overflow: hidden;
        }

        .toggle-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          margin-bottom: 20px;
        }

        .nav-links li {
          list-style: none;
          padding: 10px;
        }

        .nav-links li a {
          color: white;
          text-decoration: none;
          display: block;
        }

        .main-content {
          flex-grow: 1;
          padding: 20px;
          background: #f4f4f4;
        }
      `}</style>
    </div>
  );
}

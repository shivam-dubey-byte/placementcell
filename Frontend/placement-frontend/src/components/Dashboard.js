import React, { useState } from "react";
import { Link } from "react-router-dom";


export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="dashboard-layout">
        {/* Sidebar */}
        <div className={`dashboard-sidebar ${isSidebarOpen ? "open" : "collapsed"}`}>
          <button className="dashboard-toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>☰</button>
          <ul className="dashboard-nav-links">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/settings">Settings</Link></li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="dashboard-main-content">
          <h2>Dashboard Overview</h2>
          <p>Welcome! Here you can see the analytics and reports.</p>
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

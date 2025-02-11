import React from "react";
import Navbar from "../components/Nav"; // Adjust the path if needed
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <>
       {/* ✅ Reusing the existing Navbar */}

      <div className="dashboard-container">
        {/* Sidebar (Optional) */}
        <div className="sidebar">
          <h3>Dashboard Menu</h3>
          <ul>
            <li>
              <Link to="/dashboard">Overview</Link>
            </li>
            <li>
              <Link to="/dashboard/profile">Profile</Link>
            </li>
            <li>
              <Link to="/dashboard/settings">Settings</Link>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="dashboard-content">
          <h1>Welcome to Your Dashboard</h1>
          <p>Here, you can manage your account, view analytics, and more.</p>
        </div>
      </div>

      {/* Dashboard Styles */}
      <style>
        {`
        .dashboard-container {
          display: flex;
          height: 100vh;
        }
        .sidebar {
          width: 250px;
          background: #f8f9fa;
          padding: 20px;
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
        }
        .sidebar ul {
          list-style: none;
          padding: 0;
        }
        .sidebar ul li {
          margin-bottom: 10px;
        }
        .dashboard-content {
          flex-grow: 1;
          padding: 20px;
        }
        `}
      </style>
    </>
  );
}

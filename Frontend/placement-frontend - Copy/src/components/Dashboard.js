import React, { useState, useEffect } from "react";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Fetch user role from local storage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role) {
      setUserType(user.role);
    }
  }, []);

  // Disable scrolling when sidebar is open on mobile
  useEffect(() => {
    if (window.innerWidth <= 768) {
      document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
    }
    return () => {
      document.body.style.overflow = "auto"; // Reset on unmount
    };
  }, [isSidebarOpen]);

  // Automatically collapse sidebar on mobile/tablet screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true); // Always open on desktop
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial state based on screen size

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!userType) return <h2>Loading Dashboard...</h2>; // Prevent rendering until role is loaded

  // Role-based navigation
  const adminLinks = [
    "Dashboard",
    "Manage Students",
    "Approve NOC",
    "Approve LOR",
    "Send Emails",
    "Manage Admins",
    "File Manager",
  ];

  const studentLinks = [
    "Dashboard",
    "Apply for NOC",
    "Apply for LOR",
    "Upload Resume",
    "Profile",
    "Settings",
  ];

  const sidebarLinks = userType === "admin" ? adminLinks : studentLinks;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className={`dashboard-sidebar ${isSidebarOpen ? "open" : "collapsed"}`}>
        {/* Toggle button only visible on mobile/tablet */}
        {window.innerWidth <= 768 && (
          <button className="dashboard-toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? "✕" : "☰"}
          </button>
        )}
        <ul className={`dashboard-nav-links ${isSidebarOpen ? "show" : "hide"}`}>
          {sidebarLinks.map((item, index) => (
            <li key={index} className="sidebar-item">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="dashboard-main-content">
        <h2>{userType === "admin" ? "Admin Dashboard" : "Student Dashboard"}</h2>
        <p>Welcome! Manage your tasks efficiently</p>
      </div>

      {/* Scoped Styles */}
      <style>{`
        .dashboard-layout {
          display: flex;
          height: 100vh; /* Full height */
        }

        .dashboard-sidebar {
          width: 250px;
          background: #2c3e50;
          color: white;
          padding: 20px;
          transition: width 0.3s ease-in-out;
          overflow: hidden;
          position: fixed;
          height: 100vh; /* Full height */
          left: 0;
          top: 0; /* Start from the top */
          z-index: 1000;
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
        }

        .dashboard-sidebar.collapsed {
          width: 60px;
        }

        .dashboard-toggle-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          margin-bottom: 20px;
        }

        .dashboard-nav-links {
          list-style: none;
          padding: 0;
          margin: 0;
          transition: opacity 0.3s ease-in-out;
        }

        .dashboard-nav-links.hide {
          opacity: 0;
          visibility: hidden;
          height: 0;
          overflow: hidden;
        }

        .sidebar-item {
          padding: 10px;
          color: white;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.2s ease-in-out;
        }

        .sidebar-item:hover {
          background: #34495e;
        }

        .dashboard-main-content {
          flex-grow: 1;
          padding: 20px;
          background: #f4f4f4;
          margin-left: 250px; /* Default margin for desktop */
          transition: margin-left 0.3s ease-in-out;
        }

        @media (max-width: 768px) {
          .dashboard-sidebar {
            width: ${isSidebarOpen ? "250px" : "60px"};
          }

          .dashboard-main-content {
            margin-left: ${isSidebarOpen ? "250px" : "60px"};
          }
        }
      `}</style>
    </div>
  );
}
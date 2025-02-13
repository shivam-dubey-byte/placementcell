import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "./dashboard/Sidebar";
import Home from "./dashboard/home";
import "../styles/Dashboard.css";

const Dashboard = ({ userType }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  // Handle Sidebar state on window resize
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 768;
      setIsMobile(isMobileView);
      setIsSidebarOpen(!isMobileView); // Close sidebar on mobile
    };

    window.addEventListener("resize", handleResize);
    handleResize();

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
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        userType={userType}
        isMobile={isMobile}
      />

      {/* Toggle button for mobile */}
      {isMobile && !isSidebarOpen && (
        <button className="dashboard-sidebar-toggle" onClick={() => setIsSidebarOpen(true)}>
          ☰
        </button>
      )}

      {/* Main Content with Nested Routes */}
      <div className={`dashboard-main-content ${isSidebarOpen && isMobile ? "shifted" : ""}`}>
        <Routes>
          <Route path="/" element={<Home userType={userType} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;

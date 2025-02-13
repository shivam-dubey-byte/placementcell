import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "./dashboard/Sidebar";
import Home from "./dashboard/home";
import ManageStudents from "./dashboard/ManageStudents";
import ApproveNOC from "./dashboard/ApproveNOC";
import ApproveLOR from "./dashboard/ApproveLOR";
import SendEmails from "./dashboard/SendEmails";
import ManageAdmins from "./dashboard/ManageAdmins";
import FileManager from "./dashboard/FileManager";
import ApplyNOC from "./dashboard/ApplyForNOC";
import ApplyLOR from "./dashboard/ApplyForLOR";
import UploadResume from "./dashboard/UploadResume";
import Profile from "./dashboard/Profile";
import Settings from "./dashboard/Settings";
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

  // Define routes dynamically for different user types
  const dashboardRoutes = {
    admin: [
      { path: "/", element: <Home userType={userType} /> },
      { path: "/dashboard/manage-students", element: <ManageStudents /> },
      { path: "/dashboard/approve-noc", element: <ApproveNOC /> },
      { path: "/dashboard/approve-lor", element: <ApproveLOR /> },
      { path: "/dashboard/send-emails", element: <SendEmails /> },
      { path: "/dashboard/manage-admins", element: <ManageAdmins /> },
      { path: "/dashboard/file-manager", element: <FileManager /> },
    ],
    student: [
      { path: "/", element: <Home userType={userType} /> },
      { path: "/dashboard/apply-noc", element: <ApplyNOC /> },
      { path: "/dashboard/apply-lor", element: <ApplyLOR /> },
      { path: "/dashboard/upload-resume", element: <UploadResume /> },
      { path: "/dashboard/profile", element: <Profile /> },
      { path: "/dashboard/settings", element: <Settings /> },
    ],
  };

  // Function to render routes dynamically
  const renderRoutes = () => {
    return dashboardRoutes[userType]?.map((route, index) => (
      <Route key={index} path={route.path} element={route.element} />
    ));
  };

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
        <Routes>{renderRoutes()}</Routes>
      </div>
    </div>
  );
};

export default Dashboard;

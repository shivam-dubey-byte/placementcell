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
import UploadFiles from "./dashboard/UploadFiles";
import "../styles/Dashboard.css";
import StudentListPage from "./dashboard/StudentListPage";
import OfferDetailsPage from "./dashboard/OfferDetailsPage";
import RecruiterDetailsPage from "./dashboard/RecruiterDetailsPage";
import TrendYearPage from "./dashboard/TrendYearPage";
import CompanyListPage from "./dashboard/CompanyListPage";



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
      { path: "manage-students", element: <ManageStudents /> },
      { path: "approve-noc", element: <ApproveNOC /> },
      { path: "approve-lor", element: <ApproveLOR /> },
      { path: "send-emails", element: <SendEmails /> },
      { path: "manage-admins", element: <ManageAdmins /> },
      { path: "file-manager", element: <FileManager /> },
      {path:"upload-files",element:<UploadFiles/>},
      { path: "student-list/:year", element: <StudentListPage /> },
      {path:"offer-details/:year", element:<OfferDetailsPage />} ,
      {path:"recruiter/:year", element:<RecruiterDetailsPage />} ,
      {path:"trend/:year", element:<TrendYearPage />} ,
      {path:"companies/:year", element:<CompanyListPage />}
      

    ],
    student: [
      { path: "/", element: <Home userType={userType} /> },
      { path: "apply-noc", element: <ApplyNOC /> },
      { path: "apply-lor", element: <ApplyLOR /> },
      { path: "upload-resume", element: <UploadResume /> },
      { path: "profile", element: <Profile /> },
      { path: "settings", element: <Settings /> },
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

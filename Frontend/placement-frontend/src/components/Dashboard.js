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
import SendNotification from "./dashboard/SendNotification";

import { FaBell } from "react-icons/fa";
import socket from "../socket";

const Dashboard = ({ userType }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch("http://localhost:5009/api/notifications/read", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ title: "*", createdAt: "*" }),
      });
      if (res.ok) {
        setNotifications([]);
        setShowDropdown(false); // ✅ Close dropdown
      }
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 768;
      setIsMobile(isMobileView);
      setIsSidebarOpen(!isMobileView);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.role) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!(user?.email || user?.role)) return;

    socket.emit("join", user.email);
    const fetchNotifications = async () => {
      try {
        const res = await fetch("http://localhost:5009/api/notifications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setNotifications(data.map((n, i) => ({ id: i + 1, message: n.message })));
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err.message);
      }
    };

    fetchNotifications();

    socket.on("new_notification", (data) => {
      setNotifications((prev) => [
        { id: Date.now(), message: data.message },
        ...prev
      ]);
    });

    return () => socket.off("new_notification");
  }, []);

  // ✅ Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      const dropdown = document.getElementById("notification-dropdown");
      const bell = document.getElementById("notification-bell");
      if (
        dropdown &&
        !dropdown.contains(e.target) &&
        bell &&
        !bell.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const dashboardRoutes = {
    admin: [
      { path: "/", element: <Home userType={userType} /> },
      { path: "manage-students", element: <ManageStudents /> },
      { path: "approve-noc", element: <ApproveNOC /> },
      { path: "approve-lor", element: <ApproveLOR /> },
      { path: "send-emails", element: <SendEmails /> },
      { path: "manage-admins", element: <ManageAdmins /> },
      { path: "file-manager", element: <FileManager /> },
      { path: "upload-files", element: <UploadFiles /> },
      { path: "student-list/:year", element: <StudentListPage /> },
      { path: "offer-details/:year", element: <OfferDetailsPage /> },
      { path: "recruiter/:year", element: <RecruiterDetailsPage /> },
      { path: "trend/:year", element: <TrendYearPage /> },
      { path: "companies/:year", element: <CompanyListPage /> },
      { path: "send-notifications", element: <SendNotification /> }
    ],
    student: [
      { path: "/", element: <Home userType={userType} /> },
      { path: "apply-noc", element: <ApplyNOC /> },
      { path: "apply-lor", element: <ApplyLOR /> },
      { path: "upload-resume", element: <UploadResume /> },
      { path: "profile", element: <Profile /> },
      { path: "settings", element: <Settings /> }
    ],
  };

  const renderRoutes = () => {
    return dashboardRoutes[userType]?.map((route, index) => (
      <Route key={index} path={route.path} element={route.element} />
    ));
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        userType={userType}
        isMobile={isMobile}
      />

      {isMobile && !isSidebarOpen && (
        <button className="dashboard-sidebar-toggle" onClick={() => setIsSidebarOpen(true)}>
          ☰
        </button>
      )}

      {/* 🔔 Bell Icon */}
      <div style={{ position: "fixed", top: "70px", right: "20px", zIndex: 1001 }}>
        <div
          id="notification-bell"
          style={{
            position: "relative",
            width: "48px",
            height: "48px",
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1), inset 0 0 2px rgba(255, 255, 255, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
          onClick={() => setShowDropdown((prev) => !prev)}
          title="Notifications"
        >
          <FaBell size={20} color="#222" />
          {notifications.length > 0 && (
            <span
              style={{
                position: "absolute",
                top: "4px",
                right: "4px",
                backgroundColor: "#ff3b30",
                color: "#fff",
                fontSize: "10px",
                padding: "2px 6px",
                borderRadius: "12px",
                fontWeight: "bold",
                boxShadow: "0 0 4px rgba(255, 59, 48, 0.5)"
              }}
            >
              {notifications.length}
            </span>
          )}
        </div>

        {showDropdown && (
          <div
            id="notification-dropdown"
            style={{
              position: "absolute",
              top: "58px",
              right: "0",
              width: "280px",
              maxHeight: "300px",
              background: "#fff",
              borderRadius: "10px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
              overflowY: "auto",
              padding: "10px",
              fontSize: "14px",
            }}
          >
            <div style={{ textAlign: "right", marginBottom: "8px" }}>
              <button
                onClick={handleMarkAllAsRead}
                style={{
                  fontSize: "12px",
                  background: "transparent",
                  border: "none",
                  color: "#007bff",
                  cursor: "pointer",
                }}
              >
                Mark all as read
              </button>
            </div>

            {notifications.length === 0 ? (
              <p style={{ textAlign: "center", margin: 0, color: "#777" }}>No new notifications</p>
            ) : (
              notifications.map((note) => (
                <div
                  key={note.id}
                  style={{
                    padding: "8px",
                    borderBottom: "1px solid #eee",
                    color: "#333",
                  }}
                >
                  {note.message}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className={`dashboard-main-content ${isSidebarOpen && isMobile ? "shifted" : ""}`}>
        <Routes>{renderRoutes()}</Routes>
      </div>
    </div>
  );
};

export default Dashboard;

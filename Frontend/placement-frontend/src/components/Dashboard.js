import React from "react";
import DashboardSidebar from "../components/DashboardSidebar";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <DashboardSidebar />
      <div className="dashboard-content">
        <h2>Dashboard Content</h2>
      </div>
    </div>
  );
}

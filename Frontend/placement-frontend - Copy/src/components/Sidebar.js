import React from "react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`dashboard-sidebar ${isOpen ? "open" : ""}`}>
      <button className="dashboard-toggle-btn" onClick={toggleSidebar}>
        {isOpen ? "✕" : "☰"}
      </button>
      <ul className="dashboard-nav-links">
        {/* Add your sidebar links here */}
      </ul>
    </div>
  );
};

export default Sidebar;
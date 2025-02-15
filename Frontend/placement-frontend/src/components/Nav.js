import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token_expiry") ? true : false
  );
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      const expiry = localStorage.getItem("token_expiry");
  
      if (!expiry || Date.now() > parseInt(expiry)) {
        // Token expired, logout the user
        localStorage.removeItem("token");
        localStorage.removeItem("token_expiry");
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    };
  
    checkAuthStatus(); // Run on mount
  
    const interval = setInterval(checkAuthStatus, 60000); // Check every 1 min
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  
  useEffect(() => {
    const pathMap = {
      "/": "Home",
      "/features": "Features",
      "/dashboard": "Dashboard",
      "/faqs": "FAQs",
      "/about": "About",
    };

    const matchedLink = Object.keys(pathMap).find((path) => location.pathname === path);
    setActiveLink(pathMap[matchedLink] || "");
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("token_expiry");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const handleDashboardClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate("/login");
    }
  };

  const isDashboard = location.pathname === "/dashboard";

  return (
    <>
      {/* Navbar */}
      <nav className={`navbar navbar-light bg-light px-3 ${isDashboard ? "fixed-nav" : ""} ${menuOpen ? "navbar-blur" : ""}`}>
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img
              src={`${process.env.PUBLIC_URL}/mujlogo.png`}
              alt="MUJ Logo"
              style={{ height: "40px", width: "auto", marginRight: "10px" }}
            />
            <h1 className="m-0" style={{ fontSize: "1.5rem" }}>
              MUJ Placement Cell
            </h1>
          </Link>

          <div className="d-none d-lg-flex mx-auto">
            <ul className="navbar-nav d-flex flex-row gap-3">
              {["Home", "Features", "Dashboard", "FAQs", "About"].map((name) => (
                <li className="nav-item" key={name}>
                  <Link
                    to={name === "Home" ? "/" : `/${name.toLowerCase()}`}
                    className="nav-link"
                    style={{
                      color: activeLink === name ? "#d5652c" : "#6c757d",
                      fontWeight: activeLink === name ? "bold" : "normal",
                      minWidth: "80px",
                      display: "inline-block",
                      textAlign: "center",
                    }}
                    onClick={name === "Dashboard" ? handleDashboardClick : undefined}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="d-none d-lg-flex gap-2">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn btn-outline-warning">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-warning">
                  Sign-up
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            )}
          </div>

          <button className="navbar-toggler d-lg-none" type="button" onClick={() => setMenuOpen(true)}>
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>

      {/* Space to avoid content overlap when navbar is fixed */}
      {isDashboard && <div className="fixed-nav-placeholder"></div>}

      {/* Mobile Sidebar */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="sidebar">
          <button className="close-btn" onClick={() => setMenuOpen(false)}>
            &times;
          </button>
          <ul className="nav flex-column">
            {["Home", "Features", "Dashboard", "FAQs", "About"].map((name) => (
              <li className="nav-item" key={name}>
                <Link
                  to={name === "Home" ? "/" : `/${name.toLowerCase()}`}
                  className="nav-link"
                  style={{
                    color: activeLink === name ? "#d5652c" : "#6c757d",
                    fontWeight: activeLink === name ? "bold" : "normal",
                    minWidth: "80px",
                    display: "inline-block",
                    textAlign: "center",
                  }}
                  onClick={(e) => {
                    if (name === "Dashboard") handleDashboardClick(e);
                    setMenuOpen(false);
                  }}
                >
                  {name}
                </Link>
              </li>
            ))}
            <li className="nav-item mt-3">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="btn btn-outline-warning w-100 d-block text-center">
                    Login
                  </Link>
                  <Link to="/signup" className="btn btn-warning w-100 d-block text-center mt-2">
                    Sign-up
                  </Link>
                </>
              ) : (
                <button onClick={handleLogout} className="btn btn-danger w-100 d-block text-center">
                  Logout
                </button>
              )}
            </li>
          </ul>
        </div>
        <div className="blur-bg" onClick={() => setMenuOpen(false)}></div>
      </div>

      {/* Styles */}
      <style>
        {`
        .mobile-menu {
          position: fixed;
          top: 0;
          right: -100%;
          width: 100%;
          height: 100%;
          transition: right 0.4s ease-in-out;
          display: flex;
          z-index: 1050;
        }
        .mobile-menu.open {
          right: 0;
        }
        .sidebar {
          width: 75%;
          height: 100%;
          background: white;
          padding: 20px;
          box-shadow: -4px 0 10px rgba(0, 0, 0, 0.2);
          z-index: 1051;
        }
        .close-btn {
          font-size: 2rem;
          border: none;
          background: none;
          float: right;
          cursor: pointer;
        }
        .blur-bg {
          width: 25%;
          height: 100%;
          backdrop-filter: blur(8px);
          background: rgba(0, 0, 0, 0.3);
          cursor: pointer;
          z-index: 1050;
        }
        .fixed-nav {
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 1000;
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .fixed-nav-placeholder {
          height: 70px;
        }
        .navbar-blur {
          backdrop-filter: blur(5px);
        }
        `}
      </style>
    </>
  );
}

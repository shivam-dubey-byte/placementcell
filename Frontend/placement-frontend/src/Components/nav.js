import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link
import { useNavigate } from "react-router-dom";
export default function Navbar() {
  const [activeLink, setActiveLink] = useState("Home"); // Default active link
  const [menuOpen, setMenuOpen] = useState(false); // Controls mobile sidebar

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    setActiveLink(link);
    setMenuOpen(false); // Close sidebar after selection
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-light bg-light px-3">
        <div className="container-fluid">
          {/* Logo & Title */}
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img
              src={`${process.env.PUBLIC_URL}/mujlogo.png`}
              alt="MUJ Logo"
              style={{ height: "40px", width: "auto", marginRight: "10px" }}
            />
            <h1 className="m-0" style={{ fontSize: "1.5rem" }}>MUJ Placement Cell</h1>
          </a>

          {/* Desktop Navigation (Centered) */}
          <div className="d-none d-lg-flex mx-auto">
            <ul className="navbar-nav d-flex flex-row gap-3">
              {["Home", "Features", "Dashboard", "FAQs", "About"].map((name) => (
                <li className="nav-item" key={name}>
                  <a
                    href={`/${name.toLowerCase()}`}
                    className="nav-link"
                    style={{
                      color: activeLink === name ? "#d5652c" : "#6c757d",
                      fontWeight: activeLink === name ? "bold" : "normal",
                    }}
                    onClick={(e) => handleLinkClick(e, name)}
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Buttons on the Right Side */}
          <div className="d-none d-lg-flex gap-2">
            <Link to="/login" className="btn btn-outline-warning">Login</Link>
            <Link to="/signup" className="btn btn-warning">Sign-up</Link>
          </div>

          {/* Mobile Hamburger Menu */}
          <button className="navbar-toggler d-lg-none" type="button" onClick={() => setMenuOpen(true)}>
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="sidebar">
          <button className="close-btn" onClick={() => setMenuOpen(false)}>&times;</button>
          <ul className="nav flex-column">
            {["Home", "Features", "Dashboard", "FAQs", "About"].map((name) => (
              <li className="nav-item" key={name}>
                <a
                  href={`/${name.toLowerCase()}`}
                  className="nav-link"
                  style={{
                    color: activeLink === name ? "#d5652c" : "#6c757d",
                    fontWeight: activeLink === name ? "bold" : "normal",
                  }}
                  onClick={(e) => handleLinkClick(e, name)}
                >
                  {name}
                </a>
              </li>
            ))}
            <li className="nav-item mt-3">
            <Link to="/login" className="btn btn-outline-warning w-100 d-block text-center" style={{ textDecoration: "none" }}>
            Login
            </Link>
            </li>
            <li className="nav-item mt-2">
            <Link to="/signup" className="btn btn-warning w-100 d-block text-center" style={{ textDecoration: "none" }}>
            Sign-up
            </Link>
            </li>
          </ul>
        </div>
        <div className="blur-bg" onClick={() => setMenuOpen(false)}></div>
      </div>

      {/* Styles for Sidebar and Blur Effect */}
      <style>
        {`
        /* Mobile Menu Styles */
        .mobile-menu {
          position: fixed;
          top: 0;
          right: -100%;
          width: 100%;
          height: 100%;
          transition: right 0.4s ease-in-out;
          display: flex;
          z-index: 10;
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
          z-index: 1001;
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
          z-index: 1000;
        }
        @media (min-width: 992px) {
          .mobile-menu { display: none; } /* Hide sidebar on large screens */
        }
        `}
      </style>
    </>
  );
}

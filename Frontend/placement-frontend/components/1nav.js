import React, { useState } from "react";

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("Home"); // Default active link set to "Home"

  const handleLinkClick = (e, link) => {
    e.preventDefault(); // Prevent page reload
    setActiveLink(link); // Set active link
  };

  return (
    <>
      <div className="container">
        <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
          {/* Logo and Title */}
          <div className="col-lg-3 mb-2 mb-md-0">
            <div className="d-inline-flex link-body-emphasis text-decoration-none">
              <img
                src={`${process.env.PUBLIC_URL}/mujlogo.png`}
                alt="MUJ Logo"
                style={{ height: "40px", width: "auto", marginRight: "10px" }}
              />
              <h1 className="navbar-brand">MUJ Placement Cell</h1>
            </div>
          </div>

          {/* Navigation Links */}
          <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
            {[
              { name: "Home", path: "/" },
              { name: "Features", path: "/features" },
              { name: "Pricing", path: "/pricing" },
              { name: "FAQs", path: "/faqs" },
              { name: "About", path: "/about" },
            ].map((item) => (
              <li key={item.name}>
                <a
                  href={item.path}
                  className="nav-link px-2"
                  style={{
                    color: activeLink === item.name ? "#d5652c" : "#6c757d",
                    fontWeight: activeLink === item.name ? "bold" : "normal",
                  }}
                  onClick={(e) => handleLinkClick(e, item.name)}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Buttons */}
          <div className="col-md-3 text-end">
            <button type="button" className="btn btn-outline-warning me-2">
              Login
            </button>
            <button type="button" className="btn btn-warning">Sign-up</button>
          </div>
        </header>
      </div>
    </>
  );
}

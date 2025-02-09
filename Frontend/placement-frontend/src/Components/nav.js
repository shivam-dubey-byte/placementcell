import React from 'react';
import { useState } from 'react';
//import '../Components/style.css'; // Uncomment if you have a CSS file

export default function Navbar() {
  const [changeVisible, setVisible] = useState(false);

  const toggleMenu = (event) => {
    event.currentTarget.classList.toggle('change');
    setVisible((prevState) => !prevState);
  };

  return (
    <>
      {/* Navbar Start */}
      <nav className="navbar navbar-light custom-navbar">
        <div className="container">
          {/* Logo and Brand Name */}
          <div className="d-flex align-items-center">
            <img
              src={`${process.env.PUBLIC_URL}/mujlogo.png`} // Logo from the public folder
              alt="MUJ Logo"
              style={{ height: '50px', width: 'auto', marginRight: '10px' }} // Set height and width
            />
            <a className="navbar-brand playfair-display-navbar">
              MUJ Training & Placement Cell
            </a>
          </div>

          {/* Search Form */}
          <form className="d-flex">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-primary" type="submit">
              Search
            </button>
          </form>
        </div>
      </nav>
      {/* Navbar End */}
    </>
  );
}
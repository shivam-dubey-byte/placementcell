import React from "react";

export default function Home() {
  return (
    <div className="hero">
      <h1 className="hero-text">Training & Placement Cell</h1>

      <style>
        {`
        /* Container for Background background.jpg */
        .hero {
          height: 40vh;  /* 40% of viewport height */
          width: 100%;
          background: url('${process.env.PUBLIC_URL}/background.jpg') no-repeat center center;
          background-size: cover; /* Ensures the image fits without stretching */
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          text-align: center;
          z-index:1;
        }
        
        /* Text Styling */
        .hero-text {
          font-size: 2.5rem;
          color: white;
          font-weight: bold;
          text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
          position: absolute;
        }
        `}
      </style>
    </div>
  );
}

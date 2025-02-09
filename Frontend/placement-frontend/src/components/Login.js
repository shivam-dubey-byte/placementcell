import React, { useState } from "react";
import "../App.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2 className="text-center mb-4">Login</h2>
        <form>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" placeholder="Enter email" />
          </div>
          <div className="mb-3 password-wrapper">
            <label className="form-label">Password</label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Enter password"
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>
          <button type="submit" className="btn btn-warning w-100">Login</button>
        </form>
      </div>
    </div>
  );
}

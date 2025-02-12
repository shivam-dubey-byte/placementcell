import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Correct import
import "../App.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "https://mujtpcbackend.shivamrajdubey.tech/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        localStorage.setItem("token", token); // Save token

        // Decode JWT token to extract user details
        const decoded = jwtDecode(token); // Use jwtDecode instead of jwt_decode
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: decoded.name,
            email: decoded.email,
            role: decoded.role,
          })
        );

        alert("Login successful!");
        // Show user details in alert
          // Retrieve user data from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
      alert(`Login successful!\nName: ${user.name}\nRole: ${user.role}`);
        navigate("/dashboard"); // Redirect user
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2 className="text-center mb-4">Login</h2>
        {error && <p className="text-danger">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 password-wrapper">
            <label className="form-label">Password</label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          <div className="d-flex justify-content-between mb-3 auth-links">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="btn btn-warning w-100">
            Login
          </button>
        </form>

        <p className="text-center mt-3 auth-links">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}

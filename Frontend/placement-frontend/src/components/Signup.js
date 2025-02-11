import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const signupResponse = await fetch(
        "https://mujtpcbackend.shivamrajdubey.tech/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const signupData = await signupResponse.json();

      if (!signupResponse.ok) {
        setError(signupData.message || "Signup failed.");
        return;
      }

      // If signup is successful, proceed with login
      const loginResponse = await fetch(
        "https://mujtpcbackend.shivamrajdubey.tech/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        setError(loginData.message || "Login failed.");
        return;
      }

      // Store the token in localStorage
      localStorage.setItem("token", loginData.token);
      localStorage.setItem("user", JSON.stringify(loginData.user));

      setMessage("Signup & Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 2000); // Redirect after 2 seconds

    } catch (err) {
      setError("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2 className="text-center mb-4">Sign Up</h2>
        {message && <p className="text-success">{message}</p>}
        {error && <p className="text-danger">{error}</p>}
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field with Show/Hide Option */}
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

          {/* Confirm Password Field with Show/Hide Option */}
          <div className="mb-3 password-wrapper">
            <label className="form-label">Confirm Password</label>
            <div className="position-relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          <button type="submit" className="btn btn-warning w-100">
            Sign Up
          </button>

          <p className="text-center mt-3 auth-links">
            Already have an account?{" "}
            <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../App.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redirect logged-in users to the dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.role) {
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Invalid token, clearing storage.");
        localStorage.clear();
      }
    }
  }, [navigate]); // Run only on mount

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(// http://localhost:5000/auth/login
        "https://mujtpcbackend.shivamrajdubey.tech/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const textResponse = await response.text();
      console.log("Raw API Response:", textResponse);

      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (err) {
        throw new Error("Invalid JSON format received from API.");
      }

      if (response.ok) {
        if (!data.token) {
          throw new Error("Token not found in API response.");
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("token_expiry", Date.now() + 60 * 60 * 1000);
        console.log("Token stored:", localStorage.getItem("token"));

        try {
          const decoded = jwtDecode(data.token);
          console.log("Decoded Token:", decoded);

          localStorage.setItem(
            "user",
            JSON.stringify({
              name: decoded.name,
              email: decoded.email,
              role: decoded.role,
              profileImg:data.profileImage
            })
          );
        } catch (decodeError) {
          throw new Error("Error decoding JWT token.");
        }

        setLoading(false);
        setSuccess(true);

        // Force page reload to ensure correct state
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        setError(data.message || "Invalid credentials");
        setLoading(false);
      }
    } catch (err) {
      console.error("Login Error:", err.message);
      setError(err.message || "Something went wrong. Try again later.");
      setLoading(false);
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

          <button type="submit" className="btn btn-warning w-100" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm text-light"></span>
            ) : success ? (
              "✅ Verified"
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-center mt-3 auth-links">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}

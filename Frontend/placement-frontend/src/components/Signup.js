import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "../App.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Signup API request
      const signupResponse = await axios.post("https://mujtpcbackend.shivamrajdubey.tech/auth/signup", {
        //name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (signupResponse.status === 201) {
        const loginResponse = await axios.post(
          "https://mujtpcbackend.shivam…y.tech/auth/login",
          { email: formData.email, password: formData.password },
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
        
        if (loginResponse.status === 200) {
          Cookies.set("token", loginResponse.data.token, { expires: 7 });
          window.location.href = "/dashboard"; // Redirect after login
        }
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Signup or Login failed!");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2 className="text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 password-wrapper">
            <label className="form-label">Password</label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
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
          <button type="submit" className="btn btn-warning w-100">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

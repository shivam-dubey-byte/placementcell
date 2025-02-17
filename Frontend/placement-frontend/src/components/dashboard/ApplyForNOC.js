import React, { useState } from "react";
import "../../styles/Form1.css";
import axios from "axios"; // Import axios for making HTTP requests

const ApplyForNOC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "",
    supportingDocuments: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      supportingDocuments: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the token from localStorage or wherever it is stored
    const token = localStorage.getItem("token"); // Replace with your actual token retrieval logic

    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    // Prepare the data to send in the request body
    const requestData = {
      message: formData.reason, // Use the reason as the message
      noc: "1", // Set noc to "1" as required
    };

    try {
      // Send the POST request
      const response = await axios.post(
        "https://resumemujtpc.shivamrajdubey.tech/api/active-request",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      // Handle the response
      if (response.status === 201) {
        alert("NOC application submitted successfully!");
        console.log("Response:", response.data);
      } else {
        alert("Failed to submit NOC application.");
      }
    } catch (error) {
      console.error("Error submitting NOC application:", error);
      alert("An error occurred while submitting the NOC application.");
    }
  };

  return (
    <div className="form-container">
      <h2>Apply for NOC</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="reason">Reason for NOC:</label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="supportingDocuments">Supporting Documents:</label>
          <input
            type="file"
            id="supportingDocuments"
            name="supportingDocuments"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ApplyForNOC;

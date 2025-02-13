import React, { useState } from "react";
import "../../styles/Form1.css";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("NOC Application Submitted:", formData);
    alert("NOC application submitted successfully!");
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
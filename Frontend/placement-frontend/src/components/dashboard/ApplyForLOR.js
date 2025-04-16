import React, { useState, useRef } from "react";
import "../../styles/Form1.css";

const ApplyForLOR = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    fileUrl: "",
    lor: 1, // Ensure lor = 1 is always sent
  });

  const [fileUploading, setFileUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null); // Reference for file input

  const getToken = () => localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileUploading(true);
    
    const uploadData = new FormData();
    uploadData.append("resume", file);

    try {// https://requestsmuj.shivamrajdubey.tech
      const response = await fetch("http://localhost:5002/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: uploadData,
      });

      const result = await response.json();

      if (response.ok) {
        setFormData((prevData) => ({
          ...prevData,
          fileUrl: result.fileUrl,
        }));
        alert("File uploaded successfully!");
      } else {
        alert(`File upload failed: ${result.message}`);
      }
    } catch (error) {
      alert("Error uploading file. Please try again.");
    } finally {
      setFileUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fileUrl) {
      alert("Please upload a supporting document first.");
      return;
    }

    setSubmitting(true);

    try {// https://requestsmuj.shivamrajdubey.tech
      const response = await fetch("http://localhost:5002/api/active-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("LOR application submitted successfully!");
        console.log("LOR Application Data:", result);

        // Clear the form after submission
        setFormData({
          name: "",
          email: "",
          message: "",
          fileUrl: "",
          lor: 1, // Ensure it remains 1
        });

        // Reset file input manually
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        alert(`Submission failed: ${result.message}`);
      }
    } catch (error) {
      alert("Error submitting form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Apply for LOR</h2>
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
            disabled={submitting}
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
            disabled={submitting}
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Reason for LOR:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </div>
        <div className="form-group">
          <label htmlFor="supportingDocuments">Supporting Documents:</label>
          <input
            type="file"
            id="supportingDocuments"
            name="supportingDocuments"
            accept="application/pdf"
            ref={fileInputRef} // Attach ref here
            onChange={handleFileChange}
            required
            disabled={fileUploading || submitting}
          />
          {fileUploading && <p>Uploading file...</p>}
          {formData.fileUrl && (
            <p>
              File uploaded: <a href={formData.fileUrl} target="_blank" rel="noopener noreferrer">View File</a>
            </p>
          )}
        </div>
        <button type="submit" className="submit-button" disabled={fileUploading || submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ApplyForLOR;

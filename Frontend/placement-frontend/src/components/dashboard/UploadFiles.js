import React, { useState, useRef } from "react";
import "../../styles/UploadPlacement.css";
import "../../styles/UploadNotification.css"; // 👈 Create this CSS file

const UploadPlacementData = () => {
  const [placementYear, setPlacementYear] = useState("");
  const [studentYear, setStudentYear] = useState("");
  const [uploadingPlacement, setUploadingPlacement] = useState(false);
  const [uploadingStudent, setUploadingStudent] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const placementFileRef = useRef(null);
  const studentFileRef = useRef(null);

  const getToken = () => localStorage.getItem("token");

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000); // auto-dismiss
  };

  const handleUpload = async (type, year, fileRef, endpoint, setUploading, clearForm) => {
    const file = fileRef.current?.files[0];
    if (!file || !year) {
      showToast("⚠️ Please select both a file and a year.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("year", year);

    setUploading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`✅ ${type} uploaded successfully!`);
        clearForm();
      } else {
        showToast(`❌ Upload failed: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      showToast("❌ Error uploading file. See console for details.");
    } finally {
      setUploading(false);
    }
  };

  const getYearsList = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= 2020; y--) {
      years.push(y);
    }
    return years;
  };

  return (
    <div className="upload-wrapper">
      {toastMessage && <div className="toast">{toastMessage}</div>}
      <h2 className="upload-header">📁 Upload Placement & Student Data</h2>
      <div className="upload-grid">
        <div className="upload-card">
          <h3>Upload Placement Data</h3>
          <select
            value={placementYear}
            onChange={(e) => setPlacementYear(e.target.value)}
            className="upload-select"
          >
            <option value="">Select Year</option>
            {getYearsList().map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <label className="custom-file-label" htmlFor="placementFile">
            Choose Placement CSV
          </label>
          <input type="file" id="placementFile" accept=".csv" ref={placementFileRef} />

          <button
            onClick={() =>
              handleUpload(
                "Placement Data",
                placementYear,
                placementFileRef,
                "http://localhost:5005/api/upload-placement",
                setUploadingPlacement,
                () => {
                  setPlacementYear("");
                  if (placementFileRef.current) placementFileRef.current.value = "";
                }
              )
            }
            disabled={uploadingPlacement}
            className="upload-button"
          >
            {uploadingPlacement ? "Uploading..." : "Upload CSV"}
          </button>
        </div>

        <div className="upload-card">
          <h3>Upload Student List</h3>
          <select
            value={studentYear}
            onChange={(e) => setStudentYear(e.target.value)}
            className="upload-select"
          >
            <option value="">Select Year</option>
            {getYearsList().map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <label className="custom-file-label" htmlFor="studentFile">
            Choose Student CSV
          </label>
          <input type="file" id="studentFile" accept=".csv" ref={studentFileRef} />

          <button
            onClick={() =>
              handleUpload(
                "Student List",
                studentYear,
                studentFileRef,
                "http://localhost:5005/api/upload-students",
                setUploadingStudent,
                () => {
                  setStudentYear("");
                  if (studentFileRef.current) studentFileRef.current.value = "";
                }
              )
            }
            disabled={uploadingStudent}
            className="upload-button blue"
          >
            {uploadingStudent ? "Uploading..." : "Upload CSV"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPlacementData;

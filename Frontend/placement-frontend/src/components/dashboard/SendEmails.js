import React, { useState } from "react";
import axios from "axios";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import "./SendEmails.css";

const SendEmails = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isMassMailing, setIsMassMailing] = useState(true);
  const [feedback, setFeedback] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const lines = reader.result.split("\n");
        const emails = lines.map((line) => line.trim()).filter(Boolean);
        resolve(emails);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const handleSendEmails = async () => {
    if ((!csvFile && isMassMailing) || !subject || !message || (!isMassMailing && !email)) {
      setFeedback("Please complete all fields and provide the required file or email address.");
      return;
    }

    setIsSending(true);
    setFeedback("");

    try {
      const token = localStorage.getItem("token");

      if (isMassMailing) {
        const emails = await parseCSV(csvFile);
        if (emails.length === 0) {
          setFeedback("No emails found in the CSV file.");
          setIsSending(false);
          return;
        }

        const response = await axios.post(
          "http://localhost:5004/api/sendEmails",
          { emails, subject, message },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setFeedback(response.data.success ? "Emails sent successfully!" : "Error sending the emails.");
      } else {
        const response = await axios.post(
          "http://localhost:5004/api/sendEmail",
          { email, subject, message },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setFeedback(response.data.success ? "Email sent successfully!" : "Error sending the email.");
      }
    } catch (error) {
      console.error("Error sending emails:", error);
      setFeedback("An error occurred while processing the request.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="send-emails-container">
      <h2>Send Emails</h2>
      <p>Select your mailing option and fill in the details.</p>

      <div className="toggle-button-row">
        <button
          className={`toggle-half ${isMassMailing ? "active" : ""}`}
          onClick={() => setIsMassMailing(true)}
        >
          Mass Mailing
        </button>
        <button
          className={`toggle-half ${!isMassMailing ? "active" : ""}`}
          onClick={() => setIsMassMailing(false)}
        >
          Single Email
        </button>
      </div>

      <div className="form-grid">
        {isMassMailing ? (
          <div className="form-section full">
            <label className="input-label">Upload CSV File</label>
            <div className="csv-upload-inline" onClick={() => document.getElementById("csvUpload").click()}>
              <span className="upload-icon">📎</span>
              <span className="upload-text">
                {csvFile ? csvFile.name : "Click to select CSV file"}
              </span>
              <input
                type="file"
                id="csvUpload"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden-upload"
              />
            </div>
          </div>
        ) : (
          <div className="form-section">
            <label className="input-label">Recipient Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="example@email.com"
            />
          </div>
        )}

        <div className="form-section">
          <label className="input-label">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input-field"
            placeholder="Email Subject"
          />
        </div>

        <div className="form-section full">
          <label className="input-label">Message</label>


          <SunEditor
  setContents={message}
  onChange={setMessage}
  setOptions={{
    height: 300,
    defaultStyle: "text-align: left;",
    formats: ["p", "div", "h1", "h2"],
    buttonList: [
      ["undo", "redo"],
      ["formatBlock"],
      ["bold", "underline", "italic"],
      ["fontColor", "hiliteColor"],
     // ["align"],
      ["list", "link", "image"],
      ["removeFormat", "fullScreen"]
    ],
    imageUploadHeader: {}, // no headers needed
    imageUploadUrl: null,  // disables external uploading
    imageGalleryUrl: null,
    imageUploadSizeLimit: 300000, // 300KB max to be safe
    imageAccept: "image/*",
    base64Encode: true, // ✅ ENABLE base64
  }}
  className="sun-editor"
/>




        </div>
      </div>

      {feedback && <p className="feedback">{feedback}</p>}

      <button
        className={`send-btn ${isSending ? "loading" : ""}`}
        onClick={handleSendEmails}
        disabled={isSending}
      >
        {isSending ? <span className="loading-spinner"></span> : "Send Email"}
      </button>
    </div>
  );
};

export default SendEmails;

import React, { useState } from "react";
import axios from "axios";
import "./SendEmails.css"; // Link your CSS file here

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

  const handleSubjectChange = (e) => setSubject(e.target.value);
  const handleMessageChange = (e) => setMessage(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);

  const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result;
        const lines = text.split("\n");
        const emails = lines.map((line) => line.trim()).filter(Boolean);
        resolve(emails);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const handleSendEmails = async () => {
    if ((!csvFile && isMassMailing) || !subject || !message || (isMassMailing && !csvFile && !email)) {
      setFeedback("Please complete all fields and upload a CSV file or provide an email address.");
      return;
    }

    setIsSending(true);
    setFeedback("");

    try {
      if (isMassMailing) {
        const emails = await parseCSV(csvFile);
        if (emails.length === 0) {
          setFeedback("No emails found in the CSV file.");
          setIsSending(false);
          return;
        }

        const response = await axios.post("https://your-backend-api.com/sendEmails", {
          emails,
          subject,
          message,
        });

        if (response.data.success) {
          setFeedback("Emails sent successfully!");
        } else {
          setFeedback("Error sending the emails.");
        }
      } else {
        const response = await axios.post("https://your-backend-api.com/sendEmail", {
          email,
          subject,
          message,
        });

        if (response.data.success) {
          setFeedback("Email sent successfully!");
        } else {
          setFeedback("Error sending the email.");
        }
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
      <div className="overlay"></div>
      <h2>Send Emails</h2>
      <p>Select your mailing option and provide the details.</p>

      <div className="radio-buttons">
        <div className="radio-option">
          <label>
            <input
              type="radio"
              name="mailing-option"
              checked={isMassMailing}
              onChange={() => setIsMassMailing(true)}
            />
            Mass Mailing (CSV Upload)
          </label>
        </div>
        <div className="radio-option">
          <label>
            <input
              type="radio"
              name="mailing-option"
              checked={!isMassMailing}
              onChange={() => setIsMassMailing(false)}
            />
            Send to a Particular Email
          </label>
        </div>
      </div>

      {isMassMailing ? (
        <div className="upload-section">
          <label htmlFor="fileUpload" className="input-label">
            Upload CSV File:
          </label>
          <input
            type="file"
            id="fileUpload"
            accept=".csv"
            onChange={handleFileUpload}
            className="upload-input"
          />
        </div>
      ) : (
        <div className="input-section">
          <label htmlFor="email" className="input-label">
            Recipient's Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter recipient's email"
            className="input-field"
          />
        </div>
      )}

      <div className="input-section">
        <label htmlFor="subject" className="input-label">
          Subject:
        </label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={handleSubjectChange}
          placeholder="Enter email subject"
          className="input-field"
        />
      </div>

      <div className="input-section">
        <label htmlFor="message" className="input-label">
          Message:
        </label>
        <textarea
          id="message"
          value={message}
          onChange={handleMessageChange}
          placeholder="Enter your message"
          className="textarea-field"
        />
      </div>

      {feedback && <p className="feedback">{feedback}</p>}

      <button
        className={`send-btn ${isSending ? "loading" : ""}`}
        onClick={handleSendEmails}
        disabled={isSending}
      >
        {isSending ? (
          <span className="loading-spinner"></span>
        ) : (
          "Send Emails"
        )}
      </button>
    </div>
  );
};

export default SendEmails;

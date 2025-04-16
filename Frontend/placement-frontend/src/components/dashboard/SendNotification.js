import React, { useState } from "react";

const SendNotification = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState({ show: false, success: true, message: "" });

  const getToken = () => localStorage.getItem("token");

  const showToast = (success, message) => {
    setToast({ show: true, success, message });
    setTimeout(() => setToast({ show: false, success: true, message: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const response = await fetch("http://localhost:5009/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ title, message, broadcast: true }),
      });

      const result = await response.json();
      if (response.ok) {
        showToast(true, "✅ Notification sent!");
        setTitle("");
        setMessage("");
      } else {
        showToast(false, `❌ Failed: ${result.message}`);
      }
    } catch (err) {
      showToast(false, "❌ Something went wrong.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={notificationPage}>
      <style>
        {`
          @keyframes slideUp {
            from {
              transform: translate(-50%, 100%);
              opacity: 0;
            }
            to {
              transform: translate(-50%, 0%);
              opacity: 1;
            }
          }
        `}
      </style>

      <div style={notificationCard}>
        <h2 style={notificationTitle}>📣 Notify Students</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Important update..."
              required
              style={inputStyle}
            />
          </div>
          <div style={inputGroup}>
            <label style={labelStyle}>Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message to all students..."
              required
              style={textareaStyle}
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            style={{
              ...buttonStyle,
              cursor: sending ? "not-allowed" : "pointer",
              opacity: sending ? 0.6 : 1,
            }}
          >
            {sending ? "Sending..." : "🚀 Send Notification"}
          </button>
        </form>

        {toast.show && (
          <div
            style={{
              ...toastStyle,
              background: toast.success
                ? "linear-gradient(135deg, #00c9ff, #92fe9d)"
                : "linear-gradient(135deg, #ff758c, #ff7eb3)",
            }}
          >
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default SendNotification;

// Inline Styles
const notificationPage = {
  width: "100%",
  height: "100%",
  padding: "40px",
  background: "linear-gradient(135deg, #e3f2fd, #fce4ec)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxSizing: "border-box",
  borderRadius: "12px",
};

const notificationCard = {
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(8px)",
  borderRadius: "16px",
  padding: "40px",
  maxWidth: "600px",
  width: "100%",
  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.1)",
};

const notificationTitle = {
  fontSize: "2rem",
  textAlign: "center",
  color: "#333",
  marginBottom: "30px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const inputGroup = {
  display: "flex",
  flexDirection: "column",
};

const labelStyle = {
  fontWeight: 600,
  marginBottom: "8px",
  fontSize: "1rem",
  color: "#444",
};

const inputStyle = {
  padding: "12px 16px",
  fontSize: "1rem",
  borderRadius: "10px",
  border: "1px solid #ccc",
  outline: "none",
};

const textareaStyle = {
  padding: "12px 16px",
  fontSize: "1rem",
  borderRadius: "10px",
  border: "1px solid #ccc",
  outline: "none",
  minHeight: "120px",
  resize: "vertical",
};

const buttonStyle = {
  padding: "14px",
  fontSize: "1.1rem",
  fontWeight: "bold",
  background: "linear-gradient(135deg, #2196f3, #6f42c1)",
  color: "white",
  border: "none",
  borderRadius: "50px",
  transition: "background 0.3s ease",
};

const toastStyle = {
  position: "fixed",
  bottom: "30px",
  left: "50%",
  transform: "translateX(-50%)",
  padding: "12px 24px",
  borderRadius: "30px",
  color: "white",
  fontWeight: "bold",
  fontSize: "1rem",
  zIndex: 1000,
  animation: "slideUp 0.4s ease-out",
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
};

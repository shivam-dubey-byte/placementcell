import { useEffect, useState } from "react";
import { Button, Card, Form, Spinner, Alert } from "react-bootstrap";

const ResumeUpload = () => {
  const [resume, setResume] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    // Fetch existing resume from the backend
    const fetchResume = async () => {
      try {
        const response = await fetch("https://requestsmuj.shivamrajdubey.tech/api/resume", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is stored
          },
        });

        const data = await response.json();
        if (response.ok && data.fileUrl) {
          setResumeUrl(data.fileUrl);
        }
      } catch (error) {
        console.error("Error fetching resume:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setResume(file);
      setUploadSuccess(false); // Reset success state
      setErrorMessage(null); // Reset error state

      // Upload to backend
      uploadResume(file);
    }
  };

  const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("https://requestsmuj.shivamrajdubey.tech/resume-upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.fileUrl) {
          setResumeUrl(data.fileUrl);
          setUploadSuccess(true); // Show success message
        } else {
          setErrorMessage("Upload successful, but no file URL returned.");
        }
      } else {
        setErrorMessage("Resume upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      setErrorMessage("Network error. Please check your connection.");
    }
  };

  return (
    <Card className="shadow-lg p-4 border-0" style={{ backgroundColor: "#f4f4f4" }}>
      <Card.Body>
        <h4 className="text-dark mb-3">Upload Resume</h4>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            {uploadSuccess && <Alert variant="success">Resume uploaded successfully!</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            {!resumeUrl ? (
              <Form.Label
                className="d-block p-4 border rounded text-center cursor-pointer"
                style={{ borderColor: "#2c3e50", color: "#2c3e50", backgroundColor: "white" }}
              >
                <Form.Control type="file" className="d-none" accept=".pdf,.doc,.docx" onChange={handleUpload} />
                <span>Click to Upload</span>
              </Form.Label>
            ) : (
              <div className="text-center">
                {resume && <p className="text-muted small mb-2">{resume.name}</p>}
                <div className="d-flex justify-content-center gap-3">
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    download="resume.pdf"
                    style={{ backgroundColor: "#2c3e50", color: "white" }}
                  >
                    View Resume
                  </a>
                  <Form.Label className="btn text-white m-0" style={{ backgroundColor: "#f39c12" }}>
                    <Form.Control type="file" className="d-none" accept=".pdf,.doc,.docx" onChange={handleUpload} />
                    Reupload
                  </Form.Label>
                </div>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default ResumeUpload;

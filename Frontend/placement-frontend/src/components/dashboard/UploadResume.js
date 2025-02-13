import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";

const ResumeUpload = () => {
  const [resume, setResume] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setResume(file);
      setResumeUrl(URL.createObjectURL(file));
    }
  };

  return (
    <Card className="shadow-lg p-4 border-0" style={{ backgroundColor: "#f4f4f4" }}>
      <Card.Body>
        <h4 className="text-dark mb-3">Upload Resume</h4>

        {!resume ? (
          <Form.Label
            className="d-block p-4 border rounded text-center cursor-pointer"
            style={{ borderColor: "#2c3e50", color: "#2c3e50", backgroundColor: "white" }}
          >
            <Form.Control type="file" className="d-none" accept=".pdf,.doc,.docx" onChange={handleUpload} />
            <span>Click to Upload</span>
          </Form.Label>
        ) : (
          <div className="text-center">
            <p className="text-muted small mb-2">{resume.name}</p>
            <div className="d-flex justify-content-center gap-3">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
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
      </Card.Body>
    </Card>
  );
};

export default ResumeUpload;

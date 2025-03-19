import React, { useState, useEffect } from 'react';
import './ApproveLOR.css';

const ApproveLOR = () => {
  const [lorRequests, setLorRequests] = useState([]);
  const [isApproving, setIsApproving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Sample LOR Data
  useEffect(() => {
    // Simulate fetching data from backend (can be replaced with real API call)
    const sampleRequests = [
      {
        id: 1,
        studentName: 'Krishna Yadav',
        studentEmail: 'krishna.yadav@example.com',
        reason: 'Requesting LOR for applying to an international university.',
        docLink: 'http://example.com/lor-docs/krishna-yadav-lor.pdf',
        status: 'Pending'
      },
      {
        id: 2,
        studentName: 'Siddharth Reddy',
        studentEmail: 'siddharth.reddy@example.com',
        reason: 'Requesting LOR for internship application.',
        docLink: 'http://example.com/lor-docs/siddharth-reddy-lor.pdf',
        status: 'Pending'
      }
    ];

    setLorRequests(sampleRequests);
  }, []);

  // Handle approval
  const handleApprove = (id) => {
    setIsApproving(true);
    setFeedbackMessage('');

    // Simulate approval process
    setTimeout(() => {
      setLorRequests((prevState) =>
        prevState.map((request) =>
          request.id === id ? { ...request, status: 'Approved' } : request
        )
      );
      setFeedbackMessage('LOR Request Approved!');
      setIsApproving(false);
    }, 1000);
  };

  // Handle rejection
  const handleReject = (id) => {
    setIsApproving(true);
    setFeedbackMessage('');

    // Simulate rejection process
    setTimeout(() => {
      setLorRequests((prevState) =>
        prevState.map((request) =>
          request.id === id ? { ...request, status: 'Rejected' } : request
        )
      );
      setFeedbackMessage('LOR Request Rejected!');
      setIsApproving(false);
    }, 1000);
  };

  return (
    <div className="lor-approval-container">
      <h2 className="title">Approve LOR Requests</h2>

      {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}

      {/* Display LOR Requests */}
      {lorRequests.length === 0 ? (
        <p className="loading-text">No LOR requests available.</p>
      ) : (
        lorRequests.map((lor) => (
          <div className="lor-block" key={lor.id}>
            <div className="lor-header">
              <h3>{lor.studentName}</h3>
              <p className="student-email">{lor.studentEmail}</p>
            </div>

            <div className="lor-details">
              <div className="detail-item">
                <label>Reason:</label>
                <p>{lor.reason}</p>
              </div>

              <div className="detail-item">
                <label>Document:</label>
                <div className="document-container">
                  <a
                    href={lor.docLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="document-link"
                  >
                    Supporting Document
                  </a>
                </div>
              </div>

              <div className="detail-item">
                <label>Status:</label>
                <div className="status-container">
                  <p className={`status ${lor.status.toLowerCase()}`}>
                    {lor.status}
                  </p>
                </div>
              </div>
            </div>

            {lor.status === 'Pending' && (
              <div className="action-buttons">
                <button
                  onClick={() => handleApprove(lor.id)}
                  className="approve-btn"
                  disabled={isApproving}
                >
                  {isApproving ? 'Approving...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleReject(lor.id)}
                  className="reject-btn"
                  disabled={isApproving}
                >
                  {isApproving ? 'Rejecting...' : 'Reject'}
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ApproveLOR;

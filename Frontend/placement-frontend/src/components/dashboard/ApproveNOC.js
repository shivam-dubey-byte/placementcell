import React, { useState, useEffect } from 'react';
import './ApproveNOC.css';

const ApproveNOC = () => {
  const [nocRequests, setNocRequests] = useState([]);
  const [isApproving, setIsApproving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Sample NOC Data
  useEffect(() => {
    // Simulate fetching data from backend (can be replaced with real API call)
    const sampleRequests = [
      {
        id: 1,
        studentName: 'Shivam Dubey',
        studentEmail: 'shivam.dubey@example.com',
        reason: 'Requesting NOC for higher studies at a foreign university.',
        docLink: 'http://example.com/noc-docs/shivam-dubey-noc.pdf',
        status: 'Pending'
      },
      {
        id: 2,
        studentName: 'Karan Sharma',
        studentEmail: 'karan.sharma@example.com',
        reason: 'Requesting NOC for attending a national conference on AI.',
        docLink: 'http://example.com/noc-docs/karan-sharma-noc.pdf',
        status: 'Pending'
      }
    ];

    setNocRequests(sampleRequests);
  }, []);

  // Handle approval
  const handleApprove = (id) => {
    setIsApproving(true);
    setFeedbackMessage('');

    // Simulate approval process
    setTimeout(() => {
      setNocRequests((prevState) =>
        prevState.map((request) =>
          request.id === id ? { ...request, status: 'Approved' } : request
        )
      );
      setFeedbackMessage('NOC Request Approved!');
      setIsApproving(false);
    }, 1000);
  };

  // Handle rejection
  const handleReject = (id) => {
    setIsApproving(true);
    setFeedbackMessage('');

    // Simulate rejection process
    setTimeout(() => {
      setNocRequests((prevState) =>
        prevState.map((request) =>
          request.id === id ? { ...request, status: 'Rejected' } : request
        )
      );
      setFeedbackMessage('NOC Request Rejected!');
      setIsApproving(false);
    }, 1000);
  };

  return (
    <div className="noc-approval-container">
      <h2 className="title">Approve NOC Requests</h2>

      {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}

      {/* Display NOC Requests */}
      {nocRequests.length === 0 ? (
        <p className="loading-text">No NOC requests available.</p>
      ) : (
        nocRequests.map((noc) => (
          <div className="noc-block" key={noc.id}>
            <div className="noc-header">
              <h3>{noc.studentName}</h3>
              <p className="student-email">{noc.studentEmail}</p>
            </div>

            <div className="noc-details">
              <div className="detail-item">
                <label>Reason:</label>
                <p>{noc.reason}</p>
              </div>

              <div className="detail-item">
                <label>Document:</label>
                <div className="document-container">
                  <a
                    href={noc.docLink}
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
                  <p className={`status ${noc.status.toLowerCase()}`}>
                    {noc.status}
                  </p>
                </div>
              </div>
            </div>

            {noc.status === 'Pending' && (
              <div className="action-buttons">
                <button
                  onClick={() => handleApprove(noc.id)}
                  className="approve-btn"
                  disabled={isApproving}
                >
                  {isApproving ? 'Approving...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleReject(noc.id)}
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

export default ApproveNOC;

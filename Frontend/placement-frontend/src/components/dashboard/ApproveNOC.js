import React, { useState, useEffect } from 'react';
import './ApproveNOC.css';

const ApproveNOC = () => {
  const [nocRequests, setNocRequests] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const [processingType, setProcessingType] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch NOC Requests from API
  useEffect(() => {
    const fetchNOCRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5003/api/active-request', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to fetch requests');
        }

        const { data } = await response.json();

        const formattedData = data.map((item) => ({
          id: item._id,
          studentName: item.name,
          studentEmail: item.email,
          reason: item.message,
          docLink: item.fileUrl,
          dateTime: item.dateTime,
          status: 'Pending',
        }));

        setNocRequests(formattedData);
      } catch (error) {
        console.error('Fetch Error:', error);
        setFeedbackMessage(error.message || 'Failed to load NOC requests');
      } finally {
        setLoading(false);
      }
    };

    fetchNOCRequests();
  }, []);

  const handleAction = async (requestId, actionValue, studentEmail, dateTime) => {
    setProcessingId(requestId);
    setProcessingType(actionValue === 1 ? 'approve' : 'reject');
    setFeedbackMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5003/api/action', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: actionValue,
          email: studentEmail,
          dateTime: dateTime,
          requestId: requestId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Action failed');
      }

      setNocRequests((prev) =>
        prev.map((request) =>
          request.id === requestId
            ? { ...request, status: actionValue === 1 ? 'Approved' : 'Rejected' }
            : request
        )
      );

      setFeedbackMessage(`NOC Request ${actionValue === 1 ? 'Approved' : 'Rejected'}!`);
    } catch (error) {
      console.error('Action Error:', error);
      setFeedbackMessage(error.message);
    } finally {
      setProcessingId(null);
      setProcessingType(null);
    }
  };

  const handleApprove = (id, email, dateTime) => {
    handleAction(id, 1, email, dateTime);
  };

  const handleReject = (id, email, dateTime) => {
    handleAction(id, 0, email, dateTime);
  };

  return (
    <div className="noc-approval-container">
      <h2 className="title">Approve NOC Requests</h2>

      {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}

      {loading ? (
        <p className="loading-text">Loading NOC requests...</p>
      ) : nocRequests.length === 0 ? (
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
                  <p className={`status ${noc.status.toLowerCase()}`}>{noc.status}</p>
                </div>
              </div>
            </div>

            {noc.status === 'Pending' && (
              <div className="action-buttons">
                <button
                  onClick={() => handleApprove(noc.id, noc.studentEmail, noc.dateTime)}
                  className="approve-btn"
                  disabled={processingId === noc.id}
                >
                  {processingId === noc.id && processingType === 'approve' ? 'Approving...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleReject(noc.id, noc.studentEmail, noc.dateTime)}
                  className="reject-btn"
                  disabled={processingId === noc.id}
                >
                  {processingId === noc.id && processingType === 'reject' ? 'Rejecting...' : 'Reject'}
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

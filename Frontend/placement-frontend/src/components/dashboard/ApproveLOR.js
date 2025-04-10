import React, { useState, useEffect } from 'react';
import './ApproveLOR.css';

const ApproveLOR = () => {
  const [lorRequests, setLorRequests] = useState([]);
  const [processingId, setProcessingId] = useState(null); // Tracks the ID being processed
  const [processingType, setProcessingType] = useState(null); // 'approve' or 'reject'
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch LOR Requests from API
  useEffect(() => {
    const fetchLORRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5002/api/active-request', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to fetch requests');
        }

        const { data } = await response.json();

        const formattedData = data.map(item => ({
          id: item._id,
          studentName: item.name,
          studentEmail: item.email,
          reason: item.message,
          docLink: item.fileUrl,
          dateTime: item.dateTime,
          status: 'Pending'
        }));

        setLorRequests(formattedData);
      } catch (error) {
        console.error('Fetch Error:', error);
        setFeedbackMessage(error.message || 'Failed to load LOR requests');
      } finally {
        setLoading(false);
      }
    };

    fetchLORRequests();
  }, []);

  const handleAction = async (requestId, actionValue, studentEmail, dateTime) => {
    setProcessingId(requestId);
    setProcessingType(actionValue === 1 ? 'approve' : 'reject');
    setFeedbackMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5002/api/action', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: actionValue,
          email: studentEmail,
          dateTime: dateTime,
          requestId: requestId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Action failed');
      }

      setLorRequests(prev =>
        prev.map(request =>
          request.id === requestId
            ? { ...request, status: actionValue === 1 ? 'Approved' : 'Rejected' }
            : request
        )
      );

      setFeedbackMessage(`LOR Request ${actionValue === 1 ? 'Approved' : 'Rejected'}!`);
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
    <div className="lor-approval-container">
      <h2 className="title">Approve LOR Requests</h2>

      {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}

      {loading ? (
        <p className="loading-text">Loading LOR requests...</p>
      ) : lorRequests.length === 0 ? (
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
                  onClick={() => handleApprove(lor.id, lor.studentEmail, lor.dateTime)}
                  className="approve-btn"
                  disabled={processingId === lor.id}
                >
                  {processingId === lor.id && processingType === 'approve' ? 'Approving...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleReject(lor.id, lor.studentEmail, lor.dateTime)}
                  className="reject-btn"
                  disabled={processingId === lor.id}
                >
                  {processingId === lor.id && processingType === 'reject' ? 'Rejecting...' : 'Reject'}
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

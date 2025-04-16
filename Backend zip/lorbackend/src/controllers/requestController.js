const {
    addToActiveRequest,
    fetchFromActiveRequest,
    removeFromActiveRequest,
    fetchFromHistory,
    addToHistory,
    increaseRequestData,
    decreaseActiveRequest,
    actionHistory
} = require('../models/requestModel.js');

const axios = require("axios");

// Add new Active Request
const addActiveRequest = async (req, res) => {
    const dateTime = new Date();
    const { name, email, message, noc, lor = "NUL", fileUrl } = req.body;

    try {
        const newRequest = await addToActiveRequest(name, email, message, fileUrl, dateTime);
        await increaseRequestData();
        await addToHistory(name, email, message, fileUrl, dateTime);

        const notificationMessage = `You the New LOR request`;
        const notificationTitle = "New LOR Request";
        await axios.post(
            "http://localhost:5009/api/notifications",
            {
              //email:"admin@mujiot.com", // recipient (student)
              title: notificationTitle,
              message: notificationMessage,
              broadcast:true,
            },
            {
              headers: {
                Authorization: `Bearer ${req.token}` // use the extracted token
              }
            }
          );
          
        res.status(201).json({ message: 'Data added to ActiveRequest', request: newRequest });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get paginated Active Requests
const getActiveRequest = async (req, res) => {
    const { page = 0, limit = 5 } = req.body;

    try {
        const data = await fetchFromActiveRequest(parseInt(page), parseInt(limit));
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Approve/Reject Request
const actionLorRequest = async (req, res) => {
    try {
        let { action, email, dateTime, requestId } = req.body;
        dateTime = new Date(dateTime);

        if (typeof action === 'undefined' || !requestId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: action and requestId'
            });
        }

        if (![0, 1].includes(Number(action))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid action value. Use 0 (reject) or 1 (approve)'
            });
        }

        const actionDateTime = new Date();

        await actionHistory(email, dateTime, action, actionDateTime);
        await removeFromActiveRequest(email, dateTime);
        await decreaseActiveRequest();
        
        const notificationMessage = `Your LOR request has been ${action === 1 ? 'approved' : 'rejected'}`;
        const notificationTitle = action === 1 ? "LOR Request Approved ✅" : "Request Rejected ❌";
        
        await axios.post(
          "http://localhost:5009/api/notifications",
          {
            email, // recipient (student)
            title: notificationTitle,
            message: notificationMessage
          },
          {
            headers: {
              Authorization: `Bearer ${req.token}` // use the extracted token
            }
          }
        );
        


        res.status(200).json({
            success: true,
            message: `Request ${action === 1 ? 'approved' : 'rejected'} successfully`
        });

    } catch (error) {
        console.error('Error processing action:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get History
const getHistory = async (req, res) => {
    const { email, page = 0, limit = 5 } = req.body;

    try {
        const data = await fetchFromHistory(email, parseInt(page), parseInt(limit));
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    addActiveRequest,
    getActiveRequest,
    getHistory,
    actionLorRequest
};

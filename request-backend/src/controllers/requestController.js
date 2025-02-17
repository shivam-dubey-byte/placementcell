const {
    addToActiveRequest,
    fetchFromActiveRequest,
    removeFromActiveRequest,
    addToHistory,
    fetchFromHistory
} = require('../models/requestModel.js');

// Add data to ActiveRequest (email from token)
const addActiveRequest = async (req, res) => {
    console.log(req.email);
    const email = req.email; // Email extracted from token
    const { message, noc = "NUL", lor = "NUL", time } = req.body;
    console.log(email);
    try {
        const newRequest = await addToActiveRequest(email, message, noc, lor, time);
        await addToHistory(email, message, noc, lor, time);
        res.status(201).json({ message: 'Data added to ActiveRequest', request: newRequest });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Fetch data from ActiveRequest (email from body)
const getActiveRequest = async (req, res) => {
    const { email, page = 0, limit = 5 } = req.body;

    try {
        const data = await fetchFromActiveRequest(email, parseInt(page), parseInt(limit));
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Remove data from ActiveRequest (email from body)
const deleteActiveRequest = async (req, res) => {
    const { email, field } = req.body;

    try {
        const result = await removeFromActiveRequest(email, field);
        res.status(200).json({ message: 'Data removed from ActiveRequest', result });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Add data to History (email from token) Not being used just made for emergency
const addHistory = async (req, res) => {
    const email = req.user; // Email extracted from token
    const { message, noc = "NUL", lor = "NUL", time } = req.body;
    const role = req.role;
    try {
        if(role=='admin'){
        const newHistory = await addToHistory(email, message, noc, lor, time);
        res.status(201).json({ message: 'Data added to History', history: newHistory });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}; 

// Fetch data from History (email from body)
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
    deleteActiveRequest,
    addHistory,
    getHistory
};

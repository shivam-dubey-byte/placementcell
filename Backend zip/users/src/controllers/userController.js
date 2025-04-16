// controllers/userController.js
const { getStudents,
  getAdmins,
   findUserByNameOrEmail,
   updateUser, 
   deleteUser,
   findAdminByNameOrEmail  } = require('../models/userModel');

// Get all students
const fetchStudents = async (req, res) => {
  try {
    const page = req.body.page ?? 1;
    const students = await getStudents(page);
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Find user by name or email (using request body)
const searchUser = async (req, res) => {
  try {
    const { query } = req.body;
    const page = req.body.page ?? 1;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required in the request body" });
    }

    const users = await findUserByNameOrEmail(query,page);

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error in searchUser:", error); // Debugging
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Find user by name or email (using request body)
const searchAdmin = async (req, res) => {
  try {
    const { query } = req.body;
    const page = req.body.page ?? 1;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required in the request body" });
    }

    const users = await findAdminByNameOrEmail(query,page);

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error in searchUser:", error); // Debugging
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Get all students
const fetchAdmins = async (req, res) => {
  try {
    const page = req.body.page ?? 1;
    const admins = await getAdmins(page);
    res.status(200).json({ admins});
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


// Edit (Update) User
const editUser = async (req, res) => {
  try {
    const { userId, updates } = req.body; // Expect userId and updates object

    if (!userId || !updates) {
      return res.status(400).json({ error: "User ID and updates are required" });
    }

    const result = await updateUser(userId, updates);
    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", updatedUser: result });
  } catch (error) {
    console.error("Error in editUser:", error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Delete User
const removeUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const result = await deleteUser(userId);
    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in removeUser:", error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};


module.exports = { fetchStudents, searchUser, fetchAdmins,removeUser,editUser,searchAdmin  };

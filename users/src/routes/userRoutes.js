// routes/userRoutes.js
const express = require('express');
const { fetchStudents, 
    searchUser, 
    fetchAdmins,
    editUser,
    removeUser  } = require('../controllers/userController');

const router = express.Router();

// Route to fetch all students (Paginated)
router.post('/students', fetchStudents);

// Route to fetch all admins (Paginated)
router.post('/admins', fetchAdmins);

// Route to search users by name or email
router.post('/search', searchUser);



// Route to edit (update) user details
router.post('/edit', editUser);

// Route to delete a user
router.post('/delete', removeUser);


module.exports = router;

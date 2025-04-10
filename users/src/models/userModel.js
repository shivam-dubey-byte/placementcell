// models/userModel.js
const { ObjectId } = require('mongodb');
const connectDB = require('../connectDB');

// Get all students
const getStudents = async (page) => {
  const db = await connectDB("user");
  const usersCollection = db.collection("users");
  const resumesCollection = db.collection("resume");

  // Fetch students with pagination
  const students = await usersCollection
    .find({ role: "student" })
    .project({ password: 0, __v: 0 }) // Exclude sensitive fields
    .skip((page - 1) * 10) // Pagination
    .limit(10)
    .toArray();

  // Extract emails of students
  const emails = students.map(student => student.email);

  // Fetch resumes by email
  const resumes = await resumesCollection
    .find({ email: { $in: emails } })
    .toArray();

  // Attach resume URLs to students
  const studentsWithResumes = students.map(student => ({
    ...student,
    resume: resumes.find(resume => resume.email === student.email)?.resume || null
  }));

  return studentsWithResumes;
};

/*
const getStudents = async (page) => {
  const db = await connectDB("user");
  const usersCollection = db.collection("users");
  const resumesCollection = db.collection("resume");

  // Fetch students with pagination
  const students = await usersCollection
    .find({ role: "student" })
    .project({ password: 0, __v: 0 }) // Exclude sensitive fields
    .skip((page - 1) * 10) // Pagination
    .limit(10)
    .toArray();

  // Extract emails of students
  const emails = students.map(student => student.email);

  // Fetch resumes by email
  const resumes = await resumesCollection
    .find({ email: { $in: emails } })
    .toArray();

  // Attach resumes to corresponding students
  const studentsWithResumes = students.map(student => ({
    ...student,
    resume: resumes.find(resume => resume.email === student.email) || null
  }));

  return studentsWithResumes;
};
*/
/*
const getStudents = async (page) => {
  const db = await connectDB("user");
  const collection = db.collection('users');
  
  const students = await collection.find({ role: "student" })
  .project({ password: 0, __v: 0 })  // Exclude sensitive fields
  .skip((page - 1) * 10)  // Skip users for pagination
  .limit(10)  // Get only 10 students per page
  .toArray();

  return students;
}; */

const getAdmins = async (page) => {
  const db = await connectDB("user");
  const collection = db.collection('users');
  
  const admins = await collection.find({ role: "admin" })
  .project({ password: 0, __v: 0 })  // Exclude sensitive fields
  .skip((page - 1) * 10)  // Skip users for pagination
  .limit(10)  // Get only 10 students per page
  .toArray();

  return admins;
};

// Find a user by name or email (case-insensitive)
const findUserByNameOrEmail = async (query,page) => {
  try {
    const db = await connectDB("user");
    const collection = db.collection('users');

    const users = await collection.find({
      $and: [
        { role: "student" }, // Ensure the user has the role "student"
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    }).project({ password: 0, __v: 0 })
    .project({ password: 0, __v: 0 })  // Exclude sensitive fields
    .skip((page - 1) * 10)  // Skip users for pagination
    .limit(10)  // Get only 10 students per page
    .toArray();

    return users;
  } catch (error) {
    console.error("Database error:", error);
    return [];
  }
};

// Find a user by name or email (case-insensitive)
const findAdminByNameOrEmail = async (query,page) => {
  try {
    const db = await connectDB("user");
    const collection = db.collection('users');

    const users = await collection.find({
      $and: [
        { role: "admin" }, // Ensure the user has the role "student"
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    }).project({ password: 0, __v: 0 })
    .project({ password: 0, __v: 0 })  // Exclude sensitive fields
    .skip((page - 1) * 10)  // Skip users for pagination
    .limit(10)  // Get only 10 students per page
    .toArray();

    return users;
  } catch (error) {
    console.error("Database error:", error);
    return [];
  }
};

// Update User
const updateUser = async (userId, updates) => {
  try {
    const db = await connectDB("user");
    const collection = db.collection('users');

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(userId) }, 
      { $set: updates }, 
      { returnDocument: 'after' } // Return updated user
    );

    return result.value; // Return updated user object
  } catch (error) {
    console.error("Error in updateUser:", error);
    return null;
  }
};

// Delete User
const deleteUser = async (userId) => {
  try {
    const db = await connectDB("user");
    const collection = db.collection('users');

    const result = await collection.deleteOne({ _id: new ObjectId(userId) });

    return result.deletedCount > 0; // Return true if user deleted
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return false;
  }
};


module.exports = {
   getStudents,
   findUserByNameOrEmail, 
   getAdmins, 
   deleteUser, 
   updateUser,
   findAdminByNameOrEmail };

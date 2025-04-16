import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/ManageStudent.css";  // Ensure this matches your project styles

const ManageStudent = () => {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [editingStudent, setEditingStudent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingStudents, setDeletingStudents] = useState({}); // Track deleting status for each student
  const [updatedName, setUpdatedName] = useState(""); // State for the updated name
  const [updatedEmail, setUpdatedEmail] = useState(""); // State for the updated email

  // Fetch students from API
  const fetchStudents = async (pageNum = 1) => {
    try {
      setLoading(true);// https://mujrequest.shivamrajdubey.tech
      const response = await axios.post("http://localhost:5004/auth/students", { page: pageNum });
      setStudents(response.data.students);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search students
  const searchStudents = async () => {
    if (!search.trim()) {
      fetchStudents();
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5004/auth/search", { query: search });
      setStudents(response.data.users);
    } catch (error) {
      console.error("Error searching students:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Save (Editing)
  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = {
        name: updatedName, // Send the updated name
        email: updatedEmail, // Send the updated email
      };

      // Send the data in the required format
      await axios.post("http://localhost:5004/auth/edit", {
        userId: editingStudent, // Send student ID to edit
        updates // Send updated details (name and email)
      });

      alert("Changes saved successfully!"); // Handle success response
      setEditingStudent(null); // Exit edit mode
      setUpdatedName(""); // Clear updated name
      setUpdatedEmail(""); // Clear updated email
      fetchStudents(page); // Re-fetch students to get updated list
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setSaving(false);
    }
  };

  // Handle Delete (With Confirmation)
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) return;

    setDeletingStudents((prevState) => ({
      ...prevState,
      [id]: true, // Set this student's deletion state to true while deleting
    }));

    try {
      // Send POST request to the delete endpoint
      await axios.post("http://localhost:5004/auth/delete", {
        userId: id // Send student ID to delete
      });

      setStudents(students.filter((student) => student._id !== id)); // Update the students list locally
      alert("Student deleted successfully!");
    } catch (error) {
      console.error("Error deleting student:", error);
    } finally {
      setDeletingStudents((prevState) => ({
        ...prevState,
        [id]: false, // Reset the deletion state for this student after deletion
      }));
    }
  };


  const handleDownload = async (url, name) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `Resume-${name.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      alert("Failed to download resume.");
      console.error(error);
    }
  };
  

  useEffect(() => {
    fetchStudents(page);
  }, [page]);

  return (
    <div className="manage-student-container">
      {/* Header Section */}
      <div className="manage-student-header">
        <h2>Manage Students</h2>
        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search Student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={searchStudents} className="search-btn">Search</button>
        </div>
      </div>

      {/* Student Table */}
      {loading ? (
        <p className="loading-text">Loading students...</p>
      ) : (
        <div className="table-container">
          <table className="student-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Resume</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr><td colSpan="5" className="no-data">No students found</td></tr>
              ) : (
                students.map((student, index) => (
                  <tr key={student._id}>
                    <td>{index + 1}</td>
                    <td>
                      {editingStudent === student._id ? (
                        <input 
                          type="text" 
                          value={updatedName} // Bind the value to updatedName
                          onChange={(e) => setUpdatedName(e.target.value)} // Update name when input changes
                        />
                      ) : (
                        student.name
                      )}
                    </td>
                    <td>
                      {editingStudent === student._id ? (
                        <input 
                          type="text" 
                          value={updatedEmail} // Bind the value to updatedEmail
                          onChange={(e) => setUpdatedEmail(e.target.value)} // Update email when input changes
                        />
                      ) : (
                        student.email
                      )}
                    </td>
                    <td>
                      <a onClick={() => handleDownload(student.resume, student.name)} target="_blank" rel="noopener noreferrer" className="resume-link">
                        View Resume
                      </a>
                    </td>
                    <td className="student-actions">
                      {editingStudent === student._id ? (
                        <>
                          <button className="save-btn" onClick={handleSave} disabled={saving}>
                            {saving ? <span className="loading-spinner"></span> : "Save"}
                          </button>
                          <button className="cancel-btn" onClick={() => setEditingStudent(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="edit-btn" onClick={() => { 
                            setEditingStudent(student._id); 
                            setUpdatedName(student.name); 
                            setUpdatedEmail(student.email);
                          }}>Edit</button>
                          <button 
                            className="delete-btn" 
                            onClick={() => handleDelete(student._id)} 
                            disabled={deletingStudents[student._id]} // Disable only the button for this student
                          >
                            {deletingStudents[student._id] ? <span className="loading-spinner"></span> : "Delete"}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1} className="pagination-btn">
          Previous
        </button>
        <span className="page-number"> Page {page} </span>
        <button onClick={() => setPage(page + 1)} className="pagination-btn">
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageStudent;

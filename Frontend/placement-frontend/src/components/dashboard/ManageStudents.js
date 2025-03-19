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
  const [deleting, setDeleting] = useState(false);

  // Fetch students from API
  const fetchStudents = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await axios.post("https://mujrequest.shivamrajdubey.tech/auth/students", { page: pageNum });
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
      const response = await axios.post("https://mujrequest.shivamrajdubey.tech/auth/search", { query: search });
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
      // Simulating API call (Replace with actual API request)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert("Changes saved successfully!"); // Replace with actual API response handling
      setEditingStudent(null);
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

    setDeleting(true);
    try {
      // Simulating API call (Replace with actual API request)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setStudents(students.filter((student) => student._id !== id));
      alert("Student deleted successfully!");
    } catch (error) {
      console.error("Error deleting student:", error);
    } finally {
      setDeleting(false);
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
                        <input type="text" defaultValue={student.name} />
                      ) : (
                        student.name
                      )}
                    </td>
                    <td>{student.email}</td>
                    <td>
                      <a href={student.resume} target="_blank" rel="noopener noreferrer" className="resume-link">
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
                          <button className="edit-btn" onClick={() => setEditingStudent(student._id)}>Edit</button>
                          <button className="delete-btn" onClick={() => handleDelete(student._id)} disabled={deleting}>
                            {deleting ? <span className="loading-spinner"></span> : "Delete"}
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

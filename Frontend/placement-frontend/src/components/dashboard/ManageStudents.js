import React, { useState } from "react";
import "../../styles/ManageStudent.css";

const ManageStudent = () => {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([
    { id: 1, name: "Amit Sharma", email:"admin@admin.com",resume:"resume" },//branch: "CSE", year: "2024"
    { id: 2, name: "Priya Verma",  email:"admin@admin.com",resume:"resume"},//branch: "ECE", year: "2025"
    { id: 3, name: "Rahul Mehta", email:"admin@admin.com",resume:"resume"}//branch: "IT", year: "2024" 
  ]);

  const handleDelete = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  return (
    <div className="manage-student-container">
      <div className="manage-student-header">
        <h2>Manage Students</h2>
        <input
          type="text"
          className="search-bar"
          placeholder="Search Student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

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
          {students
            .filter((student) =>
              student.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.resume}</td>
                <td className="student-actions">
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(student.id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageStudent;

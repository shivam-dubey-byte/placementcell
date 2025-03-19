import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/ManageAdmin.css";  // Ensure this matches your project styles

const ManageAdmin = () => {
  const [search, setSearch] = useState("");
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingAdmins, setDeletingAdmins] = useState({}); // Track deleting status for each admin
  const [updatedName, setUpdatedName] = useState(""); // State for the updated name
  const [updatedEmail, setUpdatedEmail] = useState(""); // State for the updated email
  const [isAddingAdmin, setIsAddingAdmin] = useState(false); // Toggle for Add Admin form
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "",role:"admin" }); // New admin state

  // Fetch admins from API
  const fetchAdmins = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await axios.post("https://mujrequest.shivamrajdubey.tech/auth/admins", { page: pageNum });
      setAdmins(response.data.admins);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search admins
  const searchAdmins = async () => {
    if (!search.trim()) {
      fetchAdmins();
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("https://mujrequest.shivamrajdubey.tech/auth/searchAdmin", { query: search });
      setAdmins(response.data.admins); // Assuming API returns admins here
    } catch (error) {
      console.error("Error searching admins:", error);
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
      await axios.post("https://mujrequest.shivamrajdubey.tech/auth/edit", {
        userId: editingAdmin, // Send admin ID to edit
        updates // Send updated details (name and email)
      });

      alert("Changes saved successfully!"); // Handle success response
      setEditingAdmin(null); // Exit edit mode
      setUpdatedName(""); // Clear updated name
      setUpdatedEmail(""); // Clear updated email
      fetchAdmins(page); // Re-fetch admins to get updated list
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setSaving(false);
    }
  };

  // Handle Delete (With Confirmation)
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this admin?");
    if (!confirmDelete) return;

    setDeletingAdmins((prevState) => ({
      ...prevState,
      [id]: true, // Set this admin's deletion state to true while deleting
    }));

    try {
      // Send POST request to the delete endpoint
      await axios.post("https://mujrequest.shivamrajdubey.tech/auth/delete", {
        userId: id // Send admin ID to delete
      });

      setAdmins(admins.filter((admin) => admin._id !== id)); // Update the admins list locally
      alert("Admin deleted successfully!");
    } catch (error) {
      console.error("Error deleting admin:", error);
    } finally {
      setDeletingAdmins((prevState) => ({
        ...prevState,
        [id]: false, // Reset the deletion state for this admin after deletion
      }));
    }
  };

  // Handle Add New Admin
  const handleAddAdmin = async () => {
    try {
      await axios.post("https://mujtpcbackend.shivamrajdubey.tech/auth/signup", newAdmin); // Signup API for adding admin
      fetchAdmins(); // Refresh the list of admins
      setNewAdmin({ name: "", email: "", password: "" }); // Clear the new admin fields
      setIsAddingAdmin(false); // Close the Add Admin form
    } catch (error) {
      console.error("Error adding admin:", error);
      alert("Error adding admin");
    }
  };

  useEffect(() => {
    fetchAdmins(page);
  }, [page]);

  return (
    <div className="manage-admin-container">
      {/* Header Section */}
      <div className="manage-admin-header">
        <h2>Manage Admins</h2>
        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search Admin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={searchAdmins} className="search-btn">Search</button>
        </div>
        {/* Add Admin Button */}
        <button className="add-admin-btn" onClick={() => setIsAddingAdmin(true)}>Add Admin</button>
      </div>

      {/* Add Admin Form */}
      {isAddingAdmin && (
        <div className="add-admin-form">
          <h3>Add New Admin</h3>
          <input
            type="text"
            placeholder="Name"
            value={newAdmin.name}
            onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={newAdmin.email}
            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={newAdmin.password}
            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
          />
          <button className="submit-btn" onClick={handleAddAdmin}>Add Admin</button>
          <button className="cancel-btn" onClick={() => setIsAddingAdmin(false)}>Cancel</button>
        </div>
      )}

      {/* Admin Table */}
      {loading ? (
        <p className="loading-text">Loading admins...</p>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 ? (
                <tr><td colSpan="4" className="no-data">No admins found</td></tr>
              ) : (
                admins.map((admin, index) => (
                  <tr key={admin._id}>
                    <td>{index + 1}</td>
                    <td>
                      {editingAdmin === admin._id ? (
                        <input 
                          type="text" 
                          value={updatedName} // Bind the value to updatedName
                          onChange={(e) => setUpdatedName(e.target.value)} // Update name when input changes
                        />
                      ) : (
                        admin.name
                      )}
                    </td>
                    <td>
                      {editingAdmin === admin._id ? (
                        <input 
                          type="text" 
                          value={updatedEmail} // Bind the value to updatedEmail
                          onChange={(e) => setUpdatedEmail(e.target.value)} // Update email when input changes
                        />
                      ) : (
                        admin.email
                      )}
                    </td>
                    <td className="admin-actions">
                      {editingAdmin === admin._id ? (
                        <>
                          <button className="save-btn" onClick={handleSave} disabled={saving}>
                            {saving ? <span className="loading-spinner"></span> : "Save"}
                          </button>
                          <button className="cancel-btn" onClick={() => setEditingAdmin(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="edit-btn" onClick={() => { 
                            setEditingAdmin(admin._id); 
                            setUpdatedName(admin.name); 
                            setUpdatedEmail(admin.email);
                          }}>Edit</button>
                          <button 
                            className="delete-btn" 
                            onClick={() => handleDelete(admin._id)} 
                            disabled={deletingAdmins[admin._id]} // Disable only the button for this admin
                          >
                            {deletingAdmins[admin._id] ? <span className="loading-spinner"></span> : "Delete"}
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

export default ManageAdmin;

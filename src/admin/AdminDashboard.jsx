import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import {
  FiUsers,
  FiUser,
  FiSearch,
  FiEdit2,
  FiLock,
  FiUnlock,
  FiTrash2,
  FiRefreshCw,
  FiShield,
  FiX,
  FiSave
} from "react-icons/fi";

import "../styles/admin-dashboard.css";

const API_URL = "http://localhost:5000";

const AdminDashboard = () => {

  // =====================================================
  // LOGGED-IN USER
  // =====================================================

  const loggedInUser = useSelector(
    (state) => state.auth.user
  );


  // =====================================================
  // STATES
  // =====================================================

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [editingUser, setEditingUser] = useState(null);


  // =====================================================
  // LOAD USERS
  // =====================================================

  const loadUsers = async () => {

    try {

      setLoading(true);

      const response = await axios.get(
        `${API_URL}/users`
      );

      setUsers(response.data);

    } catch (error) {

      console.error(
        "Unable to load users:",
        error
      );

      alert(
        "Unable to load users. Make sure JSON Server is running."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD ON PAGE OPEN
  // =====================================================

  useEffect(() => {

    loadUsers();

  }, []);


  // =====================================================
  // SEARCH USERS
  // =====================================================

  const filteredUsers = users.filter((user) => {

    const searchText =
      search.trim().toLowerCase();

    if (!searchText) {
      return true;
    }

    return (
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      user.role?.toLowerCase().includes(searchText) ||
      user.country?.toLowerCase().includes(searchText)
    );

  });


  // =====================================================
  // EDIT USER
  // =====================================================

  const handleEdit = (user) => {

    setEditingUser({
      ...user
    });

  };


  // =====================================================
  // CLOSE EDIT
  // =====================================================

  const closeEdit = () => {

    setEditingUser(null);

  };


  // =====================================================
  // SAVE USER
  // =====================================================

  const handleSaveUser = async () => {

    if (!editingUser) {
      return;
    }

    try {

      const response = await axios.patch(
        `${API_URL}/users/${editingUser.id}`,
        {
          name: editingUser.name,
          email: editingUser.email,
          dob: editingUser.dob,
          gender: editingUser.gender,
          country: editingUser.country
        }
      );

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === editingUser.id
            ? response.data
            : user
        )
      );

      setEditingUser(null);

      alert("User details updated successfully.");

    } catch (error) {

      console.error(
        "Update user error:",
        error
      );

      alert(
        "Unable to update user."
      );

    }

  };


  // =====================================================
  // LOCK / UNLOCK USER
  // =====================================================

  const handleToggleLock = async (user) => {

    // Admin protection
    if (user.role === "admin") {

      alert(
        "Administrator accounts cannot be locked."
      );

      return;

    }


    const currentlyLocked =
      user.locked === true;


    const action =
      currentlyLocked
        ? "unlock"
        : "lock";


    const confirmed =
      window.confirm(
        `Are you sure you want to ${action} ${user.name}?`
      );


    if (!confirmed) {
      return;
    }


    try {

      const response = await axios.patch(
        `${API_URL}/users/${user.id}`,
        {
          locked: !currentlyLocked
        }
      );


      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item.id === user.id
            ? response.data
            : item
        )
      );


      alert(
        currentlyLocked
          ? `${user.name} has been unlocked.`
          : `${user.name} has been locked.`
      );

    } catch (error) {

      console.error(
        "Lock user error:",
        error
      );

      alert(
        "Unable to change user status."
      );

    }

  };


  // =====================================================
  // DELETE USER
  // =====================================================

  const handleDelete = async (user) => {

    // Admin protection
    if (user.role === "admin") {

      alert(
        "Administrator accounts cannot be deleted."
      );

      return;

    }


    const confirmed =
      window.confirm(
        `Are you sure you want to permanently delete ${user.name}?`
      );


    if (!confirmed) {
      return;
    }


    try {

      await axios.delete(
        `${API_URL}/users/${user.id}`
      );


      setUsers((currentUsers) =>
        currentUsers.filter(
          (item) =>
            item.id !== user.id
        )
      );


      alert(
        `${user.name} has been deleted.`
      );

    } catch (error) {

      console.error(
        "Delete user error:",
        error
      );

      alert(
        "Unable to delete user."
      );

    }

  };


  // =====================================================
  // NOT ADMIN
  // =====================================================

  if (
    !loggedInUser ||
    loggedInUser.role !== "admin"
  ) {

    return (

      <div className="admin-dashboard-page">

        <div className="admin-access-denied">

          <FiShield />

          <h2>
            Access Denied
          </h2>

          <p>
            Only administrators can access this page.
          </p>

        </div>

      </div>

    );

  }


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="admin-dashboard-page">

        <div className="admin-loading">

          <FiRefreshCw />

          <h2>
            Loading Users...
          </h2>

        </div>

      </div>

    );

  }


  // =====================================================
  // RETURN
  // =====================================================

  return (

    <div className="admin-dashboard-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <section className="admin-dashboard-header">

        <div>

          <span>
            EDULEARN ADMIN
          </span>

          <h1>
            User Management
          </h1>

          <p>
            Manage registered students and their account access.
          </p>

        </div>


        <button
          type="button"
          className="admin-refresh-btn"
          onClick={loadUsers}
        >

          <FiRefreshCw />

          Refresh

        </button>

      </section>



      {/* =================================================
          STATISTICS
      ================================================= */}

      <section className="admin-user-stats">


        <div className="admin-user-stat">

          <div className="admin-stat-icon">
            <FiUsers />
          </div>

          <div>

            <span>
              Total Users
            </span>

            <strong>
              {users.length}
            </strong>

          </div>

        </div>



        <div className="admin-user-stat">

          <div className="admin-stat-icon">
            <FiUser />
          </div>

          <div>

            <span>
              Students
            </span>

            <strong>
              {
                users.filter(
                  (user) =>
                    user.role === "student"
                ).length
              }
            </strong>

          </div>

        </div>



        <div className="admin-user-stat">

          <div className="admin-stat-icon">
            <FiLock />
          </div>

          <div>

            <span>
              Locked Users
            </span>

            <strong>
              {
                users.filter(
                  (user) =>
                    user.locked === true
                ).length
              }
            </strong>

          </div>

        </div>



        <div className="admin-user-stat">

          <div className="admin-stat-icon">
            <FiShield />
          </div>

          <div>

            <span>
              Administrators
            </span>

            <strong>
              {
                users.filter(
                  (user) =>
                    user.role === "admin"
                ).length
              }
            </strong>

          </div>

        </div>

      </section>



      {/* =================================================
          USER MANAGEMENT CARD
      ================================================= */}

      <section className="admin-users-section">


        {/* HEADER */}

        <div className="admin-users-heading">

          <div>

            <h2>
              Registered Users
            </h2>

            <span>
              {filteredUsers.length} users found
            </span>

          </div>


          {/* SEARCH */}

          <div className="admin-search">

            <FiSearch />

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>



        {/* =================================================
            TABLE
        ================================================= */}

        {filteredUsers.length > 0 ? (

          <div className="admin-users-table-wrapper">

            <table className="admin-users-table">

              <thead>

                <tr>

                  <th>
                    User
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Role
                  </th>

                  <th>
                    State
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredUsers.map((user) => (

                  <tr key={user.id}>


                    {/* USER */}

                    <td>

                      <div className="admin-user-info">

                        <div className="admin-user-avatar">

                          <FiUser />

                        </div>

                        <div>

                          <strong>
                            {user.name}
                          </strong>

                          <small>
                            ID: {user.id}
                          </small>

                        </div>

                      </div>

                    </td>



                    {/* EMAIL */}

                    <td>
                      {user.email}
                    </td>



                    {/* ROLE */}

                    <td>

                      <span
                        className={
                          user.role === "admin"
                            ? "admin-role admin-role-admin"
                            : "admin-role"
                        }
                      >

                        {user.role === "admin"
                          ? "Administrator"
                          : "Student"}

                      </span>

                    </td>



                    {/* STATE */}

                    <td>
                      {user.country || "Not provided"}
                    </td>



                    {/* STATUS */}

                    <td>

                      <span
                        className={
                          user.locked
                            ? "user-status locked"
                            : "user-status active"
                        }
                      >

                        {user.locked
                          ? "Locked"
                          : "Active"}

                      </span>

                    </td>



                    {/* ACTIONS */}

                    <td>

                      <div className="admin-action-buttons">


                        {/* EDIT */}

                        <button
                          type="button"
                          className="admin-action edit"
                          title="Edit User"
                          onClick={() =>
                            handleEdit(user)
                          }
                        >

                          <FiEdit2 />

                        </button>



                        {/* LOCK */}

                        <button
                          type="button"
                          className="admin-action lock"
                          title={
                            user.role === "admin"
                              ? "Administrator cannot be locked"
                              : user.locked
                                ? "Unlock User"
                                : "Lock User"
                          }
                          disabled={
                            user.role === "admin"
                          }
                          onClick={() =>
                            handleToggleLock(user)
                          }
                        >

                          {user.locked
                            ? <FiUnlock />
                            : <FiLock />}

                        </button>



                        {/* DELETE */}

                        <button
                          type="button"
                          className="admin-action delete"
                          title={
                            user.role === "admin"
                              ? "Administrator cannot be deleted"
                              : "Delete User"
                          }
                          disabled={
                            user.role === "admin"
                          }
                          onClick={() =>
                            handleDelete(user)
                          }
                        >

                          <FiTrash2 />

                        </button>


                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="admin-no-users">

            <FiUsers />

            <h3>
              No Users Found
            </h3>

            <p>
              Try changing your search.
            </p>

          </div>

        )}

      </section>



      {/* =================================================
          EDIT USER MODAL
      ================================================= */}

      {editingUser && (

        <div className="admin-modal-overlay">

          <div className="admin-edit-modal">


            {/* MODAL HEADER */}

            <div className="admin-modal-header">

              <div>

                <span>
                  USER MANAGEMENT
                </span>

                <h2>
                  Edit User
                </h2>

              </div>


              <button
                type="button"
                onClick={closeEdit}
                className="admin-modal-close"
              >

                <FiX />

              </button>

            </div>



            {/* FORM */}

            <div className="admin-edit-form">


              {/* NAME */}

              <div className="admin-form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  value={editingUser.name || ""}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      name: e.target.value
                    })
                  }
                />

              </div>



              {/* EMAIL */}

              <div className="admin-form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  value={editingUser.email || ""}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      email: e.target.value
                    })
                  }
                />

              </div>



              {/* DOB */}

              <div className="admin-form-group">

                <label>
                  Date of Birth
                </label>

                <input
                  type="date"
                  value={editingUser.dob || ""}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      dob: e.target.value
                    })
                  }
                />

              </div>



              {/* GENDER */}

              <div className="admin-form-group">

                <label>
                  Gender
                </label>

                <select
                  value={editingUser.gender || ""}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      gender: e.target.value
                    })
                  }
                >

                  <option value="">
                    Select Gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>



              {/* STATE */}

              <div className="admin-form-group">

                <label>
                  State
                </label>

                <select
                  value={editingUser.country || ""}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      country: e.target.value
                    })
                  }
                >

                  <option value="">
                    Select State
                  </option>

                  <option value="Andhra Pradesh">
                    Andhra Pradesh
                  </option>

                  <option value="Telangana">
                    Telangana
                  </option>

                  <option value="Tamil Nadu">
                    Tamil Nadu
                  </option>

                  <option value="Kerala">
                    Kerala
                  </option>

                  <option value="Karnataka">
                    Karnataka
                  </option>

                </select>

              </div>


            </div>



            {/* MODAL ACTIONS */}

            <div className="admin-modal-actions">

              <button
                type="button"
                className="admin-cancel-btn"
                onClick={closeEdit}
              >

                Cancel

              </button>


              <button
                type="button"
                className="admin-save-btn"
                onClick={handleSaveUser}
              >

                <FiSave />

                Save Changes

              </button>

            </div>


          </div>

        </div>

      )}

    </div>

  );

};

export default AdminDashboard;
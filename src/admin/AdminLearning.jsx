import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  FiBookOpen,
  FiAward,
  FiUsers,
  FiCheckCircle,
  FiRefreshCw,
  FiTrendingUp,
  FiEdit2,
  FiLock,
  FiUnlock,
  FiTrash2,
  FiX,
  FiSave,
  FiSearch
} from "react-icons/fi";

import "../styles/admin-learning.css";
import "../styles/modern-overrides.css";

const API_URL = "http://localhost:5000";

const AdminLearning = () => {

  // =====================================================
  // STATE
  // =====================================================

  const [enrollments, setEnrollments] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("dashboard");

  const [search, setSearch] = useState("");

  const [editingUser, setEditingUser] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    dob: "",
    gender: "",
    country: ""
  });


  // =====================================================
  // LOAD DATA
  // =====================================================

  const load = async () => {

    setLoading(true);

    try {

      const [enrollmentResponse, userResponse] =
        await Promise.all([
          axios.get(`${API_URL}/enrollments`),
          axios.get(`${API_URL}/users`)
        ]);

      setEnrollments(enrollmentResponse.data);
      setUsers(userResponse.data);

    } catch (error) {

      console.error(
        "Admin dashboard error:",
        error
      );

      alert(
        "Unable to load admin data. Make sure JSON Server is running."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    load();

  }, []);


  // =====================================================
  // STATISTICS
  // =====================================================

  const totalStudents = useMemo(() => {

    return users.filter(
      (user) => user.role !== "admin"
    ).length;

  }, [users]);


  const completed = enrollments.filter(
    (x) =>
      x.completed ||
      Number(x.progress) === 100
  ).length;


  const active = enrollments.filter(
    (x) =>
      Number(x.progress) > 0 &&
      Number(x.progress) < 100
  ).length;


  const certificates = enrollments.filter(
    (x) => x.certificateIssued
  ).length;


  const avg = enrollments.length
    ? Math.round(
        enrollments.reduce(
          (sum, x) =>
            sum + (Number(x.progress) || 0),
          0
        ) / enrollments.length
      )
    : 0;


  // =====================================================
  // SEARCH USERS
  // =====================================================

  const filteredUsers = users.filter((user) => {

    const value = search
      .toLowerCase()
      .trim();

    if (!value) return true;

    return (
      user.name?.toLowerCase().includes(value) ||
      user.email?.toLowerCase().includes(value) ||
      user.role?.toLowerCase().includes(value) ||
      user.country?.toLowerCase().includes(value)
    );

  });


  // =====================================================
  // EDIT USER
  // =====================================================

  const openEditUser = (user) => {

    setEditingUser(user);

    setEditForm({
      name: user.name || "",
      email: user.email || "",
      dob: user.dob || "",
      gender: user.gender || "",
      country: user.country || ""
    });

  };


  const handleEditChange = (e) => {

    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });

  };


  const saveUser = async () => {

    if (!editingUser) return;


    if (
      !editForm.name.trim() ||
      !editForm.email.trim()
    ) {

      alert(
        "Name and email are required."
      );

      return;

    }


    try {

      const updatedUser = {

        ...editingUser,

        name: editForm.name.trim(),

        email:
          editForm.email.trim().toLowerCase(),

        dob: editForm.dob,

        gender: editForm.gender,

        country: editForm.country

      };


      await axios.patch(
        `${API_URL}/users/${editingUser.id}`,
        updatedUser
      );


      setUsers(
        users.map((user) =>
          user.id === editingUser.id
            ? updatedUser
            : user
        )
      );


      setEditingUser(null);

      alert(
        "User details updated successfully."
      );

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

  const toggleUserLock = async (user) => {

    if (user.role === "admin") {

      alert(
        "Administrator accounts cannot be locked."
      );

      return;

    }


    const newLockedStatus =
      !Boolean(user.locked);


    const message = newLockedStatus
      ? `Lock ${user.name}'s account?`
      : `Unlock ${user.name}'s account?`;


    if (!window.confirm(message)) {

      return;

    }


    try {

      const updatedUser = {

        ...user,

        locked: newLockedStatus

      };


      await axios.patch(
        `${API_URL}/users/${user.id}`,
        {
          locked: newLockedStatus
        }
      );


      setUsers(
        users.map((item) =>
          item.id === user.id
            ? updatedUser
            : item
        )
      );


      alert(
        newLockedStatus
          ? "User account locked."
          : "User account unlocked."
      );

    } catch (error) {

      console.error(
        "Lock user error:",
        error
      );

      alert(
        "Unable to change account status."
      );

    }

  };


  // =====================================================
  // DELETE USER
  // =====================================================

  const deleteUser = async (user) => {

    if (user.role === "admin") {

      alert(
        "Administrator account cannot be deleted."
      );

      return;

    }


    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );


    if (!confirmed) return;


    try {

      // Delete user

      await axios.delete(
        `${API_URL}/users/${user.id}`
      );


      // Delete user's enrollments

      const userEnrollments =
        enrollments.filter(
          (item) =>
            String(item.userId) ===
            String(user.id)
        );


      await Promise.all(
        userEnrollments.map(
          (item) =>
            axios.delete(
              `${API_URL}/enrollments/${item.id}`
            )
        )
      );


      // Remove from UI

      setUsers(
        users.filter(
          (item) =>
            item.id !== user.id
        )
      );


      setEnrollments(
        enrollments.filter(
          (item) =>
            String(item.userId) !==
            String(user.id)
        )
      );


      alert(
        "User account deleted successfully."
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
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="admin-learning-page">

        <div className="admin-loading">

          <FiRefreshCw />

          <h2>
            Loading admin dashboard...
          </h2>

        </div>

      </div>

    );

  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="admin-learning-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-learning-header">

        <div>

          <span>
            EDULEARN ADMIN
          </span>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Manage users and monitor learning activity.
          </p>

        </div>


        <button
          className="refresh-btn"
          onClick={load}
        >

          <FiRefreshCw />

          Refresh Data

        </button>

      </div>


      {/* =================================================
          STATS
      ================================================= */}

      <div className="learning-stats">

        <div className="learning-stat-card">

          <div className="stat-icon">
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


        <div className="learning-stat-card">

          <div className="stat-icon">
            <FiUsers />
          </div>

          <div>

            <span>
              Students
            </span>

            <strong>
              {totalStudents}
            </strong>

          </div>

        </div>


        <div className="learning-stat-card">

          <div className="stat-icon">
            <FiBookOpen />
          </div>

          <div>

            <span>
              Enrollments
            </span>

            <strong>
              {enrollments.length}
            </strong>

          </div>

        </div>


        <div className="learning-stat-card">

          <div className="stat-icon">
            <FiAward />
          </div>

          <div>

            <span>
              Certificates
            </span>

            <strong>
              {certificates}
            </strong>

          </div>

        </div>

      </div>


      {/* =================================================
          ADMIN TABS
      ================================================= */}

      <div className="admin-tabs">

        <button
          className={
            activeTab === "dashboard"
              ? "admin-tab active"
              : "admin-tab"
          }
          onClick={() =>
            setActiveTab("dashboard")
          }
        >

          <FiTrendingUp />

          Dashboard

        </button>


        <button
          className={
            activeTab === "users"
              ? "admin-tab active"
              : "admin-tab"
          }
          onClick={() =>
            setActiveTab("users")
          }
        >

          <FiUsers />

          User Accounts ({users.length})

        </button>


        <button
          className={
            activeTab === "learning"
              ? "admin-tab active"
              : "admin-tab"
          }
          onClick={() =>
            setActiveTab("learning")
          }
        >

          <FiBookOpen />

          Student Learning ({enrollments.length})

        </button>

      </div>


      {/* =================================================
          DASHBOARD TAB
      ================================================= */}

      {activeTab === "dashboard" && (

        <>

          <div className="admin-visuals">


            <div className="visual-card">

              <h2>
                Learning Status
              </h2>

              <div className="donut" />

              <div className="visual-legend">

                <span>
                  Completed {completed}
                </span>

                <span>
                  Active {active}
                </span>

                <span>
                  Other{" "}
                  {Math.max(
                    0,
                    enrollments.length -
                      completed -
                      active
                  )}
                </span>

              </div>

            </div>


            <div className="visual-card">

              <h2>
                Progress Health
                <FiTrendingUp />
              </h2>

              <div className="bar-list">


                <div className="bar-row">

                  <label>

                    <span>
                      Average Progress
                    </span>

                    <b>
                      {avg}%
                    </b>

                  </label>

                  <div className="bar">

                    <i
                      style={{
                        width: `${avg}%`
                      }}
                    />

                  </div>

                </div>


                <div className="bar-row">

                  <label>

                    <span>
                      Completion Rate
                    </span>

                    <b>

                      {enrollments.length
                        ? Math.round(
                            (completed /
                              enrollments.length) *
                              100
                          )
                        : 0}
                      %

                    </b>

                  </label>

                  <div className="bar">

                    <i
                      style={{
                        width: `${
                          enrollments.length
                            ? Math.round(
                                (completed /
                                  enrollments.length) *
                                  100
                              )
                            : 0
                        }%`
                      }}
                    />

                  </div>

                </div>


                <div className="bar-row">

                  <label>

                    <span>
                      Certificate Rate
                    </span>

                    <b>

                      {enrollments.length
                        ? Math.round(
                            (certificates /
                              enrollments.length) *
                              100
                          )
                        : 0}
                      %

                    </b>

                  </label>

                  <div className="bar">

                    <i
                      style={{
                        width: `${
                          enrollments.length
                            ? Math.round(
                                (certificates /
                                  enrollments.length) *
                                  100
                              )
                            : 0
                        }%`
                      }}
                    />

                  </div>

                </div>

              </div>

            </div>

          </div>

        </>

      )}


      {/* =================================================
          USER ACCOUNTS
      ================================================= */}

      {activeTab === "users" && (

        <section className="admin-users-section">

          <div className="admin-section-header">

            <div>

              <h2>
                Registered User Accounts
              </h2>

              <p>
                Manage EduLearn users and account access.
              </p>

            </div>

          </div>


          {/* SEARCH */}

          <div className="admin-search">

            <FiSearch />

            <input
              type="text"
              placeholder="Search users by name, email, role or state..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          {/* TABLE */}

          {filteredUsers.length > 0 ? (

            <div className="learning-table-wrapper">

              <table className="learning-table admin-users-table">

                <thead>

                  <tr>

                    <th>
                      USER ID
                    </th>

                    <th>
                      FULL NAME
                    </th>

                    <th>
                      EMAIL ADDRESS
                    </th>

                    <th>
                      ROLE
                    </th>

                    <th>
                      STATE
                    </th>

                    <th>
                      STATUS
                    </th>

                    <th>
                      ACTION
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredUsers.map(
                    (user) => (

                      <tr key={user.id}>

                        <td>
                          <b>
                            {user.id}
                          </b>
                        </td>


                        <td>

                          <b>
                            {user.name}
                          </b>

                        </td>


                        <td>
                          {user.email}
                        </td>


                        <td>

                          <span
                            className={
                              user.role === "admin"
                                ? "role-badge admin"
                                : "role-badge student"
                            }
                          >

                            {user.role === "admin"
                              ? "Administrator"
                              : "Student"}

                          </span>

                        </td>


                        <td>
                          {user.country || "Not provided"}
                        </td>


                        <td>

                          {user.locked ? (

                            <span className="user-status locked">

                              <FiLock />

                              Locked

                            </span>

                          ) : (

                            <span className="user-status active">

                              <FiCheckCircle />

                              Active

                            </span>

                          )}

                        </td>


                        <td>

                          <div className="user-actions">


                            {/* EDIT */}

                            <button
                              className="user-action edit"
                              title="Edit User"
                              onClick={() =>
                                openEditUser(user)
                              }
                            >

                              <FiEdit2 />

                            </button>


                            {/* LOCK / UNLOCK */}

                            {user.role !== "admin" && (

                              <button
                                className="user-action lock"
                                title={
                                  user.locked
                                    ? "Unlock User"
                                    : "Lock User"
                                }
                                onClick={() =>
                                  toggleUserLock(user)
                                }
                              >

                                {user.locked
                                  ? <FiUnlock />
                                  : <FiLock />}

                              </button>

                            )}


                            {/* DELETE */}

                            {user.role !== "admin" && (

                              <button
                                className="user-action delete"
                                title="Delete User"
                                onClick={() =>
                                  deleteUser(user)
                                }
                              >

                                <FiTrash2 />

                              </button>

                            )}

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="no-learning">

              <FiUsers />

              <h3>
                No users found
              </h3>

              <p>
                Try another search.
              </p>

            </div>

          )}

        </section>

      )}


      {/* =================================================
          STUDENT LEARNING
      ================================================= */}

      {activeTab === "learning" && (

        <section className="student-learning-section">

          <div className="section-heading">

            <h2>
              Student Course Activity
            </h2>

            <span>
              {enrollments.length} live records
            </span>

          </div>


          {enrollments.length ? (

            <div className="learning-table-wrapper">

              <table className="learning-table">

                <thead>

                  <tr>

                    <th>
                      Student
                    </th>

                    <th>
                      Course
                    </th>

                    <th>
                      Category
                    </th>

                    <th>
                      Progress
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Certificate
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {enrollments.map((item) => (

                    <tr key={item.id}>

                      <td>
                        <b>
                          {item.userName}
                        </b>
                      </td>

                      <td>
                        {item.courseName}
                      </td>

                      <td>
                        {item.categoryName}
                      </td>

                      <td>

                        <div className="admin-progress-bar">

                          <div
                            className="admin-progress-fill"
                            style={{
                              width:
                                `${item.progress || 0}%`
                            }}
                          />

                        </div>

                        <small>
                          {item.progress || 0}%
                        </small>

                      </td>

                      <td>

                        {item.completed
                          ? "Completed"
                          : "In Progress"}

                      </td>

                      <td>

                        {item.certificateIssued
                          ? "Issued"
                          : "Not Issued"}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="no-learning">

              <FiBookOpen />

              <h3>
                No enrollments yet
              </h3>

              <p>
                Student enrollments will appear here.
              </p>

            </div>

          )}

        </section>

      )}


      {/* =================================================
          EDIT USER MODAL
      ================================================= */}

      {editingUser && (

        <div className="admin-modal-overlay">

          <div className="admin-edit-modal">

            <div className="admin-modal-header">

              <div>

                <h2>
                  <FiEdit2 />
                  Edit User
                </h2>

                <p>
                  Update account information
                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  setEditingUser(null)
                }
              >

                <FiX />

              </button>

            </div>


            <div className="admin-edit-form">


              <div className="admin-form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                />

              </div>


              <div className="admin-form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                />

              </div>


              <div className="admin-form-row">

                <div className="admin-form-group">

                  <label>
                    Date of Birth
                  </label>

                  <input
                    type="date"
                    name="dob"
                    value={editForm.dob}
                    onChange={handleEditChange}
                  />

                </div>


                <div className="admin-form-group">

                  <label>
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={editForm.gender}
                    onChange={handleEditChange}
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

              </div>


              <div className="admin-form-group">

                <label>
                  State
                </label>

                <select
                  name="country"
                  value={editForm.country}
                  onChange={handleEditChange}
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


              <div className="admin-modal-actions">

                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={() =>
                    setEditingUser(null)
                  }
                >

                  Cancel

                </button>


                <button
                  type="button"
                  className="admin-save-btn"
                  onClick={saveUser}
                >

                  <FiSave />

                  Save Changes

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default AdminLearning;
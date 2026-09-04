import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    FiUser,
    FiMail,
    FiCalendar,
    FiUsers,
    FiMapPin,
    FiShield,
    FiEdit2,
    FiCamera,
    FiBookOpen,
    FiHeart,
    FiLogOut
} from "react-icons/fi";

import { updateUser, logoutUser } from "../redux/authSlice";

import "../styles/profile.css";

const Profile = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // =====================================================
    // GET LOGGED-IN USER FROM REDUX
    // =====================================================

    const user = useSelector(
        (state) => state.auth.user
    );

    // =====================================================
    // EDIT MODE
    // =====================================================

    const [editMode, setEditMode] = useState(false);

    // =====================================================
    // PROFILE IMAGE
    // =====================================================

    const [profileImage, setProfileImage] = useState(
        user?.profileImage || null
    );

    // =====================================================
    // USER DETAILS
    // =====================================================

    const [name, setName] = useState(
        user?.name || ""
    );

    const [email, setEmail] = useState(
        user?.email || ""
    );

    const [dob, setDob] = useState(
        user?.dob || ""
    );

    const [gender, setGender] = useState(
        user?.gender || ""
    );

    const [state, setState] = useState(
        user?.country || ""
    );

    // =====================================================
    // PROFILE IMAGE UPLOAD
    // =====================================================

    const handleImageUpload = (event) => {

        const file = event.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onloadend = () => {

            const imageData = reader.result;

            setProfileImage(imageData);

        };

        reader.readAsDataURL(file);
    };

    // =====================================================
    // SAVE PROFILE
    // =====================================================

    const saveProfile = async () => {

        if (!user) return;

        const updatedUser = {

            ...user,

            name: name.trim(),

            email: email.trim().toLowerCase(),

            dob: dob,

            gender: gender,

            country: state,

            profileImage: profileImage

        };

        try {

            await axios.patch(
                `http://localhost:5000/users/${user.id}`,
                {
                    name: updatedUser.name,
                    email: updatedUser.email,
                    dob: updatedUser.dob,
                    gender: updatedUser.gender,
                    country: updatedUser.country,
                    profileImage: updatedUser.profileImage
                }
            );

            // Update Redux
            dispatch(
                updateUser(updatedUser)
            );

            setEditMode(false);

            alert(
                "Profile updated successfully"
            );

        } catch (error) {

            console.error(
                "Profile update error:",
                error
            );

            alert(
                "Unable to update profile. Make sure JSON Server is running."
            );

        }

    };

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        dispatch(
            logoutUser()
        );

        navigate("/Login");

    };

    // =====================================================
    // USER NOT LOGGED IN
    // =====================================================

    if (!user) {

        return (

            <div className="profile-page">

                <div className="profile-login-card">

                    <FiUser className="profile-login-icon" />

                    <h2>
                        Login Required
                    </h2>

                    <p>
                        Please login to view your profile.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/Login")
                        }
                    >
                        Go to Login
                    </button>

                </div>

            </div>

        );

    }

    return (

        <div className="profile-page">

            {/* =================================================
                PROFILE HEADER
            ================================================= */}

            <div className="profile-cover">

                <div className="profile-title">

                    <h1>
                        My Profile
                    </h1>

                    <p>
                        Manage your EduLearn account
                    </p>

                </div>

            </div>

            {/* =================================================
                MAIN PROFILE CARD
            ================================================= */}

            <div className="profile-container">

                <div className="profile-main-card">

                    {/* PROFILE IMAGE */}

                    <div className="profile-image-section">

                        <div className="profile-large-image">

                            {profileImage ? (

                                <img
                                    src={profileImage}
                                    alt="Profile"
                                />

                            ) : (

                                <FiUser />

                            )}

                        </div>

                        <label
                            className="profile-camera"
                            title="Change Profile Photo"
                        >

                            <FiCamera />

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                hidden
                            />

                        </label>

                    </div>

                    {/* PROFILE NAME */}

                    <div className="profile-heading">

                        <h2>
                            {user.name || "EduLearn Student"}
                        </h2>

                        <p>
                            {user.role === "admin"
                                ? "Administrator"
                                : "Student"}
                        </p>

                    </div>

                    {/* EDIT BUTTON */}

                    <button
                        className="edit-profile-button"
                        onClick={() =>
                            setEditMode(!editMode)
                        }
                    >

                        <FiEdit2 />

                        {editMode
                            ? "Cancel"
                            : "Edit Profile"}

                    </button>

                </div>

                {/* =================================================
                    ACCOUNT INFORMATION
                ================================================= */}

                <div className="profile-content">

                    <div className="profile-section-card">

                        <div className="section-title">

                            <h3>
                                Personal Information
                            </h3>

                            <p>
                                Your basic account details
                            </p>

                        </div>

                        <div className="profile-details-grid">

                            {/* NAME */}

                            <div className="profile-detail">

                                <div className="detail-icon">
                                    <FiUser />
                                </div>

                                <div className="detail-content">

                                    <span>
                                        Full Name
                                    </span>

                                    {editMode ? (

                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                        />

                                    ) : (

                                        <strong>
                                            {user.name || "Not provided"}
                                        </strong>

                                    )}

                                </div>

                            </div>

                            {/* EMAIL */}

                            <div className="profile-detail">

                                <div className="detail-icon">
                                    <FiMail />
                                </div>

                                <div className="detail-content">

                                    <span>
                                        Email Address
                                    </span>

                                    {editMode ? (

                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                        />

                                    ) : (

                                        <strong>
                                            {user.email}
                                        </strong>

                                    )}

                                </div>

                            </div>

                            {/* DOB */}

                            <div className="profile-detail">

                                <div className="detail-icon">
                                    <FiCalendar />
                                </div>

                                <div className="detail-content">

                                    <span>
                                        Date of Birth
                                    </span>

                                    {editMode ? (

                                        <input
                                            type="date"
                                            value={dob}
                                            onChange={(e) =>
                                                setDob(e.target.value)
                                            }
                                        />

                                    ) : (

                                        <strong>
                                            {user.dob || "Not provided"}
                                        </strong>

                                    )}

                                </div>

                            </div>

                            {/* GENDER */}

                            <div className="profile-detail">

                                <div className="detail-icon">
                                    <FiUsers />
                                </div>

                                <div className="detail-content">

                                    <span>
                                        Gender
                                    </span>

                                    {editMode ? (

                                        <select
                                            value={gender}
                                            onChange={(e) =>
                                                setGender(e.target.value)
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

                                    ) : (

                                        <strong>
                                            {user.gender || "Not provided"}
                                        </strong>

                                    )}

                                </div>

                            </div>

                            {/* STATE */}

                            <div className="profile-detail">

                                <div className="detail-icon">
                                    <FiMapPin />
                                </div>

                                <div className="detail-content">

                                    <span>
                                        State
                                    </span>

                                    {editMode ? (

                                        <select
                                            value={state}
                                            onChange={(e) =>
                                                setState(e.target.value)
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

                                            <option value="Karnataka">
                                                Karnataka
                                            </option>

                                            <option value="Kerala">
                                                Kerala
                                            </option>

                                        </select>

                                    ) : (

                                        <strong>
                                            {user.country || "Not provided"}
                                        </strong>

                                    )}

                                </div>

                            </div>

                            {/* ROLE */}

                            <div className="profile-detail">

                                <div className="detail-icon">
                                    <FiShield />
                                </div>

                                <div className="detail-content">

                                    <span>
                                        Account Type
                                    </span>

                                    <strong>
                                        {user.role === "admin"
                                            ? "Administrator"
                                            : "Student"}
                                    </strong>

                                </div>

                            </div>

                        </div>

                        {/* SAVE BUTTON */}

                        {editMode && (

                            <div className="save-profile-area">

                                <button
                                    className="save-profile-button"
                                    onClick={saveProfile}
                                >
                                    Save Changes
                                </button>

                            </div>

                        )}

                    </div>

                    {/* =================================================
                        QUICK ACCESS
                    ================================================= */}

                    <div className="profile-section-card">

                        <div className="section-title">

                            <h3>
                                Quick Access
                            </h3>

                            <p>
                                Access your learning activities
                            </p>

                        </div>

                        <div className="profile-quick-grid">

                            <button
                                onClick={() =>
                                    navigate("/my-learning")
                                }
                            >

                                <FiBookOpen />

                                <span>
                                    My Learning
                                </span>

                                <small>
                                    View your courses
                                </small>

                            </button>

                            <button
                                onClick={() =>
                                    navigate("/wishlist")
                                }
                            >

                                <FiHeart />

                                <span>
                                    Wishlist
                                </span>

                                <small>
                                    Saved courses
                                </small>

                            </button>

                        </div>

                    </div>

                    {/* =================================================
                        LOGOUT
                    ================================================= */}

                    <div className="profile-logout-card">

                        <div>

                            <h3>
                                Sign Out
                            </h3>

                            <p>
                                Sign out of your EduLearn account.
                            </p>

                        </div>

                        <button
                            onClick={handleLogout}
                        >

                            <FiLogOut />

                            Logout

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default Profile;
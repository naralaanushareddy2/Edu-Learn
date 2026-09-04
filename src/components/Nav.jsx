import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import "../styles/nav.css";
import logo from "../assets/logo.png";

import {
  FiSearch,
  FiHeart,
  FiBookOpen,
  FiUser,
  FiCamera,
  FiUpload,
  FiTrash2,
  FiLogIn,
  FiLogOut
} from "react-icons/fi";

const Nav = () => {

  // =====================================================
  // GET USER FROM REDUX
  // =====================================================

  const loggedInUser = useSelector(
    (state) => state.auth.user
  );

  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  const [profileImage, setProfileImage] = useState(
    loggedInUser?.profileImage || null
  );

  const [showProfile, setShowProfile] = useState(false);

  // =====================================================
  // IMAGE UPLOAD
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
  // REMOVE IMAGE
  // =====================================================

  const removeProfileImage = () => {

    setProfileImage(null);

  };

  return (

    <div>

      {/* =================================================
          TOP NAVIGATION
      ================================================= */}

      <nav className="nav-upper">

        <section className="u-nav">

          <p>
            Learn Anytime, Anywhere | Build Your Future with EduLearn
          </p>

        </section>

        <section className="s-link">

          <Link to="/HelpSupport">
            Help & Support
          </Link>

          <Link to="/TermsConditions">
            Terms & Conditions
          </Link>

        </section>

      </nav>

      {/* =================================================
          MIDDLE NAVIGATION
      ================================================= */}

      <nav className="nav-middle">

        {/* LOGO */}

        <section className="logo">

          <Link to="/">

            <img
              src={logo}
              alt="EduLearn Logo"
            />

          </Link>

        </section>

        {/* SEARCH */}

        <section className="search-bar">

          <div className="search-box">

            <input
              type="text"
              placeholder="Search Courses, Subjects, Skills..."
            />

            <button type="button">

              <FiSearch />

            </button>

          </div>

        </section>

        {/* USER ACTIONS */}

        <section className="user-actions">

          {/* WISHLIST */}

          {loggedInUser && (

            <Link
              to="/wishlist"
              className="action-icon"
              title="Wishlist"
            >

              <FiHeart />

            </Link>

          )}

          {/* LOGIN */}

          {!loggedInUser && (

            <Link
              to="/Login"
              className="login-btn"
            >

              <FiLogIn />

              <span>
                Login
              </span>

            </Link>

          )}

          {/* PROFILE */}

          {loggedInUser && (

            <div className="profile-section">

              <button
                type="button"
                className="profile-button"
                onClick={() =>
                  setShowProfile(!showProfile)
                }
                title="Profile"
              >

                {profileImage ? (

                  <img
                    src={profileImage}
                    alt="Profile"
                  />

                ) : (

                  <FiUser />

                )}

              </button>

              {/* PROFILE DROPDOWN */}

              {showProfile && (

                <div className="profile-menu">

                  {/* PROFILE HEADER */}

                  <div className="profile-header">

                    <div className="profile-preview">

                      {profileImage ? (

                        <img
                          src={profileImage}
                          alt="Profile"
                        />

                      ) : (

                        <FiUser />

                      )}

                    </div>

                    <div>

                      <h4>
                        Welcome
                      </h4>

                      <p>
                        {loggedInUser.name || "EduLearn User"}
                      </p>

                    </div>

                  </div>

                  {/* UPLOAD IMAGE */}

                  <label className="profile-option">

                    <FiUpload />

                    <span>
                      {profileImage
                        ? "Change Photo"
                        : "Upload Image"}
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      hidden
                    />

                  </label>

                  {/* TAKE PHOTO */}

                  <label className="profile-option">

                    <FiCamera />

                    <span>
                      Take Photo
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      onChange={handleImageUpload}
                      hidden
                    />

                  </label>

                  {/* REMOVE PHOTO */}

                  {profileImage && (

                    <button
                      type="button"
                      className="profile-option"
                      onClick={removeProfileImage}
                    >

                      <FiTrash2 />

                      <span>
                        Remove Photo
                      </span>

                    </button>

                  )}

                  {/* MY PROFILE */}

                  <Link
                    to="/profile"
                    className="profile-option"
                    onClick={() =>
                      setShowProfile(false)
                    }
                  >

                    <FiUser />

                    <span>
                      My Profile
                    </span>

                  </Link>

                  {/* MY LEARNING */}

                  <Link
                    to="/my-learning"
                    className="profile-option"
                    onClick={() =>
                      setShowProfile(false)
                    }
                  >

                    <FiBookOpen />

                    <span>
                      My Learning
                    </span>

                  </Link>

                  {/* WISHLIST */}

                  <Link
                    to="/wishlist"
                    className="profile-option"
                    onClick={() =>
                      setShowProfile(false)
                    }
                  >

                    <FiHeart />

                    <span>
                      Wishlist
                    </span>

                  </Link>

                </div>

              )}

            </div>

          )}

        </section>

      </nav>

    </div>

  );

};

export default Nav;
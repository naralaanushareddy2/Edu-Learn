import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "../context/useTheme";
import { updateUser, logoutUser } from "../redux/authSlice";

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
  FiLogOut,
  FiSun,
  FiMoon
} from "react-icons/fi";

const Nav = () => {
  const dispatch = useDispatch();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // =====================================================
  // GET USER FROM REDUX
  // =====================================================

  const loggedInUser = useSelector(
    (state) => state.auth.user
  );

  // Derive profile image directly from Redux auth user
  const profileImage = loggedInUser?.profileImage || null;

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

      if (loggedInUser) {
        dispatch(updateUser({ ...loggedInUser, profileImage: imageData }));
      }

    };

    reader.readAsDataURL(file);

  };

  // =====================================================
  // REMOVE IMAGE
  // =====================================================

  const removeProfileImage = () => {

    if (loggedInUser) {
      dispatch(updateUser({ ...loggedInUser, profileImage: null }));
    }

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

          <Link to="/" className="logo-link" aria-label="EduLearn home">

            <img
              src={logo}
              alt="EduLearn"
            />

          </Link>

        </section>

        {/* SEARCH */}

        <section className="search-bar">

          <form
            className="search-box"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchTerm.trim()) {
                navigate(`/Courses?search=${encodeURIComponent(searchTerm.trim())}`);
              }
            }}
          >

            <input
              type="text"
              placeholder="Search Courses, Subjects, Skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button type="submit" aria-label="Search">

              <FiSearch />

            </button>

          </form>

        </section>

        {/* USER ACTIONS */}

        <section className="user-actions">

          {/* THEME TOGGLE (DARK / LIGHT) */}
          <button
            type="button"
            className="action-icon theme-toggle-btn"
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <FiSun className="theme-toggle-icon sun-icon" />
            ) : (
              <FiMoon className="theme-toggle-icon moon-icon" />
            )}
          </button>

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

                  {/* THEME TOGGLE */}
                  <button
                    type="button"
                    className="profile-option theme-profile-option"
                    onClick={() => {
                      toggleTheme();
                    }}
                  >
                    {isDark ? <FiSun /> : <FiMoon />}
                    <span>
                      {isDark ? "Light Mode" : "Dark Mode"}
                    </span>
                  </button>

                  {/* LOGOUT */}
                  <button
                    type="button"
                    className="profile-option profile-logout-option"
                    onClick={() => {
                      setShowProfile(false);
                      dispatch(logoutUser());
                      navigate("/Login");
                    }}
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>

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
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import {
  FiHeart,
  FiBookOpen,
  FiArrowRight,
  FiTrash2
} from "react-icons/fi";

import {
  setWishlist,
  removeFromWishlist
} from "../redux/wishlistSlice";

import "../styles/wishlist.css";

const API_URL = "http://localhost:5000";

const Wishlist = () => {

  const dispatch = useDispatch();

  // =====================================================
  // GET USER FROM REDUX
  // =====================================================

  const loggedInUser = useSelector(
    (state) => state.auth.user
  );

  // =====================================================
  // GET WISHLIST FROM REDUX
  // =====================================================

  const wishlist = useSelector(
    (state) => state.wishlist.items
  );

  // =====================================================
  // LOCAL STATE
  // =====================================================

  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD WISHLIST
  // =====================================================

  useEffect(() => {

    const loadWishlist = async () => {

      if (!loggedInUser) {

        dispatch(
          setWishlist([])
        );

        setLoading(false);

        return;

      }

      try {

        setLoading(true);

        const response = await axios.get(
          `${API_URL}/wishlist?userId=${encodeURIComponent(
            loggedInUser.id
          )}`
        );

        dispatch(
          setWishlist(response.data)
        );

      } catch (error) {

        console.error(
          "Wishlist loading error:",
          error
        );

        alert(
          "Unable to load your wishlist. Make sure JSON Server is running."
        );

      } finally {

        setLoading(false);

      }

    };

    loadWishlist();

  }, [
    loggedInUser,
    dispatch
  ]);

  // =====================================================
  // REMOVE FROM WISHLIST
  // =====================================================

  const handleRemove = async (wishlistId) => {

    try {

      await axios.delete(
        `${API_URL}/wishlist/${wishlistId}`
      );

      dispatch(
        removeFromWishlist(wishlistId)
      );

    } catch (error) {

      console.error(
        "Remove wishlist error:",
        error
      );

      alert(
        "Unable to remove the course from wishlist."
      );

    }

  };

  // =====================================================
  // USER NOT LOGGED IN
  // =====================================================

  if (!loggedInUser) {

    return (

      <div className="wishlist-page">

        <div className="empty-wishlist">

          <FiHeart />

          <h2>
            Please Login
          </h2>

          <p>
            Login to manage your wishlist.
          </p>

          <Link to="/Login">
            Login
          </Link>

        </div>

      </div>

    );

  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="wishlist-page">

        <div className="empty-wishlist">

          <FiHeart />

          <h2>
            Loading Wishlist...
          </h2>

        </div>

      </div>

    );

  }

  return (

    <div className="wishlist-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="wishlist-header">

        <FiHeart />

        <p>
          YOUR COLLECTION
        </p>

        <h1>
          My Wishlist
        </h1>

        <span>
          Courses you've saved for learning later.
        </span>

      </section>

      {/* =================================================
          EMPTY WISHLIST
      ================================================= */}

      {wishlist.length === 0 ? (

        <div className="empty-wishlist">

          <FiHeart />

          <h2>
            Your Wishlist is Empty
          </h2>

          <p>
            Save courses that you want to learn later.
          </p>

          <Link to="/categories">

            Explore Courses

            <FiArrowRight />

          </Link>

        </div>

      ) : (

        /* =================================================
           WISHLIST COURSES
        ================================================= */

        <section className="wishlist-grid">

          {wishlist.map((course) => (

            <article
              className="wishlist-card"
              key={course.id}
            >

              <div className="wishlist-card-icon">

                <FiBookOpen />

              </div>

              <div className="wishlist-card-content">

                <span className="wishlist-category">

                  {course.categoryName}

                </span>

                <h2>
                  {course.courseName || course.name}
                </h2>

                <p>
                  {course.description ||
                    "Continue learning this course with EduLearn."}
                </p>

                <div className="wishlist-meta">

                  {course.level && (
                    <span>
                      {course.level}
                    </span>
                  )}

                  {course.duration && (
                    <span>
                      {course.duration}
                    </span>
                  )}

                </div>

                <div className="wishlist-actions">

                  <Link
                    to={`/Courses/${course.courseId}`}
                    className="view-course-btn"
                  >

                    View Course

                    <FiArrowRight />

                  </Link>

                  <button
                    type="button"
                    className="remove-wishlist-btn"
                    onClick={() =>
                      handleRemove(course.id)
                    }
                  >

                    <FiTrash2 />

                    Remove

                  </button>

                </div>

              </div>

            </article>

          ))}

        </section>

      )}

    </div>

  );

};

export default Wishlist;
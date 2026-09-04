
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import categories from "@data/categories.json";

import {
  setEnrollments,
  updateEnrollment,
  removeEnrollment
} from "../redux/enrollmentSlice";

import {
  FiBookOpen,
  FiPlayCircle,
  FiTrash2,
  FiAward,
  FiClock,
  FiCheckCircle
} from "react-icons/fi";

import "../styles/my-learning.css";

const API_URL = "http://localhost:5000";

const MyLearning = () => {

  // =====================================================
  // REDUX
  // =====================================================

  const dispatch = useDispatch();

  // Get logged-in user from Redux
  const loggedInUser = useSelector(
    (state) => state.auth.user
  );

  // Get enrollments from Redux
  const enrollments = useSelector(
    (state) => state.enrollment.enrollments
  );


  // =====================================================
  // LOCAL STATE
  // =====================================================

  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);


  // =====================================================
  // FIND COURSE FROM categories.json
  // =====================================================

  const findCourse = (courseId) => {

    for (const category of categories) {

      const course =
        category.subcategories.find(
          (item) =>
            Number(item.id) === Number(courseId)
        );

      if (course) {

        return {
          ...course,

          categoryId:
            category.id,

          categoryName:
            category.name
        };

      }

    }

    return null;
  };


  // =====================================================
  // LOAD ENROLLMENTS FROM JSON SERVER
  // =====================================================

  const loadEnrollments = async () => {

    try {

      setLoading(true);

      // No logged-in user
      if (!loggedInUser) {

        dispatch(
          setEnrollments([])
        );

        setCourses([]);

        return;
      }


      // Get user's enrollments from JSON Server
      const response = await axios.get(
        `${API_URL}/enrollments?userId=${encodeURIComponent(
          loggedInUser.id
        )}`
      );


      // Store database data in Redux
      dispatch(
        setEnrollments(
          response.data
        )
      );

    } catch (error) {

      console.error(
        "My Learning error:",
        error
      );

      alert(
        "Unable to load your learning courses."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD DATA WHEN USER CHANGES
  // =====================================================

  useEffect(() => {

    loadEnrollments();

  }, [
    loggedInUser
  ]);


  // =====================================================
  // FORMAT REDUX ENROLLMENTS INTO COURSE DATA
  // =====================================================

  useEffect(() => {

    if (!loggedInUser) {

      setCourses([]);

      return;
    }


    const formattedCourses =
      enrollments
        .map((enrollment) => {

          const course =
            findCourse(
              enrollment.courseId
            );


          // Course not found
          if (!course) {

            return null;

          }


          return {

            ...course,

            enrollmentId:
              enrollment.id,

            progress:
              Number(
                enrollment.progress || 0
              ),

            completedLessons:
              enrollment.completedLessons || [],

            completed:
              enrollment.completed || false,

            enrolledAt:
              enrollment.enrolledAt

          };

        })
        .filter(Boolean);


    setCourses(
      formattedCourses
    );

  }, [
    enrollments,
    loggedInUser
  ]);


  // =====================================================
  // UNENROLL COURSE
  // =====================================================

  const handleUnenroll = async (
    enrollmentId,
    courseName
  ) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to unenroll from ${courseName}?`
      );


    if (!confirmed) {

      return;

    }


    try {

      // Delete from JSON Server
      await axios.delete(
        `${API_URL}/enrollments/${enrollmentId}`
      );


      // Remove from Redux
      dispatch(
        removeEnrollment(
          enrollmentId
        )
      );


      alert(
        `${courseName} has been removed from My Learning.`
      );


    } catch (error) {

      console.error(
        "Unenroll error:",
        error
      );

      alert(
        "Unable to unenroll from this course."
      );

    }

  };


  // =====================================================
  // USER NOT LOGGED IN
  // =====================================================

  if (!loggedInUser) {

    return (

      <div className="my-learning-page">

        <div className="empty-learning">

          <FiBookOpen />

          <h2>
            Please Login
          </h2>

          <p>
            Login to see your enrolled courses.
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

      <div className="my-learning-page">

        <div className="empty-learning">

          <FiBookOpen />

          <h2>
            Loading My Learning...
          </h2>

        </div>

      </div>

    );

  }


  // =====================================================
  // RETURN UI
  // =====================================================

  return (

    <div className="my-learning-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <section className="my-learning-header">

        <p>
          YOUR LEARNING JOURNEY
        </p>

        <h1>
          My Learning
        </h1>

        <span>
          Continue your courses and track your progress.
        </span>

      </section>


      {/* =================================================
          LEARNING SUMMARY
      ================================================= */}

      {courses.length > 0 && (

        <section className="learning-summary">

          <div>

            <strong>
              {courses.length}
            </strong>

            <span>
              Enrolled Courses
            </span>

          </div>


          <div>

            <strong>

              {
                courses.filter(
                  (course) =>
                    course.progress === 100
                ).length
              }

            </strong>

            <span>
              Completed
            </span>

          </div>


          <div>

            <strong>

              {
                Math.round(
                  courses.reduce(
                    (sum, course) =>
                      sum +
                      Number(
                        course.progress || 0
                      ),
                    0
                  ) /
                  courses.length
                )
              }%

            </strong>

            <span>
              Average Progress
            </span>

          </div>

        </section>

      )}


      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {courses.length === 0 ? (

        <div className="empty-learning">

          <FiBookOpen />

          <h2>
            No Courses Yet
          </h2>

          <p>
            You haven't enrolled in any courses yet.
          </p>

          <Link to="/categories">
            Explore Courses
          </Link>

        </div>

      ) : (

        /* =================================================
           COURSES
        ================================================= */

        <section className="learning-courses">

          {courses.map((course) => (

            <article
              className="learning-course-card"
              key={course.enrollmentId}
            >


              {/* COURSE ICON */}

              <div className="learning-course-icon">

                <FiBookOpen />

              </div>


              {/* COURSE CONTENT */}

              <div className="learning-course-content">


                {/* CATEGORY */}

                <span className="learning-category">

                  {course.categoryName}

                </span>


                {/* COURSE NAME */}

                <h2>
                  {course.name}
                </h2>


                {/* DESCRIPTION */}

                <p>
                  {course.description}
                </p>


                {/* =================================================
                    META
                ================================================= */}

                <div className="learning-meta">

                  <span>

                    <FiClock />

                    {course.duration}

                  </span>


                  <span>

                    <FiBookOpen />

                    {course.lessons?.length || 0}
                    {" "}
                    Lessons

                  </span>

                </div>


                {/* =================================================
                    PROGRESS HEADER
                ================================================= */}

                <div className="progress-header">

                  <span>
                    Course Progress
                  </span>

                  <strong>
                    {course.progress}%
                  </strong>

                </div>


                {/* PROGRESS BAR */}

                <div className="progress-bar">

                  <div
                    className="progress-fill"
                    style={{
                      width:
                        `${course.progress}%`
                    }}
                  />

                </div>


                {/* LESSON PROGRESS */}

                <p className="lesson-progress">

                  {course.completedLessons.length}

                  {" "}

                  of

                  {" "}

                  {course.lessons?.length || 0}

                  {" "}

                  lessons completed

                </p>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="learning-actions">


                  {/* CONTINUE LEARNING */}

                  <Link
                    to={`/Courses/${course.id}`}
                    className="continue-btn"
                  >

                    <FiPlayCircle />

                    {course.progress === 0
                      ? "Start Learning"
                      : "Continue Learning"}

                  </Link>


                  {/* CERTIFICATE */}

                  {course.progress === 100 && (

                    <Link
                      to={`/certificate/${course.id}`}
                      className="certificate-btn"
                    >

                      <FiAward />

                      Certificate

                    </Link>

                  )}


                  {/* UNENROLL */}

                  <button
                    type="button"
                    className="unenroll-btn"
                    onClick={() =>
                      handleUnenroll(
                        course.enrollmentId,
                        course.name
                      )
                    }
                  >

                    <FiTrash2 />

                    Unenroll

                  </button>

                </div>


                {/* =================================================
                    COMPLETED LABEL
                ================================================= */}

                {course.progress === 100 && (

                  <div className="course-completed-label">

                    <FiCheckCircle />

                    Course Completed

                  </div>

                )}

              </div>

            </article>

          ))}

        </section>

      )}

    </div>

  );

};


export default MyLearning;

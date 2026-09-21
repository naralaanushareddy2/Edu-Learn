import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api, { API_URL } from "../services/api";
import { useDispatch, useSelector } from "react-redux";

import categories from "@data/categories.json";

import {
  setEnrollments,
  removeEnrollment
} from "../redux/enrollmentSlice";

import {
  FiBookOpen,
  FiPlayCircle,
  FiTrash2,
  FiAward,
  FiClock,
  FiCheckCircle,
  FiTrendingUp
} from "react-icons/fi";

import "../styles/my-learning.css";

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

  const [loading, setLoading] = useState(true);

  // =====================================================
  // FIND COURSE FROM categories.json
  // =====================================================

  const findCourse = (courseId) => {
    for (const category of categories) {
      const course = category.subcategories.find(
        (item) => Number(item.id) === Number(courseId)
      );

      if (course) {
        return {
          ...course,
          categoryId: category.id,
          categoryName: category.name
        };
      }
    }

    return null;
  };

  // =====================================================
  // FORMAT REDUX ENROLLMENTS INTO COURSE DATA (DERIVED)
  // =====================================================

  const courses = useMemo(() => {
    if (!loggedInUser) return [];

    return enrollments
      .map((enrollment) => {
        const course = findCourse(enrollment.courseId);
        if (!course) return null;

        return {
          ...course,
          enrollmentId: enrollment.id,
          progress: Number(enrollment.progress || 0),
          completedLessons: enrollment.completedLessons || [],
          completed: enrollment.completed || false,
          enrolledAt: enrollment.enrolledAt
        };
      })
      .filter(Boolean);
  }, [enrollments, loggedInUser]);

  // =====================================================
  // LOAD ENROLLMENTS ON USER CHANGE
  // =====================================================

  useEffect(() => {
    let isMounted = true;

    const fetchEnrollments = async () => {
      if (!loggedInUser?.id) {
        dispatch(setEnrollments([]));
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const response = await api.get(
          `${API_URL}/enrollments?userId=${encodeURIComponent(loggedInUser.id)}`
        );

        if (isMounted) {
          dispatch(setEnrollments(response.data));
        }
      } catch (error) {
        console.error("My Learning error:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEnrollments();

    return () => {
      isMounted = false;
    };
  }, [loggedInUser, dispatch]);


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

      // Delete enrollment record
      await api.delete(
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

          <div className="summary-card">
            <div className="summary-card-icon enrolled-icon">
              <FiBookOpen />
            </div>
            <div className="summary-card-info">
              <p className="summary-value">
                {courses.length}
              </p>
              <p className="summary-label">
                Enrolled Courses
              </p>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-card-icon completed-icon">
              <FiCheckCircle />
            </div>
            <div className="summary-card-info">
              <p className="summary-value">
                {
                  courses.filter(
                    (course) =>
                      course.progress === 100
                  ).length
                }
              </p>
              <p className="summary-label">
                Completed
              </p>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-card-icon progress-icon">
              <FiTrendingUp />
            </div>
            <div className="summary-card-info">
              <p className="summary-value">
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
              </p>
              <p className="summary-label">
                Average Progress
              </p>
            </div>
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

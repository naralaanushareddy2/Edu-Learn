import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import api, { API_URL } from "../services/api";
import { useDispatch, useSelector } from "react-redux";

import categories from "@data/categories.json";

import {
  setEnrollments,
  addEnrollment,
  updateEnrollment,
} from "../redux/enrollmentSlice";

import {
  setWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../redux/wishlistSlice";

import "../styles/course-details.css";

import {
  FiBookOpen,
  FiArrowLeft,
  FiPlayCircle,
  FiExternalLink,
  FiClock,
  FiBarChart2,
  FiHeart,
  FiCheckCircle,
  FiAward,
  FiX,
} from "react-icons/fi";


const CourseDetails = () => {

  const { subcategoryId } = useParams();

  // =====================================================
  // FIND COURSE & CATEGORY
  // =====================================================

  let selectedSubcategory = null;
  let selectedCategory = null;

  for (const category of categories) {
    const found = category.subcategories.find(
      (sub) => Number(sub.id) === Number(subcategoryId)
    );
    if (found) {
      selectedSubcategory = found;
      selectedCategory = category;
      break;
    }
  }

  // =====================================================
  // REDUX
  // =====================================================

  const dispatch = useDispatch();

  // Logged-in user
  const loggedInUser = useSelector(
    (state) => state.auth.user
  );

  // Enrollments from Redux
  const enrollments = useSelector(
    (state) => state.enrollment.enrollments
  );

  // Wishlist from Redux
  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  // =====================================================
  // LOCAL & DERIVED STATE
  // =====================================================

  const [localEnrollment, setLocalEnrollment] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [activeLessonVideo, setActiveLessonVideo] = useState(null);

  const matchedEnrollment = useMemo(() => {
    if (!loggedInUser || !selectedSubcategory) return null;
    return (
      enrollments.find(
        (item) =>
          String(item.userId) === String(loggedInUser.id) &&
          String(item.courseId) === String(selectedSubcategory.id)
      ) || null
    );
  }, [enrollments, loggedInUser, selectedSubcategory]);

  const enrollment = localEnrollment || matchedEnrollment;
  const setEnrollment = setLocalEnrollment;

  const isWishlisted = useMemo(() => {
    if (!selectedSubcategory || !loggedInUser) return false;
    return wishlistItems.some(
      (item) =>
        String(item.userId) === String(loggedInUser.id) &&
        String(item.courseId) === String(selectedSubcategory.id)
    );
  }, [wishlistItems, loggedInUser, selectedSubcategory]);

  const setIsWishlisted = () => {};

  const parseYouTubeStart = (url, explicitStart) => {
    if (Number.isFinite(explicitStart) && explicitStart > 0) {
      return Math.floor(explicitStart);
    }

    if (!url) return 0;

    const startParam = url.match(/[?&]start=(\d+)/);
    if (startParam) {
      return parseInt(startParam[1], 10);
    }

    const tParam = url.match(/[?&#]t=([^&]+)/);
    if (!tParam) return 0;

    const value = decodeURIComponent(tParam[1]);
    if (/^\d+s?$/i.test(value)) {
      return parseInt(value, 10);
    }

    let seconds = 0;
    const hours = value.match(/(\d+)h/i);
    const minutes = value.match(/(\d+)m/i);
    const secs = value.match(/(\d+)s/i);
    if (hours) seconds += parseInt(hours[1], 10) * 3600;
    if (minutes) seconds += parseInt(minutes[1], 10) * 60;
    if (secs) seconds += parseInt(secs[1], 10);
    return seconds;
  };

  const getWatchUrl = (url, startSeconds = 0) => {
    if (!url) return "";
    if (!startSeconds) return url;

    try {
      const parsed = new URL(url);
      parsed.searchParams.delete("t");
      parsed.searchParams.delete("start");
      parsed.searchParams.set("t", `${startSeconds}s`);
      return parsed.toString();
    } catch {
      return url;
    }
  };

  const getEmbedUrl = (url, explicitStart) => {
    if (!url) return "";
    try {
      let videoId = "";
      const startSeconds = parseYouTubeStart(url, explicitStart);

      const vMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
      if (vMatch) {
        videoId = vMatch[1];
      } else {
        const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
        if (shortMatch) {
          videoId = shortMatch[1];
        }
      }

      if (videoId) {
        let embed = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
        if (startSeconds > 0) {
          embed += `&start=${startSeconds}`;
        }
        return embed;
      }
      return url;
    } catch {
      return url;
    }
  };




  // =====================================================
  // LOAD ENROLLMENTS
  // =====================================================

  useEffect(() => {

    const loadEnrollments = async () => {

      try {

        if (!loggedInUser) {
          return;
        }


        const response =
          await api.get(
            `${API_URL}/enrollments?userId=${encodeURIComponent(
              loggedInUser.id
            )}`
          );


        // Store database data in Redux
        dispatch(
          setEnrollments(response.data)
        );

      } catch (error) {

        console.error(
          "Error loading enrollments:",
          error
        );

      }

    };


    loadEnrollments();

  }, [loggedInUser, dispatch]);


  // =====================================================
  // LOAD WISHLIST
  // =====================================================

  useEffect(() => {

    const loadWishlist = async () => {

      try {

        if (!loggedInUser) {
          return;
        }


        const response =
          await api.get(
            `${API_URL}/wishlist?userId=${encodeURIComponent(
              loggedInUser.id
            )}`
          );


        // Store database data in Redux
        dispatch(
          setWishlist(response.data)
        );

      } catch (error) {

        console.error(
          "Error loading wishlist:",
          error
        );

      }

    };


    loadWishlist();

  }, [loggedInUser, dispatch]);


  // =====================================================


  // =====================================================
  // COURSE NOT FOUND
  // =====================================================

  if (!selectedSubcategory) {

    return (

      <div className="course-not-found">

        <FiBookOpen />

        <h2>
          Course Not Found
        </h2>

        <p>
          The course you are looking for does not exist.
        </p>

        <Link to="/categories">

          <FiArrowLeft />

          Back to Categories

        </Link>

      </div>

    );

  }





  // =====================================================
  // PROGRESS
  // =====================================================

  const completedLessons =
    enrollment?.completedLessons || [];


  const totalLessons =
    selectedSubcategory.lessons?.length || 0;


  const progress =
    enrollment?.progress ??
    (
      totalLessons > 0
        ? Math.round(
            (
              completedLessons.length /
              totalLessons
            ) * 100
          )
        : 0
    );


  // =====================================================
  // ENROLL COURSE
  // =====================================================

  const handleEnroll = async () => {

    try {

      // -------------------------------------------------
      // CHECK LOGIN
      // -------------------------------------------------

      if (!loggedInUser) {

        alert(
          "Please login first."
        );

        return;

      }


      setProcessing(true);


      // -------------------------------------------------
      // CHECK EXISTING ENROLLMENT
      // -------------------------------------------------

      const existing =
        await api.get(
          `${API_URL}/enrollments?userId=${encodeURIComponent(
            loggedInUser.id
          )}&courseId=${selectedSubcategory.id}`
        );


      if (existing.data.length > 0) {

        const existingEnrollment =
          existing.data[0];


        // Update local UI
        setEnrollment(
          existingEnrollment
        );


        // Update the specific enrollment in Redux
        dispatch(
          updateEnrollment(
            existingEnrollment
          )
        );


        alert(
          "You are already enrolled in this course."
        );

        return;

      }


      // -------------------------------------------------
      // CREATE ENROLLMENT DATA
      // -------------------------------------------------

      const enrollmentData = {

        userId:
          loggedInUser.id,

        userName:
          loggedInUser.name ||
          loggedInUser.username ||
          loggedInUser.email,

        courseId:
          selectedSubcategory.id,

        courseName:
          selectedSubcategory.name,

        categoryId:
          selectedCategory.id,

        categoryName:
          selectedCategory.name,

        completedLessons: [],

        progress: 0,

        completed: false,

        certificateIssued: false,

        enrolledAt:
          new Date().toISOString(),

        completedAt: null,

      };


      // -------------------------------------------------
      // CREATE RECORD
      // -------------------------------------------------

      const response =
        await api.post(
          `${API_URL}/enrollments`,
          enrollmentData
        );


      // -------------------------------------------------
      // ADD NEW ENROLLMENT TO REDUX
      // -------------------------------------------------

      dispatch(
        addEnrollment(
          response.data
        )
      );


      // -------------------------------------------------
      // UPDATE CURRENT PAGE
      // -------------------------------------------------

      setEnrollment(
        response.data
      );


      alert(
        `${selectedSubcategory.name} enrolled successfully!`
      );

    } catch (error) {

      console.error(
        "Enrollment error:",
        error
      );

      alert(
        "Unable to enroll in this course. Make sure JSON Server is running on port 5000."
      );

    } finally {

      setProcessing(false);

    }

  };


  // =====================================================
  // MARK LESSON COMPLETE
  // =====================================================

  const handleLessonComplete = async (
    lessonId
  ) => {

    try {

      // -------------------------------------------------
      // CHECK ENROLLMENT
      // -------------------------------------------------

      if (!enrollment) {

        alert(
          "Please enroll in this course first."
        );

        return;

      }


      // -------------------------------------------------
      // GET OLD COMPLETED LESSONS
      // -------------------------------------------------

      const oldLessons =
        enrollment.completedLessons || [];


      // -------------------------------------------------
      // PREVENT DUPLICATE
      // -------------------------------------------------

      if (
        oldLessons.includes(lessonId)
      ) {

        return;

      }


      // -------------------------------------------------
      // ADD LESSON
      // -------------------------------------------------

      const updatedLessons = [
        ...oldLessons,
        lessonId,
      ];


      // -------------------------------------------------
      // CALCULATE PROGRESS
      // -------------------------------------------------

      const newProgress =
        totalLessons > 0
          ? Math.round(
              (
                updatedLessons.length /
                totalLessons
              ) * 100
            )
          : 0;


      // -------------------------------------------------
      // CHECK COMPLETION
      // -------------------------------------------------

      const completed =
        newProgress === 100;


      // -------------------------------------------------
      // UPDATE JSON SERVER
      // -------------------------------------------------

      const response =
        await api.patch(
          `${API_URL}/enrollments/${enrollment.id}`,
          {

            completedLessons:
              updatedLessons,

            progress:
              newProgress,

            completed:
              completed,

            completedAt:
              completed
                ? new Date().toISOString()
                : null,

            certificateIssued:
              completed,

          }
        );


      // -------------------------------------------------
      // UPDATE LOCAL STATE
      // -------------------------------------------------

      setEnrollment(
        response.data
      );


      // -------------------------------------------------
      // UPDATE REDUX
      // -------------------------------------------------

      dispatch(
        updateEnrollment(
          response.data
        )
      );


      // -------------------------------------------------
      // COMPLETION MESSAGE
      // -------------------------------------------------

      if (completed) {

        alert(
          `Congratulations! You completed ${selectedSubcategory.name}. Your certificate is now available.`
        );

      }

    } catch (error) {

      console.error(
        "Progress update error:",
        error
      );

      alert(
        "Unable to update your progress."
      );

    }

  };


  // =====================================================
  // WISHLIST
  // =====================================================

  const handleWishlist = async () => {

    try {

      // -------------------------------------------------
      // CHECK LOGIN
      // -------------------------------------------------

      if (!loggedInUser) {

        alert(
          "Please login first."
        );

        return;

      }


      // -------------------------------------------------
      // FIND CURRENT USER'S WISHLIST ITEM
      // -------------------------------------------------

      const existingWishlistItem =
        wishlistItems.find(
          (item) =>
            String(item.userId) ===
              String(loggedInUser.id) &&
            String(item.courseId) ===
              String(selectedSubcategory.id)
        );


      // -------------------------------------------------
      // REMOVE
      // -------------------------------------------------

      if (existingWishlistItem) {

        await api.delete(
          `${API_URL}/wishlist/${existingWishlistItem.id}`
        );


        dispatch(
          removeFromWishlist(
            existingWishlistItem.id
          )
        );


        setIsWishlisted(false);


        alert(
          "Course removed from wishlist."
        );

        return;

      }


      // -------------------------------------------------
      // CREATE WISHLIST
      // -------------------------------------------------

      const wishlistData = {

        userId:
          loggedInUser.id,

        userName:
          loggedInUser.name ||
          loggedInUser.username ||
          loggedInUser.email,

        courseId:
          selectedSubcategory.id,

        courseName:
          selectedSubcategory.name,

        categoryId:
          selectedCategory.id,

        categoryName:
          selectedCategory.name,

        addedAt:
          new Date().toISOString(),

      };


      // -------------------------------------------------
      // SAVE RECORD
      // -------------------------------------------------

      const response =
        await api.post(
          `${API_URL}/wishlist`,
          wishlistData
        );


      // -------------------------------------------------
      // ADD TO REDUX
      // -------------------------------------------------

      dispatch(
        addToWishlist(
          response.data
        )
      );


      setIsWishlisted(true);


      alert(
        `${selectedSubcategory.name} added to wishlist!`
      );

    } catch (error) {

      console.error(
        "Wishlist error:",
        error
      );

      alert(
        "Unable to update wishlist."
      );

    }

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="course-details-page">

      {/* BACK */}

      <Link
        to={`/categories/${selectedCategory.id}`}
        className="back-category-btn"
      >

        <FiArrowLeft />

        Back to {selectedCategory.name}

      </Link>


      {/* COURSE HEADER */}

      <section className="course-details-header">

        <div className="course-details-icon">

          <FiBookOpen />

        </div>


        <div className="course-details-content">

          <span className="course-category">

            {selectedCategory.name}

          </span>


          <h1>

            {selectedSubcategory.name}

          </h1>


          <p className="course-description">

            {selectedSubcategory.description}

          </p>


          {/* COURSE META */}

          <div className="course-meta">

            <div className="meta-item">

              <FiBarChart2 />

              <span>
                {selectedSubcategory.level}
              </span>

            </div>


            <div className="meta-item">

              <FiClock />

              <span>
                {selectedSubcategory.duration}
              </span>

            </div>


            <div className="meta-item">

              <FiBookOpen />

              <span>
                {totalLessons} Lessons
              </span>

            </div>

          </div>


          {/* PROGRESS */}

          {enrollment && (

            <div className="course-progress">

              <div className="progress-header">

                <span>
                  Course Progress
                </span>

                <strong>
                  {progress}%
                </strong>

              </div>


              <div className="progress-bar">

                <div
                  className="progress-fill"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

            </div>

          )}


          {/* ACTION BUTTONS */}

          <div className="course-actions">

            {!enrollment ? (

              <button
                type="button"
                className="enroll-btn"
                onClick={handleEnroll}
                disabled={processing}
              >

                <FiBookOpen />

                {processing
                  ? "Enrolling..."
                  : "Enroll Now"}

              </button>

            ) : progress === 100 ? (

              <Link
                to={`/certificate/${selectedSubcategory.id}`}
                className="certificate-btn"
              >

                <FiAward />

                Download Certificate

              </Link>

            ) : (

              <div className="course-progress-message">

                <FiCheckCircle />

                Complete all lessons to
                unlock your certificate.

              </div>

            )}


            {/* WISHLIST */}

            <button
              type="button"
              className={`wishlist-btn ${
                isWishlisted
                  ? "wishlisted"
                  : ""
              }`}
              onClick={handleWishlist}
            >

              <FiHeart />

              {isWishlisted
                ? "Remove from Wishlist"
                : "Add to Wishlist"}

            </button>

          </div>

        </div>

      </section>


      {/* LESSONS */}

      <section className="course-lessons-section">

        <div className="lessons-heading">

          <span>
            COURSE CONTENT
          </span>

          <h2>
            Learn {selectedSubcategory.name}
          </h2>

          <p>
            Complete every lesson to track your progress.
          </p>

        </div>


        <div className="lessons-container">

          {selectedSubcategory.lessons?.map(
            (lesson, index) => {

              const completed =
                completedLessons.includes(
                  lesson.id
                );


              return (

                <div
                  className={`lesson-card ${
                    completed
                      ? "lesson-completed"
                      : ""
                  }`}
                  key={lesson.id}
                >

                  <div className="lesson-number">

                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}

                  </div>


                  <div className="lesson-content">

                    <div className="lesson-title-row">

                      <h3>
                        {lesson.title}
                      </h3>


                      {completed && (

                        <span className="completed-badge">

                          <FiCheckCircle />

                          Completed

                        </span>

                      )}

                    </div>


                    <p>
                      {lesson.description}
                    </p>


                    {lesson.video && (
                      <div className="lesson-video-actions">
                        <button
                          type="button"
                          className="watch-video-btn"
                          onClick={() =>
                            setActiveLessonVideo({
                              ...lesson,
                              partNumber: index + 1,
                              start: lesson.start || 0
                            })
                          }
                          title="Watch this part"
                        >
                          <FiPlayCircle />
                          <span>Watch Part {index + 1}</span>
                        </button>
                        <a
                          href={getWatchUrl(lesson.video, lesson.start)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="external-video-link"
                          title="Open this part on YouTube"
                        >
                          <FiExternalLink />
                        </a>
                      </div>
                    )}


                    {enrollment &&
                      !completed && (

                        <button
                          type="button"
                          className="complete-lesson-btn"
                          onClick={() =>
                            handleLessonComplete(
                              lesson.id
                            )
                          }
                        >

                          <FiCheckCircle />

                          Mark Lesson Complete

                        </button>

                    )}

                  </div>

                </div>

              );

            }
          )}

        </div>


        {/* COURSE COMPLETION */}

        {enrollment &&
          progress === 100 && (

            <div className="course-completed-box">

              <FiAward />

              <h2>
                Congratulations! 🎉
              </h2>

              <p>

                You have successfully completed
                {` ${selectedSubcategory.name}`}.

              </p>


              <Link
                to={`/certificate/${selectedSubcategory.id}`}
                className="download-certificate-btn"
              >

                <FiAward />

                Get Your Certificate

              </Link>

            </div>

          )}

      </section>


      {/* BOTTOM NAVIGATION */}

      <div className="course-bottom-navigation">

        <Link
          to={`/categories/${selectedCategory.id}`}
          className="bottom-back-btn"
        >

          <FiArrowLeft />

          Back to {selectedCategory.name}

        </Link>

      </div>

      {/* VIDEO PLAYER MODAL */}
      {activeLessonVideo && (
        <div
          className="video-modal-overlay"
          onClick={() => setActiveLessonVideo(null)}
        >
          <div
            className="video-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="video-modal-header">
              <div className="video-modal-title">
                <span className="video-part-badge">
                  Part {activeLessonVideo.partNumber || 1}
                </span>
                <h3>{activeLessonVideo.title}</h3>
              </div>
              <button
                type="button"
                className="video-modal-close"
                onClick={() => setActiveLessonVideo(null)}
                aria-label="Close video"
              >
                <FiX />
              </button>
            </div>

            <div className="video-modal-player-wrapper">
              <iframe
                key={`${activeLessonVideo.id}-${activeLessonVideo.start || 0}-${activeLessonVideo.video}`}
                src={getEmbedUrl(activeLessonVideo.video, activeLessonVideo.start)}
                title={activeLessonVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="video-modal-iframe"
              />
            </div>

            <div className="video-modal-footer">
              <p>{activeLessonVideo.description}</p>
              <div className="video-modal-actions">
                <a
                  href={getWatchUrl(activeLessonVideo.video, activeLessonVideo.start)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-youtube-link"
                >
                  <FiExternalLink />
                  <span>Open in YouTube</span>
                </a>
                {enrollment && !completedLessons.includes(activeLessonVideo.id) && (
                  <button
                    type="button"
                    className="modal-complete-btn"
                    onClick={() => {
                      handleLessonComplete(activeLessonVideo.id);
                    }}
                  >
                    <FiCheckCircle />
                    <span>Mark as Completed</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>

  );

};


export default CourseDetails;

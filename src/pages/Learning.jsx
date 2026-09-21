import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/learning.css";

import {
  FiBookOpen,
  FiTarget,
  FiClock,
  FiArrowRight
} from "react-icons/fi";

const Learning = () => {
  const loggedInUser = useSelector((state) => state.auth.user);
  const enrollments = useSelector((state) => state.enrollment.enrollments);

  const completedCount = enrollments.filter((e) => e.completed).length;
  const avgProgress = enrollments.length
    ? Math.round(
        enrollments.reduce((acc, curr) => acc + Number(curr.progress || 0), 0) /
          enrollments.length
      )
    : 0;

  return (

    <div className="learning-page">


      {/* ================= HEADER ================= */}

      <section className="learning-header">

        <p>
          YOUR LEARNING JOURNEY
        </p>

        <h1>
          My Learning
        </h1>

        <span>
          Continue your courses and track your
          learning progress in one place.
        </span>

      </section>


      {/* ================= STATISTICS ================= */}

      <section className="learning-stats">


        <div className="learning-stat-card">

          <FiBookOpen />

          <div>

            <h3>
              {loggedInUser ? enrollments.length : 0}
            </h3>

            <p>
              Enrolled Courses
            </p>

          </div>

        </div>


        <div className="learning-stat-card">

          <FiTarget />

          <div>

            <h3>
              {loggedInUser ? `${avgProgress}%` : "0%"}
            </h3>

            <p>
              Overall Progress
            </p>

          </div>

        </div>


        <div className="learning-stat-card">

          <FiClock />

          <div>

            <h3>
              {loggedInUser ? `${completedCount} Done` : "0 hrs"}
            </h3>

            <p>
              Completed Courses
            </p>

          </div>

        </div>


      </section>


      {/* ================= CONTINUE LEARNING ================= */}

      <section className="continue-learning">

        <h2>
          Continue Learning
        </h2>


        <div className="learning-empty">

          <FiBookOpen />

          <h3>
            {loggedInUser && enrollments.length > 0
              ? "Continue Your Active Courses"
              : "Start Your Learning Journey"}
          </h3>

          <p>
            {loggedInUser && enrollments.length > 0
              ? `You currently have ${enrollments.length} enrolled course(s). Pick up right where you left off.`
              : "Explore our courses and start learning in-demand skills today."}
          </p>

          <Link to={loggedInUser && enrollments.length > 0 ? "/my-learning" : "/Courses"}>
            {loggedInUser && enrollments.length > 0 ? "Go to My Learning" : "Explore Courses"}
            <FiArrowRight />
          </Link>

        </div>

      </section>

      {/* ================= BACK HOME ================= */}

      <section className="learning-bottom">

        <Link to="/">

          <FiArrowRight />
          Back to Home

        </Link>

      </section>


    </div>

  );
};


export default Learning;
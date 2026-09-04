import React from "react";
import { Link } from "react-router-dom";
import "../styles/learning.css";

import {
  FiBookOpen,
  FiTarget,
  FiClock,
  FiArrowRight
} from "react-icons/fi";


const Learning = () => {

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
              0
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
              0%
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
              0 hrs
            </h3>

            <p>
              Learning Time
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
            Start Your Learning Journey
          </h3>

          <p>
            You haven't enrolled in any courses yet.
            Explore our courses and start learning today.
          </p>


          <Link to="/Courses">

            Explore Courses
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
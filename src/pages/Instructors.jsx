import React from "react";
import { Link } from "react-router-dom";
import "../styles/instructors.css";

import {
  FiUser,
  FiArrowRight
} from "react-icons/fi";


const Instructors = () => {

  return (

    <div className="instructors-page">


      {/* ================= HEADER ================= */}

      <section className="instructors-header">

        <p>
          LEARN FROM THE BEST
        </p>

        <h1>
          Our Expert Instructors
        </h1>

        <span>
          Learn from experienced professionals
          who are passionate about teaching.
        </span>

      </section>


      {/* ================= INSTRUCTORS ================= */}

      <section className="instructors-section">

        <h2>
          Meet Our Instructors
        </h2>


        <div className="instructor-grid">


          {/* INSTRUCTOR 1 */}

          <div className="instructor-card">

            <div className="instructor-icon">
              <FiUser />
            </div>

            <h3>
              Lavanya
            </h3>

            <p className="instructor-role">
              Full-Stack Development
            </p>

            <p>
              Experienced developer passionate
              about teaching modern web technologies.
            </p>

            <Link to="/Instructors/Lavanya">

              View Profile
              <FiArrowRight />

            </Link>

          </div>


          {/* INSTRUCTOR 2 */}

          <div className="instructor-card">

            <div className="instructor-icon">
              <FiUser />
            </div>

            <h3>
              Hema Narendra Reddy
            </h3>

            <p className="instructor-role">
              Data Science
            </p>

            <p>
              Helps students understand data,
              analytics and practical applications.
            </p>

            <Link to="/Instructors/Hema Narendra Reddy">

              View Profile
              <FiArrowRight />

            </Link>

          </div>


          {/* INSTRUCTOR 3 */}

          <div className="instructor-card">

            <div className="instructor-icon">
              <FiUser />
            </div>

            <h3>
              Puneeth 
            </h3>

            <p className="instructor-role">
              Programming
            </p>

            <p>
              Focuses on programming fundamentals
              and problem-solving skills.
            </p>

            <Link to="/Instructors/Puneeth">

              View Profile
              <FiArrowRight />

            </Link>

          </div>


        </div>

      </section>


      {/* ================= BACK HOME ================= */}

      <section className="instructors-bottom">

        <Link to="/">
          <FiArrowRight />
          Back to Home
        </Link>

      </section>


    </div>

  );
};


export default Instructors;
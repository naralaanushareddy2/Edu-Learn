import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/instructors.css";

import {
  FiUser,
  FiArrowRight,
  FiArrowLeft,
  FiAward,
  FiBookOpen,
  FiCheckCircle,
  FiX
} from "react-icons/fi";

const INSTRUCTORS_DATA = [
  {
    name: "Lavanya",
    role: "Full-Stack Development Lead",
    bio: "Senior full-stack engineer and educator passionate about teaching modern web technologies, responsive frontends, and robust backend architectures.",
    experience: "8+ Years Industry Experience",
    courses: ["HTML & CSS Mastery", "JavaScript Essentials", "Full Stack Development"],
    rating: "4.9 / 5.0",
    students: "1,420+ Students"
  },
  {
    name: "Hema Narendra Reddy",
    role: "Data Science & Analytics Specialist",
    bio: "Data scientist dedicated to helping learners understand data modeling, statistical analysis, and practical machine learning applications.",
    experience: "7+ Years Industry Experience",
    courses: ["Python for Data Science", "NumPy & Pandas", "SQL & Relational Databases"],
    rating: "4.95 / 5.0",
    students: "2,100+ Students"
  },
  {
    name: "Puneeth",
    role: "Computer Science & Systems Instructor",
    bio: "Focuses on computer science fundamentals, data structures, algorithms, and systematic problem-solving skills for career success.",
    experience: "6+ Years Industry Experience",
    courses: ["C++ Programming", "Algorithms & Problem Solving", "System Architecture"],
    rating: "4.85 / 5.0",
    students: "980+ Students"
  }
];

const Instructors = () => {
  const { instructorName } = useParams();
  const [selectedInstructor, setSelectedInstructor] = useState(() => {
    if (instructorName) {
      const decoded = decodeURIComponent(instructorName).toLowerCase();
      return INSTRUCTORS_DATA.find((inst) => inst.name.toLowerCase() === decoded) || null;
    }
    return null;
  });

  return (
    <div className="instructors-page">
      {/* ================= HEADER ================= */}
      <section className="instructors-header">
        <p className="instructors-eyebrow">LEARN FROM DISTINGUISHED EDUCATORS</p>
        <h1>Our Expert Faculty & Instructors</h1>
        <span>
          Learn from experienced practitioners committed to rigorous academic excellence and real-world mastery.
        </span>
      </section>

      {/* ================= INSTRUCTORS ================= */}
      <section className="instructors-section">
        <div className="instructor-grid">
          {INSTRUCTORS_DATA.map((inst) => (
            <div className="instructor-card" key={inst.name}>
              <div className="instructor-icon">
                <FiUser />
              </div>

              <h3>{inst.name}</h3>
              <p className="instructor-role">{inst.role}</p>
              <p className="instructor-bio">{inst.bio}</p>

              <div className="instructor-meta">
                <span className="instructor-pill">
                  <FiAward /> {inst.experience}
                </span>
                <span className="instructor-pill">
                  <FiBookOpen /> {inst.students}
                </span>
              </div>

              <button
                type="button"
                className="view-instructor-btn"
                onClick={() => setSelectedInstructor(inst)}
              >
                View Academic Profile
                <FiArrowRight />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* INSTRUCTOR DETAIL MODAL */}
      {selectedInstructor && (
        <div
          className="instructor-modal-overlay"
          onClick={() => setSelectedInstructor(null)}
        >
          <div
            className="instructor-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="instructor-modal-close"
              onClick={() => setSelectedInstructor(null)}
              aria-label="Close"
            >
              <FiX />
            </button>

            <div className="instructor-modal-header">
              <div className="modal-avatar">
                <FiUser />
              </div>
              <div>
                <h2>{selectedInstructor.name}</h2>
                <p className="modal-role">{selectedInstructor.role}</p>
                <p className="modal-exp">{selectedInstructor.experience}</p>
              </div>
            </div>

            <div className="instructor-modal-body">
              <h4>About the Faculty Member</h4>
              <p>{selectedInstructor.bio}</p>

              <h4>Featured Courses Taught</h4>
              <ul className="modal-courses-list">
                {selectedInstructor.courses.map((course) => (
                  <li key={course}>
                    <FiCheckCircle /> {course}
                  </li>
                ))}
              </ul>

              <div className="modal-footer-action">
                <Link
                  to="/Courses"
                  className="explore-courses-btn"
                  onClick={() => setSelectedInstructor(null)}
                >
                  Explore Catalog Courses <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= BACK HOME ================= */}
      <section className="instructors-bottom">
        <Link to="/" className="back-link">
          <FiArrowLeft />
          Back to Home
        </Link>
      </section>
    </div>
  );
};

export default Instructors;
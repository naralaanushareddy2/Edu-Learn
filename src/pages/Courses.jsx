import React from "react";
import { Link } from "react-router-dom";
import categories from "@data/categories.json";
import "../styles/courses.css";
import "../styles/modern-overrides.css";
import { FiBookOpen, FiArrowRight, FiLayers } from "react-icons/fi";

const Courses = () => (
  <div className="courses-page">
    <section className="courses-header">
      <p>EXPLORE & LEARN</p>
      <h1>Build skills that move you forward.</h1>
      <span>
        Choose a learning path and start building practical skills today.
      </span>
    </section>
    <section className="course-section">
      <h2>Popular Learning Paths</h2>
      <div className="course-grid">
        {categories.map((c) => (
          <article className="course-card" key={c.id}>
            <div className="course-icon">
              <FiLayers />
            </div>
            <small>{c.subcategories.length} courses</small>
            <h3>{c.name}</h3>
            <p>{c.description}</p>
            <Link to={`/categories/${c.id}`}>
              Explore path <FiArrowRight />
            </Link>
          </article>
        ))}
      </div>
    </section>
    <section className="courses-bottom">
      <Link to="/">
        <FiArrowRight /> Back to Home
      </Link>
    </section>
  </div>
);
export default Courses;

import React from "react";
import { Link } from "react-router-dom";
import categories from "@data/categories.json";
import "../styles/home.css";
import "../styles/modern-overrides.css";
import banner from "../assets/home-banner.jpg";
import {
  FiBookOpen,
  FiUsers,
  FiTarget,
  FiArrowRight,
  FiStar,
} from "react-icons/fi";

const Home = () => {
  const featured = categories
    .flatMap((c) =>
      c.subcategories.map((course) => ({
        ...course,
        category: c.name,
        categoryId: c.id,
      })),
    )
    .slice(0, 6);
  return (
    <div className="home-page">
      <section className="hero" style={{ backgroundImage: `url(${banner})` }}>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-label">WELCOME TO EDULEARN</p>
          <h1>
            Learn Today,
            <br />
            Lead Tomorrow.
          </h1>
          <p className="hero-description">
            Master practical skills through focused courses, guided learning
            paths and progress tracking designed for your career.
          </p>
          <div className="hero-buttons">
            <Link to="/Courses" className="hero-btn primary-btn">
              Explore Courses <FiArrowRight />
            </Link>
            <Link to="/Register" className="hero-btn secondary-btn">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
      <section className="why-edulearn">
        <div className="section-heading">
          <p>LEARNING, REIMAGINED</p>
          <h2>Everything you need to grow</h2>
        </div>
        <div className="feature-container">
          <Link to="/Courses" className="feature-card">
            <div className="feature-icon">
              <FiBookOpen />
            </div>
            <div className="feature-content">
              <h3>Curated Courses</h3>
              <p>Learn in-demand skills with structured, practical lessons.</p>
              <span>
                Explore courses <FiArrowRight />
              </span>
            </div>
          </Link>
          <Link to="/Instructors" className="feature-card">
            <div className="feature-icon">
              <FiUsers />
            </div>
            <div className="feature-content">
              <h3>Expert Instructors</h3>
              <p>
                Learn concepts through clear explanations and real projects.
              </p>
              <span>
                Meet instructors <FiArrowRight />
              </span>
            </div>
          </Link>
          <Link to="/my-learning" className="feature-card">
            <div className="feature-icon">
              <FiTarget />
            </div>
            <div className="feature-content">
              <h3>Track Progress</h3>
              <p>Continue where you left off and celebrate every milestone.</p>
              <span>
                My learning <FiArrowRight />
              </span>
            </div>
          </Link>
        </div>
      </section>
      <section className="featured-courses">
        <div className="section-heading">
          <p>POPULAR RIGHT NOW</p>
          <h2>Featured Courses</h2>
        </div>
        <div className="course-grid">
          {featured.map((course) => (
            <article className="course-card" key={course.id}>
              <div className="course-icon">
                <FiBookOpen />
              </div>
              <small className="course-category">{course.category}</small>
              <h3>{course.name}</h3>
              <p>{course.description}</p>
              <div style={{ display: "flex", gap: 5, color: "#f5a623" }}>
                <FiStar />
                <FiStar />
                <FiStar />
                <FiStar />
                <FiStar />
              </div>
              <Link to={`/Courses/${course.id}`}>
                View Course <FiArrowRight />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
export default Home;

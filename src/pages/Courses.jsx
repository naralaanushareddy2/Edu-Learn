import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import categories from "@data/categories.json";
import "../styles/courses.css";
import "../styles/modern-overrides.css";
import { FiArrowRight, FiLayers, FiSearch, FiX, FiCheckCircle } from "react-icons/fi";

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamQuery = searchParams.get("search") || "";
  const [filterQuery, setFilterQuery] = useState(searchParamQuery);

  const query = filterQuery.trim().toLowerCase();

  // Filtered categories & courses
  const filteredData = useMemo(() => {
    if (!query) {
      return {
        isSearch: false,
        categories: categories,
        courses: []
      };
    }

    // Collect all subcategory courses that match name, description, or category
    const matchingCourses = [];
    categories.forEach((cat) => {
      cat.subcategories.forEach((sub) => {
        if (
          sub.name.toLowerCase().includes(query) ||
          sub.description.toLowerCase().includes(query) ||
          cat.name.toLowerCase().includes(query)
        ) {
          matchingCourses.push({
            ...sub,
            categoryName: cat.name,
            categoryId: cat.id
          });
        }
      });
    });

    const matchingCategories = categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(query) ||
        cat.description.toLowerCase().includes(query)
    );

    return {
      isSearch: true,
      categories: matchingCategories,
      courses: matchingCourses
    };
  }, [query]);

  const handleClear = () => {
    setFilterQuery("");
    setSearchParams({});
  };

  return (
    <div className="courses-page">
      <section className="courses-header">
        <p className="courses-eyebrow">ACADEMIC & PROFESSIONAL CATALOG</p>
        <h1>Build In-Demand Skills That Move You Forward</h1>
        <span>
          Choose a structured learning path or search focused courses designed for practical mastery.
        </span>

        <div className="courses-search-wrapper">
          <div className="courses-inline-search">
            <FiSearch className="inline-search-icon" />
            <input
              type="text"
              placeholder="Search by course name, skill, or discipline (e.g., Python, React, SQL)..."
              value={filterQuery}
              onChange={(e) => {
                setFilterQuery(e.target.value);
                if (e.target.value) {
                  setSearchParams({ search: e.target.value });
                } else {
                  setSearchParams({});
                }
              }}
            />
            {filterQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={handleClear}
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* SEARCH RESULTS VIEW */}
      {filteredData.isSearch ? (
        <section className="course-section">
          <div className="search-results-bar">
            <h2>
              Search Results
              <span className="results-count">
                ({filteredData.courses.length} course{filteredData.courses.length !== 1 ? "s" : ""} found)
              </span>
            </h2>
            <button type="button" className="text-reset-btn" onClick={handleClear}>
              Reset to all tracks
            </button>
          </div>

          {filteredData.courses.length > 0 ? (
            <div className="course-grid">
              {filteredData.courses.map((course) => (
                <article className="course-card" key={course.id}>
                  <div className="course-card-top">
                    <span className="course-track-pill">{course.categoryName}</span>
                    <span className="course-level-tag">{course.level || "All Levels"}</span>
                  </div>
                  <h3>{course.name}</h3>
                  <p>{course.description}</p>
                  <div className="course-card-meta">
                    <span>{course.duration || "Self-Paced"}</span>
                    <span>{course.lessons?.length || 0} Lessons</span>
                  </div>
                  <Link to={`/Courses/${course.id}`} className="course-card-link">
                    Start Learning <FiArrowRight />
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-search-state">
              <FiLayers className="empty-icon" />
              <h3>No courses found matching &ldquo;{filterQuery}&rdquo;</h3>
              <p>Try searching with a broader keyword or browse our curated paths below.</p>
              <button type="button" className="primary-btn" onClick={handleClear}>
                Browse All Paths
              </button>
            </div>
          )}
        </section>
      ) : (
        /* DEFAULT CURATED PATHS VIEW */
        <section className="course-section">
          <div className="section-title-wrapper">
            <h2>Curated Learning Paths</h2>
            <p className="section-subtitle">
              Comprehensive roadmaps guided by industry curricula
            </p>
          </div>

          <div className="course-grid">
            {categories.map((c) => (
              <article className="course-card" key={c.id}>
                <div className="course-icon">
                  <FiLayers />
                </div>
                <small className="course-track-pill">{c.subcategories.length} focused courses</small>
                <h3>{c.name}</h3>
                <p>{c.description}</p>
                <div className="course-card-features">
                  <span className="course-feature-item">
                    <FiCheckCircle /> Verified Certificate
                  </span>
                </div>
                <Link to={`/categories/${c.id}`} className="course-card-link">
                  Explore Path <FiArrowRight />
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="courses-bottom">
        <Link to="/">
          <FiArrowRight /> Back to Home
        </Link>
      </section>
    </div>
  );
};

export default Courses;

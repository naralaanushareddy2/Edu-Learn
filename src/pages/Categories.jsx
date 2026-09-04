import React from "react";
import { Link } from "react-router-dom";

import "../styles/categories.css";

import {
  FiBookOpen,
  FiCode,
  FiDatabase,
  FiCloud,
  FiUsers,
  FiBarChart2,
  FiArrowRight,
} from "react-icons/fi";

import categories from "@data/categories.json";

const Categories = () => {

  const getCategoryIcon = (icon) => {

    switch (icon) {

      case "code":
        return <FiCode />;

      case "book":
        return <FiBookOpen />;

      case "chart":
        return <FiBarChart2 />;

      case "database":
        return <FiDatabase />;

      case "cloud":
        return <FiCloud />;

      case "users":
        return <FiUsers />;

      default:
        return <FiBookOpen />;
    }
  };

  return (
    <div className="categories-page">

      {/* HEADER */}

      <section className="categories-header">

        <p>LEARN & GROW</p>

        <h1>Explore Categories</h1>

        <span>
          Choose a category and discover courses
          designed to build your skills.
        </span>

      </section>


      {/* CATEGORIES */}

      <section className="categories-section">

        <div className="categories-grid">

          {categories.map((category) => (

            <Link
              key={category.id}
              to={`/categories/${category.id}`}
              className="category-card"
            >

              {/* ICON */}

              <div className="category-icon">
                {getCategoryIcon(category.icon)}
              </div>


              {/* NAME */}

              <h2>
                {category.name}
              </h2>


              {/* DESCRIPTION */}

              <p>
                {category.description}
              </p>


              {/* COUNT */}

              <span className="subcategory-count">

                {category.subcategories.length}
                {" "}
                Subcategories

              </span>


              {/* EXPLORE */}

              <div className="explore-button">

                Explore

                <FiArrowRight />

              </div>

            </Link>

          ))}

        </div>

      </section>

    </div>
  );
};

export default Categories;
import React from "react";
import { Link, useParams } from "react-router-dom";

import "../styles/subcategories.css";

import {
  FiBookOpen,
  FiArrowLeft,
  FiArrowRight
} from "react-icons/fi";

import categories from "@data/categories.json";

const Subcategories = () => {

  const { categoryId } = useParams();

  console.log("Category ID:", categoryId);
  console.log("Categories:", categories);

  const selectedCategory = categories.find(
    (category) => category.id === Number(categoryId)
  );

  if (!selectedCategory) {
    return (
      <div className="subcategory-not-found">

        <h2>Category Not Found</h2>

        <p>
          No category was found for ID: {categoryId}
        </p>

        <Link to="/categories">
          <FiArrowLeft />
          Back to Categories
        </Link>

      </div>
    );
  }

  return (
    <div className="subcategories-page">

      {/* BACK BUTTON */}

      <Link
        to="/categories"
        className="back-category-btn"
      >
        <FiArrowLeft />
        Back to Categories
      </Link>


      {/* HEADER */}

      <section className="subcategory-page-header">

        <p>EXPLORE CATEGORY</p>

        <h1>
          {selectedCategory.name}
        </h1>

        <span>
          {selectedCategory.description}
        </span>

      </section>


      {/* SUBCATEGORIES */}

      <section className="subcategory-page-section">

        <div className="subcategory-heading">

          <p>START LEARNING</p>

          <h2>
            Explore {selectedCategory.name}
          </h2>

          <span>
            Choose a subcategory and start learning.
          </span>

        </div>


        <div className="subcategory-page-grid">

          {selectedCategory.subcategories.map(
            (subcategory) => (

              <Link
                key={subcategory.id}
                to={`/Courses/${subcategory.id}`}
                className="subcategory-page-card"
              >

                <div className="subcategory-page-icon">
                  <FiBookOpen />
                </div>


                <div className="subcategory-page-content">

                  <h3>
                    {subcategory.name}
                  </h3>

                  <p>
                    {subcategory.description}
                  </p>

                  {subcategory.level && (
                    <span>
                      Level: {subcategory.level}
                    </span>
                  )}

                  {subcategory.duration && (
                    <span>
                      Duration: {subcategory.duration}
                    </span>
                  )}

                  <div className="subcategory-explore">
                    Explore Course
                    <FiArrowRight />
                  </div>

                </div>

              </Link>

            )
          )}

        </div>

      </section>

    </div>
  );
};

export default Subcategories;
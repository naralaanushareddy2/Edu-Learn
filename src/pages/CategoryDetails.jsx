import React from "react";
import { Link, useParams } from "react-router-dom";

import categories from "../../data/categories.json";

import "../styles/category-details.css";

import {
  FiBookOpen,
  FiArrowRight,
  FiArrowLeft
} from "react-icons/fi";


const CategoryDetails = () => {

  const { categoryId } = useParams();

  const selectedCategory = categories.find(
    (category) =>
      category.id === Number(categoryId)
  );


  if (!selectedCategory) {

    return (
      <div className="category-not-found">

        <h2>
          Category Not Found
        </h2>

        <Link to="/categories">
          <FiArrowLeft />
          Back to Categories
        </Link>

      </div>
    );

  }


  return (

    <div className="category-details-page">

      {/* ================= HEADER ================= */}

      <section className="category-details-header">

        <Link
          to="/categories"
          className="back-category-link"
        >
          <FiArrowLeft />
          Back to Categories
        </Link>


        <p>
          EXPLORE CATEGORY
        </p>

        <h1>
          {selectedCategory.name}
        </h1>

        <span>
          {selectedCategory.description}
        </span>

      </section>


      {/* ================= SUBCATEGORIES ================= */}

      <section className="subcategories-page-section">

        <div className="subcategories-heading">

          <p>
            START LEARNING
          </p>

          <h2>
            Explore {selectedCategory.name}
          </h2>

          <span>
            Choose a topic and start building your skills.
          </span>

        </div>


        <div className="subcategory-grid">

          {selectedCategory.subcategories.map(
            (subcategory) => (

              <Link
                key={subcategory.id}
                to={`/course/${subcategory.id}`}
                className="subcategory-card"
              >

                <div className="subcategory-icon">
                  <FiBookOpen />
                </div>


                <div className="subcategory-content">

                  <h3>
                    {subcategory.name}
                  </h3>

                  <p>
                    {subcategory.description}
                  </p>


                  <div className="subcategory-info">

                    <span>
                      {subcategory.level}
                    </span>

                    <span>
                      {subcategory.duration}
                    </span>

                  </div>


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


export default CategoryDetails;
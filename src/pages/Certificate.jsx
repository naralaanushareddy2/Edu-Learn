import React, {
  useEffect,
  useRef,
  useState
} from "react";

import {
  Link,
  useParams
} from "react-router-dom";

import axios from "axios";

import { jsPDF } from "jspdf";

import categories from "@data/categories.json";

import {
  FiAward,
  FiArrowLeft,
  FiDownload
} from "react-icons/fi";

import "../styles/certificate.css";

const API_URL =
  "http://localhost:5000";


const Certificate = () => {

  const { courseId } = useParams();

  const [enrollment, setEnrollment] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const certificateRef =
    useRef(null);


  const loggedInUser =
    JSON.parse(
      localStorage.getItem(
        "loggedInUser"
      )
    );


  // =====================================================
  // FIND COURSE
  // =====================================================

  let selectedCourse = null;
  let selectedCategory = null;

  categories.forEach(
    (category) => {

      const found =
        category.subcategories.find(
          (course) =>
            Number(course.id) ===
            Number(courseId)
        );

      if (found) {

        selectedCourse = found;

        selectedCategory =
          category;

      }

    }
  );


  // =====================================================
  // LOAD ENROLLMENT
  // =====================================================

  useEffect(() => {

    const loadEnrollment = async () => {

      try {

        if (
          !loggedInUser ||
          !selectedCourse
        ) {

          setLoading(false);

          return;

        }


        const response =
          await axios.get(

            `${API_URL}/enrollments?userId=${encodeURIComponent(
              loggedInUser.id
            )}&courseId=${selectedCourse.id}`

          );


        if (
          response.data.length > 0
        ) {

          setEnrollment(
            response.data[0]
          );

        }

      } catch (error) {

        console.error(
          "Certificate error:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    loadEnrollment();

  }, [courseId]);


  // =====================================================
  // DOWNLOAD CERTIFICATE
  // =====================================================

  const downloadCertificate =
    () => {

      if (
        !enrollment ||
        enrollment.progress !== 100
      ) {

        alert(
          "Complete the course to unlock your certificate."
        );

        return;

      }


      const doc =
        new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4"
        });


      // Outer border

      doc.setLineWidth(2);

      doc.rect(
        10,
        10,
        277,
        190
      );


      // Title

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(30);

      doc.text(
        "EduLearn",
        148.5,
        45,
        {
          align: "center"
        }
      );


      doc.setFontSize(24);

      doc.text(
        "CERTIFICATE OF COMPLETION",
        148.5,
        65,
        {
          align: "center"
        }
      );


      // Student text

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(16);

      doc.text(
        "This certificate is proudly presented to",
        148.5,
        85,
        {
          align: "center"
        }
      );


      // Student name

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(26);

      doc.text(
        loggedInUser.name,
        148.5,
        103,
        {
          align: "center"
        }
      );


      // Course

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(15);

      doc.text(
        "for successfully completing the course",
        148.5,
        120,
        {
          align: "center"
        }
      );


      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(21);

      doc.text(
        selectedCourse.name,
        148.5,
        138,
        {
          align: "center"
        }
      );


      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(13);

      doc.text(
        `Category: ${selectedCategory.name}`,
        148.5,
        153,
        {
          align: "center"
        }
      );


      const completionDate =
        enrollment.completedAt
          ? new Date(
              enrollment.completedAt
            ).toLocaleDateString()
          : new Date().toLocaleDateString();


      doc.text(
        `Completed on: ${completionDate}`,
        148.5,
        165,
        {
          align: "center"
        }
      );


      doc.text(
        "EduLearn - Online Learning Platform",
        148.5,
        185,
        {
          align: "center"
        }
      );


      doc.save(
        `${selectedCourse.name}-Certificate.pdf`
      );

    };


  // =====================================================
  // COURSE NOT FOUND
  // =====================================================

  if (!selectedCourse) {

    return (

      <div className="certificate-page">

        <h2>
          Course Not Found
        </h2>

        <Link to="/categories">
          Back to Categories
        </Link>

      </div>

    );

  }


  // =====================================================
  // LOGIN REQUIRED
  // =====================================================

  if (!loggedInUser) {

    return (

      <div className="certificate-page">

        <FiAward />

        <h2>
          Please Login
        </h2>

        <p>
          Login to access your certificate.
        </p>

        <Link to="/Login">
          Login
        </Link>

      </div>

    );

  }


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="certificate-page">

        <FiAward />

        <h2>
          Loading Certificate...
        </h2>

      </div>

    );

  }


  // =====================================================
  // NOT COMPLETED
  // =====================================================

  if (
    !enrollment ||
    enrollment.progress !== 100
  ) {

    return (

      <div className="certificate-page">

        <FiAward />

        <h2>
          Certificate Locked
        </h2>

        <p>
          Complete 100% of the course to receive your certificate.
        </p>

        <Link
          to={`/Courses/${selectedCourse.id}`}
        >

          <FiArrowLeft />

          Continue Learning

        </Link>

      </div>

    );

  }


  // =====================================================
  // CERTIFICATE
  // =====================================================

  return (

    <div className="certificate-page">

      <Link
        to={`/Courses/${selectedCourse.id}`}
        className="certificate-back"
      >

        <FiArrowLeft />

        Back to Course

      </Link>


      <div
        className="certificate-card"
        ref={certificateRef}
      >

        <div className="certificate-icon">

          <FiAward />

        </div>


        <p className="certificate-platform">
          EduLearn
        </p>


        <h1>
          Certificate of Completion
        </h1>


        <p>
          This certificate is proudly presented to
        </p>


        <h2>
          {loggedInUser.name}
        </h2>


        <p>
          for successfully completing
        </p>


        <h3>
          {selectedCourse.name}
        </h3>


        <p className="certificate-category">

          Category:
          {" "}
          {selectedCategory.name}

        </p>


        <p className="certificate-date">

          Completed on:
          {" "}
          {new Date(
            enrollment.completedAt
          ).toLocaleDateString()}

        </p>


        <div className="certificate-footer">

          <span>
            EduLearn
          </span>

          <span>
            Online Learning Platform
          </span>

        </div>

      </div>


      <button
        type="button"
        className="download-certificate-button"
        onClick={downloadCertificate}
      >

        <FiDownload />

        Download Certificate

      </button>

    </div>

  );

};

export default Certificate;
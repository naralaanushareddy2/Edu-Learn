import React from "react";
import "../styles/terms-conditions.css";

const TermsConditions = () => {
  return (
    <div className="terms-page">

      <section className="terms-header">
        <p>EDULEARN</p>

        <h1>Terms & Conditions</h1>

        <span>
          Please read these terms carefully before using the EduLearn platform.
        </span>
      </section>

      <section className="terms-container">

        <div className="terms-section">
          <h2>1. Introduction</h2>

          <p>
            EduLearn is an online learning platform designed to help users
            explore courses, learn new skills and track their learning
            progress. By accessing or using EduLearn, you agree to follow
            these terms and conditions.
          </p>
        </div>

        <div className="terms-section">
          <h2>2. User Accounts</h2>

          <p>
            Users are responsible for providing accurate information when
            creating an account. Account credentials should be kept secure
            and should not be shared with others.
          </p>
        </div>

        <div className="terms-section">
          <h2>3. Courses and Learning Content</h2>

          <p>
            EduLearn provides educational content for learning and skill
            development. Course content may include videos, lessons,
            descriptions and other educational resources.
          </p>
        </div>

        <div className="terms-section">
          <h2>4. Course Enrollment</h2>

          <p>
            Users may enroll in available courses through the platform.
            Enrolled courses can be accessed through the My Learning section.
            Users are expected to use course content only for educational
            purposes.
          </p>
        </div>

        <div className="terms-section">
          <h2>5. Wishlist</h2>

          <p>
            The Wishlist feature allows users to save courses for future
            reference. Adding a course to the Wishlist does not automatically
            enroll the user in that course.
          </p>
        </div>

        <div className="terms-section">
          <h2>6. User Conduct</h2>

          <p>
            Users should use the platform responsibly and must not attempt to
            misuse, disrupt or gain unauthorized access to any part of the
            application.
          </p>
        </div>

        <div className="terms-section">
          <h2>7. Intellectual Property</h2>

          <p>
            EduLearn interface, branding and application content are intended
            for educational use. Users should not reproduce or redistribute
            protected content without appropriate permission.
          </p>
        </div>

        <div className="terms-section">
          <h2>8. Privacy</h2>

          <p>
            EduLearn aims to handle user information responsibly. Users should
            review the application's privacy practices and understand how
            information is used while accessing the platform.
          </p>
        </div>

        <div className="terms-section">
          <h2>9. Changes to These Terms</h2>

          <p>
            EduLearn may update these terms when necessary to improve the
            platform or introduce new features. Updated terms will be
            reflected on this page.
          </p>
        </div>

        <div className="terms-section">
          <h2>10. Contact and Support</h2>

          <p>
            If you have questions regarding these terms or the EduLearn
            platform, please contact the support team through the Help &
            Support section.
          </p>
        </div>

      </section>

    </div>
  );
};

export default TermsConditions;

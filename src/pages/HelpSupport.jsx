import React from "react";
import { FiBookOpen, FiUser, FiHeart, FiHelpCircle, FiMail, FiMessageCircle } from "react-icons/fi";
import "../styles/help-support.css";

const HelpSupport = () => {
  const faqs = [
    {
      icon: <FiBookOpen />,
      title: "How do I enroll in a course?",
      description:
        "Open the course you are interested in and click the Enroll Course button. The course will then be available in your My Learning section."
    },
    {
      icon: <FiUser />,
      title: "How can I manage my profile?",
      description:
        "Open your Profile page to view and manage your account information and learning details."
    },
    {
      icon: <FiHeart />,
      title: "How does Wishlist work?",
      description:
        "Use the wishlist option on a course to save courses that you want to explore or enroll in later."
    },
    {
      icon: <FiBookOpen />,
      title: "Where can I see my enrolled courses?",
      description:
        "Open My Learning from the bottom navigation to view your enrolled courses and continue your learning."
    },
    {
      icon: <FiHelpCircle />,
      title: "What if I cannot access a course?",
      description:
        "Make sure you are logged in with your registered account. If the issue continues, contact EduLearn support."
    }
  ];

  return (
    <div className="help-page">

      <section className="help-header">
        <p className="help-label">EDULEARN SUPPORT</p>

        <h1>Help & Support</h1>

        <p>
          Find answers to common questions and get help with your
          EduLearn learning experience.
        </p>
      </section>

      <section className="help-container">

        <div className="help-intro">
          <FiMessageCircle />

          <div>
            <h2>How can we help you?</h2>
            <p>
              Explore the frequently asked questions below to learn
              more about courses, enrollment, profiles and learning.
            </p>
          </div>
        </div>

        <div className="faq-grid">

          {faqs.map((faq, index) => (
            <div className="faq-card" key={index}>

              <div className="faq-icon">
                {faq.icon}
              </div>

              <div>
                <h3>{faq.title}</h3>
                <p>{faq.description}</p>
              </div>

            </div>
          ))}

        </div>

        <div className="support-card">

          <div className="support-icon">
            <FiMail />
          </div>

          <div>
            <h2>Still need help?</h2>

            <p>
              If you cannot find the answer to your question,
              contact the EduLearn support team for assistance.
            </p>

            <a href="mailto:support@edulearn.com">
              support@edulearn.com
            </a>
          </div>

        </div>

      </section>

    </div>
  );
};

export default HelpSupport;

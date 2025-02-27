import React from "react";
import { Link } from "react-router-dom";

const EduaiSec = () => {
  const sectionStyle = {
    backgroundColor: "#1E3A8A", 
    color: "white",
    textAlign: "center",
    padding: "80px 20px",
  };

  const headingStyle = {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#FBF2C0",
  };

  const descriptionStyle = {
    fontSize: "1.4rem",
    maxWidth: "900px",
    margin: "0 auto",
    marginBottom: "35px",
    lineHeight: "1.6",
  };

  const featureListStyle = {
    listStyle: "none",
    padding: 0,
    maxWidth: "700px",
    margin: "0 auto",
  };

  const featureItemStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Light transparent box
    padding: "18px",
    borderRadius: "10px",
    margin: "12px 0",
    fontSize: "1.3rem",
    transition: "transform 0.2s, font-size 0.2s",
    cursor: "pointer",
  };

  const featureItemHoverStyle = {
    transform: "scale(1.05)", 
    fontSize: "1.4rem",
  };

  const buttonStyle = {
    backgroundColor: "#FFA500",
    color: "white",
    fontSize: "1.3rem",
    padding: "14px 30px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    marginTop: "25px",
    transition: "transform 0.2s, background-color 0.3s",
  };

  const buttonHoverStyle = {
    backgroundColor: "#FF8C00",
    transform: "scale(1.05)",
  };

  return (
    <section style={sectionStyle}>
      <h2 style={headingStyle}>🚀 Discover the Power of EduAI Mentor</h2>
      <p style={descriptionStyle}>
        Your smartest study companion! Simplify complex topics, generate
        personalized quizzes, and get AI-powered insights to boost your
        learning. Stay ahead with real-time translations, offline
        access, and AI-guided progress tracking.
      </p>
      <ul style={featureListStyle}>
        {[
          "AI-powered textbook scanning & intelligent summarization",
          "Customized learning paths tailored to your strengths",
          "Smart quizzes & memory-enhancing revision techniques",
          "Real-time multilingual support for global learners",
          "Offline learning mode for seamless accessibility",
        ].map((feature, index) => (
          <li
            key={index}
            style={featureItemStyle}
            onMouseEnter={(e) =>
              Object.assign(e.target.style, featureItemHoverStyle)
            }
            onMouseLeave={(e) =>
              Object.assign(e.target.style, featureItemStyle)
            }
          >
            🔹 {feature}
          </li>
        ))}
      </ul>
      <Link to="/eduai-mentor">
      <button
        style={buttonStyle}
        onMouseEnter={(e) => Object.assign(e.target.style, buttonHoverStyle)}
        onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
      >
        Explore EduAI Mentor
      </button>
      </Link>
    </section>
  );
};

export default EduaiSec;

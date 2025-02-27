import React from "react";
import { Link } from "react-router-dom";
import "./SkillForgeSec.css";

const SkillForgeSec = () => {
  return (
    <section className="skillforge-section">
      <div className="skillforge-header">
        <h2 className="skillforge-title">SkillForge</h2>
        <p className="skillforge-description">
          SkillForge is a project-based learning hub that helps users develop real-world skills
          through interactive challenges and hands-on projects.
        </p>
      </div>

      <div className="skillforge-features">
        {[
          `"In 10 Minutes" gamified challenges`,
          "Hands-on project-based learning",
          "AI-suggested tasks for real-world applications",
          "Personalized learning pathways that every student Deserves",
        ].map((feature, index) => (
          <div key={index} className="feature-box">
            <span className="bullet">◆</span>
            <strong>{feature}</strong>
          </div>
        ))}
      </div>

      <div className="explore-button-container">
        <Link to="/skillforge">
        <button className="explore-button">Explore SkillForge</button>
        </Link>
      </div>
    </section>
  );
};

export default SkillForgeSec;

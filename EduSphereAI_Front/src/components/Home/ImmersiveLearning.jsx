import React from "react";
import "./ImmersiveLearning.css";
import { Link } from "react-router-dom";

const ImmersiveLearning = () => {
  return (
    <section className="immersive-learning-section">
      <div className="content-card">
        <h2 className="title">Immersive Learning</h2>
        <p className="description">
          Experience cutting-edge AI and AR technology through interactive, engaging, and hands-on educational experiences.
        </p>
        <ul className="features-list">
          <li>✔ AI-generated video lessons for complex subjects</li>
          <li>✔ Interactive storytelling courses</li>
          <li>✔ Augmented reality experiences for science, history, and geography</li>
          <li>✔ Voice-based learning without screen dependency</li>
        </ul>
        <Link to="/immersive-learning">
        <button className="explore-button">Explore Immersive Learning</button>
        </Link>
      </div>
    </section>
  );
};

export default ImmersiveLearning;

import React from "react";
import "./EduC.css";
import { Link } from "react-router-dom";

const EduC = () => {
  return (
    <section className="educonnect-section">
      <h2 className="educonnect-title">EduConnect</h2>
      <p className="educonnect-description">
        Connect with mentors, study groups, and a global learning community.
      </p>

      <div className="educonnect-features">
        <div className="feature-box">
          <h3>Peer Learning Groups</h3>
          <p>Join AI-powered study groups to collaborate with learners worldwide.</p>
        </div>
        <div className="feature-box">
          <h3>Mentor Matching</h3>
          <p>Get matched with experienced mentors to guide your learning journey.</p>
        </div>
        <div className="feature-box">
          <h3>Global Educator Network</h3>
          <p>Access a diverse community of teachers and students for resource sharing.</p>
        </div>
        <div className="feature-box">
          <h3>Local Learning Hubs</h3>
          <p>Find study spaces and workshops in your area to enhance your skills.</p>
        </div>
      </div>

      <div className="explore-button-container">
        <Link to="/educonnect">
        <button className="explore-button">Explore EduConnect</button>
        </Link>
      </div>
    </section>
  );
};

export default EduC;

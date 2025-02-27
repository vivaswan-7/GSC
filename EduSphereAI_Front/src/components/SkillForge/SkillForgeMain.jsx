import React from "react";
import { Link } from "react-router-dom";
import "./SkillForgeMain.css";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";

const SkillForgeMain = () => {
  return (
    <div className="marg-top">
     <Navbar />   
    <div className="skillforge-container">
      <h1>🚀 Welcome to SkillForge</h1>
      <div className="card">
        <h2>⏳ Learn in 10 Minutes</h2>
        <p>Quick AI-generated challenges to boost your skills.</p>
        <Link to="/challenge">
          <button>Start Challenge</button>
        </Link>
      </div>

      <div className="card">
        <h2>🤝 AI Matched Learning</h2>
        <p>Find mentors & learners with shared interests.</p>
        <Link to="/ai-matching">
          <button>Find Matches</button>
        </Link>
      </div>

      <div className="card">
        <h2>📥 Offline Learning</h2>
        <p>Download AI-generated lessons & learn anytime.</p>
        <Link to="/offline-learning">
          <button>Download Lessons</button>
        </Link>
      </div>

      <div className="card">
        <h2>🎯 Personalized Playlists</h2>
        <p>AI-crafted courses based on your skill gaps.</p>
        <Link to="/playlists">
          <button>Generate Playlist</button>
        </Link>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default SkillForgeMain;

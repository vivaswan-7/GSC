import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./AiMatching.css";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";

const AiMatching = () => {
  const [skill, setSkill] = useState("");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

  const findMatches = async () => {
    if (!skill.trim()) {
      alert("Please enter a skill!");
      return;
    }

    setLoading(true);
    setMatches([]);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Find 3 ideal AI-matched mentors or learners based on interest in ${skill}. Format as a clean list with names, expertise, and why they are a good match. No asterisks or bullet points.`;

      const result = await model.generateContent(prompt);
      const generatedText = result.response.text();

      if (generatedText) {
        const cleanMatches = generatedText
          .split("\n")
          .filter(line => line.trim() !== "")
          .map(line => line.replace(/[*•]/g, "").trim());

        setMatches(cleanMatches.length > 0 ? cleanMatches : ["⚠️ No matches found."]);
      } else {
        setMatches(["⚠️ No matches found."]);
      }
    } catch (error) {
      console.error("Error finding matches:", error);
      setMatches(["⚠️ No matches found. Try again."]);
    }

    setLoading(false);
  };

  return (
    <div className="marg-top">
      <Navbar />
      <div className="skillforge-container">
        <h2>🤝 AI Matched Learners & Mentors</h2>
        <input
          type="text"
          placeholder="Enter a skill (e.g., Machine Learning)"
          value={skill}
          onChange={(e) => setSkill(e.target.value)} 
          className="input-match"
        />
        <button onClick={findMatches} disabled={loading}>
          {loading ? "Finding..." : "Find Matches"}
        </button>

        {matches.length > 0 && (
          <div className="card match-card">
            <h3>🔍 AI-Matched Learners & Mentors</h3>
            <ul>
              {matches.map((match, index) => (
                <li key={index} className={`match-item match-color-${index % 5}`}>
                  <span className="match-icon">✨</span> {match}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AiMatching;
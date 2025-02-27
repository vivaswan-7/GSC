import React from "react";
import { Link } from "react-router-dom";

const CareerAISec = () => {
  return (
    <section style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Career AI</h2>
        <p style={styles.description}>
          Career AI helps learners discover the best career paths based on their skills
          and interests. It provides personalized career recommendations, job market
          trends, and skill-building resources to ensure career success.
        </p>
        <div style={styles.features}>
          {[
            "AI-powered career assessments",
            "Recommended career paths based on interests",
            "Industry-relevant skill-building courses",
            "AI-generated certification exams",
          ].map((feature, index) => (
            <div key={index} style={styles.featureBox} className="feature-box">
              <span style={styles.bullet}>◆</span>
              <strong>{feature}</strong>
            </div>
          ))}
        </div>
        <Link to="/career-ai">  
        <button style={styles.button}>Explore Career AI</button>
        </Link>
      </div>
    </section>
  );
};

const styles = {
  wrapper: {
    backgroundColor: "black",
    padding: "80px 0", // Ensures equal top and bottom spacing
    display: "flex",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "#FFC107",
    color: "white",
    textAlign: "center",
    padding: "60px 20px",
    borderRadius: "15px",
    maxWidth: "900px",
    width: "90%",
  },
  heading: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#330066",
  },
  description: {
    fontSize: "1.2rem",
    margin: "15px 0",
    color: "white",
    maxWidth: "750px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  features: {
    marginTop: "20px",
  },
  featureBox: {
    backgroundColor: "#FFEB3B",
    color: "#000",
    fontSize: "1rem",
    fontWeight: "bold",
    padding: "15px",
    borderRadius: "10px",
    margin: "12px auto",
    width: "85%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.3s ease-in-out", // Animation
  },
  bullet: {
    color: "#007bff",
    marginRight: "8px",
  },
  button: {
    backgroundColor: "#4A148C",
    color: "white",
    fontSize: "1.2rem",
    fontWeight: "bold",
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    marginTop: "20px",
    transition: "0.3s",
  },
};

const styleTag = document.createElement("style");
styleTag.innerHTML = `
  .feature-box:hover {
    transform: scale(1.1);
  }
`;
document.head.appendChild(styleTag);

export default CareerAISec;

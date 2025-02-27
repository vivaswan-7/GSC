import React from "react";

const HeroSection = () => {
  return (
    <section
      style={{
        position: "relative",
        width: "96.32vw",
        height: "94.5vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "white",
        padding: "20px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "99vw",
          height: "100vh", 
          backgroundImage: "url('https://images.pexels.com/photos/8613083/pexels-photo-8613083.jpeg')",
          backgroundSize: "cover", 
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -2,
        }}
      ></div>

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "99vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.4)", 
          zIndex: -1,
        }}
      ></div>

      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          zIndex: 1,
          transform: "translateY(-45px)", 
        }}
      >
        <h1 style={{ fontSize: "3rem", fontWeight: "bold", color: "#FFD700" }}>
          Welcome to EduSphere
        </h1>
        <p style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
          EduSphere is an all-in-one AI-powered education platform designed to
          make learning accessible, engaging, and personalized. Whether you’re a
          student, a professional, or a lifelong learner, EduSphere provides the
          tools you need to succeed.
        </p>
        <button
          style={{
            padding: "15px 30px",
            fontSize: "1.2rem",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Explore EduSphere
        </button>
      </div>
    </section>
  );
};

export default HeroSection;

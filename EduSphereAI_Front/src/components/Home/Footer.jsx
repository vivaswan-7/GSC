import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaArrowUp } from "react-icons/fa";
import "./Footer.css"; 

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when scrolling down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <h2 className="logo">EduSphere</h2>
          <p>Empowering education with AI-driven learning solutions.</p>
        </div>

        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul>
            <Link to="/" className="foot-item">
              <li>Home</li>
            </Link>
            <Link to="/eduai-mentor" className="foot-item">
              <li>EduAI Mentor</li>
            </Link>
            <Link to="/career-ai" className="foot-item">
              <li>Career AI</li>
            </Link>
            <Link to="/skillforge" className="foot-item">
              <li>SkillForge</li>
            </Link>
            <Link to="/educonnect" className="foot-item">
              <li>EduConnect</li>
            </Link>
            <Link to="/immersive-learning" className="foot-item">
              <li>Immersive Learning</li>
            </Link>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Contact Us</h3>
          <p>Email: adircjha@gmail.com</p>
          <p>Phone: +91 1234 567 890</p>
          <p>Address: USAR - IPU KE BAAP</p>
        </div>

        <div className="footer-column">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <FaFacebookF />
            <FaTwitter />
            <FaLinkedinIn />
            <FaInstagram />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 EduSphere. All rights reserved.</p>

        {isVisible && (
          <button className="scroll-top" onClick={scrollToTop}>
            <FaArrowUp />
          </button>
        )}
      </div>
    </footer>
  );
};

export default Footer;

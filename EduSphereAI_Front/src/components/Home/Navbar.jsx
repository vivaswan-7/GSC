import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { MdOutlinePsychology, MdConnectWithoutContact } from "react-icons/md";
import { AiOutlineBook } from "react-icons/ai";
import { PiUsersThreeBold } from "react-icons/pi";
import { MdSettings } from 'react-icons/md';

import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button 
          className="hamburger-menu" 
          onClick={toggleMenu}
          aria-label="Toggle Navigation Menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        
        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" className="nav-item" onClick={closeMenu}>
              <FaHome className="nav-icon" />
              Home
            </Link>
          </li>
          <li>
            <Link to="/eduai-mentor" className="nav-item" onClick={closeMenu}>
              <MdOutlinePsychology className="nav-icon" />
              EduAI Mentor
            </Link>
          </li>
          <li>
            <Link to="/career-ai" className="nav-item" onClick={closeMenu}>
              <AiOutlineBook className="nav-icon" />
              Career AI
            </Link>
          </li>
          <li>
            <Link to="/skillforge" className="nav-item" onClick={closeMenu}>
              <PiUsersThreeBold className="nav-icon highlight" />
              SkillForge
            </Link>
          </li>
          <li>
            <Link to="/educonnect" className="nav-item" onClick={closeMenu}>
              <MdConnectWithoutContact className="nav-icon" />
              EduConnect
            </Link>
          </li>
          <li>
            <Link to="/immersive-learning" className="nav-item" onClick={closeMenu}>
              <MdSettings className="nav-icon" />
              Immersion
            </Link>
          </li>
          <li>
            <Link to="/auth" className="nav-item" onClick={closeMenu}>
              <FaUser className="nav-icon" />
              Profile
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
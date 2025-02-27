import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUser } from "react-icons/fa";
import { MdOutlinePsychology, MdConnectWithoutContact } from "react-icons/md";
import { AiOutlineBook } from "react-icons/ai";
import { PiUsersThreeBold } from "react-icons/pi";
import { MdSettings } from 'react-icons/md';

import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <Link to="/" className="nav-item">
            <FaHome className="nav-icon" />
            Home
          </Link>
        </li>
        <li>
          <Link to="/eduai-mentor" className="nav-item">
            <MdOutlinePsychology className="nav-icon" />
            EduAI Mentor
          </Link>
        </li>
        <li>
          <Link to="/career-ai" className="nav-item">
            <AiOutlineBook className="nav-icon" />
            Career AI
          </Link>
        </li>
        <li>
          <Link to="/skillforge" className="nav-item">
            <PiUsersThreeBold className="nav-icon highlight" />
            SkillForge
          </Link>
        </li>
        <li>
          <Link to="/educonnect" className="nav-item">
            <MdConnectWithoutContact className="nav-icon" />
            EduConnect
          </Link>
        </li>
        <li>
          <Link to="/immersive-learning" className="nav-item">
            <MdSettings className="nav-icon" />
            Immersion
          </Link>
        </li>
        <li>
          <Link to="/auth" className="nav-item">
            <FaUser className="nav-icon" />
            Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

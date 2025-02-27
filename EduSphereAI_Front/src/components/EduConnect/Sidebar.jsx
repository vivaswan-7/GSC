import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUsers, FaComments, FaBook, FaBars } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("Home");

  const menuItems = [
    { name: "Home", icon: <FaHome />, link: "/" }, // Functional
    { name: "Study Groups", icon: <FaUsers />, link: "#" }, // Non-functional
    { name: "Mentor Chat", icon: <FaComments />, link: "#" }, // Non-functional
    { name: "Resources", icon: <FaBook />, link: "#" }, // Non-functional
  ];

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Toggle Button */}
      <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
        <FaBars />
      </button>

      {/* Sidebar Navigation */}
      <ul className="side-nav">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={active === item.name ? "active" : ""}
            onClick={() => setActive(item.name)}
          >
            {item.link === "/" ? (
              <Link to={item.link} className="nav-link">
                {item.icon}
                {!collapsed && <span>{item.name}</span>}
              </Link>
            ) : (
              <a href="/#" className="nav-link">
                {item.icon}
                {!collapsed && <span>{item.name}</span>}
              </a>
            )}
            {collapsed && <div className="tooltip">{item.name}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

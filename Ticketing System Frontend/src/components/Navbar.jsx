import React from "react";
import "./Navbar.css"; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Ticketing System</div>
      <ul className="navbar-links">
        <li>
          <a href="" className="nav-link">
            Dashboard
          </a>
        </li>
        <li>
          <a href="/" className="nav-link logout">
            Logout
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

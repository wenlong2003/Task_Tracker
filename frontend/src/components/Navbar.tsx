// Navbar.tsx
import React from "react";
import "./Navbar.css";
import Toggle from "./toggle";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  isDark: boolean;
  toggleDark: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenSidebar: () => void;
}

function Navbar({ isDark, toggleDark, onOpenSidebar }: NavbarProps) {
  const { isAuthenticated } = useAuth();

  return (
    <nav>
      <button className="sidebar-btn" onClick={onOpenSidebar}> <i className="bi bi-list"></i></button>

      <ul className="nav-links">
        <li className="link"><Link to="/">Home</Link></li>
        <li className="link"><Link to="/dashboard">Dashboard</Link></li>
        <li className="link"><Link to="/calendar">Calendar</Link></li>

        {!isAuthenticated && (
          <>
            <li className="link">
              <Link to="/signup" className="signup-btn">Sign Up</Link>
            </li>
            <li className="link">
              <Link to="/signin" className="login-btn">Log In</Link>
            </li>
          </>
        )}
      </ul>

      <div className="toggle-wrapper">
        <Toggle handleChange={toggleDark} isChecked={isDark} />
      </div>
    </nav>
  );
}

export default Navbar;
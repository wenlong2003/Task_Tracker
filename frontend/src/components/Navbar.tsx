// Navbar.tsx
import React from "react";
import "./Navbar.css";
import Toggle from "./toggle";
import { Link } from "react-router-dom";

interface NavbarProps {
  isAuthenticated: boolean;
  isDark: boolean;
  toggleDark: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogout?: () => void;
}

function Navbar({ isAuthenticated, onLogout, isDark, toggleDark }: NavbarProps) {
  return (
    <nav>
      <ul className="nav-links">
        <li className="link"><Link to="/">Home</Link></li>
        <li className="link"><Link to="/dashboard">Dashboard</Link></li>
        <li className="link"><Link to="/calendar">Calendar</Link></li>

        {!isAuthenticated ? (
          <>
            <li className="link"><Link to="signup" className="signup-btn">Sign Up</Link></li>
            <li className="link"><Link to="signin" className="login-btn">Log In</Link></li>
          </>
        ) : (
          <li className="link">
            <button
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem("userId");
                localStorage.removeItem("username");
                onLogout && onLogout();
              }}
            >
              Logout
            </button>
          </li>
        )}
      </ul>
      <div className="toggle-wrapper">
        <Toggle handleChange={toggleDark} isChecked={isDark} />
      </div>
    </nav>
  );
}

export default Navbar;
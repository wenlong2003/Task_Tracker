import "./Navbar.css";
import { Link } from "react-router-dom";

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout?: () => void;
}

function Navbar ({ isAuthenticated, onLogout }: NavbarProps) {
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
          <li className="link"><button className="logout-btn" onClick={onLogout}>Logout</button></li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
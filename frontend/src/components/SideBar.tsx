import { Link } from "react-router-dom";
import "./Sidebar.css";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className={`sidebar-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
      <div className="sidebar" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}><i className="bi bi-x-lg"></i></button>

        <div className="sidebar-header">
          <h3>Menu</h3>
        </div>

        <div className="sidebar-links">
          <Link to="/" onClick={onClose}><i className="bi bi-house"></i>Home</Link>
          <Link to="/dashboard" onClick={onClose}><i className="bi bi-window-sidebar"></i> Dashboard</Link>
          <Link to="/calendar" onClick={onClose}><i className="bi bi-calendar3"></i> Calendar</Link>
        </div>

        <hr />

        <div className="sidebar-section">
          {!isAuthenticated ? (
            <div className="auth-links">
              <Link to="/signin" onClick={onClose}><i className="bi bi-box-arrow-in-right"></i> Sign In</Link>
              <Link to="/signup" onClick={onClose}><i className="bi bi-box-arrow-in-left"></i> Sign Up</Link>
            </div>
          ) : (
            <>
              <div className="user-settings">
                <h4>User Settings</h4>
                <button className="settings-btn">Account Settings</button>
              </div>

              <button
                className="logout-btn"
                onClick={() => {
                  logout();
                  onClose();
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
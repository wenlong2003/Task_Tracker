import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className={`sidebar-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
      <div className="sidebar" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}><i className="bi bi-x-lg"></i></button>

        <div className="sidebar-header">
          <h3>Menu</h3>
        </div>

        <div className="sidebar-links">
          <Link to="/" onClick={onClose}><i className="bi bi-house"></i>Home</Link>
          <Link to="/dashboard" onClick={onClose}><i className="bi bi-clipboard-plus"></i> Dashboard</Link>
          <Link to="/calendar" onClick={onClose}><i className="bi bi-calendar3"></i> Calendar</Link>
        </div>

        <hr />

        <div className="sidebar-section">
          {!isAuthenticated ? (
            <div className="auth-links">
              <Link to="/signup" onClick={onClose}><i className="bi bi-person-add"></i> Sign Up</Link>
              <Link to="/signin" onClick={onClose}><i className="bi bi-box-arrow-in-right"></i> Sign In</Link>
            </div>
          ) : (
            <>
              <div className="user-settings">
                <h4>User Settings</h4>
                <Link to="/settings" className="settings-btn" onClick={onClose}>
                  Account Settings
                </Link>
              </div>

              <button
                className="logout-btn"
                onClick={() => {
                  logout();
                  onClose();
                  navigate("/signin");
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
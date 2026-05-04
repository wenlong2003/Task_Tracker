import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Settings.css";

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { logout } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleSaveProfile = async () => {
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update profile");
        return;
      }

      alert("Profile updated successfully");
    } catch (err) {
      alert("Error updating profile");
    }
  };

  const handleChangePassword = async () => {
    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update password");
        return;
      }

      alert("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      alert("Error updating password");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div>
            <h2>Profile</h2>
            <p>Edit your personal information here.</p>

            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button className="save-btn" onClick={handleSaveProfile}>
              Save Changes
            </button>
          </div>
        );

      case "security":
        return (
          <div>
            <h2>Security</h2>
            <p>Update your password and security settings.</p>

            <input
              placeholder="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <input
              placeholder="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              className="save-btn"
              onClick={handleChangePassword}
            >
              Update Password
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
  <div className="settings-page"> 
    <div className="settings-layout">
      <main className="settings-sidebar">
        <button 
          className={activeTab === "profile" ? "active" : ""} 
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button 
          className={activeTab === "security" ? "active" : ""} 
          onClick={() => setActiveTab("security")}
        >
          Security
        </button>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </main>

      <aside className="settings-content">
        {renderContent()}
      </aside>
    </div>
  </div>
);
}

export default Settings;
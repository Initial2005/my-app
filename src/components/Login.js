import React, { useEffect, useState } from "react";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [section, setSection] = useState("");
  const [isAdminChoice, setIsAdminChoice] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Autofill for convenience if previously saved
    const saved = localStorage.getItem("lastLogin");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setUserId(data.userId || "");
        setName(data.name || "");
        setSection(data.section || "");
      } catch (_) {}
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!userId.trim()) {
      setError("Please enter your ID");
      return;
    }

    // Determine admin: auto-admin if ID is 123456, or user explicitly chose admin
    const isAdmin = userId.trim() === "123456" || isAdminChoice;

    const userSettings = {
      displayName: name || "Guest User",
      email: "",
      bio: isAdmin ? "Admin - PSIT" : "Student - PSIT",
      rollNo: userId.trim(),
      section: section || "",
      profilePhoto: "",
      emailNotifications: true,
      courseRecommendations: true,
      weeklyReports: false,
      showProfilePublicly: true,
      allowProgressView: false,
    };

    // Persist auth + user settings
    localStorage.setItem(
      "auth",
      JSON.stringify({ isLoggedIn: true, isAdmin, userId: userId.trim() })
    );
    localStorage.setItem("userSettings", JSON.stringify(userSettings));
    localStorage.setItem(
      "lastLogin",
      JSON.stringify({ userId: userId.trim(), name, section })
    );

    if (onLogin) onLogin({ userSettings, isAdmin });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">BrainChainPSIT</h1>
        <p className="login-subtitle">Sign in to continue</p>
        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label">
            ID
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="e.g., 23CS101 or 123456 for admin"
              className="login-input"
            />
          </label>
          <label className="login-label">
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="login-input"
            />
          </label>
          <label className="login-label">
            Section
            <input
              type="text"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="e.g., CSE-A"
              className="login-input"
            />
          </label>

          <label className="login-checkbox">
            <input
              type="checkbox"
              checked={isAdminChoice}
              onChange={(e) => setIsAdminChoice(e.target.checked)}
            />
            I am an admin
          </label>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-button">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

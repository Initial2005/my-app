import React, { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [activeTab, setActiveTab] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // User Settings State
  const [userSettings, setUserSettings] = useState({
    displayName: "Vaishnavi",
    email: "vaishnavi@psit.ac.in",
    bio: "Computer Science Student at PSIT",
    rollNo: "23CS101",
    section: "CSE-A",
    profilePhoto: "",
    emailNotifications: true,
    courseRecommendations: true,
    weeklyReports: false,
    showProfilePublicly: true,
    allowProgressView: false,
  });

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSettingsChange = (newSettings) => {
    setUserSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
    // Save to localStorage
    localStorage.setItem(
      "userSettings",
      JSON.stringify({
        ...userSettings,
        ...newSettings,
      })
    );
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Load settings from localStorage on mount
  useEffect(() => {
    // auth
    try {
      const authRaw = localStorage.getItem("auth");
      if (authRaw) {
        const auth = JSON.parse(authRaw);
        setIsLoggedIn(!!auth.isLoggedIn);
        setIsAdmin(!!auth.isAdmin);
        // If admin, default to admin panel; else home
        setActiveTab(auth.isAdmin ? "admin" : "home");
      }
    } catch (e) {
      // ignore
    }

    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      try {
        setUserSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    }
  }, []);

  const handleLogin = ({ userSettings: newSettings, isAdmin: adminFlag }) => {
    setUserSettings((prev) => ({ ...prev, ...newSettings }));
    setIsAdmin(!!adminFlag);
    setIsLoggedIn(true);
    setActiveTab(adminFlag ? "admin" : "home");
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("auth");
    } catch (_) {}
    setIsLoggedIn(false);
    setIsAdmin(false);
    setActiveTab("home");
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <Sidebar
        collapsed={isSidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userSettings={userSettings}
      />
      <div className="main-content">
        <Header
          onToggleSidebar={handleToggleSidebar}
          onToggleTheme={handleToggleTheme}
          theme={theme}
          sidebarCollapsed={isSidebarCollapsed}
          isAdmin={isAdmin}
          onLogout={handleLogout}
        />
        <Dashboard
          activeTab={activeTab}
          onTabChange={handleTabChange}
          userSettings={userSettings}
          onSettingsChange={handleSettingsChange}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
}

export default App;

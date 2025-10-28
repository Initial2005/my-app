import React, { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [activeTab, setActiveTab] = useState("home");

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
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      try {
        setUserSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    }
  }, []);

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
        />
        <Dashboard
          activeTab={activeTab}
          onTabChange={handleTabChange}
          userSettings={userSettings}
          onSettingsChange={handleSettingsChange}
        />
      </div>
    </div>
  );
}

export default App;

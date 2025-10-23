import React, { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState("dark");

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="app">
      <Sidebar
        collapsed={isSidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />
      <div className="main-content">
        <Header
          onToggleSidebar={handleToggleSidebar}
          onToggleTheme={handleToggleTheme}
          theme={theme}
          sidebarCollapsed={isSidebarCollapsed}
        />
        <Dashboard />
      </div>
    </div>
  );
}

export default App;

import React from "react";
import { Coins, Moon, Sun } from "lucide-react";
import "./Header.css";

const Header = ({
  onToggleSidebar,
  sidebarCollapsed,
  onToggleTheme,
  theme,
}) => {
  return (
    <div className="header">
      <h1 className="dashboard-title">BrainChainPSIT Dashboard</h1>
      <div className="coins-display">
        <Coins size={20} />
        <span>PSIT Coins: 120</span>
      </div>
      <button
        className="theme-toggle"
        aria-label="Toggle theme"
        onClick={onToggleTheme}
        title={
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  );
};

export default Header;

import React, { useEffect, useRef, useState } from "react";
import { Coins, Moon, Sun } from "lucide-react";
import "./Header.css";

const mockHistory = [
  { id: 1, date: "2025-10-20", change: +50, reason: "Quiz reward" },
  { id: 2, date: "2025-10-18", change: -30, reason: "Submission fee" },
  { id: 3, date: "2025-10-15", change: +100, reason: "Referral bonus" },
];

const Header = ({
  onToggleSidebar,
  sidebarCollapsed,
  onToggleTheme,
  theme,
}) => {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        handleClose();
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
    }, 300); // match animation duration (increased to 300ms for spring effect)
  };

  const handleToggle = () => {
    if (open) {
      handleClose();
    } else {
      setOpen(true);
    }
  };

  const totalCoins = 120; // keep as-is for now; could be passed in via props later

  return (
    <div className="header">
      <div className="title-container">
        <h1 className="dashboard-title">BrainChainPSIT</h1>
      </div>

      <div className="header-right">
        <div
          className="coins-display clickable"
          role="button"
          tabIndex={0}
          onClick={handleToggle}
          onKeyDown={(e) => e.key === "Enter" && handleToggle()}
          aria-expanded={open}
          aria-controls="coins-panel"
        >
          <Coins size={20} />
          <span>PSIT Coins: {totalCoins}</span>
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

      {open && (
        <div
          className={`coins-panel ${isClosing ? "closing" : ""}`}
          id="coins-panel"
          ref={panelRef}
        >
          <div className="coins-panel-header">
            <strong>PSIT Coins</strong>
            <span className="coins-balance">{totalCoins} pts</span>
          </div>

          <div className="coins-section">
            <h4>About</h4>
            <p className="muted">
              PSIT Coins are earned by completing activities on BrainChainPSIT.
              They can be used to unlock challenges, pay submission fees, or
              redeemed for perks.
            </p>
          </div>

          <div className="coins-section">
            <h4>Recent activity</h4>
            <ul className="coins-history">
              {mockHistory.map((h) => (
                <li key={h.id} className="history-item">
                  <span className="history-date">{h.date}</span>
                  <span
                    className={`history-change ${h.change > 0 ? "pos" : "neg"}`}
                  >
                    {h.change > 0 ? `+${h.change}` : h.change}
                  </span>
                  <span className="history-reason">{h.reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;

import React, { useEffect, useRef, useState } from "react";
import {
  Coins,
  Moon,
  Sun,
  ShieldCheck,
  LogOut,
  Copy,
  RefreshCw,
} from "lucide-react";
import { getBlockchain } from "../blockchain";
import Wallet from "../blockchain/Wallet";
import "./Header.css";

const Header = ({
  onToggleSidebar,
  sidebarCollapsed,
  onToggleTheme,
  theme,
  isAdmin = false,
  onLogout,
  userSettings,
}) => {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [blockchain] = useState(() => getBlockchain());
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const panelRef = useRef(null);

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    if (auth.userId) {
      const w = new Wallet(auth.userId, userSettings?.displayName || "Student");
      setWallet(w);
      const bal = blockchain.getBalanceOfAddress(w.address);
      setBalance(bal);
      const transactions = blockchain.getTransactionsForAddress(w.address);
      const recent = transactions.slice(-5).reverse().map((tx) => ({
        id: tx.hash || Math.random(),
        date: new Date(tx.blockTimestamp || tx.timestamp || Date.now()).toLocaleDateString(),
        change: tx.toAddress === w.address ? tx.amount : -tx.amount,
        reason: tx.type === "reward" ? "Problem solved" : 
                tx.type === "achievement_reward" ? "Achievement" :
                tx.type === "contract_reward" ? "Bonus reward" :
                tx.type === "daily_bonus" ? "Daily bonus" :
                tx.type === "purchase" ? "Marketplace purchase" : "Transaction",
      }));
      setRecentActivity(recent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSettings]);

  const updateBalance = (address) => {
    if (!address) return;
    const bal = blockchain.getBalanceOfAddress(address);
    setBalance(bal);
  };

  const loadRecentActivity = (address) => {
    if (!address) return;
    const transactions = blockchain.getTransactionsForAddress(address);
    const recent = transactions
      .slice(-5)
      .reverse()
      .map((tx) => ({
        id: tx.hash || Math.random(),
        date: new Date(
          tx.blockTimestamp || tx.timestamp || Date.now()
        ).toLocaleDateString(),
        change: tx.toAddress === address ? tx.amount : -tx.amount,
        reason:
          tx.type === "reward"
            ? "Problem solved"
            : tx.type === "achievement_reward"
            ? "Achievement"
            : tx.type === "contract_reward"
            ? "Bonus reward"
            : tx.type === "daily_bonus"
            ? "Daily bonus"
            : tx.type === "purchase"
            ? "Marketplace purchase"
            : "Transaction",
      }));
    setRecentActivity(recent);
  };

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
    }, 300);
  };

  const handleToggle = () => {
    if (open) {
      handleClose();
    } else {
      setOpen(true);
      if (wallet) {
        updateBalance(wallet.address);
        loadRecentActivity(wallet.address);
      }
    }
  };

  const copyAddress = async () => {
    if (!wallet) return;
    try {
      await navigator.clipboard.writeText(wallet.address);
      alert("Wallet address copied to clipboard!");
    } catch (e) {
      console.warn("Copy failed", e);
    }
  };

  const refreshBalance = () => {
    if (!wallet) return;
    updateBalance(wallet.address);
    loadRecentActivity(wallet.address);
  };

  const minePending = () => {
    if (!wallet) return;
    blockchain.minePendingTransactions(wallet.address);
    updateBalance(wallet.address);
    loadRecentActivity(wallet.address);
    alert("✅ Pending transactions mined!");
  };

  return (
    <div className="header">
      <div className="title-container">
        <h1 className="dashboard-title">BrainChainPSIT</h1>
      </div>

      <div className="header-right">
        {isAdmin && (
          <span className="admin-badge" title="Admin account">
            <ShieldCheck size={16} />
            <span>Admin</span>
          </span>
        )}
        <div
          className="wallet-display clickable"
          role="button"
          tabIndex={0}
          onClick={handleToggle}
          onKeyDown={(e) => e.key === "Enter" && handleToggle()}
          aria-expanded={open}
          aria-controls="wallet-panel"
        >
          <Coins size={20} />
          <span className="wallet-label">PSIT Wallet</span>
          <span className="wallet-balance-badge">{balance}</span>
        </div>

        {onLogout && (
          <button
            className="logout-button"
            aria-label="Logout"
            onClick={onLogout}
            title="Logout"
          >
            <LogOut size={16} />
            <span className="logout-text">Logout</span>
          </button>
        )}

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

      {open && wallet && (
        <div
          className={`wallet-panel ${isClosing ? "closing" : ""}`}
          id="wallet-panel"
          ref={panelRef}
        >
          <div className="wallet-panel-header">
            <div className="wallet-header-top">
              <strong>PSIT Wallet</strong>
              <span className="wallet-balance-large">{balance} PSIT</span>
            </div>
            <div className="wallet-address-row">
              <span className="wallet-address-label">Address:</span>
              <code className="wallet-address-code" title={wallet.address}>
                {wallet.address.substring(0, 16)}...{wallet.address.substring(wallet.address.length - 8)}
              </code>
            </div>
          </div>

          <div className="wallet-actions-row">
            <button className="wallet-action-btn" onClick={copyAddress}>
              <Copy size={14} />
              Copy
            </button>
            <button className="wallet-action-btn" onClick={refreshBalance}>
              <RefreshCw size={14} />
              Refresh
            </button>
            <button className="wallet-action-btn primary" onClick={minePending}>
              Mine Pending
            </button>
          </div>

          <div className="wallet-section">
            <h4>Recent Activity</h4>
            <ul className="wallet-history">
              {recentActivity.length > 0 ? (
                recentActivity.map((h) => (
                  <li key={h.id} className="history-item">
                    <span className="history-date">{h.date}</span>
                    <span
                      className={`history-change ${h.change > 0 ? "pos" : "neg"}`}
                    >
                      {h.change > 0 ? `+${h.change}` : h.change}
                    </span>
                    <span className="history-reason">{h.reason}</span>
                  </li>
                ))
              ) : (
                <li className="empty-history">No recent activity</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;

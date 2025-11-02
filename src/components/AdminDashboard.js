/**
 * AdminDashboard.js - Admin panel for PSIT Coin management
 * Displays notifications, blockchain stats, and user activities
 */

import React, { useState, useEffect } from "react";
import {
  Bell,
  TrendingUp,
  Users,
  Coins,
  Award,
  ShoppingCart,
  Activity,
} from "lucide-react";
import { getBlockchain } from "../blockchain";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [blockchain] = useState(() => getBlockchain());
  const [blockchainStats, setBlockchainStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Load blockchain stats
    const stats = blockchain.getBlockchainStats();
    setBlockchainStats(stats);

    // Load admin notifications
    const storedNotifications = JSON.parse(
      localStorage.getItem("adminNotifications") || "[]"
    );
    setNotifications(storedNotifications);

    // Set up periodic refresh
    const interval = setInterval(() => {
      const updatedStats = blockchain.getBlockchainStats();
      setBlockchainStats(updatedStats);

      const updatedNotifications = JSON.parse(
        localStorage.getItem("adminNotifications") || "[]"
      );
      setNotifications(updatedNotifications);
    }, 5000);

    return () => clearInterval(interval);
  }, [blockchain]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "reward":
        return <Award size={20} className="notif-icon reward" />;
      case "purchase":
        return <ShoppingCart size={20} className="notif-icon purchase" />;
      default:
        return <Bell size={20} className="notif-icon default" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return date.toLocaleDateString();
  };

  if (!blockchainStats) {
    return <div className="admin-loading">Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>
          <Activity size={28} />
          Admin Dashboard - PSIT Coin Management
        </h2>
        <p className="admin-subtitle">
          Monitor blockchain activity and user rewards
        </p>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`admin-tab ${
            activeTab === "notifications" ? "active" : ""
          }`}
          onClick={() => setActiveTab("notifications")}
        >
          Notifications
          {notifications.length > 0 && (
            <span className="notif-badge">{notifications.length}</span>
          )}
        </button>
        <button
          className={`admin-tab ${activeTab === "blockchain" ? "active" : ""}`}
          onClick={() => setActiveTab("blockchain")}
        >
          Blockchain
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "overview" && (
          <>
            <div className="stats-overview">
              <div className="stat-card">
                <div className="stat-icon">
                  <Coins size={32} />
                </div>
                <div className="stat-info">
                  <div className="stat-label">Total Rewards Distributed</div>
                  <div className="stat-value">
                    ₱{blockchainStats.totalRewardsDistributed}
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <ShoppingCart size={32} />
                </div>
                <div className="stat-info">
                  <div className="stat-label">Total Purchases</div>
                  <div className="stat-value">
                    ₱{blockchainStats.totalPurchases}
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <TrendingUp size={32} />
                </div>
                <div className="stat-info">
                  <div className="stat-label">Total Transactions</div>
                  <div className="stat-value">
                    {blockchainStats.totalTransactions}
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Users size={32} />
                </div>
                <div className="stat-info">
                  <div className="stat-label">Blocks Mined</div>
                  <div className="stat-value">{blockchainStats.blockCount}</div>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Recent Notifications</h3>
              {notifications.slice(0, 5).length === 0 ? (
                <div className="no-activity">
                  <Bell size={48} />
                  <p>No recent activity</p>
                </div>
              ) : (
                <div className="activity-list">
                  {notifications.slice(0, 5).map((notif, index) => (
                    <div key={index} className="activity-item">
                      {getNotificationIcon(notif.type)}
                      <div className="activity-details">
                        <div className="activity-title">
                          {notif.type === "reward" &&
                          notif.transaction?.metadata
                            ? `${notif.transaction.to} earned ${notif.transaction.amount} coins`
                            : "New Activity"}
                        </div>
                        <div className="activity-meta">
                          {notif.transaction?.metadata?.problemTitle && (
                            <span>
                              {notif.transaction.metadata.problemTitle} •{" "}
                              <span
                                className={`diff-${notif.transaction.metadata.difficulty?.toLowerCase()}`}
                              >
                                {notif.transaction.metadata.difficulty}
                              </span>
                            </span>
                          )}
                          <span className="activity-time">
                            {formatTimestamp(notif.timestamp)}
                          </span>
                        </div>
                      </div>
                      <div className="activity-amount">
                        +₱{notif.transaction?.amount || 0}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "notifications" && (
          <div className="notifications-section">
            <h3>All Notifications</h3>
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <Bell size={64} />
                <p>No notifications yet</p>
                <p className="hint">
                  Notifications will appear when users earn coins
                </p>
              </div>
            ) : (
              <div className="notifications-list">
                {notifications.map((notif, index) => (
                  <div key={index} className="notification-card">
                    {getNotificationIcon(notif.type)}
                    <div className="notification-content">
                      <div className="notification-header">
                        <span className="notification-type">
                          {notif.type.charAt(0).toUpperCase() +
                            notif.type.slice(1)}
                        </span>
                        <span className="notification-time">
                          {formatTimestamp(notif.timestamp)}
                        </span>
                      </div>
                      <div className="notification-details">
                        <strong>{notif.transaction?.to}</strong> earned{" "}
                        <strong>₱{notif.transaction?.amount}</strong> coins
                        {notif.transaction?.metadata?.problemTitle && (
                          <div className="notification-problem">
                            Problem: {notif.transaction.metadata.problemTitle} (
                            {notif.transaction.metadata.difficulty})
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "blockchain" && (
          <div className="blockchain-section">
            <h3>Blockchain Information</h3>

            <div className="blockchain-info-grid">
              <div className="info-card">
                <div className="info-label">Total Blocks</div>
                <div className="info-value">{blockchainStats.blockCount}</div>
              </div>

              <div className="info-card">
                <div className="info-label">Mining Difficulty</div>
                <div className="info-value">{blockchainStats.difficulty}</div>
              </div>

              <div className="info-card">
                <div className="info-label">Pending Transactions</div>
                <div className="info-value">
                  {blockchainStats.pendingTransactions}
                </div>
              </div>

              <div className="info-card">
                <div className="info-label">Blockchain Status</div>
                <div
                  className={`info-value ${
                    blockchainStats.isValid ? "valid" : "invalid"
                  }`}
                >
                  {blockchainStats.isValid ? "✓ Valid" : "✗ Invalid"}
                </div>
              </div>
            </div>

            <div className="blockchain-actions">
              <button
                className="action-btn"
                onClick={() => {
                  const isValid = blockchain.isChainValid();
                  alert(`Blockchain is ${isValid ? "VALID ✓" : "INVALID ✗"}`);
                }}
              >
                Verify Blockchain Integrity
              </button>

              <button
                className="action-btn secondary"
                onClick={() => {
                  console.log("Full blockchain:", blockchain.chain);
                  alert("Blockchain data logged to console");
                }}
              >
                Export Blockchain Data
              </button>
            </div>

            <div className="reward-mapping">
              <h4>Reward Structure</h4>
              <div className="reward-table">
                <div className="reward-row">
                  <span className="difficulty-label easy">Easy</span>
                  <span className="reward-amount">₱10</span>
                </div>
                <div className="reward-row">
                  <span className="difficulty-label medium">Medium</span>
                  <span className="reward-amount">₱25</span>
                </div>
                <div className="reward-row">
                  <span className="difficulty-label hard">Hard</span>
                  <span className="reward-amount">₱50</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

/**
 * PSITCoinWallet.js - User wallet interface component
 * Displays wallet balance, transaction history, and allows purchases
 */

import React, { useState, useEffect } from "react";
import {
  Wallet as WalletIcon,
  TrendingUp,
  ShoppingCart,
  Award,
  History,
  Download,
  Copy,
  Check,
} from "lucide-react";
import { getBlockchain } from "../blockchain";
import Wallet from "../blockchain/Wallet";
import "./PSITCoinWallet.css";

const PSITCoinWallet = ({ userSettings, onClose, embedded = false }) => {
  const [wallet, setWallet] = useState(null);
  const [blockchain] = useState(() => getBlockchain());
  const [balance, setBalance] = useState(0);
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);

  // Initialize wallet
  useEffect(() => {
    const userWallet = new Wallet(
      userSettings.rollNo || "GUEST",
      userSettings.displayName || "Guest User"
    );
    setWallet(userWallet);

    // Update balance and stats
    updateWalletData(userWallet);

    // Set up periodic refresh
    const interval = setInterval(() => {
      updateWalletData(userWallet);
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSettings]);

  const updateWalletData = (userWallet) => {
    if (!userWallet || !userWallet.address) return;

    const currentBalance = blockchain.getBalanceOfAddress(userWallet.address);
    const userStats = blockchain.getUserStats(userWallet.address);
    const userTransactions = blockchain.getTransactionsForAddress(
      userWallet.address
    );

    setBalance(currentBalance);
    setStats(userStats);
    setTransactions(userTransactions);
  };

  const copyAddress = () => {
    if (wallet && wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const exportWallet = () => {
    if (wallet) {
      const walletData = wallet.exportWallet();
      const dataStr = JSON.stringify(walletData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `psit-wallet-${wallet.userId}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case "reward":
        return <Award size={18} className="tx-icon reward" />;
      case "purchase":
        return <ShoppingCart size={18} className="tx-icon purchase" />;
      case "mining_reward":
        return <TrendingUp size={18} className="tx-icon mining" />;
      default:
        return <History size={18} className="tx-icon default" />;
    }
  };

  if (!wallet) {
    return (
      <div className={embedded ? "wallet-loading embedded" : "wallet-loading"}>
        Initializing wallet...
      </div>
    );
  }

  // Header content common
  const Header = () => (
    <div className={embedded ? "wallet-header embedded" : "wallet-header"}>
      <h2>
        <WalletIcon size={24} />
        PSIT Coin Wallet
      </h2>
      {!embedded && (
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );

  const Tabs = () => (
    <div className={embedded ? "wallet-tabs embedded" : "wallet-tabs"}>
      <button
        className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
        onClick={() => setActiveTab("overview")}
      >
        Overview
      </button>
      <button
        className={`tab-btn ${activeTab === "transactions" ? "active" : ""}`}
        onClick={() => setActiveTab("transactions")}
      >
        Transactions
      </button>
      <button
        className={`tab-btn ${activeTab === "spend" ? "active" : ""}`}
        onClick={() => setActiveTab("spend")}
      >
        Spend Coins
      </button>
    </div>
  );

  const Content = () => (
    <div className={embedded ? "wallet-content embedded" : "wallet-content"}>
      {activeTab === "overview" && (
        <>
          <div className="balance-card">
            <div className="balance-label">Your Balance</div>
            <div className="balance-amount">
              <span className="coin-symbol">₱</span>
              {balance.toFixed(2)}
              <span className="coin-name">PSIT Coins</span>
            </div>
            <div className="balance-usd">
              ≈ ₹{(balance * 10).toFixed(2)} value
            </div>
          </div>

          <div className="wallet-address-card">
            <div className="address-label">Wallet Address</div>
            <div className="address-display">
              <code>{wallet.address}</code>
              <button className="copy-btn" onClick={copyAddress}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Earned</div>
                <div className="stat-value">₱{stats.totalEarned}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Spent</div>
                <div className="stat-value">₱{stats.totalSpent}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Problems Solved</div>
                <div className="stat-value">{stats.problemsSolved.total}</div>
                <div className="stat-breakdown">
                  <span className="easy">{stats.problemsSolved.easy} Easy</span>
                  <span className="medium">
                    {stats.problemsSolved.medium} Medium
                  </span>
                  <span className="hard">{stats.problemsSolved.hard} Hard</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Transactions</div>
                <div className="stat-value">{stats.transactionCount}</div>
              </div>
            </div>
          )}

          <div className="wallet-actions">
            <button
              className="action-btn primary"
              onClick={() => setActiveTab("spend")}
            >
              <ShoppingCart size={18} />
              Spend Coins
            </button>
            <button className="action-btn secondary" onClick={exportWallet}>
              <Download size={18} />
              Backup Wallet
            </button>
          </div>
        </>
      )}

      {activeTab === "transactions" && (
        <div className="transactions-list">
          <h3>Transaction History</h3>
          {transactions.length === 0 ? (
            <div className="no-transactions">
              <History size={48} />
              <p>No transactions yet</p>
              <p className="hint">Complete problems to earn PSIT Coins!</p>
            </div>
          ) : (
            <div className="tx-list">
              {transactions.map((tx, index) => (
                <div key={index} className={`tx-item ${tx.type}`}>
                  <div className="tx-icon-wrapper">
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div className="tx-details">
                    <div className="tx-title">
                      {tx.type === "reward" && tx.metadata.problemTitle
                        ? `Solved: ${tx.metadata.problemTitle}`
                        : tx.type === "purchase" && tx.metadata.item
                        ? `Purchased: ${tx.metadata.item}`
                        : tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </div>
                    <div className="tx-meta">
                      {tx.timestamp}
                      {tx.metadata.difficulty && (
                        <span
                          className={`difficulty-badge ${tx.metadata.difficulty.toLowerCase()}`}
                        >
                          {tx.metadata.difficulty}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className={`tx-amount ${
                      tx.to === wallet.address ? "positive" : "negative"
                    }`}
                  >
                    {tx.to === wallet.address ? "+" : "-"}₱{tx.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "spend" && (
        <div className="spend-section">
          <h3>Spend Your PSIT Coins</h3>
          <p className="spend-intro">
            Use your PSIT Coins to purchase items from cafeteria, tuckshop, or
            boost your internal marks!
          </p>

          <div className="spend-options">
            <div className="spend-card">
              <div className="spend-icon">🍕</div>
              <h4>Cafeteria</h4>
              <p>Buy snacks, meals, and beverages</p>
              <div className="spend-price">From ₱10</div>
              <button
                className="spend-btn"
                onClick={() => alert("Cafeteria purchase coming soon!")}
                disabled={balance < 10}
              >
                Shop Now
              </button>
            </div>

            <div className="spend-card">
              <div className="spend-icon">📚</div>
              <h4>Tuckshop</h4>
              <p>Purchase stationery and supplies</p>
              <div className="spend-price">From ₱15</div>
              <button
                className="spend-btn"
                onClick={() => alert("Tuckshop purchase coming soon!")}
                disabled={balance < 15}
              >
                Shop Now
              </button>
            </div>

            <div className="spend-card premium">
              <div className="spend-icon">⭐</div>
              <h4>Internal Marks</h4>
              <p>Boost your internal assessment marks</p>
              <div className="spend-price">₱100 = +1 mark</div>
              <button
                className="spend-btn"
                onClick={() => alert("Internal marks boost coming soon!")}
                disabled={balance < 100}
              >
                Redeem
              </button>
            </div>
          </div>

          {balance < 10 && (
            <div className="insufficient-balance">
              <p>⚠️ Insufficient balance. Solve more problems to earn coins!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (embedded) {
    return (
      <div className="wallet-embedded">
        <Header />
        <Tabs />
        <Content />
      </div>
    );
  }

  return (
    <div className="wallet-overlay">
      <div className="wallet-modal">
        <Header />
        <Tabs />
        <Content />
      </div>
    </div>
  );
};

export default PSITCoinWallet;

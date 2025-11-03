import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Lightbulb,
  BookOpen,
  Award,
  Zap,
  Star,
  Lock,
} from "lucide-react";
import { getBlockchain } from "../blockchain";
import Wallet from "../blockchain/Wallet";
import Transaction from "../blockchain/Transaction";
import "./Marketplace.css";

const MARKETPLACE_ITEMS = [
  {
    id: "hint_single",
    name: "Problem Hint",
    description: "Get a helpful hint for any problem",
    icon: <Lightbulb size={32} />,
    price: 50,
    category: "hints",
    type: "consumable",
  },
  {
    id: "hint_bundle_5",
    name: "5 Hints Bundle",
    description: "Bundle of 5 problem hints (Save 20%!)",
    icon: <Lightbulb size={32} />,
    price: 200,
    category: "hints",
    type: "consumable",
    badge: "SAVE 20%",
  },
  {
    id: "premium_course",
    name: "Premium Course Access",
    description: "Unlock one premium advanced course",
    icon: <BookOpen size={32} />,
    price: 500,
    category: "courses",
    type: "unlock",
  },
  {
    id: "all_courses",
    name: "All Courses Bundle",
    description: "Lifetime access to all premium courses",
    icon: <BookOpen size={32} />,
    price: 2000,
    category: "courses",
    type: "unlock",
    badge: "BEST VALUE",
  },
  {
    id: "custom_badge",
    name: "Custom Profile Badge",
    description: "Create your own unique profile badge",
    icon: <Award size={32} />,
    price: 300,
    category: "badges",
    type: "cosmetic",
  },
  {
    id: "streak_freeze",
    name: "Streak Freeze",
    description: "Protect your streak for 1 day",
    icon: <Zap size={32} />,
    price: 100,
    category: "boosts",
    type: "consumable",
  },
  {
    id: "double_xp",
    name: "2x Coin Boost (24h)",
    description: "Double coin earnings for 24 hours",
    icon: <Star size={32} />,
    price: 400,
    category: "boosts",
    type: "consumable",
  },
  {
    id: "solution_view",
    name: "View Solution",
    description: "View the optimal solution for any problem",
    icon: <Lock size={32} />,
    price: 150,
    category: "hints",
    type: "consumable",
  },
];

const Marketplace = () => {
  const [blockchain] = useState(() => getBlockchain());
  const [userAddress, setUserAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [purchases, setPurchases] = useState({});
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    const settings = JSON.parse(localStorage.getItem("userSettings") || "{}");
    if (auth.userId) {
      const w = new Wallet(auth.userId, settings?.displayName || "Student");
      const address = w.address;
      setUserAddress(address);
      const bal = blockchain.getBalanceOfAddress(address);
      setBalance(bal);
      const stored = JSON.parse(
        localStorage.getItem("marketplacePurchases") || "{}"
      );
      setPurchases(stored[address] || {});
    }
  }, [blockchain]);

  const updateBalance = (address) => {
    const bal = blockchain.getBalanceOfAddress(address);
    setBalance(bal);
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(userAddress);
      alert("Wallet address copied to clipboard");
    } catch (e) {
      console.warn("Copy failed", e);
    }
  };

  const mineNow = () => {
    if (!userAddress) return;
    blockchain.minePendingTransactions(userAddress);
    updateBalance(userAddress);
  };

  const handlePurchase = (item) => {
    if (balance < item.price) {
      alert("Insufficient PSIT Coins! Solve more problems to earn coins.");
      return;
    }

    setSelectedItem(item);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = () => {
    if (!selectedItem) return;

    // Create spend transaction
    try {
      const purchaseTx = new Transaction(
        userAddress,
        "marketplace",
        selectedItem.price,
        "purchase",
        { itemId: selectedItem.id, itemName: selectedItem.name }
      );
      // For purchases, signTransaction is optional in our simplified model
      blockchain.addTransaction(purchaseTx);
    } catch (e) {
      console.warn("Failed to create purchase transaction:", e);
    }

    // Mine the transaction
    blockchain.minePendingTransactions(userAddress);

    // Record purchase
    const stored = JSON.parse(
      localStorage.getItem("marketplacePurchases") || "{}"
    );
    if (!stored[userAddress]) {
      stored[userAddress] = {};
    }
    if (!stored[userAddress][selectedItem.id]) {
      stored[userAddress][selectedItem.id] = { count: 0, lastPurchase: null };
    }
    stored[userAddress][selectedItem.id].count += 1;
    stored[userAddress][selectedItem.id].lastPurchase = Date.now();
    localStorage.setItem("marketplacePurchases", JSON.stringify(stored));

    setPurchases(stored[userAddress]);
    updateBalance(userAddress);
    setShowPurchaseModal(false);
    setSelectedItem(null);

    alert(`✅ Successfully purchased ${selectedItem.name}!`);
  };

  const categories = [
    { id: "all", name: "All Items", icon: <ShoppingBag size={16} /> },
    { id: "hints", name: "Hints", icon: <Lightbulb size={16} /> },
    { id: "courses", name: "Courses", icon: <BookOpen size={16} /> },
    { id: "boosts", name: "Boosts", icon: <Zap size={16} /> },
    { id: "badges", name: "Badges", icon: <Award size={16} /> },
  ];

  const filteredItems =
    selectedCategory === "all"
      ? MARKETPLACE_ITEMS
      : MARKETPLACE_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <div className="marketplace-container">
      {/* Wallet Bar - above navbar */}
      {userAddress && (
        <div className="wallet-bar">
          <div className="wallet-left">
            <div className="wallet-label">PSIT Wallet</div>
            <div className="wallet-address" title={userAddress}>
              {userAddress}
            </div>
          </div>
          <div className="wallet-right">
            <div className="wallet-balance">
              <span className="wallet-balance-label">Balance</span>
              <span className="wallet-balance-amount">{balance} PSIT</span>
            </div>
            <div className="wallet-actions">
              <button className="wallet-action" onClick={copyAddress}>
                Copy Address
              </button>
              <button className="wallet-action primary" onClick={mineNow}>
                Mine Pending
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="marketplace-header">
        <div className="header-content">
          <h1>
            <ShoppingBag size={32} />
            PSIT Coin Marketplace
          </h1>
          <p>Spend your hard-earned coins on helpful items and upgrades!</p>
        </div>
        <div className="balance-display">
          <span className="balance-label">Your Balance</span>
          <span className="balance-amount">{balance} PSIT</span>
        </div>
      </div>

      <div className="marketplace-categories">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-btn ${
              selectedCategory === cat.id ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      <div className="marketplace-grid">
        {filteredItems.map((item) => {
          const owned = purchases[item.id]?.count || 0;
          const canAfford = balance >= item.price;

          return (
            <div
              key={item.id}
              className={`marketplace-item ${!canAfford ? "disabled" : ""}`}
            >
              {item.badge && <div className="item-badge">{item.badge}</div>}

              <div className="item-icon">{item.icon}</div>

              <div className="item-info">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>

              <div className="item-footer">
                <div className="item-price">
                  <span className="price-amount">{item.price}</span>
                  <span className="price-currency">PSIT</span>
                </div>

                {owned > 0 && item.type === "consumable" && (
                  <span className="owned-badge">Owned: {owned}</span>
                )}

                <button
                  className="purchase-btn"
                  onClick={() => handlePurchase(item)}
                  disabled={!canAfford}
                >
                  {canAfford ? "Purchase" : "Not enough coins"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showPurchaseModal && selectedItem && (
        <div
          className="purchase-modal-overlay"
          onClick={() => setShowPurchaseModal(false)}
        >
          <div className="purchase-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Purchase</h2>
            <div className="modal-item-preview">
              {selectedItem.icon}
              <h3>{selectedItem.name}</h3>
              <p>{selectedItem.description}</p>
            </div>
            <div className="modal-price">
              <span>Price:</span>
              <strong>{selectedItem.price} PSIT Coins</strong>
            </div>
            <div className="modal-balance">
              <span>Your Balance:</span>
              <strong>{balance} PSIT Coins</strong>
            </div>
            <div className="modal-after">
              <span>Balance After:</span>
              <strong>{balance - selectedItem.price} PSIT Coins</strong>
            </div>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowPurchaseModal(false)}
              >
                Cancel
              </button>
              <button className="confirm-btn" onClick={confirmPurchase}>
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;

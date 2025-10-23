import React, { useState } from "react";
import "./Dashboard.css";
import Problems from "./Problems";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="dashboard">
      {/* Top Navigation */}
      <nav className="top-nav">
        <button
          className={`nav-link ${activeTab === "home" ? "active" : ""}`}
          onClick={() => setActiveTab("home")}
        >
          Home
        </button>
        <button
          className={`nav-link ${activeTab === "explore" ? "active" : ""}`}
          onClick={() => setActiveTab("explore")}
        >
          Explore
        </button>
        <button
          className={`nav-link ${activeTab === "problems" ? "active" : ""}`}
          onClick={() => setActiveTab("problems")}
        >
          Problems
        </button>
        <button
          className={`nav-link ${activeTab === "contest" ? "active" : ""}`}
          onClick={() => setActiveTab("contest")}
        >
          Contest
        </button>
        <button
          className={`nav-link ${activeTab === "discuss" ? "active" : ""}`}
          onClick={() => setActiveTab("discuss")}
        >
          Discuss
        </button>
        <button
          className={`nav-link ${activeTab === "interview" ? "active" : ""}`}
          onClick={() => setActiveTab("interview")}
        >
          Interview
        </button>
        <button
          className={`nav-link ${activeTab === "store" ? "active" : ""}`}
          onClick={() => setActiveTab("store")}
        >
          Store
        </button>
      </nav>

      {/* Content based on active tab */}
      {activeTab === "home" && (
        <>
          {/* Metrics Cards */}
          <div className="metrics-cards">
            <div className="metric-card">
              <h3 className="card-title">Marks</h3>
              <div className="card-value">85 / 100</div>
            </div>
            <div className="metric-card">
              <h3 className="card-title">Rank</h3>
              <div className="card-value">#12</div>
            </div>
          </div>

          {/* Blockchain History Card */}
          <div className="blockchain-card">
            <h3 className="card-title">Blockchain History</h3>
            <button className="view-transactions-btn">View Transactions</button>
          </div>

          {/* Weekly Progress */}
          <div className="weekly-progress">
            <h2 className="progress-title">Weekly Progress</h2>
            <div className="progress-chart">
              <div className="bar" style={{ height: "60%" }}></div>
              <div className="bar" style={{ height: "80%" }}></div>
              <div className="bar" style={{ height: "45%" }}></div>
              <div className="bar" style={{ height: "90%" }}></div>
            </div>
          </div>
        </>
      )}

      {activeTab === "problems" && <Problems />}
    </div>
  );
};

export default Dashboard;

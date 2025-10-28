import React, { useState } from "react";
import { Clock, Users, Trophy, Calendar } from "lucide-react";
import "./Contest.css";

const Contest = () => {
  const [filter, setFilter] = useState("upcoming");

  const contests = [
    {
      id: 1,
      title: "Weekly Coding Challenge #47",
      description: "Test your algorithmic skills with 5 challenging problems",
      status: "upcoming",
      startTime: "Oct 26, 2025 10:00 AM",
      duration: "2 hours",
      participants: 1234,
      prize: "Certificate + 500 Coins",
      difficulty: "Medium",
    },
    {
      id: 2,
      title: "Data Structures Sprint",
      description: "Focus on trees, graphs, and dynamic programming",
      status: "upcoming",
      startTime: "Oct 28, 2025 3:00 PM",
      duration: "3 hours",
      participants: 892,
      prize: "Certificate + 750 Coins",
      difficulty: "Hard",
    },
    {
      id: 3,
      title: "Beginner's Bootcamp",
      description: "Perfect for those starting their coding journey",
      status: "upcoming",
      startTime: "Oct 30, 2025 11:00 AM",
      duration: "1.5 hours",
      participants: 2145,
      prize: "Certificate + 300 Coins",
      difficulty: "Easy",
    },
    {
      id: 4,
      title: "Monthly Grand Challenge",
      description: "The biggest competition of the month with 10 problems",
      status: "live",
      startTime: "Oct 24, 2025 9:00 AM",
      duration: "4 hours",
      participants: 3456,
      prize: "Certificate + 1000 Coins + Special Badge",
      difficulty: "Mixed",
    },
    {
      id: 5,
      title: "Weekly Coding Challenge #46",
      description: "Array and string manipulation problems",
      status: "past",
      startTime: "Oct 19, 2025 10:00 AM",
      duration: "2 hours",
      participants: 1567,
      prize: "Certificate + 500 Coins",
      difficulty: "Medium",
      winner: "Rahul Sharma",
      yourRank: 45,
    },
    {
      id: 6,
      title: "Algorithm Battle #32",
      description: "Sorting, searching, and optimization challenges",
      status: "past",
      startTime: "Oct 15, 2025 2:00 PM",
      duration: "2.5 hours",
      participants: 1234,
      prize: "Certificate + 600 Coins",
      difficulty: "Hard",
      winner: "Priya Singh",
      yourRank: 23,
    },
  ];

  const filteredContests = contests.filter(
    (contest) => contest.status === filter
  );

  const getStatusBadge = (status) => {
    const badges = {
      live: { text: "🔴 LIVE NOW", class: "live" },
      upcoming: { text: "📅 Upcoming", class: "upcoming" },
      past: { text: "✅ Completed", class: "past" },
    };
    return badges[status];
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: "#00D4AA",
      Medium: "#FFA500",
      Hard: "#FF4444",
      Mixed: "#4A9EFF",
    };
    return colors[difficulty] || "#888";
  };

  return (
    <div className="contest-container">
      <div className="contest-header">
        <h2 className="contest-title">🏆 Coding Contests</h2>
        <p className="contest-subtitle">
          Compete with others and climb the leaderboard
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="contest-filters">
        <button
          className={`filter-tab ${filter === "live" ? "active" : ""}`}
          onClick={() => setFilter("live")}
        >
          <span className="live-indicator">🔴</span> Live
        </button>
        <button
          className={`filter-tab ${filter === "upcoming" ? "active" : ""}`}
          onClick={() => setFilter("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`filter-tab ${filter === "past" ? "active" : ""}`}
          onClick={() => setFilter("past")}
        >
          Past Contests
        </button>
      </div>

      {/* Contest Cards */}
      <div className="contest-list">
        {filteredContests.map((contest) => {
          const statusBadge = getStatusBadge(contest.status);
          return (
            <div key={contest.id} className={`contest-card ${contest.status}`}>
              <div className="contest-card-header">
                <div>
                  <h3 className="contest-card-title">{contest.title}</h3>
                  <span className={`status-badge ${statusBadge.class}`}>
                    {statusBadge.text}
                  </span>
                </div>
                <span
                  className="difficulty-badge"
                  style={{ color: getDifficultyColor(contest.difficulty) }}
                >
                  {contest.difficulty}
                </span>
              </div>

              <p className="contest-description">{contest.description}</p>

              <div className="contest-details">
                <div className="detail-item">
                  <Calendar size={16} />
                  <span>{contest.startTime}</span>
                </div>
                <div className="detail-item">
                  <Clock size={16} />
                  <span>{contest.duration}</span>
                </div>
                <div className="detail-item">
                  <Users size={16} />
                  <span>
                    {contest.participants.toLocaleString()} participants
                  </span>
                </div>
              </div>

              <div className="contest-prize">
                <Trophy size={16} />
                <span>{contest.prize}</span>
              </div>

              {contest.status === "past" && (
                <div className="contest-results">
                  <div className="result-item">
                    <span className="result-label">Winner:</span>
                    <span className="result-value">🥇 {contest.winner}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Your Rank:</span>
                    <span className="result-value">#{contest.yourRank}</span>
                  </div>
                </div>
              )}

              <div className="contest-actions">
                {contest.status === "live" && (
                  <button className="btn-primary">Join Now</button>
                )}
                {contest.status === "upcoming" && (
                  <>
                    <button className="btn-primary">Register</button>
                    <button className="btn-secondary">Set Reminder</button>
                  </>
                )}
                {contest.status === "past" && (
                  <>
                    <button className="btn-secondary">View Solutions</button>
                    <button className="btn-secondary">View Rankings</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredContests.length === 0 && (
        <div className="no-contests">
          <p>No {filter} contests at the moment</p>
        </div>
      )}
    </div>
  );
};

export default Contest;

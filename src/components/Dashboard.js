import React, { useState } from "react";
import "./Dashboard.css";
import Problems from "./Problems";
import Interview from "./Interview";
import Discuss from "./Discuss";
import Explore from "./Explore";
import Certificates from "./Certificates";
import Contest from "./Contest";
import AdminDashboard from "./AdminDashboard";
import Marketplace from "./Marketplace";

// Settings Section Component
const SettingsSection = ({ userSettings, onSettingsChange }) => {
  const [formData, setFormData] = useState({
    displayName: userSettings.displayName || "Vaishnavi",
    email: userSettings.email || "vaishnavi@psit.ac.in",
    bio: userSettings.bio || "Computer Science Student at PSIT",
    rollNo: userSettings.rollNo || "23CS101",
    section: userSettings.section || "CSE-A",
    profilePhoto: userSettings.profilePhoto || "",
    emailNotifications: userSettings.emailNotifications !== false,
    courseRecommendations: userSettings.courseRecommendations !== false,
    weeklyReports: userSettings.weeklyReports || false,
    showProfilePublicly: userSettings.showProfilePublicly !== false,
    allowProgressView: userSettings.allowProgressView || false,
  });

  const [saveMessage, setSaveMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profilePhoto: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      profilePhoto: "",
    }));
  };

  const handleSave = () => {
    onSettingsChange(formData);
    setSaveMessage("✓ Settings saved successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  return (
    <div className="settings-section">
      <h2 className="section-title">⚙️ Settings</h2>
      {saveMessage && <div className="save-message">{saveMessage}</div>}
      <div className="settings-groups">
        <div className="settings-group">
          <h3>Profile Settings</h3>
          <div className="setting-item profile-photo-section">
            <label>Profile Photo</label>
            <div className="profile-photo-container">
              <div className="profile-photo-preview">
                {formData.profilePhoto ? (
                  <img src={formData.profilePhoto} alt="Profile" />
                ) : (
                  <div className="no-photo">
                    <span>📷</span>
                    <p>No photo</p>
                  </div>
                )}
              </div>
              <div className="profile-photo-actions">
                <input
                  type="file"
                  id="profilePhotoInput"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  className="upload-photo-btn"
                  onClick={() =>
                    document.getElementById("profilePhotoInput").click()
                  }
                >
                  📤 Upload Photo
                </button>
                {formData.profilePhoto && (
                  <button
                    type="button"
                    className="remove-photo-btn"
                    onClick={handleRemovePhoto}
                  >
                    🗑️ Remove
                  </button>
                )}
                <p className="photo-hint">Max size: 5MB (JPG, PNG, GIF)</p>
              </div>
            </div>
          </div>
          <div className="setting-item">
            <label>Display Name</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
            />
          </div>
          <div className="setting-item">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="setting-item">
            <label>Roll Number</label>
            <input
              type="text"
              name="rollNo"
              value={formData.rollNo}
              onChange={handleInputChange}
            />
          </div>
          <div className="setting-item">
            <label>Section</label>
            <input
              type="text"
              name="section"
              value={formData.section}
              onChange={handleInputChange}
            />
          </div>
          <div className="setting-item">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="3"
            />
          </div>
        </div>
        <div className="settings-group">
          <h3>Preferences</h3>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                name="emailNotifications"
                checked={formData.emailNotifications}
                onChange={handleInputChange}
              />
              Email Notifications
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                name="courseRecommendations"
                checked={formData.courseRecommendations}
                onChange={handleInputChange}
              />
              Course Recommendations
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                name="weeklyReports"
                checked={formData.weeklyReports}
                onChange={handleInputChange}
              />
              Weekly Progress Reports
            </label>
          </div>
        </div>
        <div className="settings-group">
          <h3>Privacy</h3>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                name="showProfilePublicly"
                checked={formData.showProfilePublicly}
                onChange={handleInputChange}
              />
              Show Profile Publicly
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                name="allowProgressView"
                checked={formData.allowProgressView}
                onChange={handleInputChange}
              />
              Allow others to see my progress
            </label>
          </div>
        </div>
      </div>
      <button className="save-settings-btn" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
};

const Dashboard = ({
  activeTab,
  onTabChange,
  userSettings = {},
  onSettingsChange,
  isAdmin = false,
}) => {
  // Content tabs that should show the top navigation
  const contentTabs = [
    "home",
    "explore",
    "problems",
    "contest",
    "interview",
    "discuss",
    "certificates",
    "leaderboard",
  ];
  const showTopNav = contentTabs.includes(activeTab);

  return (
    <div className="dashboard">
      {/* Top Navigation - Only show for content sections */}
      {showTopNav && (
        <nav className="top-nav">
          <button
            className={`nav-link ${activeTab === "explore" ? "active" : ""}`}
            onClick={() => onTabChange("explore")}
          >
            📚 Courses
          </button>
          <button
            className={`nav-link ${activeTab === "problems" ? "active" : ""}`}
            onClick={() => onTabChange("problems")}
          >
            💡 Practice
          </button>
          <button
            className={`nav-link ${activeTab === "contest" ? "active" : ""}`}
            onClick={() => onTabChange("contest")}
          >
            🏆 Contests
          </button>
          <button
            className={`nav-link ${activeTab === "interview" ? "active" : ""}`}
            onClick={() => onTabChange("interview")}
          >
            🎯 Interview Prep
          </button>
          <button
            className={`nav-link ${activeTab === "discuss" ? "active" : ""}`}
            onClick={() => onTabChange("discuss")}
          >
            💬 Community
          </button>
          <button
            className={`nav-link ${
              activeTab === "leaderboard" ? "active" : ""
            }`}
            onClick={() => onTabChange("leaderboard")}
          >
            📊 Leaderboard
          </button>
        </nav>
      )}

      {/* Content based on active tab */}
      {activeTab === "home" && (
        <>
          {/* Welcome Banner */}
          <div className="welcome-banner">
            <h1 className="welcome-title">
              Welcome back, {userSettings?.displayName || "Student"}! 👋
            </h1>
            <p className="welcome-subtitle">
              Ready to continue your learning journey?
            </p>
          </div>

          {/* Stats Grid - Top Row */}
          <div className="stats-grid">
            <div className="stat-card psit-coins">
              <div className="stat-icon psit-coin-icon">
                <img
                  src="/assets/psit-coin.png"
                  alt="PSIT Coin"
                  className="coin-image"
                />
              </div>
              <div className="stat-content">
                <div className="stat-label">PSIT COINS</div>
                <div className="stat-value">10</div>
                <div className="stat-change">↑ +0 all time</div>
              </div>
            </div>

            <div className="stat-card problems-solved">
              <div className="stat-icon">
                <span>{"</>"}</span>
              </div>
              <div className="stat-content">
                <div className="stat-label">PROBLEMS SOLVED</div>
                <div className="stat-breakdown">
                  <span className="easy">0 Easy</span>
                  <span className="medium">0 Med</span>
                  <span className="hard">0 Hard</span>
                </div>
              </div>
            </div>

            <div className="stat-card current-streak">
              <div className="stat-icon">
                <span>🔥</span>
              </div>
              <div className="stat-content">
                <div className="stat-label">CURRENT STREAK</div>
                <div className="stat-value">0</div>
              </div>
            </div>

            <div className="stat-card achievements">
              <div className="stat-icon">
                <span>🏆</span>
              </div>
              <div className="stat-content">
                <div className="stat-label">ACHIEVEMENTS</div>
                <div className="stat-value">0</div>
              </div>
            </div>
          </div>

          {/* Stats Grid - Bottom Row */}
          <div className="stats-grid-bottom">
            <div className="stat-card global-rank">
              <div className="stat-icon">
                <span>🏅</span>
              </div>
              <div className="stat-content">
                <div className="stat-label">GLOBAL RANK</div>
                <div className="stat-change green">↑ Top 10%</div>
              </div>
            </div>

            <div className="stat-card weekly-goal">
              <div className="stat-icon">
                <span>🎯</span>
              </div>
              <div className="stat-content">
                <div className="stat-label">WEEKLY GOAL</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "0%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Sections */}
          <div className="activity-grid">
            <div className="activity-section weekly-activity">
              <div className="activity-header">
                <h3>📈 Weekly Activity</h3>
                <span className="activity-meta">1 problems this week</span>
              </div>
              <div className="activity-chart">
                <div className="chart-bar">
                  <div className="bar-fill" style={{ height: "0%" }}></div>
                  <span className="bar-label">Thu</span>
                  <span className="bar-value">0</span>
                </div>
                <div className="chart-bar">
                  <div className="bar-fill" style={{ height: "0%" }}></div>
                  <span className="bar-label">Fri</span>
                  <span className="bar-value">0</span>
                </div>
                <div className="chart-bar">
                  <div className="bar-fill" style={{ height: "0%" }}></div>
                  <span className="bar-label">Sat</span>
                  <span className="bar-value">0</span>
                </div>
                <div className="chart-bar">
                  <div className="bar-fill" style={{ height: "0%" }}></div>
                  <span className="bar-label">Sun</span>
                  <span className="bar-value">0</span>
                </div>
                <div className="chart-bar">
                  <div className="bar-fill" style={{ height: "0%" }}></div>
                  <span className="bar-label">Mon</span>
                  <span className="bar-value">0</span>
                </div>
                <div className="chart-bar">
                  <div className="bar-fill" style={{ height: "0%" }}></div>
                  <span className="bar-label">Tue</span>
                  <span className="bar-value">0</span>
                </div>
                <div className="chart-bar">
                  <div className="bar-fill" style={{ height: "100%" }}></div>
                  <span className="bar-label">Wed</span>
                  <span className="bar-value">1</span>
                </div>
              </div>
            </div>

            <div className="activity-section recent-activity">
              <div className="activity-header">
                <h3>🕐 Recent Activity</h3>
                <span className="activity-meta">Last 5 actions</span>
              </div>
              <div className="recent-list">
                <div className="recent-item">
                  <div className="recent-info">
                    <div className="recent-title">Activity</div>
                    <div className="recent-time">51m ago</div>
                  </div>
                  <div className="recent-coins">+10</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "problems" && <Problems userSettings={userSettings} />}

      {activeTab === "admin" && <AdminDashboard />}

      {activeTab === "explore" && <Explore />}

      {activeTab === "interview" && <Interview />}

      {activeTab === "discuss" && <Discuss />}

      {activeTab === "certificates" && <Certificates />}

      {activeTab === "contest" && <Contest />}

      {activeTab === "progress" && (
        <div className="progress-section">
          <h2 className="section-title">📈 Your Learning Progress</h2>
          <div className="progress-stats">
            <div className="stat-card">
              <h3>Total Courses</h3>
              <p className="stat-value">12</p>
              <span className="stat-label">Enrolled</span>
            </div>
            <div className="stat-card">
              <h3>Completed</h3>
              <p className="stat-value">3</p>
              <span className="stat-label">Courses</span>
            </div>
            <div className="stat-card">
              <h3>In Progress</h3>
              <p className="stat-value">5</p>
              <span className="stat-label">Courses</span>
            </div>
            <div className="stat-card">
              <h3>Study Streak</h3>
              <p className="stat-value">15 🔥</p>
              <span className="stat-label">Days</span>
            </div>
          </div>
          <div className="weekly-progress">
            <h3>Weekly Activity</h3>
            <div className="progress-chart">
              <div className="bar" style={{ height: "60%" }}>
                <span>Mon</span>
              </div>
              <div className="bar" style={{ height: "80%" }}>
                <span>Tue</span>
              </div>
              <div className="bar" style={{ height: "45%" }}>
                <span>Wed</span>
              </div>
              <div className="bar" style={{ height: "90%" }}>
                <span>Thu</span>
              </div>
              <div className="bar" style={{ height: "70%" }}>
                <span>Fri</span>
              </div>
              <div className="bar" style={{ height: "30%" }}>
                <span>Sat</span>
              </div>
              <div className="bar" style={{ height: "50%" }}>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="notifications-section">
          <h2 className="section-title">🔔 Notifications</h2>
          <div className="notification-list">
            <div className="notification-item unread">
              <span className="notification-icon">🎉</span>
              <div className="notification-content">
                <h4>New Achievement Unlocked!</h4>
                <p>You've earned the "Python Master" badge</p>
                <span className="notification-time">2 hours ago</span>
              </div>
            </div>
            <div className="notification-item unread">
              <span className="notification-icon">📚</span>
              <div className="notification-content">
                <h4>New Course Available</h4>
                <p>Advanced React Patterns is now live</p>
                <span className="notification-time">5 hours ago</span>
              </div>
            </div>
            <div className="notification-item">
              <span className="notification-icon">💬</span>
              <div className="notification-content">
                <h4>New Reply to Your Post</h4>
                <p>Someone replied to "Best practices for async/await"</p>
                <span className="notification-time">1 day ago</span>
              </div>
            </div>
            <div className="notification-item">
              <span className="notification-icon">🏆</span>
              <div className="notification-content">
                <h4>Contest Starting Soon</h4>
                <p>Weekly Coding Challenge begins in 3 hours</p>
                <span className="notification-time">2 days ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <SettingsSection
          userSettings={userSettings}
          onSettingsChange={onSettingsChange}
        />
      )}

      {activeTab === "marketplace" && <Marketplace />}

      {activeTab === "help" && (
        <div className="help-section">
          <h2 className="section-title">❓ Help & Support</h2>
          <div className="help-content">
            <div className="faq-section">
              <h3>Frequently Asked Questions</h3>
              <div className="faq-item">
                <h4>How do I earn PSIT coins?</h4>
                <p>
                  Complete courses, solve problems, and participate in contests
                  to earn coins!
                </p>
              </div>
              <div className="faq-item">
                <h4>Can I download my certificates?</h4>
                <p>
                  Yes! Visit the Achievements section and click on any
                  certificate to download or share it.
                </p>
              </div>
              <div className="faq-item">
                <h4>How do I join a contest?</h4>
                <p>
                  Navigate to the Contests tab in the top menu and click
                  "Register" on any upcoming contest.
                </p>
              </div>
              <div className="faq-item">
                <h4>What happens if I miss a lesson?</h4>
                <p>
                  No worries! All courses are self-paced. You can resume anytime
                  from where you left off.
                </p>
              </div>
            </div>
            <div className="contact-support">
              <h3>Still Need Help?</h3>
              <p>Our support team is here to help you!</p>
              <button className="contact-btn">📧 Contact Support</button>
              <button className="contact-btn">💬 Live Chat</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "leaderboard" && (
        <div className="leaderboard-section">
          <h2 className="section-title">📊 Leaderboard</h2>
          <div className="leaderboard-filters">
            <button className="filter-btn active">Overall</button>
            <button className="filter-btn">This Week</button>
            <button className="filter-btn">This Month</button>
          </div>
          <div className="leaderboard-list">
            <div className="leaderboard-item rank-1">
              <span className="rank">🥇 1</span>
              <div className="user-info">
                <strong>Rahul Sharma</strong>
                <span>22CS087</span>
              </div>
              <span className="score">2,450 pts</span>
            </div>
            <div className="leaderboard-item rank-2">
              <span className="rank">🥈 2</span>
              <div className="user-info">
                <strong>Priya Singh</strong>
                <span>22CS052</span>
              </div>
              <span className="score">2,380 pts</span>
            </div>
            <div className="leaderboard-item rank-3">
              <span className="rank">🥉 3</span>
              <div className="user-info">
                <strong>Amit Kumar</strong>
                <span>22CS019</span>
              </div>
              <span className="score">2,290 pts</span>
            </div>
            <div className="leaderboard-item">
              <span className="rank">4</span>
              <div className="user-info">
                <strong>Sneha Patel</strong>
                <span>23CS045</span>
              </div>
              <span className="score">2,150 pts</span>
            </div>
            <div className="leaderboard-item current-user">
              <span className="rank">12</span>
              <div className="user-info">
                <strong>Vaishnavi (You)</strong>
                <span>23CS101</span>
              </div>
              <span className="score">1,890 pts</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

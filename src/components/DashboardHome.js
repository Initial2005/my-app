import React, { useState, useEffect } from 'react';
import { getBlockchain } from '../blockchain';
import AchievementManager from '../blockchain/AchievementManager';
import StreakManager from '../blockchain/StreakManager';
import {
  TrendingUp,
  Award,
  Target,
  Zap,
  BookOpen,
  Code,
  Trophy,
  Flame,
  Coins,
  Star,
  Clock,
  Calendar,
  ArrowUp,
} from 'lucide-react';
import './DashboardHome.css';

const DashboardHome = ({ userSettings }) => {
  const [blockchain] = useState(() => getBlockchain());
  const [achievementManager] = useState(() => new AchievementManager());
  const [streakManager] = useState(() => new StreakManager());
  
  const [stats, setStats] = useState({
    balance: 0,
    totalProblems: 0,
    easyProblems: 0,
    mediumProblems: 0,
    hardProblems: 0,
    achievements: 0,
    streak: 0,
    rank: 0,
    totalEarned: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line
  }, []);

  const loadDashboardData = () => {
    const userAddress = `user_${userSettings?.rollNo || 'GUEST'}`;
    
    // Get balance
    const balance = blockchain.getBalanceOfAddress(userAddress);
    
    // Get transactions
    const transactions = blockchain.getAllTransactionsForAddress(userAddress);
    const rewardTxs = transactions.filter(t => t.type === 'reward' || t.type === 'contract_reward' || t.type === 'achievement_reward');
    
    // Calculate stats
    const easyCount = rewardTxs.filter(t => t.metadata?.difficulty === 'easy').length;
    const mediumCount = rewardTxs.filter(t => t.metadata?.difficulty === 'medium').length;
    const hardCount = rewardTxs.filter(t => t.metadata?.difficulty === 'hard').length;
    
    const totalEarned = rewardTxs.reduce((sum, tx) => sum + tx.amount, 0);
    
    // Get achievements
    const userAchievements = achievementManager.getUserAchievements(userAddress);
    
    // Get streak
    const streakData = streakManager.getUserStreak(userAddress);
    
    // Get recent activity (last 5 transactions)
    const recent = transactions.slice(-5).reverse().map(tx => ({
      type: tx.type,
      amount: tx.amount,
      timestamp: tx.timestamp,
      metadata: tx.metadata,
    }));
    
    // Generate weekly data (mock for now)
    const weekly = generateWeeklyData(transactions);
    
    setStats({
      balance,
      totalProblems: easyCount + mediumCount + hardCount,
      easyProblems: easyCount,
      mediumProblems: mediumCount,
      hardProblems: hardCount,
      achievements: userAchievements.length,
      streak: streakData.currentStreak,
      rank: calculateRank(balance),
      totalEarned,
    });
    
    setRecentActivity(recent);
    setWeeklyData(weekly);
  };

  const generateWeeklyData = (transactions) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    const weekData = [];
    
    for (let i = 0; i < 7; i++) {
      const dayIndex = (today - 6 + i + 7) % 7;
      const dayTxs = transactions.filter(tx => {
        const txDate = new Date(tx.timestamp);
        return txDate.getDay() === dayIndex;
      });
      
      weekData.push({
        day: days[dayIndex],
        count: dayTxs.length,
        coins: dayTxs.reduce((sum, tx) => sum + (tx.amount || 0), 0),
      });
    }
    
    return weekData;
  };

  const calculateRank = (balance) => {
    if (balance >= 5000) return 1;
    if (balance >= 2000) return 5;
    if (balance >= 1000) return 12;
    if (balance >= 500) return 25;
    return 50;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'reward': return <Code size={16} className="activity-icon reward" />;
      case 'contract_reward': return <Zap size={16} className="activity-icon bonus" />;
      case 'achievement_reward': return <Trophy size={16} className="activity-icon achievement" />;
      case 'purchase': return <Coins size={16} className="activity-icon purchase" />;
      case 'daily_bonus': return <Calendar size={16} className="activity-icon daily" />;
      default: return <Star size={16} className="activity-icon" />;
    }
  };

  const getActivityLabel = (activity) => {
    switch (activity.type) {
      case 'reward':
        return `Solved ${activity.metadata?.difficulty || ''} problem`;
      case 'contract_reward':
        return 'Smart contract bonus';
      case 'achievement_reward':
        return `Achievement: ${activity.metadata?.achievementName || 'Unlocked'}`;
      case 'purchase':
        return `Purchased: ${activity.metadata?.itemName || 'Item'}`;
      case 'daily_bonus':
        return 'Daily login bonus';
      default:
        return 'Activity';
    }
  };

  const formatTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const canClaimDaily = streakManager.canClaimDailyBonus(`user_${userSettings?.rollNo || 'GUEST'}`);

  const handleClaimDaily = () => {
    const userAddress = `user_${userSettings?.rollNo || 'GUEST'}`;
    const result = streakManager.claimDailyBonus(userAddress, blockchain);
    
    if (result.claimed) {
      blockchain.minePendingTransactions(userAddress);
      alert(`✅ ${result.message}\n+${result.amount} PSIT Coins!`);
      loadDashboardData();
    } else {
      alert(`ℹ️ ${result.message}`);
    }
  };

  const maxWeeklyCount = Math.max(...weeklyData.map(d => d.count), 1);

  return (
    <div className="dashboard-home">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome back, {userSettings?.displayName || 'Student'}! 👋
          </h1>
          <p className="hero-subtitle">
            Ready to continue your learning journey?
          </p>
        </div>
        {canClaimDaily && (
          <button className="daily-bonus-btn" onClick={handleClaimDaily}>
            <Calendar size={20} />
            Claim Daily Bonus (5 coins)
          </button>
        )}
      </div>

      {/* Main Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card highlight">
          <div className="stat-icon balance">
            <Coins size={28} />
          </div>
          <div className="stat-content">
            <h3 className="stat-label">PSIT Coins</h3>
            <p className="stat-value">{stats.balance}</p>
            <span className="stat-change positive">
              <ArrowUp size={14} />
              +{stats.totalEarned} all time
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon problems">
            <Code size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-label">Problems Solved</h3>
            <p className="stat-value">{stats.totalProblems}</p>
            <div className="stat-breakdown">
              <span className="easy">{stats.easyProblems} Easy</span>
              <span className="medium">{stats.mediumProblems} Med</span>
              <span className="hard">{stats.hardProblems} Hard</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon streak">
            <Flame size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-label">Current Streak</h3>
            <p className="stat-value">{stats.streak} days</p>
            <span className="stat-info">
              {stats.streak >= 7 ? '🔥 On fire!' : 'Keep it going!'}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon achievements">
            <Trophy size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-label">Achievements</h3>
            <p className="stat-value">{stats.achievements}</p>
            <span className="stat-info">Badges earned</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon rank">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-label">Global Rank</h3>
            <p className="stat-value">#{stats.rank}</p>
            <span className="stat-change positive">
              <ArrowUp size={14} />
              Top 10%
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon target">
            <Target size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-label">Weekly Goal</h3>
            <p className="stat-value">{weeklyData.reduce((sum, d) => sum + d.count, 0)}/20</p>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(weeklyData.reduce((sum, d) => sum + d.count, 0) / 20) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="content-grid">
        {/* Weekly Activity Chart */}
        <div className="chart-card">
          <div className="card-header">
            <h3>
              <TrendingUp size={20} />
              Weekly Activity
            </h3>
            <span className="card-info">{weeklyData.reduce((sum, d) => d.count + sum, 0)} problems this week</span>
          </div>
          <div className="chart-container">
            {weeklyData.map((day, idx) => (
              <div key={idx} className="chart-bar-wrapper">
                <div className="chart-bar-container">
                  <div 
                    className="chart-bar" 
                    style={{ height: `${(day.count / maxWeeklyCount) * 100}%` }}
                    title={`${day.count} problems, ${day.coins} coins`}
                  >
                    <span className="bar-value">{day.count}</span>
                  </div>
                </div>
                <span className="bar-label">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="activity-card">
          <div className="card-header">
            <h3>
              <Clock size={20} />
              Recent Activity
            </h3>
            <span className="card-info">Last 5 actions</span>
          </div>
          <div className="activity-list">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, idx) => (
                <div key={idx} className="activity-item">
                  {getActivityIcon(activity.type)}
                  <div className="activity-details">
                    <p className="activity-label">{getActivityLabel(activity)}</p>
                    <span className="activity-time">{formatTime(activity.timestamp)}</span>
                  </div>
                  <span className={`activity-amount ${activity.amount > 0 ? 'positive' : 'negative'}`}>
                    {activity.amount > 0 ? '+' : ''}{activity.amount}
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <Star size={48} />
                <p>No activity yet</p>
                <span>Start solving problems to see your progress!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn primary">
            <Code size={20} />
            Solve Problems
          </button>
          <button className="action-btn">
            <BookOpen size={20} />
            Browse Courses
          </button>
          <button className="action-btn">
            <Coins size={20} />
            Visit Marketplace
          </button>
          <button className="action-btn">
            <Trophy size={20} />
            View Achievements
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

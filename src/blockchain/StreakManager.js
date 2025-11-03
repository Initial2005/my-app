// Streak Management System
import Transaction from "./Transaction";

export class StreakManager {
  constructor() {
    this.streakKey = "userStreaks";
  }

  // Update streak when user solves a problem
  updateStreak(userAddress) {
    const streaks = this.getStreaks();
    const userStreak = streaks[userAddress] || this.createNewStreak();
    const today = this.getToday();

    // If already solved today, no update needed
    if (userStreak.lastSolvedDate === today) {
      return userStreak;
    }

    const yesterday = this.getYesterday();

    // Check if solving consecutive days
    if (userStreak.lastSolvedDate === yesterday) {
      userStreak.currentStreak += 1;
      userStreak.longestStreak = Math.max(
        userStreak.longestStreak,
        userStreak.currentStreak
      );
    } else if (userStreak.lastSolvedDate !== today) {
      // Streak broken
      userStreak.currentStreak = 1;
    }

    userStreak.lastSolvedDate = today;
    userStreak.totalSolvedDays += 1;

    streaks[userAddress] = userStreak;
    this.saveStreaks(streaks);

    return userStreak;
  }

  // Get daily login bonus
  claimDailyBonus(userAddress, blockchain) {
    const dailyLogins = JSON.parse(localStorage.getItem("dailyLogins") || "{}");
    const today = this.getToday();

    if (dailyLogins[userAddress] === today) {
      return { claimed: false, message: "Already claimed today" };
    }

    // Award 5 coins for daily login
    try {
      const bonusTx = new Transaction(null, userAddress, 5, "daily_bonus", {
        date: today,
      });
      blockchain.addTransaction(bonusTx);
    } catch (e) {
      console.warn("Failed to record daily bonus tx:", e);
    }

    dailyLogins[userAddress] = today;
    localStorage.setItem("dailyLogins", JSON.stringify(dailyLogins));

    return { claimed: true, amount: 5, message: "Daily bonus claimed!" };
  }

  // Check if user can claim daily bonus
  canClaimDailyBonus(userAddress) {
    const dailyLogins = JSON.parse(localStorage.getItem("dailyLogins") || "{}");
    const today = this.getToday();
    return dailyLogins[userAddress] !== today;
  }

  // Get streak bonus multiplier
  getStreakMultiplier(userAddress) {
    const streak = this.getUserStreak(userAddress);

    if (streak.currentStreak >= 30) return 2.0;
    if (streak.currentStreak >= 14) return 1.5;
    if (streak.currentStreak >= 7) return 1.3;
    if (streak.currentStreak >= 3) return 1.1;
    return 1.0;
  }

  getUserStreak(userAddress) {
    const streaks = this.getStreaks();
    return streaks[userAddress] || this.createNewStreak();
  }

  createNewStreak() {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastSolvedDate: null,
      totalSolvedDays: 0,
    };
  }

  getStreaks() {
    return JSON.parse(localStorage.getItem(this.streakKey) || "{}");
  }

  saveStreaks(streaks) {
    localStorage.setItem(this.streakKey, JSON.stringify(streaks));
  }

  getToday() {
    return new Date().toISOString().split("T")[0];
  }

  getYesterday() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
  }

  // Get streak statistics
  getStreakStats(userAddress) {
    const streak = this.getUserStreak(userAddress);
    const multiplier = this.getStreakMultiplier(userAddress);

    return {
      ...streak,
      multiplier,
      nextMilestone: this.getNextMilestone(streak.currentStreak),
    };
  }

  getNextMilestone(currentStreak) {
    const milestones = [3, 7, 14, 30];
    for (const milestone of milestones) {
      if (currentStreak < milestone) {
        return { days: milestone, daysRemaining: milestone - currentStreak };
      }
    }
    return null;
  }
}

export default StreakManager;

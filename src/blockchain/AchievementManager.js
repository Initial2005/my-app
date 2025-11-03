// Achievement System - NFT-style badges on blockchain

export const ACHIEVEMENTS = {
  // Problem-solving achievements
  first_10: {
    id: "first_10",
    name: "Getting Started",
    description: "Solved your first 10 problems",
    icon: "🎯",
    rarity: "common",
    reward: 100,
  },
  half_century: {
    id: "half_century",
    name: "Half Century",
    description: "Solved 50 problems",
    icon: "🏅",
    rarity: "rare",
    reward: 500,
  },
  century: {
    id: "century",
    name: "Century",
    description: "Solved 100 problems",
    icon: "👑",
    rarity: "epic",
    reward: 1000,
  },

  // Streak achievements
  week_warrior: {
    id: "week_warrior",
    name: "Week Warrior",
    description: "7-day solving streak",
    icon: "🔥",
    rarity: "rare",
    reward: 150,
  },
  month_master: {
    id: "month_master",
    name: "Month Master",
    description: "30-day solving streak",
    icon: "🌟",
    rarity: "epic",
    reward: 1000,
  },

  // Difficulty achievements
  easy_expert: {
    id: "easy_expert",
    name: "Easy Expert",
    description: "Solved 20 easy problems",
    icon: "🟢",
    rarity: "common",
    reward: 50,
  },
  medium_master: {
    id: "medium_master",
    name: "Medium Master",
    description: "Solved 20 medium problems",
    icon: "🟡",
    rarity: "rare",
    reward: 200,
  },
  hard_hero: {
    id: "hard_hero",
    name: "Hard Hero",
    description: "Solved 20 hard problems",
    icon: "🔴",
    rarity: "epic",
    reward: 500,
  },

  // Speed achievements
  speed_demon: {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Solved a problem in under 5 minutes",
    icon: "⚡",
    rarity: "rare",
    reward: 100,
  },

  // Special achievements
  night_owl: {
    id: "night_owl",
    name: "Night Owl",
    description: "Solved 10 problems after midnight",
    icon: "🦉",
    rarity: "rare",
    reward: 150,
  },
  early_bird: {
    id: "early_bird",
    name: "Early Bird",
    description: "Solved 10 problems before 6 AM",
    icon: "🐦",
    rarity: "rare",
    reward: 150,
  },
  weekend_warrior: {
    id: "weekend_warrior",
    name: "Weekend Warrior",
    description: "Solved 20 problems on weekends",
    icon: "🎉",
    rarity: "common",
    reward: 100,
  },

  // Course achievements
  course_complete: {
    id: "course_complete",
    name: "Course Graduate",
    description: "Completed your first course",
    icon: "🎓",
    rarity: "common",
    reward: 200,
  },
  all_courses: {
    id: "all_courses",
    name: "Master Scholar",
    description: "Completed all available courses",
    icon: "📚",
    rarity: "legendary",
    reward: 2000,
  },

  // Social achievements
  helpful: {
    id: "helpful",
    name: "Helpful Hand",
    description: "Helped 10 other students",
    icon: "🤝",
    rarity: "rare",
    reward: 300,
  },
};

export class AchievementManager {
  constructor() {
    this.achievements = ACHIEVEMENTS;
  }

  // Check and unlock achievements based on user progress
  checkAchievements(userAddress, blockchain) {
    const unlocked = [];
    const userStats = this.getUserStats(userAddress, blockchain);

    // Problem count achievements
    if (
      userStats.totalProblems >= 10 &&
      !this.hasAchievement(userAddress, "first_10")
    ) {
      this.unlockAchievement(userAddress, "first_10", blockchain);
      unlocked.push("first_10");
    }
    if (
      userStats.totalProblems >= 50 &&
      !this.hasAchievement(userAddress, "half_century")
    ) {
      this.unlockAchievement(userAddress, "half_century", blockchain);
      unlocked.push("half_century");
    }
    if (
      userStats.totalProblems >= 100 &&
      !this.hasAchievement(userAddress, "century")
    ) {
      this.unlockAchievement(userAddress, "century", blockchain);
      unlocked.push("century");
    }

    // Difficulty achievements
    if (
      userStats.easyProblems >= 20 &&
      !this.hasAchievement(userAddress, "easy_expert")
    ) {
      this.unlockAchievement(userAddress, "easy_expert", blockchain);
      unlocked.push("easy_expert");
    }
    if (
      userStats.mediumProblems >= 20 &&
      !this.hasAchievement(userAddress, "medium_master")
    ) {
      this.unlockAchievement(userAddress, "medium_master", blockchain);
      unlocked.push("medium_master");
    }
    if (
      userStats.hardProblems >= 20 &&
      !this.hasAchievement(userAddress, "hard_hero")
    ) {
      this.unlockAchievement(userAddress, "hard_hero", blockchain);
      unlocked.push("hard_hero");
    }

    return unlocked;
  }

  getUserStats(userAddress, blockchain) {
    const transactions = blockchain.getAllTransactionsForAddress(userAddress);
    const rewardTxs = transactions.filter((t) => t.type === "reward");

    return {
      totalProblems: rewardTxs.length,
      easyProblems: rewardTxs.filter((t) => t.metadata?.difficulty === "easy")
        .length,
      mediumProblems: rewardTxs.filter(
        (t) => t.metadata?.difficulty === "medium"
      ).length,
      hardProblems: rewardTxs.filter((t) => t.metadata?.difficulty === "hard")
        .length,
    };
  }

  hasAchievement(userAddress, achievementId) {
    const achievements = JSON.parse(
      localStorage.getItem("userAchievements") || "{}"
    );
    return achievements[userAddress]?.includes(achievementId) || false;
  }

  unlockAchievement(userAddress, achievementId, blockchain) {
    const achievements = JSON.parse(
      localStorage.getItem("userAchievements") || "{}"
    );
    if (!achievements[userAddress]) {
      achievements[userAddress] = [];
    }
    if (!achievements[userAddress].includes(achievementId)) {
      achievements[userAddress].push(achievementId);
      localStorage.setItem("userAchievements", JSON.stringify(achievements));

      // Award coins for achievement
      const achievement = this.achievements[achievementId];
      if (achievement && achievement.reward) {
        blockchain.createTransaction({
          fromAddress: null,
          toAddress: userAddress,
          amount: achievement.reward,
          type: "achievement_reward",
          metadata: {
            achievementId,
            achievementName: achievement.name,
          },
        });
      }

      // Store achievement on blockchain
      blockchain.createTransaction({
        fromAddress: "system",
        toAddress: userAddress,
        amount: 0,
        type: "achievement_unlock",
        metadata: {
          achievementId,
          achievementName: achievement.name,
          timestamp: Date.now(),
        },
      });
    }
  }

  getUserAchievements(userAddress) {
    const achievements = JSON.parse(
      localStorage.getItem("userAchievements") || "{}"
    );
    const userAchievementIds = achievements[userAddress] || [];

    return userAchievementIds.map((id) => ({
      ...this.achievements[id],
      unlockedAt: this.getAchievementUnlockTime(userAddress, id),
    }));
  }

  getAchievementUnlockTime(userAddress, achievementId) {
    // This would typically come from blockchain transaction history
    return Date.now(); // Placeholder
  }

  getAchievementProgress(userAddress, blockchain) {
    const stats = this.getUserStats(userAddress, blockchain);
    const progress = [];

    // Problem count progress
    progress.push({
      name: "Getting Started",
      current: stats.totalProblems,
      target: 10,
      percentage: Math.min((stats.totalProblems / 10) * 100, 100),
      unlocked: this.hasAchievement(userAddress, "first_10"),
    });
    progress.push({
      name: "Half Century",
      current: stats.totalProblems,
      target: 50,
      percentage: Math.min((stats.totalProblems / 50) * 100, 100),
      unlocked: this.hasAchievement(userAddress, "half_century"),
    });

    return progress;
  }
}

export default AchievementManager;

// Smart Contract System for PSIT Coin Blockchain
// Enables automated rules, conditional logic, and programmable rewards
import Transaction from "./Transaction";

class SmartContract {
  constructor(contractId, name, creator) {
    this.contractId = contractId;
    this.name = name;
    this.creator = creator;
    this.rules = [];
    this.isActive = true;
    this.createdAt = Date.now();
    this.executionCount = 0;
  }

  // Add a rule to the contract
  addRule(rule) {
    this.rules.push({
      id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...rule,
      createdAt: Date.now(),
    });
  }

  // Execute contract rules based on events
  execute(event, blockchain, userAddress) {
    if (!this.isActive) return null;

    const results = [];

    for (const rule of this.rules) {
      if (
        this.checkConditions(rule.conditions, event, blockchain, userAddress)
      ) {
        const result = this.executeActions(
          rule.actions,
          blockchain,
          userAddress,
          event
        );
        results.push({
          ruleId: rule.id,
          ruleName: rule.name,
          executed: true,
          result,
          timestamp: Date.now(),
        });
        this.executionCount++;
      }
    }

    return results.length > 0 ? results : null;
  }

  // Check if all conditions are met
  checkConditions(conditions, event, blockchain, userAddress) {
    return conditions.every((condition) => {
      switch (condition.type) {
        case "event_type":
          return event.type === condition.value;

        case "problem_difficulty":
          return event.difficulty === condition.value;

        case "problem_count":
          return (
            this.getUserProblemCount(blockchain, userAddress) >= condition.value
          );

        case "balance":
          return blockchain.getBalanceOfAddress(userAddress) >= condition.value;

        case "streak":
          return this.getUserStreak(userAddress) >= condition.value;

        case "time_of_day":
          const hour = new Date().getHours();
          return hour >= condition.value.start && hour <= condition.value.end;

        case "day_of_week":
          const day = new Date().getDay();
          return condition.value.includes(day);

        case "achievement":
          return this.hasAchievement(userAddress, condition.value);

        default:
          return false;
      }
    });
  }

  // Execute actions when conditions are met
  executeActions(actions, blockchain, userAddress, event) {
    const results = [];

    actions.forEach((action) => {
      switch (action.type) {
        case "reward":
          const rewardAmount = this.calculateReward(action.amount, event);
          try {
            const rewardTx = new Transaction(
              null,
              userAddress,
              rewardAmount,
              "contract_reward",
              {
                contractId: this.contractId,
                originalAmount: action.amount,
                bonusAmount: rewardAmount - action.amount,
              }
            );
            blockchain.addTransaction(rewardTx);
          } catch (e) {
            console.warn("Failed to record contract reward:", e);
          }
          results.push({ type: "reward", amount: rewardAmount });
          break;

        case "unlock_achievement":
          this.unlockAchievement(userAddress, action.achievementId);
          results.push({ type: "achievement", id: action.achievementId });
          break;

        case "apply_multiplier":
          this.applyMultiplier(userAddress, action.multiplier, action.duration);
          results.push({ type: "multiplier", value: action.multiplier });
          break;

        case "notify":
          this.sendNotification(userAddress, action.message);
          results.push({ type: "notification", message: action.message });
          break;

        default:
          break;
      }
    });

    return results;
  }

  // Calculate reward with bonuses and multipliers
  calculateReward(baseAmount, event) {
    let reward = baseAmount;

    // Apply difficulty multiplier
    const difficultyMultipliers = {
      easy: 1.0,
      medium: 1.5,
      hard: 2.0,
    };
    reward *= difficultyMultipliers[event.difficulty] || 1.0;

    // Apply user multiplier if exists
    const userMultiplier = this.getUserMultiplier(event.userAddress);
    reward *= userMultiplier;

    return Math.floor(reward);
  }

  // Helper methods
  getUserProblemCount(blockchain, userAddress) {
    const transactions =
      typeof blockchain.getTransactionsForAddress === "function"
        ? blockchain.getTransactionsForAddress(userAddress)
        : [];
    return transactions.filter((t) => t.type === "reward").length;
  }

  getUserStreak(userAddress) {
    const streakData = JSON.parse(localStorage.getItem("userStreaks") || "{}");
    return streakData[userAddress]?.currentStreak || 0;
  }

  hasAchievement(userAddress, achievementId) {
    const achievements = JSON.parse(
      localStorage.getItem("userAchievements") || "{}"
    );
    return achievements[userAddress]?.includes(achievementId) || false;
  }

  unlockAchievement(userAddress, achievementId) {
    const achievements = JSON.parse(
      localStorage.getItem("userAchievements") || "{}"
    );
    if (!achievements[userAddress]) {
      achievements[userAddress] = [];
    }
    if (!achievements[userAddress].includes(achievementId)) {
      achievements[userAddress].push(achievementId);
      localStorage.setItem("userAchievements", JSON.stringify(achievements));
    }
  }

  getUserMultiplier(userAddress) {
    const multipliers = JSON.parse(
      localStorage.getItem("userMultipliers") || "{}"
    );
    const userMult = multipliers[userAddress];

    if (userMult && userMult.expiresAt > Date.now()) {
      return userMult.value;
    }
    return 1.0;
  }

  applyMultiplier(userAddress, multiplier, duration) {
    const multipliers = JSON.parse(
      localStorage.getItem("userMultipliers") || "{}"
    );
    multipliers[userAddress] = {
      value: multiplier,
      expiresAt: Date.now() + duration,
    };
    localStorage.setItem("userMultipliers", JSON.stringify(multipliers));
  }

  sendNotification(userAddress, message) {
    const notifications = JSON.parse(
      localStorage.getItem("userNotifications") || "{}"
    );
    if (!notifications[userAddress]) {
      notifications[userAddress] = [];
    }
    notifications[userAddress].push({
      message,
      timestamp: Date.now(),
      read: false,
    });
    localStorage.setItem("userNotifications", JSON.stringify(notifications));
  }

  // Deactivate contract
  deactivate() {
    this.isActive = false;
  }

  // Activate contract
  activate() {
    this.isActive = true;
  }

  // Get contract summary
  getSummary() {
    return {
      contractId: this.contractId,
      name: this.name,
      creator: this.creator,
      ruleCount: this.rules.length,
      isActive: this.isActive,
      executionCount: this.executionCount,
      createdAt: this.createdAt,
    };
  }
}

// Pre-defined smart contracts
export const createDefaultContracts = () => {
  const contracts = [];

  // 1. Milestone Bonus Contract
  const milestoneContract = new SmartContract(
    "milestone_bonus",
    "Milestone Achievement Bonus",
    "system"
  );
  milestoneContract.addRule({
    name: "10 Problems Bonus",
    conditions: [
      { type: "event_type", value: "problem_solved" },
      { type: "problem_count", value: 10 },
    ],
    actions: [
      { type: "reward", amount: 100 },
      { type: "unlock_achievement", achievementId: "first_10" },
      {
        type: "notify",
        message: "🎉 Milestone! You solved 10 problems! Bonus: 100 PSIT Coins!",
      },
    ],
  });
  milestoneContract.addRule({
    name: "50 Problems Bonus",
    conditions: [
      { type: "event_type", value: "problem_solved" },
      { type: "problem_count", value: 50 },
    ],
    actions: [
      { type: "reward", amount: 500 },
      { type: "unlock_achievement", achievementId: "half_century" },
      {
        type: "apply_multiplier",
        multiplier: 1.5,
        duration: 7 * 24 * 60 * 60 * 1000,
      }, // 7 days
      {
        type: "notify",
        message:
          "🏆 Amazing! 50 problems solved! Bonus: 500 coins + 1.5x multiplier for 7 days!",
      },
    ],
  });
  contracts.push(milestoneContract);

  // 2. Streak Bonus Contract
  const streakContract = new SmartContract(
    "streak_bonus",
    "Daily Streak Rewards",
    "system"
  );
  streakContract.addRule({
    name: "7-Day Streak Bonus",
    conditions: [
      { type: "event_type", value: "problem_solved" },
      { type: "streak", value: 7 },
    ],
    actions: [
      { type: "reward", amount: 150 },
      { type: "unlock_achievement", achievementId: "week_warrior" },
      { type: "notify", message: "🔥 7-day streak! Bonus: 150 PSIT Coins!" },
    ],
  });
  streakContract.addRule({
    name: "30-Day Streak Bonus",
    conditions: [
      { type: "event_type", value: "problem_solved" },
      { type: "streak", value: 30 },
    ],
    actions: [
      { type: "reward", amount: 1000 },
      { type: "unlock_achievement", achievementId: "month_master" },
      {
        type: "apply_multiplier",
        multiplier: 2.0,
        duration: 30 * 24 * 60 * 60 * 1000,
      },
      {
        type: "notify",
        message:
          "🌟 30-day streak! Legendary! Bonus: 1000 coins + 2x multiplier for 30 days!",
      },
    ],
  });
  contracts.push(streakContract);

  // 3. Weekend Warrior Contract
  const weekendContract = new SmartContract(
    "weekend_warrior",
    "Weekend Bonus",
    "system"
  );
  weekendContract.addRule({
    name: "Weekend Double Rewards",
    conditions: [
      { type: "event_type", value: "problem_solved" },
      { type: "day_of_week", value: [0, 6] }, // Sunday = 0, Saturday = 6
    ],
    actions: [
      { type: "reward", amount: 20 },
      { type: "notify", message: "🎉 Weekend bonus: Extra 20 PSIT Coins!" },
    ],
  });
  contracts.push(weekendContract);

  // 4. Hard Problem Master Contract
  const hardProblemContract = new SmartContract(
    "hard_master",
    "Hard Problem Master",
    "system"
  );
  hardProblemContract.addRule({
    name: "Hard Problem Streak",
    conditions: [
      { type: "event_type", value: "problem_solved" },
      { type: "problem_difficulty", value: "hard" },
    ],
    actions: [
      { type: "reward", amount: 30 },
      {
        type: "notify",
        message: "💪 Hard problem conquered! Bonus: 30 PSIT Coins!",
      },
    ],
  });
  contracts.push(hardProblemContract);

  return contracts;
};

export default SmartContract;

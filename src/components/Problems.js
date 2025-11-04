import React, { useState } from "react";
import { Users, TrendingUp, ExternalLink } from "lucide-react";
import CodeEditor from "./CodeEditor";
import { getBlockchain } from "../blockchain";
import Wallet from "../blockchain/Wallet";
import AchievementManager from "../blockchain/AchievementManager";
import StreakManager from "../blockchain/StreakManager";
import "./Problems.css";

const Problems = ({ userSettings }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [blockchain] = useState(() => getBlockchain());
  const [userWallet] = useState(
    () =>
      new Wallet(
        userSettings?.rollNo || "GUEST",
        userSettings?.displayName || "Guest User"
      )
  );
  const [achievementManager] = useState(() => new AchievementManager());
  const [streakManager] = useState(() => new StreakManager());

  const handleProblemSolved = (problem) => {
    try {
      const userAddress = userWallet.address;

      // Update streak
      const streak = streakManager.updateStreak(userAddress);

      // Award base coins for completing the problem
      blockchain.awardCoinsForProblem(userAddress, problem.difficulty, problem);

      // Check for new achievements
      const newAchievements = achievementManager.checkAchievements(
        userAddress,
        blockchain
      );

      // Mine the pending transactions
      blockchain.minePendingTransactions(userAddress);

      // Build success message
      const baseReward =
        blockchain.rewardMapping[problem.difficulty.toLowerCase()] || 10;
      const streakMultiplier = streakManager.getStreakMultiplier(userAddress);
      const newBalance = blockchain.getBalanceOfAddress(userAddress);

      let message = `🎉 Problem Solved!\n\n`;
      message += `Base Reward: ${baseReward} PSIT Coins\n`;

      if (streakMultiplier > 1.0) {
        message += `Streak Bonus: ${streakMultiplier}x (${streak.currentStreak} days) 🔥\n`;
      }

      if (newAchievements.length > 0) {
        message += `\n🏆 New Achievements:\n`;
        newAchievements.forEach((achId) => {
          const ach = achievementManager.achievements[achId];
          message += `  ${ach.icon} ${ach.name}\n`;
        });
      }

      message += `\n💰 New Balance: ${newBalance} PSIT Coins`;

      alert(message);
    } catch (error) {
      console.error("Error awarding coins:", error);
      alert("Error processing reward. Please try again.");
    }
  };

  const problems = [
    {
      id: 1,
      title: "Two Sum",
      platform: "LeetCode",
      difficulty: "Easy",
      acceptance: "47.2%",
      description:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      tags: ["Array", "Hash Table"],
      url: "https://leetcode.com/problems/two-sum/",
      testInputs: [
        [2, 7, 11, 15],
        [3, 2, 4],
        [3, 3],
      ],
      testOutputs: [
        [0, 1],
        [1, 2],
        [0, 1],
      ],
    },
    {
      id: 2,
      title: "Valid Parentheses",
      platform: "LeetCode",
      difficulty: "Easy",
      acceptance: "40.1%",
      description:
        "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      tags: ["String", "Stack"],
      url: "https://leetcode.com/problems/valid-parentheses/",
    },
    {
      id: 3,
      title: "Merge Two Sorted Lists",
      platform: "LeetCode",
      difficulty: "Easy",
      acceptance: "60.1%",
      description:
        "Merge two sorted linked lists and return it as a sorted list.",
      tags: ["Linked List", "Recursion"],
      url: "https://leetcode.com/problems/merge-two-sorted-lists/",
    },
    {
      id: 4,
      title: "Maximum Subarray",
      platform: "LeetCode",
      difficulty: "Medium",
      acceptance: "32.8%",
      description:
        "Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.",
      tags: ["Array", "Dynamic Programming"],
      url: "https://leetcode.com/problems/maximum-subarray/",
    },
    {
      id: 5,
      title: "Longest Palindromic Substring",
      platform: "LeetCode",
      difficulty: "Medium",
      acceptance: "33.2%",
      description:
        "Given a string s, return the longest palindromic substring in s.",
      tags: ["String", "Dynamic Programming"],
      url: "https://leetcode.com/problems/longest-palindromic-substring/",
    },
    {
      id: 6,
      title: "Binary Tree Inorder Traversal",
      platform: "LeetCode",
      difficulty: "Easy",
      acceptance: "75.4%",
      description:
        "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
      tags: ["Tree", "Stack"],
      url: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
    },
    {
      id: 7,
      title: "Climbing Stairs",
      platform: "LeetCode",
      difficulty: "Easy",
      acceptance: "52.1%",
      description:
        "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps.",
      tags: ["Dynamic Programming"],
      url: "https://leetcode.com/problems/climbing-stairs/",
    },
    {
      id: 8,
      title: "Reverse Linked List",
      platform: "LeetCode",
      difficulty: "Easy",
      acceptance: "73.2%",
      description:
        "Given the head of a singly linked list, reverse the list, and return the reversed list.",
      tags: ["Linked List", "Recursion"],
      url: "https://leetcode.com/problems/reverse-linked-list/",
    },
    {
      id: 9,
      title: "Container With Most Water",
      platform: "LeetCode",
      difficulty: "Medium",
      acceptance: "54.3%",
      description:
        "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
      tags: ["Array", "Two Pointers"],
      url: "https://leetcode.com/problems/container-with-most-water/",
    },
    {
      id: 10,
      title: "3Sum",
      platform: "LeetCode",
      difficulty: "Medium",
      acceptance: "33.8%",
      description:
        "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
      tags: ["Array", "Two Pointers"],
      url: "https://leetcode.com/problems/3sum/",
    },
    {
      id: 11,
      title: "Array Manipulation",
      platform: "HackerRank",
      difficulty: "Hard",
      acceptance: "28.5%",
      description:
        "Starting with a 1-indexed array of zeros and a list of operations, for each operation add a value to each of the array element between two given indices.",
      tags: ["Array", "Prefix Sum"],
      url: "https://www.hackerrank.com/challenges/crush/problem",
    },
    {
      id: 12,
      title: "Sherlock and Anagrams",
      platform: "HackerRank",
      difficulty: "Medium",
      acceptance: "45.2%",
      description:
        "Two strings are anagrams of each other if the letters of one string can be rearranged to form the other string.",
      tags: ["String", "Hash Table"],
      url: "https://www.hackerrank.com/challenges/sherlock-and-anagrams/problem",
    },
  ];

  const filteredProblems =
    selectedDifficulty === "all"
      ? problems
      : problems.filter(
          (problem) => problem.difficulty.toLowerCase() === selectedDifficulty
        );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "#10b981";
      case "medium":
        return "#f59e0b";
      case "hard":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case "LeetCode":
        return "#ffa116";
      case "HackerRank":
        return "#00ba64";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="problems-container">
      <div className="problems-header">
        <div>
          <h2 className="problems-title">Coding Problems</h2>
          <p className="problems-subtitle">
            Solve problems and earn PSIT Coins!
          </p>
        </div>
      </div>
      <div className="filters-row">
        <div className="difficulty-filters">
          <button
            className={`filter-btn ${
              selectedDifficulty === "all" ? "active" : ""
            }`}
            onClick={() => setSelectedDifficulty("all")}
          >
            All
          </button>
          <button
            className={`filter-btn ${
              selectedDifficulty === "easy" ? "active" : ""
            }`}
            onClick={() => setSelectedDifficulty("easy")}
          >
            Easy
          </button>
          <button
            className={`filter-btn ${
              selectedDifficulty === "medium" ? "active" : ""
            }`}
            onClick={() => setSelectedDifficulty("medium")}
          >
            Medium
          </button>
          <button
            className={`filter-btn ${
              selectedDifficulty === "hard" ? "active" : ""
            }`}
            onClick={() => setSelectedDifficulty("hard")}
          >
            Hard
          </button>
        </div>
      </div>

      <div className="problems-grid">
        {filteredProblems.map((problem) => (
          <div key={problem.id} className="problem-card">
            <div className="problem-header">
              <h3 className="problem-title">{problem.title}</h3>
              <div className="problem-badges">
                <span
                  className="platform-badge"
                  style={{
                    backgroundColor: getPlatformColor(problem.platform),
                  }}
                >
                  {problem.platform}
                </span>
                <span
                  className="difficulty-badge"
                  style={{
                    backgroundColor: getDifficultyColor(problem.difficulty),
                  }}
                >
                  {problem.difficulty}
                </span>
              </div>
            </div>

            <p className="problem-description">{problem.description}</p>

            <div className="problem-stats">
              <div className="stat">
                <TrendingUp size={16} />
                <span>{problem.acceptance}</span>
              </div>
              <div className="stat">
                <Users size={16} />
                <span>Popular</span>
              </div>
            </div>

            <div className="problem-tags">
              {problem.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>

            <button
              className="solve-btn"
              onClick={() => setSelectedProblem(problem)}
            >
              <ExternalLink size={16} />
              Solve Problem
            </button>
          </div>
        ))}
      </div>

      {selectedProblem && (
        <CodeEditor
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
          onProblemSolved={() => handleProblemSolved(selectedProblem)}
        />
      )}
    </div>
  );
};

export default Problems;

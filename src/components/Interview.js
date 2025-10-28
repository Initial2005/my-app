import React, { useState } from "react";
import "./Interview.css";
import { Code, TrendingUp, Filter } from "lucide-react";

const Interview = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");

  const interviewQuestions = [
    {
      id: 1,
      title: "Two Sum",
      source: "leetcode",
      difficulty: "easy",
      topics: ["Array", "Hash Table"],
      acceptanceRate: "49.2%",
      companies: ["Google", "Amazon", "Microsoft"],
      description:
        "Given an array of integers, return indices of two numbers that add up to a specific target.",
    },
    {
      id: 2,
      title: "Reverse a Linked List",
      source: "leetcode",
      difficulty: "easy",
      topics: ["Linked List", "Recursion"],
      acceptanceRate: "72.8%",
      companies: ["Facebook", "Apple", "Amazon"],
      description: "Reverse a singly linked list iteratively or recursively.",
    },
    {
      id: 3,
      title: "Valid Parentheses",
      source: "leetcode",
      difficulty: "easy",
      topics: ["Stack", "String"],
      acceptanceRate: "40.1%",
      companies: ["Amazon", "Bloomberg", "Facebook"],
      description:
        "Check if a string containing brackets is valid with proper opening and closing.",
    },
    {
      id: 4,
      title: "Merge Two Sorted Lists",
      source: "leetcode",
      difficulty: "easy",
      topics: ["Linked List", "Recursion"],
      acceptanceRate: "61.4%",
      companies: ["Amazon", "Microsoft", "Adobe"],
      description: "Merge two sorted linked lists into one sorted linked list.",
    },
    {
      id: 5,
      title: "Binary Search",
      source: "leetcode",
      difficulty: "easy",
      topics: ["Array", "Binary Search"],
      acceptanceRate: "55.6%",
      companies: ["Google", "Amazon", "Facebook"],
      description:
        "Implement binary search algorithm to find target in sorted array.",
    },
    {
      id: 6,
      title: "LRU Cache",
      source: "leetcode",
      difficulty: "medium",
      topics: ["Design", "Hash Table", "Linked List"],
      acceptanceRate: "41.3%",
      companies: ["Amazon", "Google", "Microsoft"],
      description:
        "Design and implement a Least Recently Used (LRU) cache data structure.",
    },
    {
      id: 7,
      title: "Longest Substring Without Repeating Characters",
      source: "leetcode",
      difficulty: "medium",
      topics: ["String", "Sliding Window", "Hash Table"],
      acceptanceRate: "33.8%",
      companies: ["Amazon", "Google", "Bloomberg"],
      description:
        "Find the length of the longest substring without repeating characters.",
    },
    {
      id: 8,
      title: "3Sum",
      source: "leetcode",
      difficulty: "medium",
      topics: ["Array", "Two Pointers", "Sorting"],
      acceptanceRate: "32.4%",
      companies: ["Facebook", "Amazon", "Microsoft"],
      description: "Find all unique triplets in array that sum to zero.",
    },
    {
      id: 9,
      title: "Product of Array Except Self",
      source: "leetcode",
      difficulty: "medium",
      topics: ["Array", "Prefix Sum"],
      acceptanceRate: "64.2%",
      companies: ["Amazon", "Facebook", "Apple"],
      description:
        "Return array where each element is product of all elements except itself.",
    },
    {
      id: 10,
      title: "Coin Change",
      source: "leetcode",
      difficulty: "medium",
      topics: ["Dynamic Programming", "BFS"],
      acceptanceRate: "42.1%",
      companies: ["Amazon", "Google", "Uber"],
      description:
        "Find minimum number of coins needed to make up a given amount.",
    },
    {
      id: 11,
      title: "Array Manipulation",
      source: "hackerrank",
      difficulty: "hard",
      topics: ["Array", "Prefix Sum"],
      acceptanceRate: "28.5%",
      companies: ["Amazon", "Goldman Sachs"],
      description:
        "Perform range updates on an array and find the maximum value.",
    },
    {
      id: 12,
      title: "Roads and Libraries",
      source: "hackerrank",
      difficulty: "medium",
      topics: ["Graph", "Union Find"],
      acceptanceRate: "45.2%",
      companies: ["Amazon", "Microsoft"],
      description: "Calculate minimum cost to provide libraries to all cities.",
    },
    {
      id: 13,
      title: "Median of Two Sorted Arrays",
      source: "leetcode",
      difficulty: "hard",
      topics: ["Array", "Binary Search", "Divide and Conquer"],
      acceptanceRate: "36.7%",
      companies: ["Google", "Amazon", "Microsoft"],
      description:
        "Find the median of two sorted arrays with optimal time complexity.",
    },
    {
      id: 14,
      title: "Trapping Rain Water",
      source: "leetcode",
      difficulty: "hard",
      topics: ["Array", "Two Pointers", "Stack"],
      acceptanceRate: "58.9%",
      companies: ["Amazon", "Google", "Bloomberg"],
      description: "Calculate how much rainwater can be trapped between bars.",
    },
    {
      id: 15,
      title: "Count Triplets",
      source: "hackerrank",
      difficulty: "medium",
      topics: ["Array", "Hash Table", "Math"],
      acceptanceRate: "52.3%",
      companies: ["Amazon", "Facebook"],
      description:
        "Count triplets forming a geometric progression in an array.",
    },
  ];

  const filteredQuestions = interviewQuestions.filter((q) => {
    const difficultyMatch =
      selectedDifficulty === "all" || q.difficulty === selectedDifficulty;
    const sourceMatch = selectedSource === "all" || q.source === selectedSource;
    return difficultyMatch && sourceMatch;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "#00D4AA";
      case "medium":
        return "#FFC107";
      case "hard":
        return "#FF5252";
      default:
        return "#b7c3d6";
    }
  };

  return (
    <div className="interview-container">
      <div className="interview-header">
        <div>
          <h2 className="interview-title">Interview Questions</h2>
          <p className="interview-subtitle">
            Practice problems from LeetCode & HackerRank
          </p>
        </div>
        <div className="interview-stats">
          <div className="stat-item">
            <Code size={20} />
            <span>{filteredQuestions.length} Problems</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <Filter size={16} />
          <span>Difficulty:</span>
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

        <div className="filter-group">
          <span>Source:</span>
          <button
            className={`filter-btn ${selectedSource === "all" ? "active" : ""}`}
            onClick={() => setSelectedSource("all")}
          >
            All
          </button>
          <button
            className={`filter-btn ${
              selectedSource === "leetcode" ? "active" : ""
            }`}
            onClick={() => setSelectedSource("leetcode")}
          >
            LeetCode
          </button>
          <button
            className={`filter-btn ${
              selectedSource === "hackerrank" ? "active" : ""
            }`}
            onClick={() => setSelectedSource("hackerrank")}
          >
            HackerRank
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="questions-grid">
        {filteredQuestions.map((question) => (
          <div key={question.id} className="question-card">
            <div className="question-header">
              <div className="question-title-row">
                <h3 className="question-title">{question.title}</h3>
                <span
                  className="difficulty-badge"
                  style={{
                    backgroundColor: getDifficultyColor(question.difficulty),
                  }}
                >
                  {question.difficulty}
                </span>
              </div>
              <span className={`source-badge ${question.source}`}>
                {question.source === "leetcode" ? "LeetCode" : "HackerRank"}
              </span>
            </div>

            <p className="question-description">{question.description}</p>

            <div className="question-topics">
              {question.topics.map((topic, index) => (
                <span key={index} className="topic-tag">
                  {topic}
                </span>
              ))}
            </div>

            <div className="question-footer">
              <div className="question-meta">
                <TrendingUp size={14} />
                <span>{question.acceptanceRate}</span>
              </div>
              <div className="companies-list">
                {question.companies.slice(0, 2).map((company, index) => (
                  <span key={index} className="company-tag">
                    {company}
                  </span>
                ))}
                {question.companies.length > 2 && (
                  <span className="company-tag">
                    +{question.companies.length - 2}
                  </span>
                )}
              </div>
            </div>

            <button className="solve-btn">Solve Problem</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Interview;

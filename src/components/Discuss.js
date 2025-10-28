import React, { useState } from "react";
import "./Discuss.css";
import {
  MessageSquare,
  ThumbsUp,
  MessageCircle,
  Users,
  TrendingUp,
  Filter,
  Search,
  Plus,
} from "lucide-react";

const Discuss = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("recent");

  const discussions = [
    {
      id: 1,
      title: "Best approach for Two Sum problem?",
      author: "Rahul Kumar",
      avatar: "RK",
      category: "solutions",
      tags: ["Array", "Hash Table", "Easy"],
      content:
        "I solved Two Sum using a nested loop but it's O(n²). Can someone explain the O(n) hash map approach?",
      replies: 12,
      likes: 24,
      views: 156,
      timestamp: "2 hours ago",
      solved: true,
    },
    {
      id: 2,
      title: "How to optimize Dynamic Programming solutions?",
      author: "Priya Sharma",
      avatar: "PS",
      category: "general",
      tags: ["Dynamic Programming", "Optimization"],
      content:
        "I'm struggling with memoization vs tabulation. When should I use which approach?",
      replies: 8,
      likes: 31,
      views: 243,
      timestamp: "4 hours ago",
      solved: false,
    },
    {
      id: 3,
      title: "LeetCode Weekly Contest 372 - Problem 3 Discussion",
      author: "Amit Patel",
      avatar: "AP",
      category: "contests",
      tags: ["Contest", "Graph", "Medium"],
      content:
        "Did anyone solve the graph problem? I'm getting TLE on test case 45. My BFS implementation seems correct...",
      replies: 15,
      likes: 18,
      views: 289,
      timestamp: "6 hours ago",
      solved: false,
    },
    {
      id: 4,
      title: "Binary Search - Common Mistakes to Avoid",
      author: "Sneha Reddy",
      avatar: "SR",
      category: "solutions",
      tags: ["Binary Search", "Tutorial"],
      content:
        "Here's a comprehensive guide on binary search pitfalls: off-by-one errors, infinite loops, and overflow issues.",
      replies: 22,
      likes: 67,
      views: 512,
      timestamp: "1 day ago",
      solved: true,
    },
    {
      id: 5,
      title: "System Design Interview Tips",
      author: "Vikram Singh",
      avatar: "VS",
      category: "interviews",
      tags: ["System Design", "Interview Prep"],
      content:
        "Sharing my experience from recent FAANG interviews. Key topics: scalability, caching, load balancing.",
      replies: 34,
      likes: 92,
      views: 678,
      timestamp: "1 day ago",
      solved: false,
    },
    {
      id: 6,
      title: "Reverse a Linked List - Recursive vs Iterative",
      author: "Neha Gupta",
      avatar: "NG",
      category: "solutions",
      tags: ["Linked List", "Recursion"],
      content:
        "Which approach is better for interviews? I find recursive more elegant but iterative uses less space.",
      replies: 19,
      likes: 41,
      views: 334,
      timestamp: "2 days ago",
      solved: true,
    },
    {
      id: 7,
      title: "Getting started with Competitive Programming",
      author: "Rohan Mehta",
      avatar: "RM",
      category: "general",
      tags: ["Beginner", "CP", "Resources"],
      content:
        "New to CP. What topics should I focus on first? Any recommended practice platforms?",
      replies: 27,
      likes: 55,
      views: 421,
      timestamp: "2 days ago",
      solved: false,
    },
    {
      id: 8,
      title: "Sliding Window Technique - Pattern Recognition",
      author: "Kavya Iyer",
      avatar: "KI",
      category: "solutions",
      tags: ["Sliding Window", "Arrays", "Medium"],
      content:
        "How do you identify when to use sliding window? Sharing a checklist that helped me recognize the pattern.",
      replies: 16,
      likes: 73,
      views: 598,
      timestamp: "3 days ago",
      solved: true,
    },
    {
      id: 9,
      title: "HackerRank vs LeetCode - Which is better?",
      author: "Arjun Desai",
      avatar: "AD",
      category: "general",
      tags: ["Discussion", "Platforms"],
      content:
        "Preparing for placements. Should I focus on HackerRank or LeetCode? What are the differences?",
      replies: 41,
      likes: 38,
      views: 723,
      timestamp: "3 days ago",
      solved: false,
    },
    {
      id: 10,
      title: "Mock Interview Experience - Google SDE Role",
      author: "Divya Nair",
      avatar: "DN",
      category: "interviews",
      tags: ["Interview", "Google", "Experience"],
      content:
        "Just completed mock interview with Pramp. Sharing the questions and my approach. Feedback welcome!",
      replies: 29,
      likes: 84,
      views: 891,
      timestamp: "4 days ago",
      solved: false,
    },
  ];

  const categories = [
    { id: "all", label: "All Discussions", icon: MessageSquare },
    { id: "solutions", label: "Solutions", icon: TrendingUp },
    { id: "general", label: "General", icon: Users },
    { id: "contests", label: "Contests", icon: MessageCircle },
    { id: "interviews", label: "Interviews", icon: MessageSquare },
  ];

  const filteredDiscussions = discussions.filter((discussion) => {
    const categoryMatch =
      selectedCategory === "all" || discussion.category === selectedCategory;
    const searchMatch =
      searchQuery === "" ||
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return categoryMatch && searchMatch;
  });

  const sortedDiscussions = [...filteredDiscussions].sort((a, b) => {
    if (selectedSort === "popular") {
      return b.likes - a.likes;
    } else if (selectedSort === "replies") {
      return b.replies - a.replies;
    }
    return 0; // recent (default order)
  });

  return (
    <div className="discuss-container">
      <div className="discuss-header">
        <div>
          <h2 className="discuss-title">Community Discussions</h2>
          <p className="discuss-subtitle">
            Share solutions, ask questions, and learn together
          </p>
        </div>
        <button className="new-discussion-btn">
          <Plus size={18} />
          New Discussion
        </button>
      </div>

      {/* Search and Filters */}
      <div className="discuss-controls">
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search discussions, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="sort-controls">
          <Filter size={16} />
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="sort-select"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="replies">Most Replies</option>
          </select>
        </div>
      </div>

      {/* Categories */}
      <div className="categories-bar">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              className={`category-btn ${
                selectedCategory === category.id ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <Icon size={16} />
              {category.label}
            </button>
          );
        })}
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <MessageSquare size={16} />
          <span>{sortedDiscussions.length} Discussions</span>
        </div>
        <div className="stat-item">
          <Users size={16} />
          <span>2.3K Members</span>
        </div>
        <div className="stat-item">
          <MessageCircle size={16} />
          <span>5.1K Replies</span>
        </div>
      </div>

      {/* Discussions List */}
      <div className="discussions-list">
        {sortedDiscussions.map((discussion) => (
          <div key={discussion.id} className="discussion-card">
            <div className="discussion-avatar">
              <div className="avatar-circle">{discussion.avatar}</div>
            </div>

            <div className="discussion-content">
              <div className="discussion-main">
                <div className="discussion-title-row">
                  <h3 className="discussion-title">{discussion.title}</h3>
                  {discussion.solved && (
                    <span className="solved-badge">✓ Solved</span>
                  )}
                </div>

                <div className="discussion-meta">
                  <span className="author-name">{discussion.author}</span>
                  <span className="separator">•</span>
                  <span className="timestamp">{discussion.timestamp}</span>
                  <span className="separator">•</span>
                  <span className={`category-label ${discussion.category}`}>
                    {discussion.category}
                  </span>
                </div>

                <p className="discussion-preview">{discussion.content}</p>

                <div className="discussion-tags">
                  {discussion.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="discussion-stats">
                <div className="stat">
                  <ThumbsUp size={16} />
                  <span>{discussion.likes}</span>
                </div>
                <div className="stat">
                  <MessageCircle size={16} />
                  <span>{discussion.replies}</span>
                </div>
                <div className="stat views">
                  <span>{discussion.views} views</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedDiscussions.length === 0 && (
        <div className="empty-state">
          <MessageSquare size={48} />
          <p>No discussions found</p>
          <span>Try adjusting your filters or search query</span>
        </div>
      )}
    </div>
  );
};

export default Discuss;

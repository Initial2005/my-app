import React, { useState } from "react";
import "./Explore.css";
import {
  Code,
  BookOpen,
  Clock,
  Users,
  Star,
  TrendingUp,
  Filter,
  Search,
  Award,
} from "lucide-react";
import CourseViewer from "./CourseViewer";

const Explore = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([1, 2, 8]); // IDs of completed courses
  const [activeCourse, setActiveCourse] = useState(null);

  const courses = [
    {
      id: 1,
      title: "Python for Beginners",
      language: "Python",
      category: "programming",
      level: "beginner",
      description:
        "Learn Python from scratch. Cover variables, loops, functions, OOP, and build real projects.",
      instructor: "Dr. Rajesh Kumar",
      duration: "8 weeks",
      lessons: 42,
      students: 12450,
      rating: 4.8,
      thumbnail: "🐍",
      topics: ["Variables", "Functions", "OOP", "File Handling"],
    },
    {
      id: 2,
      title: "Advanced JavaScript & ES6+",
      language: "JavaScript",
      category: "programming",
      level: "advanced",
      description:
        "Master modern JavaScript: async/await, promises, modules, closures, and functional programming.",
      instructor: "Priya Sharma",
      duration: "10 weeks",
      lessons: 56,
      students: 8920,
      rating: 4.9,
      thumbnail: "⚡",
      topics: ["ES6+", "Async Programming", "Closures", "Functional JS"],
    },
    {
      id: 3,
      title: "Java Programming Masterclass",
      language: "Java",
      category: "programming",
      level: "intermediate",
      description:
        "Complete Java course covering core concepts, collections, multithreading, and Spring Boot basics.",
      instructor: "Amit Verma",
      duration: "12 weeks",
      lessons: 68,
      students: 15230,
      rating: 4.7,
      thumbnail: "☕",
      topics: ["Core Java", "Collections", "Multithreading", "Spring Boot"],
    },
    {
      id: 4,
      title: "C++ Data Structures & Algorithms",
      language: "C++",
      category: "dsa",
      level: "intermediate",
      description:
        "Master DSA using C++. Arrays, linked lists, trees, graphs, dynamic programming and more.",
      instructor: "Vikram Singh",
      duration: "14 weeks",
      lessons: 75,
      students: 9870,
      rating: 4.9,
      thumbnail: "💻",
      topics: ["Arrays", "Trees", "Graphs", "DP", "Recursion"],
    },
    {
      id: 5,
      title: "Web Development with React",
      language: "JavaScript",
      category: "web",
      level: "intermediate",
      description:
        "Build modern web apps with React. Hooks, Context API, Redux, and deploy production apps.",
      instructor: "Sneha Gupta",
      duration: "10 weeks",
      lessons: 52,
      students: 11250,
      rating: 4.8,
      thumbnail: "⚛️",
      topics: ["React Hooks", "Redux", "Context API", "Deployment"],
    },
    {
      id: 6,
      title: "Go Programming for Backend",
      language: "Go",
      category: "backend",
      level: "intermediate",
      description:
        "Learn Go (Golang) for building scalable backend systems. Goroutines, channels, REST APIs.",
      instructor: "Arjun Desai",
      duration: "8 weeks",
      lessons: 45,
      students: 5640,
      rating: 4.7,
      thumbnail: "🔷",
      topics: ["Goroutines", "Channels", "REST APIs", "Microservices"],
    },
    {
      id: 7,
      title: "Rust Systems Programming",
      language: "Rust",
      category: "programming",
      level: "advanced",
      description:
        "Master Rust for systems programming. Memory safety, ownership, concurrency, and performance.",
      instructor: "Kavya Iyer",
      duration: "12 weeks",
      lessons: 58,
      students: 4320,
      rating: 4.9,
      thumbnail: "🦀",
      topics: ["Ownership", "Lifetimes", "Concurrency", "Error Handling"],
    },
    {
      id: 8,
      title: "SQL & Database Design",
      language: "SQL",
      category: "database",
      level: "beginner",
      description:
        "Learn SQL from basics to advanced queries. Database design, normalization, and optimization.",
      instructor: "Neha Reddy",
      duration: "6 weeks",
      lessons: 38,
      students: 13890,
      rating: 4.8,
      thumbnail: "🗄️",
      topics: ["Queries", "Joins", "Normalization", "Indexing"],
    },
    {
      id: 9,
      title: "TypeScript Complete Guide",
      language: "TypeScript",
      category: "programming",
      level: "intermediate",
      description:
        "Type-safe JavaScript development. Interfaces, generics, decorators, and advanced types.",
      instructor: "Rohan Mehta",
      duration: "7 weeks",
      lessons: 41,
      students: 7650,
      rating: 4.7,
      thumbnail: "📘",
      topics: ["Types", "Interfaces", "Generics", "Decorators"],
    },
    {
      id: 10,
      title: "Kotlin for Android Development",
      language: "Kotlin",
      category: "mobile",
      level: "intermediate",
      description:
        "Build Android apps with Kotlin. Jetpack Compose, MVVM architecture, and modern Android dev.",
      instructor: "Divya Nair",
      duration: "11 weeks",
      lessons: 62,
      students: 6540,
      rating: 4.8,
      thumbnail: "📱",
      topics: ["Jetpack Compose", "MVVM", "Coroutines", "Room DB"],
    },
    {
      id: 11,
      title: "PHP & Laravel Web Development",
      language: "PHP",
      category: "web",
      level: "intermediate",
      description:
        "Full-stack web development with PHP and Laravel. MVC, authentication, database, deployment.",
      instructor: "Sanjay Patel",
      duration: "9 weeks",
      lessons: 48,
      students: 5230,
      rating: 4.6,
      thumbnail: "🐘",
      topics: ["Laravel", "MVC", "Authentication", "Eloquent ORM"],
    },
    {
      id: 12,
      title: "Ruby on Rails Bootcamp",
      language: "Ruby",
      category: "web",
      level: "beginner",
      description:
        "Build web applications fast with Ruby on Rails. RESTful design, Active Record, testing.",
      instructor: "Ananya Krishnan",
      duration: "8 weeks",
      lessons: 44,
      students: 4120,
      rating: 4.7,
      thumbnail: "💎",
      topics: ["Rails", "Active Record", "RESTful APIs", "Testing"],
    },
  ];

  const categories = [
    { id: "all", label: "All Courses" },
    { id: "programming", label: "Programming" },
    { id: "web", label: "Web Development" },
    { id: "mobile", label: "Mobile Dev" },
    { id: "dsa", label: "DSA" },
    { id: "database", label: "Database" },
    { id: "backend", label: "Backend" },
  ];

  const levels = [
    { id: "all", label: "All Levels" },
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
  ];

  const filteredCourses = courses.filter((course) => {
    const categoryMatch =
      selectedCategory === "all" || course.category === selectedCategory;
    const levelMatch =
      selectedLevel === "all" || course.level === selectedLevel;
    const searchMatch =
      searchQuery === "" ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.topics.some((topic) =>
        topic.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return categoryMatch && levelMatch && searchMatch;
  });

  const getLevelColor = (level) => {
    switch (level) {
      case "beginner":
        return "#00D4AA";
      case "intermediate":
        return "#FFC107";
      case "advanced":
        return "#FF5252";
      default:
        return "#b7c3d6";
    }
  };

  const handleEnrollClick = (course) => {
    setActiveCourse(course);
  };

  const handleCloseCourse = () => {
    setActiveCourse(null);
  };

  const handleCourseComplete = (course) => {
    if (!enrolledCourses.includes(course.id)) {
      setEnrolledCourses([...enrolledCourses, course.id]);
    }
    setActiveCourse(null);
    alert(
      `Congratulations! You've completed ${course.title}!\nYour certificate is now available in the Certificates section.`
    );
  };

  if (activeCourse) {
    return (
      <CourseViewer
        course={activeCourse}
        onClose={handleCloseCourse}
        onComplete={handleCourseComplete}
      />
    );
  }

  return (
    <div className="explore-container">
      <div className="explore-header">
        <div>
          <h2 className="explore-title">Explore Courses</h2>
          <p className="explore-subtitle">
            Learn programming languages and build real-world projects
          </p>
        </div>
        <div className="explore-stats">
          <div className="stat-item">
            <BookOpen size={20} />
            <span>{filteredCourses.length} Courses</span>
          </div>
          <div className="stat-item">
            <Users size={20} />
            <span>50K+ Students</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="explore-controls">
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search courses, languages, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <Filter size={16} />
          <span>Category:</span>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`filter-btn ${
                selectedCategory === category.id ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="filter-group">
          <span>Level:</span>
          {levels.map((level) => (
            <button
              key={level.id}
              className={`filter-btn ${
                selectedLevel === level.id ? "active" : ""
              }`}
              onClick={() => setSelectedLevel(level.id)}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="courses-grid">
        {filteredCourses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-thumbnail">
              <span className="thumbnail-emoji">{course.thumbnail}</span>
              <span className="language-badge">{course.language}</span>
            </div>

            <div className="course-content">
              <div className="course-header">
                <h3 className="course-title">{course.title}</h3>
                <span
                  className="level-badge"
                  style={{ backgroundColor: getLevelColor(course.level) }}
                >
                  {course.level}
                </span>
              </div>

              <p className="course-description">{course.description}</p>

              <div className="course-topics">
                {course.topics.map((topic, index) => (
                  <span key={index} className="topic-tag">
                    {topic}
                  </span>
                ))}
              </div>

              <div className="course-instructor">
                <Code size={14} />
                <span>{course.instructor}</span>
              </div>

              <div className="course-meta">
                <div className="meta-item">
                  <Clock size={14} />
                  <span>{course.duration}</span>
                </div>
                <div className="meta-item">
                  <BookOpen size={14} />
                  <span>{course.lessons} lessons</span>
                </div>
                <div className="meta-item">
                  <Users size={14} />
                  <span>{course.students.toLocaleString()}</span>
                </div>
                <div className="meta-item">
                  <Star size={14} fill="#FFC107" color="#FFC107" />
                  <span>{course.rating}</span>
                </div>
              </div>

              <button
                className="enroll-btn"
                onClick={() => handleEnrollClick(course)}
              >
                <TrendingUp size={16} />
                {enrolledCourses.includes(course.id)
                  ? "View Course"
                  : "Enroll Now - Free"}
              </button>

              {enrolledCourses.includes(course.id) && (
                <div className="completion-badge">
                  <Award size={14} />
                  <span>Certificate Earned</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="empty-state">
          <BookOpen size={48} />
          <p>No courses found</p>
          <span>Try adjusting your filters or search query</span>
        </div>
      )}
    </div>
  );
};

export default Explore;

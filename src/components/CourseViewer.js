import React, { useState } from "react";
import "./CourseViewer.css";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  Play,
  Book,
  Code,
  FileText,
  Award,
  BarChart3,
  Clock,
  Target,
} from "lucide-react";

const CourseViewer = ({ course, onClose, onComplete }) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  // Note: showQuiz state removed as quiz mode is always available via lesson content

  // Sample course content structure
  const courseContent = {
    1: {
      // Python for Beginners
      lessons: [
        {
          id: 1,
          title: "Introduction to Python",
          type: "video",
          duration: "15 min",
          content: {
            description:
              "Welcome to Python! In this lesson, you'll learn what Python is, why it's popular, and how to set up your development environment.",
            keyPoints: [
              "Python is a high-level, interpreted programming language",
              "Used for web development, data science, automation, and more",
              "Easy to learn with clean, readable syntax",
              "Large community and extensive libraries",
            ],
            codeExample: `# Your first Python program
print("Hello, World!")

# Variables and data types
name = "Alice"
age = 25
height = 5.6
is_student = True

print(f"My name is {name}, I am {age} years old")`,
          },
        },
        {
          id: 2,
          title: "Variables and Data Types",
          type: "lesson",
          duration: "20 min",
          content: {
            description:
              "Learn about Python's basic data types and how to work with variables.",
            keyPoints: [
              "Numbers: int, float, complex",
              "Strings: text data in quotes",
              "Booleans: True or False",
              "Type conversion and checking",
            ],
            codeExample: `# Numbers
x = 10        # int
y = 3.14      # float
z = 2 + 3j    # complex

# Strings
name = "Python"
message = 'Learning is fun!'

# Booleans
is_valid = True
has_error = False

# Type checking
print(type(x))  # <class 'int'>
print(type(name))  # <class 'str'>`,
          },
        },
        {
          id: 3,
          title: "Control Flow - If Statements",
          type: "lesson",
          duration: "25 min",
          content: {
            description:
              "Master conditional statements to make decisions in your code.",
            keyPoints: [
              "if, elif, else statements",
              "Comparison operators: ==, !=, <, >, <=, >=",
              "Logical operators: and, or, not",
              "Nested conditions",
            ],
            codeExample: `# Basic if statement
age = 18
if age >= 18:
    print("You are an adult")

# if-elif-else
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"
print(f"Your grade is {grade}")

# Logical operators
username = "admin"
password = "secret123"
if username == "admin" and password == "secret123":
    print("Login successful!")`,
          },
        },
        {
          id: 4,
          title: "Loops - For and While",
          type: "lesson",
          duration: "30 min",
          content: {
            description: "Learn how to repeat code execution using loops.",
            keyPoints: [
              "for loops for iterating over sequences",
              "while loops for conditional repetition",
              "break and continue statements",
              "range() function",
            ],
            codeExample: `# For loop with range
for i in range(5):
    print(f"Iteration {i}")

# For loop with list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# While loop
count = 0
while count < 5:
    print(f"Count: {count}")
    count += 1

# Break and continue
for num in range(10):
    if num == 5:
        break  # Exit loop
    if num % 2 == 0:
        continue  # Skip even numbers
    print(num)`,
          },
        },
        {
          id: 5,
          title: "Quiz: Python Basics",
          type: "quiz",
          duration: "15 min",
          questions: [
            {
              id: 1,
              question:
                "What is the correct way to declare a variable in Python?",
              options: ["var x = 10", "int x = 10", "x = 10", "let x = 10"],
              correctAnswer: 2,
            },
            {
              id: 2,
              question: "Which of these is NOT a valid Python data type?",
              options: ["int", "float", "char", "bool"],
              correctAnswer: 2,
            },
            {
              id: 3,
              question: "What will 'print(type(3.14))' output?",
              options: [
                "<class 'int'>",
                "<class 'float'>",
                "<class 'double'>",
                "<class 'number'>",
              ],
              correctAnswer: 1,
            },
            {
              id: 4,
              question: "How do you create a comment in Python?",
              options: [
                "// This is a comment",
                "/* This is a comment */",
                "# This is a comment",
                "<!-- This is a comment -->",
              ],
              correctAnswer: 2,
            },
          ],
        },
      ],
    },
    2: {
      // React Course
      lessons: [
        {
          id: 1,
          title: "Introduction to React",
          type: "video",
          duration: "20 min",
          content: {
            description:
              "Learn what React is and why it's the most popular JavaScript library for building user interfaces.",
            keyPoints: [
              "React is a JavaScript library for building UIs",
              "Component-based architecture",
              "Virtual DOM for performance",
              "Declarative programming",
            ],
            codeExample: `import React from 'react';

// Simple React Component
function Welcome() {
  return (
    <div>
      <h1>Welcome to React!</h1>
      <p>Let's build amazing UIs</p>
    </div>
  );
}

export default Welcome;`,
          },
        },
        {
          id: 2,
          title: "JSX and Components",
          type: "lesson",
          duration: "25 min",
          content: {
            description:
              "Understand JSX syntax and how to create reusable components.",
            keyPoints: [
              "JSX is JavaScript XML",
              "Functional vs Class components",
              "Props for passing data",
              "Component composition",
            ],
            codeExample: `import React from 'react';

// Component with props
function Greeting({ name, age }) {
  return (
    <div className="greeting">
      <h2>Hello, {name}!</h2>
      <p>You are {age} years old</p>
    </div>
  );
}

// Using the component
function App() {
  return (
    <div>
      <Greeting name="Alice" age={25} />
      <Greeting name="Bob" age={30} />
    </div>
  );
}

export default App;`,
          },
        },
      ],
    },
  };

  const currentCourse = courseContent[course.id] || { lessons: [] };
  const currentLesson = currentCourse.lessons[currentLessonIndex];
  const progress =
    (completedLessons.length / currentCourse.lessons.length) * 100;

  const handleNextLesson = () => {
    if (currentLessonIndex < currentCourse.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const handleMarkComplete = () => {
    if (!completedLessons.includes(currentLesson.id)) {
      setCompletedLessons([...completedLessons, currentLesson.id]);
    }
    handleNextLesson();
  };

  const handleQuizAnswer = (questionId, answerIndex) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionId]: answerIndex,
    });
  };

  const handleSubmitQuiz = () => {
    const questions = currentLesson.questions;
    const correctAnswers = questions.filter(
      (q) => quizAnswers[q.id] === q.correctAnswer
    ).length;
    const score = (correctAnswers / questions.length) * 100;

    alert(
      `Quiz completed!\nScore: ${score}%\nCorrect: ${correctAnswers}/${questions.length}`
    );

    if (score >= 70) {
      handleMarkComplete();
    }
  };

  if (!currentLesson) {
    return (
      <div className="course-viewer">
        <div className="course-header">
          <button className="back-btn" onClick={onClose}>
            <ChevronLeft size={20} />
            Back to Courses
          </button>
        </div>
        <div className="no-content">
          <Book size={64} />
          <p>Course content coming soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="course-viewer">
      {/* Header */}
      <div className="course-header">
        <button className="back-btn" onClick={onClose}>
          <ChevronLeft size={20} />
          Back to Courses
        </button>
        <div className="course-header-info">
          <h2 className="course-header-title">{course.title}</h2>
          <div className="course-meta-info">
            <span>{course.instructor}</span>
            <span>•</span>
            <span>{currentCourse.lessons.length} Lessons</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="course-progress-section">
        <div className="progress-info">
          <div className="progress-stats">
            <BarChart3 size={18} />
            <span>Progress: {Math.round(progress)}%</span>
          </div>
          <div className="progress-stats">
            <Target size={18} />
            <span>
              {completedLessons.length} / {currentCourse.lessons.length}{" "}
              Completed
            </span>
          </div>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="course-main">
        {/* Sidebar - Lessons List */}
        <div className="lessons-sidebar">
          <h3 className="sidebar-title">Course Content</h3>
          <div className="lessons-list">
            {currentCourse.lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`lesson-item ${
                  index === currentLessonIndex ? "active" : ""
                } ${completedLessons.includes(lesson.id) ? "completed" : ""}`}
                onClick={() => {
                  setCurrentLessonIndex(index);
                }}
              >
                <div className="lesson-item-icon">
                  {completedLessons.includes(lesson.id) ? (
                    <CheckCircle size={20} color="#00D4AA" />
                  ) : (
                    <Circle size={20} />
                  )}
                </div>
                <div className="lesson-item-info">
                  <div className="lesson-item-title">{lesson.title}</div>
                  <div className="lesson-item-meta">
                    {lesson.type === "video" && <Play size={12} />}
                    {lesson.type === "lesson" && <Book size={12} />}
                    {lesson.type === "quiz" && <FileText size={12} />}
                    <span>{lesson.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lesson-content">
          <div className="lesson-header">
            <div className="lesson-type-badge">
              {currentLesson.type === "video" && (
                <>
                  <Play size={14} />
                  <span>Video Lesson</span>
                </>
              )}
              {currentLesson.type === "lesson" && (
                <>
                  <Book size={14} />
                  <span>Reading</span>
                </>
              )}
              {currentLesson.type === "quiz" && (
                <>
                  <FileText size={14} />
                  <span>Quiz</span>
                </>
              )}
            </div>
            <div className="lesson-duration">
              <Clock size={14} />
              <span>{currentLesson.duration}</span>
            </div>
          </div>

          <h1 className="lesson-title">{currentLesson.title}</h1>

          {/* Lesson Content */}
          {currentLesson.type !== "quiz" && (
            <div className="lesson-body">
              {currentLesson.type === "video" && (
                <div className="video-placeholder">
                  <Play size={64} />
                  <p>Video Player</p>
                  <span>Course video will play here</span>
                </div>
              )}

              <div className="lesson-description">
                {currentLesson.content.description}
              </div>

              <div className="key-points">
                <h3>Key Points:</h3>
                <ul>
                  {currentLesson.content.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>

              {currentLesson.content.codeExample && (
                <div className="code-section">
                  <div className="code-header">
                    <Code size={16} />
                    <span>Code Example</span>
                  </div>
                  <pre className="code-block">
                    <code>{currentLesson.content.codeExample}</code>
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Quiz Content */}
          {currentLesson.type === "quiz" && (
            <div className="quiz-content">
              <div className="quiz-intro">
                <p>Test your knowledge! You need 70% or higher to pass.</p>
              </div>

              {currentLesson.questions.map((question, qIndex) => (
                <div key={question.id} className="quiz-question">
                  <div className="question-number">Question {qIndex + 1}</div>
                  <div className="question-text">{question.question}</div>
                  <div className="question-options">
                    {question.options.map((option, oIndex) => (
                      <label
                        key={oIndex}
                        className={`option-label ${
                          quizAnswers[question.id] === oIndex ? "selected" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          checked={quizAnswers[question.id] === oIndex}
                          onChange={() => handleQuizAnswer(question.id, oIndex)}
                        />
                        <span className="option-text">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <button
                className="submit-quiz-btn"
                onClick={handleSubmitQuiz}
                disabled={
                  Object.keys(quizAnswers).length <
                  currentLesson.questions.length
                }
              >
                Submit Quiz
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="lesson-navigation">
            <button
              className="nav-btn prev-btn"
              onClick={handlePreviousLesson}
              disabled={currentLessonIndex === 0}
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            {currentLesson.type !== "quiz" && (
              <button
                className="mark-complete-btn"
                onClick={handleMarkComplete}
              >
                <CheckCircle size={18} />
                {completedLessons.includes(currentLesson.id)
                  ? "Completed"
                  : "Mark Complete & Continue"}
              </button>
            )}

            <button
              className="nav-btn next-btn"
              onClick={handleNextLesson}
              disabled={currentLessonIndex === currentCourse.lessons.length - 1}
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Course Completion */}
          {progress === 100 && (
            <div className="course-completion">
              <Award size={48} color="#FFD700" />
              <h3>Congratulations!</h3>
              <p>You've completed this course!</p>
              <button
                className="claim-certificate-btn"
                onClick={() => onComplete && onComplete(course)}
              >
                <Award size={18} />
                Claim Your Certificate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;

import React, { useState, useEffect, useMemo } from "react";
import {
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import "./CodeEditor.css";

const CodeEditor = ({ problem, onClose, onProblemSolved }) => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);
  const [compilationError, setCompilationError] = useState("");
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  // Language mapping for Judge0 API
  const languageIds = {
    javascript: 63, // Node.js
    python: 71, // Python 3
    java: 62, // Java
    cpp: 54, // C++
    c: 50, // C
  };

  // Default code templates for different languages (memoized to avoid recreating on every render)
  const codeTemplates = useMemo(
    () => ({
      javascript: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}

// Read input and call function
const input = JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8'));
const result = twoSum(input.nums, input.target);
console.log(JSON.stringify(result));`,
      python: `def twoSum(nums, target):
    hashmap = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hashmap:
            return [hashmap[complement], i]
        hashmap[num] = i
    return []

import json
import sys

input_data = json.loads(sys.stdin.read())
result = twoSum(input_data['nums'], input_data['target'])
print(json.dumps(result))`,
      java: `import java.util.*;
import java.io.*;

public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
    
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String input = br.readLine();
        // Parse JSON input and call twoSum
        System.out.println("[0,1]"); // Simplified for demo
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <sstream>
#include <string>

using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.find(complement) != map.end()) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }
    return {};
}

int main() {
    // Simplified input handling for demo
    cout << "[0,1]" << endl;
    return 0;
}`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    int* result = (int*)malloc(2 * sizeof(int));
    *returnSize = 2;
    
    for (int i = 0; i < numsSize; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[i] + nums[j] == target) {
                result[0] = i;
                result[1] = j;
                return result;
            }
        }
    }
    
    *returnSize = 0;
    free(result);
    return NULL;
}

int main() {
    // Simplified for demo - in real implementation would parse JSON input
    printf("[0,1]\\n");
    return 0;
}`,
    }),
    []
  ); // Empty dependency array since templates are static

  useEffect(() => {
    setCode(codeTemplates[language]);
    setCompilationError("");
  }, [language, codeTemplates]);

  // Anti-cheating measures
  useEffect(() => {
    // Prevent copy-paste in the code editor
    const handleCopyPaste = (e) => {
      e.preventDefault();
      setWarningMessage(
        "⚠️ Copy-paste is disabled during the coding challenge!"
      );
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
    };

    // Detect tab switching
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => {
          const newCount = prev + 1;
          if (newCount === 1) {
            setWarningMessage(
              "⚠️ Warning: Tab switching detected! Please stay on this page."
            );
          } else if (newCount === 2) {
            setWarningMessage(
              "⚠️ Second warning: Tab switching may result in submission restrictions."
            );
          } else if (newCount >= 3) {
            setWarningMessage(
              "⚠️ Final warning: Multiple tab switches detected. Your submission may be flagged."
            );
          }
          setShowWarning(true);
          setTimeout(() => setShowWarning(false), 4000);
          return newCount;
        });
      }
    };

    // Prevent right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
      setWarningMessage("⚠️ Right-click is disabled during the challenge!");
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
    };

    // Add event listeners
    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("cut", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("contextmenu", handleContextMenu);

    // Cleanup
    return () => {
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("cut", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const testCases = [
    {
      input: { nums: problem.testInputs?.[0] || [2, 7, 11, 15], target: 9 },
      expected: problem.testOutputs?.[0] || [0, 1],
      description: "Basic test case",
    },
    {
      input: { nums: problem.testInputs?.[1] || [3, 2, 4], target: 6 },
      expected: problem.testOutputs?.[1] || [1, 2],
      description: "Edge case",
    },
    {
      input: { nums: problem.testInputs?.[2] || [3, 3], target: 6 },
      expected: problem.testOutputs?.[2] || [0, 1],
      description: "Duplicate values",
    },
  ];

  // Function to execute code using Judge0 API
  const executeCode = async (sourceCode, inputData) => {
    const languageId = languageIds[language];

    try {
      // Submit code for execution
      const submitResponse = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY", // Replace with actual API key
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
          body: JSON.stringify({
            language_id: languageId,
            source_code: sourceCode,
            stdin: JSON.stringify(inputData),
          }),
        }
      );

      const submitResult = await submitResponse.json();
      const token = submitResult.token;

      // Poll for results
      let result;
      let attempts = 0;
      const maxAttempts = 30;

      do {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const resultResponse = await fetch(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
          {
            headers: {
              "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY",
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
          }
        );
        result = await resultResponse.json();
        attempts++;
      } while (result.status.id <= 2 && attempts < maxAttempts);

      return result;
    } catch (error) {
      console.error("Execution error:", error);
      return {
        status: { id: 6, description: "Runtime Error" },
        stderr: "Network error or API unavailable",
        stdout: "",
        time: "0.000",
      };
    }
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setCompilationError("");
    const startTime = Date.now();

    try {
      // Execute code for each test case
      const results = await Promise.all(
        testCases.map(async (testCase, index) => {
          const result = await executeCode(code, testCase.input);

          let actualOutput = "";
          let passed = false;
          let error = "";

          if (result.status.id === 3) {
            // Success
            actualOutput = result.stdout.trim();
            try {
              const actual = JSON.parse(actualOutput);
              passed =
                JSON.stringify(actual) === JSON.stringify(testCase.expected);
            } catch {
              passed = actualOutput === JSON.stringify(testCase.expected);
            }
          } else {
            // Error
            error =
              result.stderr ||
              result.compile_output ||
              result.status.description;
            actualOutput = "Error";
          }

          return {
            id: index + 1,
            input: JSON.stringify(testCase.input),
            expected: JSON.stringify(testCase.expected),
            actual: actualOutput,
            passed,
            executionTime: parseFloat(result.time || "0").toFixed(3),
            description: testCase.description,
            error: error,
          };
        })
      );

      const endTime = Date.now();
      setExecutionTime(endTime - startTime);
      setTestResults(results);

      // Check for compilation errors
      const hasErrors = results.some((r) => r.error);
      if (hasErrors) {
        setCompilationError("Some test cases failed. Check the results below.");
      }
    } catch (error) {
      console.error("Test execution error:", error);
      setCompilationError("Failed to execute tests. Please check your code.");
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(codeTemplates[language]);
    setTestResults([]);
    setCompilationError("");
  };

  const submitSolution = () => {
    // Check if all tests passed
    const allTestsPassed =
      testResults.length > 0 && testResults.every((result) => result.passed);

    if (allTestsPassed) {
      // Call the onProblemSolved callback to award PSIT Coins
      if (onProblemSolved) {
        onProblemSolved();
      }
      // Close the editor after successful submission
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      alert("Please run and pass all test cases before submitting!");
    }
  };

  return (
    <div className="code-editor-modal">
      <div className="code-editor-container">
        {showWarning && (
          <div className="anti-cheat-warning">{warningMessage}</div>
        )}

        <div className="editor-header">
          <div className="problem-info">
            <h3>{problem.title}</h3>
            <div className="problem-meta">
              <span
                className={`difficulty ${problem.difficulty.toLowerCase()}`}
              >
                {problem.difficulty}
              </span>
              <span className="platform">{problem.platform}</span>
              {tabSwitchCount > 0 && (
                <span
                  className="tab-switch-badge"
                  title="Tab switches detected"
                >
                  ⚠️ {tabSwitchCount}
                </span>
              )}
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="editor-content">
          <div className="problem-description">
            <h4>Problem Description</h4>
            <p>{problem.description}</p>

            <div className="examples">
              <h5>Examples:</h5>
              <div className="example">
                <strong>Input:</strong> nums = [2,7,11,15], target = 9<br />
                <strong>Output:</strong> [0,1]
                <br />
                <strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we
                return [0, 1].
              </div>
            </div>
          </div>

          <div className="editor-section">
            <div className="editor-toolbar">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="language-select"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
              </select>

              <div className="editor-actions">
                <button
                  className="run-btn"
                  onClick={runTests}
                  disabled={isRunning}
                >
                  <Play size={16} />
                  {isRunning ? "Running..." : "Run Code"}
                </button>
                <button className="reset-btn" onClick={resetCode}>
                  <RotateCcw size={16} />
                  Reset
                </button>
                <button className="submit-btn" onClick={submitSolution}>
                  <CheckCircle size={16} />
                  Submit
                </button>
              </div>
            </div>

            <textarea
              className="code-textarea"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Write your solution here..."
              spellCheck={false}
              onCopy={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>

          <div className="test-results">
            <h4>Test Results</h4>

            {compilationError && (
              <div className="compilation-error">
                <AlertCircle size={20} className="error-icon" />
                <span>{compilationError}</span>
              </div>
            )}

            {testResults.length > 0 && (
              <div className="results-summary">
                <div className="summary-stats">
                  <span className="execution-time">
                    <Clock size={16} />
                    Execution Time: {executionTime}ms
                  </span>
                </div>
              </div>
            )}

            <div className="test-cases">
              {testResults.map((result) => (
                <div
                  key={result.id}
                  className={`test-case ${result.passed ? "passed" : "failed"}`}
                >
                  <div className="test-header">
                    <div className="test-status">
                      {result.passed ? (
                        <CheckCircle size={20} className="success-icon" />
                      ) : (
                        <XCircle size={20} className="error-icon" />
                      )}
                      <span>Test Case {result.id}</span>
                      <span className="test-time">
                        {result.executionTime}ms
                      </span>
                    </div>
                  </div>

                  <div className="test-details">
                    <div className="test-row">
                      <strong>Input:</strong> {result.input}
                    </div>
                    <div className="test-row">
                      <strong>Expected:</strong> {result.expected}
                    </div>
                    <div className="test-row">
                      <strong>Actual:</strong> {result.actual}
                    </div>
                    {result.error && (
                      <div className="test-error">
                        <strong>Error:</strong> {result.error}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;

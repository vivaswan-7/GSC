import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./Challenge.css";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";

const Challenge = () => {
  const [topic, setTopic] = useState("");
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [selectedOption, setSelectedOption] = useState(null);

  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

  const generateChallenge = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic!");
      return;
    }

    setLoading(true);
    setMcqs([]);
    setQuizCompleted(false);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setTimeLeft(600);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Generate exactly 10 multiple-choice questions (MCQs) on the topic: "${topic}". 
        Follow this strict JSON format:
        [
          {
            "question": "What is React?",
            "options": ["A JavaScript library", "A database", "A backend framework", "A programming language"],
            "answer": "A JavaScript library"
          },
          {
            "question": "What is JSX?",
            "options": ["JavaScript XML", "A database language", "A JavaScript framework", "A style library"],
            "answer": "JavaScript XML"
          }
        ]
        Ensure:
        - Each MCQ has exactly 4 options.
        - The correct answer is one of the options.
        - Return only valid JSON without extra text.`;

      const result = await model.generateContent(prompt);
      const generatedText = result.response.text();

      try {
        // Extract JSON if there's any extra text
        const jsonRegex = /\[[\s\S]*\]/;
        const jsonMatch = generatedText.match(jsonRegex);
        
        let mcqList;
        if (jsonMatch) {
          mcqList = JSON.parse(jsonMatch[0]);
        } else {
          // Clean up potential JSON issues - attempt to fix common problems
          const cleanedText = generatedText
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();
          
          mcqList = JSON.parse(cleanedText);
        }

        if (Array.isArray(mcqList) && mcqList.length > 0) {
          // Validate each MCQ has the required structure
          const validMcqs = mcqList.filter(mcq => 
            mcq.question && 
            Array.isArray(mcq.options) && 
            mcq.options.length === 4 &&
            mcq.answer && 
            mcq.options.includes(mcq.answer)
          );
          
          if (validMcqs.length > 0) {
            setMcqs(validMcqs);
          } else {
            throw new Error("No valid MCQs found in the response.");
          }
        } else {
          throw new Error("No valid MCQs received.");
        }
      } catch (jsonError) {
        console.error("JSON Parsing Error:", jsonError);
        console.error("Original text:", generatedText);
        alert("Error parsing MCQs. Please try again with a different topic.");
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("API Request Error:", error);
      alert("Error fetching MCQs. Try again later.");
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  useEffect(() => {
    if (timeLeft > 0 && mcqs.length > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && mcqs.length > 0) {
      setQuizCompleted(true);
    }
  }, [timeLeft, mcqs.length, quizCompleted]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (!selectedOption) {
      alert("Please select an option!");
      return;
    }

    const correctAnswer = mcqs[currentQuestion]?.answer;

    if (selectedOption === correctAnswer) {
      setScore(score + 1);
    }

    setSelectedOption(null);

    if (currentQuestion + 1 < mcqs.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  return (
    <div className="marg-top">
      <Navbar />
      <div className="skillforge-container">
        <h2>🎯 AI-Generated Quiz</h2>
        <input
          type="text"
          placeholder="Enter a topic (e.g., JavaScript, AI Basics)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button onClick={generateChallenge} disabled={loading}>
          {loading ? "Generating..." : "Start Quiz"}
        </button>

        {mcqs.length > 0 && !quizCompleted && (
          <div>
            <h3>⏳ Time Left: {formatTime(timeLeft)}</h3>

            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{
                  width: `${((currentQuestion + 1) / mcqs.length) * 100}%`,
                }}
              ></div>
            </div>

            <h3>📝 Question {currentQuestion + 1} of {mcqs.length}</h3>
            <p className="mcq-question">{mcqs[currentQuestion]?.question}</p>
            <ul className="mcq-options">
              {mcqs[currentQuestion]?.options.map((option, index) => (
                <li
                  key={index}
                  className={`mcq-option ${
                    selectedOption === option ? "selected" : ""
                  }`}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
            <button onClick={handleNextQuestion}>Next</button>
          </div>
        )}

        {quizCompleted && (
          <div className="card result-card">
            <h3>✅ Quiz Completed!</h3>
            <p>
              Your Score: {score} / {mcqs.length}
            </p>
            <p>
              🎯 AI Feedback:{" "}
              {score >= 8
                ? "🚀 Excellent! You're a pro!"
                : score >= 5
                ? "🎯 Good job! Keep learning!"
                : "📚 Keep practicing, you'll get there!"}
            </p>
            <button onClick={() => setQuizCompleted(false)}>Retry Quiz</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Challenge;
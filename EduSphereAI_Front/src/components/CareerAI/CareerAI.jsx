import React, { useState } from "react";
import "./CareerAI.css";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import { GoogleGenerativeAI } from "@google/generative-ai";

const CareerAI = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [careerPath, setCareerPath] = useState("");
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAIResponse = async (prompt) => {
    try {
      const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Use structured format for better JSON responses
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  };

  // Helper function to safely parse JSON from text
  const safelyParseJSON = (text) => {
    try {
      // First attempt: direct JSON parsing
      return JSON.parse(text);
    } catch (e) {
      try {
        // Second attempt: find JSON-like content using regex
        const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        
        // Third attempt: Extract between first [ and last ]
        const jsonStart = text.indexOf('[');
        const jsonEnd = text.lastIndexOf(']');
        
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          const jsonString = text.substring(jsonStart, jsonEnd + 1);
          return JSON.parse(jsonString);
        }
      } catch (innerError) {
        console.error("JSON parsing error:", innerError);
      }
      
      throw new Error("Could not extract valid JSON from the response");
    }
  };

  // 📌 Generate AI-Based Career Quiz with MCQs
  const generateQuiz = async () => {
    setLoading(true);
    setQuestions([]);
    setCareerPath("");
    setRecommendedCourses([]);
    setAnswers({});
  
    try {
      // More structured prompt with explicit response format for Gemini 1.5 Flash
      const prompt = `You are a career assessment expert. Create 5 multiple-choice career assessment questions.

The response should be ONLY a valid JSON array with no additional text or formatting.

Each question object should have exactly these fields:
1. "question" - a string with the question text
2. "options" - an array of exactly 4 string options
3. "correct" - one of the options that represents the default or most common answer

Example of the expected JSON format:
[
  {
    "question": "What type of work environment do you prefer?",
    "options": ["Working alone", "Small team", "Large organization", "Varied environments"],
    "correct": "Small team"
  }
]

Only return the JSON array. Do not include any explanatory text, markdown formatting, or code blocks.`;
      
      const rawText = await fetchAIResponse(prompt);
      console.log("Raw API response:", rawText); // For debugging
      
      const parsedQuestions = safelyParseJSON(rawText);
      
      if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
        throw new Error("Invalid questions format");
      }
      
      // Make sure each question has the required fields
      const validQuestions = parsedQuestions.filter(q => 
        q.question && 
        Array.isArray(q.options) && 
        q.options.length > 0 && 
        q.correct
      );
      
      if (validQuestions.length === 0) {
        throw new Error("No valid questions found");
      }
      
      setQuestions(validQuestions);
    } catch (error) {
      console.error("Error generating MCQs:", error);
      alert("Failed to generate questions. Please try again.");
    }
  
    setLoading(false);
  };
  
  // 📌 Handle Answer Selection
  const handleAnswerChange = (questionIndex, option) => {
    setAnswers({ ...answers, [questionIndex]: option });
  };

  // 📌 Analyze Answers & Recommend Career Path
  const analyzeAnswers = async () => {
    if (Object.keys(answers).length !== questions.length) {
      return alert("Please answer all questions.");
    }

    setLoading(true);
    setCareerPath("");
    setRecommendedCourses([]);

    try {
      // Create a more detailed prompt with questions and answers
      let answerDetails = "";
      questions.forEach((q, index) => {
        if (answers[index]) {
          answerDetails += `Question: ${q.question}\n`;
          answerDetails += `Answer: ${answers[index]}\n\n`;
        }
      });
      
      const prompt = `Based on these career assessment answers, recommend a specific career path that would be suitable:
                     \n${answerDetails}\nProvide a detailed explanation of why this career would be a good fit based on the answers.`;
      
      const recommendedCareer = await fetchAIResponse(prompt);
      setCareerPath(recommendedCareer.replace(/\*/g, "").trim());

      // Generate Course Recommendations using structured format
      const coursePrompt = `Suggest 3 specific online courses for someone interested in pursuing a career in ${recommendedCareer.substring(0, 100)}. 
      
Return a JSON array with exactly 3 course objects.
Each course object should have:
1. "name" - the course name
2. "platform" - the platform it's available on (like Coursera, Udemy, edX)

Example format:
[
  {
    "name": "Introduction to Data Science",
    "platform": "Coursera"
  }
]

Only return the JSON array with no additional text.`;
      
      const coursesText = await fetchAIResponse(coursePrompt);
      
      try {
        // Parse courses as JSON first
        const coursesJson = safelyParseJSON(coursesText);
        if (Array.isArray(coursesJson) && coursesJson.length > 0) {
          // Format courses from JSON
          const courses = coursesJson.map(course => ({
            name: course.name || "Course",
            platform: course.platform || "Online Platform",
            link: "#"
          }));
          setRecommendedCourses(courses);
        } else {
          throw new Error("Invalid courses format");
        }
      } catch (courseError) {
        // Fallback to text parsing if JSON fails
        console.error("Error parsing courses JSON:", courseError);
        
        // Parse course information from text
        const courseLines = coursesText.split('\n').filter(line => line.trim() !== '');
        const courses = courseLines
          .filter(line => line.includes(':') || line.includes('-'))
          .map(line => {
            // Handle different possible formats
            let platform, name;
            if (line.includes(':')) {
              [platform, name] = line.split(':');
            } else if (line.includes('-')) {
              [platform, name] = line.split('-');
            } else {
              // Default fallback
              const words = line.split(' ');
              platform = words[0];
              name = words.slice(1).join(' ');
            }
            
            // Clean up the extracted parts
            platform = platform.replace(/^\d+\.\s*/, '').trim(); // Remove leading numbers
            name = (name || "").trim();
            
            return { 
              name: name || "Course", 
              platform: platform || "Online Platform", 
              link: "#" 
            };
          });

        // Ensure we have at least some courses
        if (courses.length === 0) {
          courses.push(
            { name: "Introduction Course", platform: "Coursera", link: "#" },
            { name: "Advanced Skills", platform: "Udemy", link: "#" },
            { name: "Specialization", platform: "edX", link: "#" }
          );
        }

        setRecommendedCourses(courses);
      }
    } catch (error) {
      console.error("Error analyzing answers:", error);
      alert("Error analyzing answers. Try again.");
    }

    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <div className="career-ai-container">
        <h1>Career AI - Personalized Career Guidance</h1>
        <p>AI-powered recommendations to help you choose the right career.</p>
        <p className="info-text">(Answer Honestly Here To get the Best Results)</p>

        <button className="generate-btn" onClick={generateQuiz} disabled={loading}>
          {loading ? "Generating Quiz..." : "Start Career Quiz"}
        </button>

        {questions.length > 0 && (
          <div className="quiz-sectiono">
            {questions.map((q, index) => (
              <div key={index} className="quiz-questiono">
                <p>{q.question}</p>
                {q.options.map((option, i) => (
                  <label key={i} className="mcq-optio">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      onChange={() => handleAnswerChange(index, option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            ))}
            <button className="analyze-btn" onClick={analyzeAnswers} disabled={loading}>
              {loading ? "Analyzing..." : "Get Career Recommendation"}
            </button>
          </div>
        )}

        {careerPath && (
          <div className="career-result">
            <h2>Recommended Career Path:</h2>
            <p>{careerPath}</p>
          </div>
        )}

        {recommendedCourses.length > 0 && (
          <div className="course-recommendations">
            <h2>📚 Recommended Courses</h2>
            <ul>
              {recommendedCourses.map((course, index) => (
                <li key={index}>
                  <a href={course.link} target="_blank" rel="noopener noreferrer">
                    {course.platform}: {course.name} 🔗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CareerAI;
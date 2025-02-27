import React, { useState } from "react";
import axios from "axios";
import "./Playlist.css";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Playlists = () => {
  const [skill, setSkill] = useState("");
  const [youtubePlaylists, setYoutubePlaylists] = useState([]);
  const [aiPlaylists, setAiPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchYoutubePlaylists = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: "snippet",
            q: `${skill} tutorial playlist`,
            type: "playlist",
            maxResults: 5,
            key: process.env.REACT_APP_YOUTUBE_API_KEY
          }
        }
      );

      if (response.data.items && response.data.items.length > 0) {
        const playlists = response.data.items.map((item) => ({
          title: item.snippet.title,
          link: `https://www.youtube.com/playlist?list=${item.id.playlistId}`,
          thumbnail: item.snippet.thumbnails.medium.url
        }));
        setYoutubePlaylists(playlists);
      } else {
        setYoutubePlaylists([]);
        console.log("No YouTube playlists found");
      }
    } catch (error) {
      console.error("Error fetching YouTube playlists:", error);
      setYoutubePlaylists([]);
      setError("Failed to fetch YouTube playlists. Please try again.");
    }
  };

  const generateAIPlaylist = async () => {
    try {
      // Use the GoogleGenerativeAI library instead of direct API calls
      const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Create a learning roadmap for ${skill} with 5 real online course recommendations.

For each course, include:
1. Course name
2. Platform (Coursera, Udemy, edX, or Khan Academy)
3. A brief one-sentence description
4. A direct link to the course (if you don't know the exact link, use #)

Format your response as structured data that can be parsed into the following JSON format:
[
  {
    "courseName": "Course Title",
    "platform": "Platform Name",
    "description": "Brief description of what the course covers",
    "link": "URL or # if unknown"
  }
]

Return ONLY the JSON array with no additional text, explanations, or markdown formatting.`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      try {
        // Try to parse the response as JSON
        let parsedResponse;
        try {
          parsedResponse = JSON.parse(response);
        } catch (e) {
          // If direct parsing fails, try to extract JSON using regex
          const jsonMatch = response.match(/\[\s*\{[\s\S]*\}\s*\]/);
          if (jsonMatch) {
            parsedResponse = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error("Could not extract valid JSON");
          }
        }
        
        if (Array.isArray(parsedResponse) && parsedResponse.length > 0) {
          setAiPlaylists(parsedResponse);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (jsonError) {
        console.error("Error parsing Gemini response:", jsonError);
        console.log("Raw response:", response);
        
        // Fallback: Try to extract course information from text
        const courses = [];
        const lines = response.split('\n');
        
        let currentCourse = {};
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          
          // Try to identify course name and platform
          const courseMatch = trimmedLine.match(/["']?([^"']+)["']?\s*[:-]\s*["']?([^"',]+)["']?/);
          if (courseMatch) {
            if (currentCourse.courseName) {
              courses.push({...currentCourse});
              currentCourse = {};
            }
            currentCourse.courseName = courseMatch[1].trim();
            currentCourse.platform = courseMatch[2].trim();
            continue;
          }
          
          // Try to identify links
          const linkMatch = trimmedLine.match(/https?:\/\/[^\s"')]+/);
          if (linkMatch && currentCourse.courseName) {
            currentCourse.link = linkMatch[0];
            continue;
          }
          
          // If we have a course name but no description yet, use this line as description
          if (currentCourse.courseName && !currentCourse.description && 
              !trimmedLine.includes("courseName") && 
              !trimmedLine.includes("platform") && 
              !trimmedLine.startsWith("{") && 
              !trimmedLine.startsWith("}") &&
              trimmedLine.length > 10) {
            currentCourse.description = trimmedLine;
            
            // Complete this course entry
            if (!currentCourse.link) currentCourse.link = "#";
            courses.push({...currentCourse});
            currentCourse = {};
          }
        }
        
        // Add the last course if it exists
        if (currentCourse.courseName) {
          if (!currentCourse.link) currentCourse.link = "#";
          if (!currentCourse.description) currentCourse.description = "No description available";
          courses.push({...currentCourse});
        }
        
        if (courses.length > 0) {
          setAiPlaylists(courses);
        } else {
          // Last resort fallback
          setAiPlaylists([
            { 
              courseName: `${skill} Fundamentals`, 
              platform: "Coursera", 
              description: "A comprehensive introduction to the basics.", 
              link: "#" 
            },
            { 
              courseName: `Advanced ${skill}`, 
              platform: "Udemy", 
              description: "Take your skills to the next level with practical projects.", 
              link: "#" 
            },
            { 
              courseName: `${skill} for Professionals`, 
              platform: "edX", 
              description: "Industry-focused training for career advancement.", 
              link: "#" 
            }
          ]);
        }
      }
    } catch (error) {
      console.error("Error generating AI playlist:", error);
      setAiPlaylists([
        { 
          courseName: "⚠️ Unable to generate AI playlist", 
          platform: "", 
          description: "Please try again later.", 
          link: "#" 
        }
      ]);
      setError("Failed to generate AI playlist. Please try again.");
    }
  };

  const generatePlaylists = async () => {
    if (!skill.trim()) {
      setError("Please enter a skill to search for");
      return;
    }
    
    setLoading(true);
    setYoutubePlaylists([]);
    setAiPlaylists([]);
    setError("");
    
    try {
      // Run both API calls in parallel
      await Promise.all([
        fetchYoutubePlaylists(),
        generateAIPlaylist()
      ]);
    } catch (err) {
      console.error("Error generating playlists:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="marg-top">
      <Navbar />
      <div className="skillforge-container">
        <h2>🎯 AI + YouTube Learning Playlists</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Enter a skill (e.g., Data Science)"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && generatePlaylists()}
          />
          <button onClick={generatePlaylists} disabled={loading}>
            {loading ? "Generating..." : "Get Playlists"}
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}

        <div className="playlists-container">
          {youtubePlaylists.length > 0 && (
            <div className="card playlist-card">
              <h3>📺 YouTube Learning Playlists</h3>
              <ul className="youtube-playlist">
                {youtubePlaylists.map((playlist, index) => (
                  <li key={index} className="youtube-item">
                    <img src={playlist.thumbnail} alt={playlist.title} className="thumbnail"/>
                    <a href={playlist.link} target="_blank" rel="noopener noreferrer" className="course-link">
                      📌 {playlist.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {aiPlaylists.length > 0 && (
            <div className="card playlist-card">
              <h3>📚 AI-Generated Learning Roadmap</h3>
              <ul className="ai-playlist">
                {aiPlaylists.map((course, index) => (
                  <li key={index} className="playlist-item">
                    <div className="course-header">
                      <span className="course-name">📌 {course.courseName}</span>
                      {course.platform && <span className="platform">({course.platform})</span>}
                    </div>
                    {course.description && <p className="description">{course.description}</p>}
                    {course.link && course.link !== "#" ? (
                      <a href={course.link} target="_blank" rel="noopener noreferrer" className="course-link">
                        🔗 Go to Course
                      </a>
                    ) : (
                      <span className="no-link">⚠️ No link available</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {loading && (
            <div className="loading-indicator">
              <p>Generating your learning playlists...</p>
            </div>
          )}
          
          {!loading && youtubePlaylists.length === 0 && aiPlaylists.length === 0 && skill && (
            <div className="no-results">
              <p>No playlists found. Try a different skill or check your API keys.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Playlists;
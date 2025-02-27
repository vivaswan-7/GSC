import React, { useState, useEffect } from "react";
import axios from "axios";
import Tesseract from "tesseract.js";
import "./ImmersiveAI.css";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const languageOptions = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  hi: "Hindi",
};

// Language codes for Web Speech API
const speechLangCodes = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  hi: "hi-IN",
};

const ImmersiveAI = () => {
  const [language, setLanguage] = useState("en");
  const [videoTopic, setVideoTopic] = useState("");
  const [explanationTopic, setExplanationTopic] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [summary, setSummary] = useState("");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [speechVoices, setSpeechVoices] = useState([]);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  // Initialize Gemini API
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
  const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Check API keys and initialize Speech Synthesis on component mount
  useEffect(() => {
    const requiredKeys = [
      'REACT_APP_YOUTUBE_API_KEY',
      'REACT_APP_GEMINI_API_KEY'
    ];
    
    const missingKeys = requiredKeys.filter(key => !process.env[key]);
    
    if (missingKeys.length > 0) {
      console.warn(`Missing API keys: ${missingKeys.join(', ')}`);
    }

    // Check if Speech Synthesis is supported
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);
      
      // Get available voices
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setSpeechVoices(voices);
        }
      };

      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
      
      loadVoices(); // For browsers that load voices immediately
    } else {
      console.warn("Speech synthesis not supported in this browser");
      setIsSpeechSupported(false);
    }
    
    // Cleanup speech synthesis on unmount
    return () => {
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, [speechSynthesis]); // Added speechSynthesis to the dependency array

  const fetchYouTubeVideos = async () => {
    if (!videoTopic) {
      alert("Please enter a topic you want to learn");
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
        params: {
          q: `${videoTopic} tutorial ${language !== 'en' ? languageOptions[language] : ''}`,
          key: process.env.REACT_APP_YOUTUBE_API_KEY,
          part: "snippet",
          maxResults: 5,
          type: "video",
          relevanceLanguage: language,
          regionCode: language === "en" ? "US" : language === "es" ? "ES" : 
                     language === "fr" ? "FR" : language === "de" ? "DE" : "IN",
        },
      });
  
      if (response.data.items && response.data.items.length > 0) {
        setVideos(response.data.items);
      } else {
        alert("No videos found for this topic. Try different keywords.");
      }
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
      alert(`Failed to fetch videos: ${error.response?.data?.error?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const translateText = async (text, targetLang) => {
    if (targetLang === "en") return text;
    
    try {
      const response = await axios.post(
        "https://libretranslate.de/translate",
        {
          q: text,
          source: "en",
          target: targetLang,
          format: "text",
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      
      if (response.data && response.data.translatedText) {
        return response.data.translatedText;
      } else {
        console.warn("Translation response format unexpected:", response.data);
        return text;
      }
    } catch (error) {
      console.error("Translation error:", error);
      // Fallback to original text
      return text;
    }
  };

  // Function to speak text using Web Speech API
  const speakText = (text, langCode) => {
    if (!speechSynthesis || !isSpeechSupported) {
      alert("Text-to-speech is not supported in your browser");
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    // Create a new speech utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language
    utterance.lang = langCode;
    
    // Find an appropriate voice for the language if available
    if (speechVoices.length > 0) {
      const voices = speechVoices.filter(voice => voice.lang.startsWith(langCode.substring(0, 2)));
      if (voices.length > 0) {
        // Try to find a female voice as they tend to be clearer
        const femaleVoice = voices.find(voice => voice.name.includes('Female') || voice.name.includes('female'));
        utterance.voice = femaleVoice || voices[0];
      }
    }
    
    // Set speech properties
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Add event listeners
    utterance.onstart = () => {
      setAudioPlaying(true);
    };
    
    utterance.onend = () => {
      setAudioPlaying(false);
    };
    
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setAudioPlaying(false);
    };
    
    // Start speaking
    speechSynthesis.speak(utterance);
    
    // For long texts, Chrome has a bug where it stops after ~15 seconds
    // This is a workaround to keep it going
    const resumeInfinity = setInterval(() => {
      if (!speechSynthesis.speaking) {
        clearInterval(resumeInfinity);
      } else {
        speechSynthesis.pause();
        speechSynthesis.resume();
      }
    }, 10000);
  };

  const generateExplanation = async () => {
    if (!explanationTopic) {
      alert("Please enter a topic for AI Explanation");
      return;
    }

    setLoading(true);
    try {
      // If speech is playing, stop it
      if (speechSynthesis && audioPlaying) {
        speechSynthesis.cancel();
        setAudioPlaying(false);
      }

      // Generate explanation using Gemini SDK
      const prompt = `Provide a clear, educational explanation of the topic: ${explanationTopic}. 
                     The explanation should be informative, well-structured, and suitable for a student learning about this topic.
                     Include key concepts, examples, and practical applications where relevant.`;
      
      const result = await geminiModel.generateContent(prompt);
      let explanationText = result.response.text();
      setExplanation(explanationText);

      // Translate if needed
      if (language !== "en") {
        explanationText = await translateText(explanationText, language);
      }

      // Generate speech
      speakText(explanationText, speechLangCodes[language]);
      
    } catch (error) {
      console.error("Error generating AI explanation:", error);
      alert(`Failed to generate explanation: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const extractTextFromPDF = async (pdfFile) => {
    try {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = async function () {
          try {
            const typedArray = new Uint8Array(this.result);
            const pdf = await pdfjsLib.getDocument(typedArray).promise;
            let extractedText = "";

            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              extractedText += textContent.items.map((item) => item.str).join(" ");
            }

            resolve(extractedText);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(pdfFile);
      });
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      throw new Error("Failed to extract text from PDF");
    }
  };

  const generateSummaryFromNotes = async () => {
    if (!uploadedFile) {
      alert("Please upload a PDF or Image first");
      return;
    }

    setLoading(true);
    try {
      // Extract text from the uploaded file
      let extractedText = "";

      if (uploadedFile.type === "application/pdf") {
        extractedText = await extractTextFromPDF(uploadedFile);
      } else if (uploadedFile.type.startsWith("image/")) {
        const { data } = await Tesseract.recognize(uploadedFile, language);
        extractedText = data.text;
      } else {
        throw new Error("Unsupported file type. Please upload a PDF or image.");
      }

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error("No text could be extracted from the file.");
      }

      // Generate summary using Gemini
      const prompt = `Summarize this text into key points and concepts:\n${extractedText.substring(0, 10000)}`; // Limit text length
      
      const result = await geminiModel.generateContent(prompt);
      let summaryText = result.response.text();
      setSummary(summaryText);

      // Translate if needed
      if (language !== "en") {
        summaryText = await translateText(summaryText, language);
      }

      // Generate speech
      speakText(summaryText, speechLangCodes[language]);
      
    } catch (error) {
      console.error("Error processing notes:", error);
      alert(`Failed to process notes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="marg-top">
      <Navbar />
      <div className="immersive-container">
        <h1>🎓 Immersive AI Learning</h1>
    
        <div className="language-selector">
          <label>Select Language:</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            {Object.entries(languageOptions).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>
        
        {!isSpeechSupported && (
          <div className="warning-message">
            ⚠️ Text-to-speech is not supported in your browser. Audio features will be disabled.
          </div>
        )}
    
        <div className="grid-container">
          <div className="section">
            <h2>📽️ AI Video Lessons</h2>
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Enter topic" 
                value={videoTopic} 
                onChange={(e) => setVideoTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchYouTubeVideos()}
              />
              <button 
                className="generate-btn" 
                onClick={fetchYouTubeVideos}
                disabled={loading || !videoTopic}
              >
                {loading ? "Searching..." : "Search Videos"}
              </button>
            </div>
            <div className="video-list">
              {videos.map((video) => (
                <div key={video.id.videoId} className="video-container">
                  <iframe 
                    className="video-item" 
                    src={`https://www.youtube.com/embed/${video.id.videoId}`} 
                    allowFullScreen 
                    title={video.snippet.title}
                  ></iframe>
                  <p className="video-title">{video.snippet.title}</p>
                </div>
              ))}
            </div>
          </div>
    
          <div className="section">
            <h2>📖 AI Explanation</h2>
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Enter topic" 
                value={explanationTopic} 
                onChange={(e) => setExplanationTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && generateExplanation()}
              />
              <button 
                className="generate-btn" 
                onClick={generateExplanation}
                disabled={loading || !explanationTopic}
              >
                {loading ? "Generating..." : "Generate Explanation"}
              </button>
            </div>
            {explanation && (
              <div className="result-container">
                <h3>Explanation:</h3>
                <div className="explanation-text">{explanation}</div>
                {audioPlaying && <div className="audio-indicator">🔊 Playing audio...</div>}
                {isSpeechSupported && !audioPlaying && explanation && (
                  <button 
                    className="replay-btn"
                    onClick={() => speakText(explanation, speechLangCodes[language])}
                  >
                    🔄 Replay Audio
                  </button>
                )}
              </div>
            )}
          </div>
    
          <div className="section">
            <h2>📑 AI Summary</h2>
            <div className="file-upload">
              <input 
                type="file" 
                accept=".pdf, .png, .jpg, .jpeg" 
                onChange={(e) => setUploadedFile(e.target.files[0])}
              />
              <button 
                className="generate-btn" 
                onClick={generateSummaryFromNotes}
                disabled={loading || !uploadedFile}
              >
                {loading ? "Processing..." : "Generate Summary"}
              </button>
            </div>
            {uploadedFile && <p className="file-name">File: {uploadedFile.name}</p>}
            {summary && (
              <div className="result-container">
                <h3>Summary:</h3>
                <div className="summary-text">{summary}</div>
                {audioPlaying && <div className="audio-indicator">🔊 Playing audio...</div>}
                {isSpeechSupported && !audioPlaying && summary && (
                  <button 
                    className="replay-btn"
                    onClick={() => speakText(summary, speechLangCodes[language])}
                  >
                    🔄 Replay Audio
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ImmersiveAI;
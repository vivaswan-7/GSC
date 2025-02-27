import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./OfflineLearning.css";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";

const OfflineLearning = () => {
  const [topic, setTopic] = useState("");
  const [lesson, setLesson] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

  // AI Lesson Generation
  const generateLesson = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic!");
      return;
    }

    setLoading(true);
    setLesson(""); // Clear previous lesson
    
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Create a structured, offline-friendly learning guide for: "${topic}".

      Use these formatting guidelines:
      - Use H3 headings for sections (### Section title)
      - Use bullet points for key concepts
      - Use bold for important terms
      - Avoid using code blocks, backticks, or complex markdown
      
      Include these sections:
      - Introduction (what is this topic, why it's important)
      - Key Concepts (main ideas and definitions)
      - Applications (real-world examples)
      - Conclusion (summary and next steps)`;

      const result = await model.generateContent(prompt);
      const generatedText = result.response.text();

      if (generatedText) {
        // Process the text for safe HTML rendering
        let processedText = generatedText
          // Remove backticks completely
          .replace(/`/g, '')
          // Replace markdown headings with HTML headings
          .replace(/###\s+(.*?)(\n|$)/g, '<h3 style="color:#1e88e5; margin-top:15px;">$1</h3>')
          // Style bullet points
          .replace(/^\s*-\s+(.+)$/gm, '<p style="margin-left:15px;">• $1</p>')
          // Make bold text actually bold
          .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#2e7d32;">$1</strong>')
          // Ensure proper line breaks
          .replace(/\n\n/g, '<br/><br/>')
          .replace(/\n/g, '<br/>');

        setLesson(processedText);
      } else {
        setLesson("⚠️ No lesson generated.");
      }
    } catch (error) {
      console.error("Error generating lesson:", error);
      setLesson("⚠️ Lesson generation failed. Try again.");
    }
    
    setLoading(false);
  };

  const downloadPDF = () => {
    const lessonContent = document.getElementById("lesson-content");

    if (!lessonContent) {
      alert("⚠️ No lesson available to download.");
      return;
    }

    html2canvas(lessonContent, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 190;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("AI_Lesson.pdf");
    });
  };

  return (
    <div className="marg-top">
      <Navbar />
      <div className="skillforge-container">
        <h2>📥 Downloadable AI Lessons</h2>
        <input
          type="text"
          placeholder="Enter a topic (e.g., Web Development)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button onClick={generateLesson} disabled={loading}>
          {loading ? "Generating..." : "Get Lesson"}
        </button>

        {lesson && (
          <div className="card">
            <div id="lesson-content" className="lesson-content" dangerouslySetInnerHTML={{ __html: lesson }} />
            <button onClick={downloadPDF}>📩 Download PDF</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OfflineLearning;
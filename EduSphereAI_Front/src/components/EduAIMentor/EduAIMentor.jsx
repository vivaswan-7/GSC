import React, { useState } from "react";
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker"; // Required for pdf.js worker
import jsPDF from "jspdf";
import "./EduAIMentor.css";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import { GoogleGenerativeAI } from "@google/generative-ai";

const EduAIMentor = () => {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [summary, setSummary] = useState("");
  const [test, setTest] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("English");
  
  // Removed the unused languageCodes object

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const extractText = async () => {
    if (!file) return alert("Please upload a file first.");
    setLoading(true);
    setExtractedText("Extracting text...");

    if (file.type === "application/pdf") {
      await extractTextFromPDF(file);
    } else {
      await extractTextFromImage(file);
    }

    setLoading(false);
  };

  const extractTextFromImage = async (imageFile) => {
    try {
      const imageURL = URL.createObjectURL(imageFile);
      const { data } = await Tesseract.recognize(imageURL, "eng");
      setExtractedText(data.text);
    } catch (error) {
      setExtractedText("Error extracting text from image.");
      console.error("Tesseract Error:", error);
    }
  };

  const extractTextFromPDF = async (pdfFile) => {
    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(pdfFile);
      reader.onload = async () => {
        const pdf = await pdfjsLib.getDocument({ data: reader.result }).promise;
        let text = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item) => item.str).join(" ") + " ";
        }

        setExtractedText(text);
      };
    } catch (error) {
      setExtractedText("Error extracting text from PDF.");
      console.error("PDF.js Error:", error);
    }
  };

  const fetchAIResponse = async (prompt) => {
    try {
      const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("AI API Error:", error);
      return "Error generating response.";
    }
  };

  const summarizeText = async () => {
    if (!extractedText) return alert("Please extract text first.");
    setLoading(true);
    setSummary("Generating summary...");
    const result = await fetchAIResponse(`Summarize this: ${extractedText}`);
    setSummary(result);
    setLoading(false);
  };

  const generateTest = async () => {
    if (!extractedText) return alert("Please extract text first.");
    setLoading(true);
    setTest("Generating test...");
    const result = await fetchAIResponse(`Create a quiz from this: ${extractedText}`);
    setTest(result);
    setLoading(false);
  };

  const generateNotes = async () => {
    if (!extractedText) return alert("Please extract text first.");
    setLoading(true);
    setNotes("Generating notes...");
    const result = await fetchAIResponse(`Generate study notes from this: ${extractedText}`);
    setNotes(result);
    setLoading(false);
  };

  const downloadPDF = (title, content) => {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text(title, 10, 20);
    pdf.setFontSize(12);
    pdf.text(content, 10, 30, { maxWidth: 180 });
    pdf.save(`${title}.pdf`);
  };

  const translateText = async () => {
    if (!extractedText) return alert("Please extract text first.");
    setLoading(true);
    
    try {
      // Using Gemini API for translation
      const targetLang = language;
      const prompt = `Translate the following text from English to ${targetLang}:\n\n${extractedText}`;
      
      const translatedText = await fetchAIResponse(prompt);
      setExtractedText(translatedText);
    } catch (error) {
      alert("Error translating text.");
      console.error("Translation Error:", error);
    }
    
    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <div className="eduai-container">
        <h1>EduAI Mentor</h1>
        <p>AI-powered personalized learning assistant</p>

        <div className="upload-section">
          <h2>Upload Textbook (Text PDFs/Images)</h2>
          <input className="file-upload" type="file" accept=".pdf, .png, .jpg, .jpeg" onChange={handleFileChange} />
          <button onClick={extractText} disabled={!file || loading}>
            {loading ? "Extracting..." : "Extract Text"}
          </button>
        </div>

        <div className="ai-output">
          <h3>Extracted Text</h3>
          <textarea value={extractedText} readOnly placeholder="Extracted text will appear here..." />
        </div>

        <div className="ai-summary-section">
          <h2>AI Summarization</h2>
          <textarea value={summary} readOnly placeholder="AI-generated summary will appear here..." />
          <button onClick={summarizeText} disabled={!extractedText || loading}>
            {loading ? "Summarizing..." : "Summarize"}
          </button>
        </div>

        <div className="test-notes-section">
          <h2>Daily AI-Generated Tests & Notes</h2>
          <button onClick={generateTest} disabled={!extractedText || loading}>
            {loading ? "Generating..." : "Generate Test"}
          </button>
          <button onClick={generateNotes} disabled={!extractedText || loading}>
            {loading ? "Generating..." : "Generate Notes"}
          </button>
        </div>

        <div className="ai-output">
          <h3>AI-Generated Test:</h3>
          <textarea value={test} readOnly placeholder="Generated test will appear here..." />
          <button onClick={() => downloadPDF("AI_Generated_Test", test)} disabled={!test}>
            Download Test as PDF
          </button>
        </div>

        <div className="ai-output">
          <h3>AI-Generated Notes:</h3>
          <textarea value={notes} readOnly placeholder="Generated notes will appear here..." />
          <button onClick={() => downloadPDF("AI_Generated_Notes", notes)} disabled={!notes}>
            Download Notes as PDF
          </button>
        </div>

        <div className="multilingual-section">
          <h2>Multilingual Support</h2>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="Hindi">Hindi</option>
          </select>
          <button onClick={translateText} disabled={!extractedText || loading}>
            {loading ? "Translating..." : "Translate"}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EduAIMentor;
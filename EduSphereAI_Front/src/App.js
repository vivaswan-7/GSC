import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";  
import AuthPage from "./components/AuthPage/AuthPage";
import EduAIMentor from "./components/EduAIMentor/EduAIMentor";
import CareerAI from "./components/CareerAI/CareerAI";
import SkillForgeMain from "./components/SkillForge/SkillForgeMain";
import Challenge from "./components/SkillForge/Challenge";
import OfflineLearning from "./components/SkillForge/OfflineLearning";
import Playlists from "./components/SkillForge/Playlists";
import AiMatching from "./components/SkillForge/AiMatching";
import Dashboard from "./components/EduConnect/Dashboard";
import ImmersiveAI from "./components/ImmersiveAI/ImmersiveAI";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/eduai-mentor" element={<EduAIMentor />} />
        <Route path="/career-ai" element={<CareerAI />} />
        <Route path="/skillforge" element={<SkillForgeMain />} />
        <Route path="/challenge" element={<Challenge />} />
        <Route path="/ai-matching" element={<AiMatching />} />
        <Route path="/offline-learning" element={<OfflineLearning />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/educonnect" element={<Dashboard />} />
        <Route path="/immersive-learning" element={<ImmersiveAI />} />
      </Routes>
    </Router>
  );
}

export default App;



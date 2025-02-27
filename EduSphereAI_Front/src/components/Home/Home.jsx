import React from "react";
import Navbar from "./Navbar"; 
import HeroSection from "./HeroSection";
import EduaiSec from "./EduaiSec";
import CareerAISec from "./CareerAISec";
import SkillForgeSec from "./SkillForgeSec";
import EduC from "./EduC";
import ImmersiveLearning from "./ImmersiveLearning";
import GlobalEduSphere from "./GlobalEduSphere";
import Footer from "./Footer";


const Home = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <EduaiSec />
      <CareerAISec />
      <SkillForgeSec />
      <EduC />
      <ImmersiveLearning />
      <GlobalEduSphere />
      <Footer />
    </div>
  );
};

export default Home;
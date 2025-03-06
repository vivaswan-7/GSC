import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button, List, ListItem, useMediaQuery, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";

const SectionContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#1E3A8A",
  color: "white",
  textAlign: "center",
  padding: "80px 20px",
  [theme.breakpoints.down("sm")]: {
    padding: "60px 10px",
  },
}));

const Heading = styled(Typography)(({ theme }) => ({
  fontSize: "3rem",
  fontWeight: "bold",
  marginBottom: "20px",
  color: "#FBF2C0",
  [theme.breakpoints.down("sm")]: {
    fontSize: "2rem",
  },
}));

const Description = styled(Typography)(({ theme }) => ({
  fontSize: "1.4rem",
  maxWidth: "900px",
  margin: "0 auto 35px",
  lineHeight: "1.6",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1rem",
  },
}));

const FeatureList = styled(List)(({ theme }) => ({
  maxWidth: "700px",
  margin: "0 auto",
}));

const FeatureItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  padding: "18px",
  borderRadius: "10px",
  margin: "12px 0",
  fontSize: "1.3rem",
  transition: "transform 0.3s ease-in-out",
  cursor: "pointer",
  textAlign: "center",
  justifyContent: "center",
  "&:hover": {
    transform: "scale(1.05)",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "1rem",
    padding: "14px",
  },
}));

const ExploreButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#FFA500",
  color: "white",
  fontSize: "1.3rem",
  padding: "14px 30px",
  borderRadius: "8px",
  marginTop: "25px",
  textTransform: "none",
  transition: "transform 0.3s, backgroundColor 0.3s",
  "&:hover": {
    backgroundColor: "#FF8C00",
    transform: "scale(1.05)",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "1rem",
    padding: "10px 20px",
  },
}));

const EduaiSec = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const features = [
    "AI-powered textbook scanning & intelligent summarization",
    "Customized learning paths tailored to your strengths",
    "Smart quizzes & memory-enhancing revision techniques",
    "Real-time multilingual support for global learners",
    "Offline learning mode for seamless accessibility",
  ];

  return (
    <SectionContainer>
      <Heading variant="h2">🚀 Discover the Power of EduAI Mentor</Heading>
      <Description>
        Your smartest study companion! Simplify complex topics, generate personalized quizzes, and get AI-powered insights to boost your learning. Stay ahead with real-time translations, offline access, and AI-guided progress tracking.
      </Description>
      <FeatureList>
        {features.map((feature, index) => (
          <FeatureItem key={index}>🔹 {feature}</FeatureItem>
        ))}
      </FeatureList>
      <Link to="/eduai-mentor" style={{ textDecoration: "none" }}>
        <ExploreButton variant="contained" size={isMobile ? "medium" : "large"}>
          Explore EduAI Mentor
        </ExploreButton>
      </Link>
    </SectionContainer>
  );
};

export default EduaiSec;

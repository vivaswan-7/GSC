import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button, Grid, Card, CardContent } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

const FeatureCard = styled(motion(Card))(({ theme }) => ({
  backgroundColor: theme.palette.warning.light,
  color: theme.palette.text.primary,
  textAlign: "center",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  transition: "transform 0.3s ease-in-out",
  '&:hover': {
    transform: "scale(1.1)",
    boxShadow: theme.shadows[6],
  },
}));

const CareerAISec = () => {
  const features = [
    "AI-powered career assessments",
    "Recommended career paths based on interests",
    "Industry-relevant skill-building courses",
    "AI-generated certification exams",
  ];

  return (
    <Box sx={{ bgcolor: "black", py: 10, display: "flex", justifyContent: "center", px: 3 }}>
      <Box sx={{ bgcolor: "#FFC107", color: "white", textAlign: "center", p: { xs: 4, md: 6 }, borderRadius: 3, maxWidth: 900, width: "100%" }}>
        <Typography variant="h3" sx={{ fontWeight: "bold", color: "#330066", fontSize: { xs: "2rem", md: "3rem" } }}>
          Career AI
        </Typography>
        <Typography variant="body1" sx={{ my: 2, maxWidth: 750, mx: "auto", fontSize: { xs: "0.9rem", md: "1rem" } }}>
          Career AI helps learners discover the best career paths based on their skills
          and interests. It provides personalized career recommendations, job market
          trends, and skill-building resources to ensure career success.
        </Typography>
        <Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <FeatureCard whileHover={{ scale: 1.1 }}>
                <CardContent>
                  <Typography variant="body1" sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                    ◆ <strong>{feature}</strong>
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
        <Link to="/career-ai" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            sx={{
              mt: 3,
              bgcolor: "#4A148C",
              color: "white",
              fontSize: { xs: "1rem", md: "1.2rem" },
              fontWeight: "bold",
              '&:hover': { bgcolor: "#6A1B9A" },
              px: { xs: 3, md: 5 },
              py: { xs: 1, md: 1.5 },
            }}
          >
            Explore Career AI
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default CareerAISec;

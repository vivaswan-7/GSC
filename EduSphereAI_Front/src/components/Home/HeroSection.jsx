import React from "react";
import { Box, Typography, Button, Container, useMediaQuery, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

// Styled components
const HeroContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "100vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  textAlign: "center",
}));

const BackgroundImage = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundImage: "url('https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExODF4Y2sxZWhsOXZuNTFyN3F5dXQyZTgxYW00czFvY2pwdWdlcTNheCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/H0VvGdnwbJux2/giphy.gif')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  zIndex: -2,
});

const Overlay = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  zIndex: -1,
});

const ContentContainer = styled(Container)(({ theme }) => ({
  zIndex: 1,
  color: "white",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  padding: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const ExploreButton = styled(Button)(({ theme }) => ({
  padding: "12px 30px",
  fontSize: "1.1rem",
  backgroundColor: "#FF6B6B", // Bright coral color
  color: "white",
  marginTop: theme.spacing(3),
  boxShadow: theme.shadows[6],
  borderRadius: "25px", // Rounded corners for child-friendly look
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.1)",
    backgroundColor: "#FF5252", // Slightly darker on hover
  },
  [theme.breakpoints.down("sm")]: {
    padding: "10px 24px",
    fontSize: "1rem",
  },
}));

const HeroSection = () => {
  // Get the theme first
  const theme = useTheme();
  
  // Then use the theme in useMediaQuery
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Adjust animation variants based on screen size
  const textVariants = {
    hidden: { 
      opacity: 0, 
      y: isMobile ? 30 : 50 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: isMobile ? 0.8 : 1,
        staggerChildren: isMobile ? 0.2 : 0.3 
      } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <HeroContainer>
      <BackgroundImage />
      <Overlay />
      <ContentContainer maxWidth={isMobile ? "xs" : isTablet ? "sm" : "md"}>
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={textVariants}
          style={{ width: "100%" }}
        >
          <motion.div variants={itemVariants}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: "bold",
                fontSize: { 
                  xs: "2rem", 
                  sm: "3rem", 
                  md: "4rem" 
                },
                mb: { xs: 2, sm: 2.5, md: 3 },
                textShadow: "2px 2px 6px rgba(0,0,0,0.7)",
                color: "#4FC3F7", // Bright sky blue
              }}
            >
              Welcome to EduSphere
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography
              variant="h5"
              sx={{
                mb: { xs: 3, sm: 3.5, md: 4 },
                maxWidth: { xs: "100%", sm: "90%", md: "800px" },
                mx: "auto",
                lineHeight: { xs: 1.5, sm: 1.6, md: 1.7 },
                fontSize: { 
                  xs: "0.9rem", 
                  sm: "1.1rem", 
                  md: "1.5rem" 
                },
                px: { xs: 1, sm: 2, md: 0 },
                color: "#FFEB3B", // Bright yellow
              }}
            >
              EduSphere is an all-in-one AI-powered education platform designed to
              make learning accessible, engaging, and personalized.
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <ExploreButton 
              variant="contained"
              size={isMobile ? "medium" : "large"}
            >
              Explore EduSphere
            </ExploreButton>
          </motion.div>
        </motion.div>
      </ContentContainer>
    </HeroContainer>
  );
};

export default HeroSection;
import React from "react";
import { Container, Box } from "@mui/material";
import Calculate from "../components/calculate/Calculate";
import FloatingChatBox from "../components/OpenAIChatbox/Chatbox.jsx";
const Calculator = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        <Calculate />
      </Box>
      <FloatingChatBox />
    </Container>
  );
};

export default Calculator;

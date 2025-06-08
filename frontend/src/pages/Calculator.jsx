import React from "react";
import { Container, Box } from "@mui/material";
import Calculate from "../components/calculate/Calculate";

const Calculator = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        <Calculate />
      </Box>
    </Container>
  );
};

export default Calculator;

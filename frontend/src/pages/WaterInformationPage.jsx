import React from "react";
import { Container, Box } from "@mui/material";
import WaterTrackingPage from "../components/waterInformation/WaterInformation";

const WaterTracking = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        <WaterTrackingPage />
      </Box>
    </Container>
  );
};

export default WaterTracking;

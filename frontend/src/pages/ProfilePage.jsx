import React from "react";
import { Container, Box } from "@mui/material";
import Profile from "../components/profile/Profile";
import FloatingChatBox from "../components/OpenAIChatbox/Chatbox.jsx";
const ProfilePage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        <Profile />
      </Box>
      <FloatingChatBox />
    </Container>
  );
};

export default ProfilePage;

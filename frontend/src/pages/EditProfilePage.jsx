import React from "react";
import { Container, Box } from "@mui/material";
import EditProfile from "../components/profile/EditProfile";

const EditProfilePage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        <EditProfile />
      </Box>
    </Container>
  );
};

export default EditProfilePage;

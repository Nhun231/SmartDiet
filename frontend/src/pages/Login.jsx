import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import foodImage from '../assets/pexels-mvdheuvel-2284166.jpg';
import '../styles/login.css';
import React from "react";
import { Box, Button, TextField, Typography, Divider, Alert } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import Modal from '@mui/material/Modal';
import UserProfileForm from '../components/login/Register';


const style = {
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50vw',
    height: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};


export default function Login() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Container fluid>
            <Row style={{ position: "relative", height: "100vh" }}>
                <Col md={3} className="sidebar">
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            mx: "auto",
                            p: 3,
                            borderRadius: 2,
                            boxShadow: 3,
                            backgroundColor: "rgb(241, 240, 232)",
                            fontFamily: "sans-serif",
                        }}
                    >
                        <Row>
                            <Col>
                                <Typography variant="h5" fontWeight={500} gutterBottom
                                    style={{
                                        color: "black",
                                        fontFamily: "sans-serif",
                                        textAlign: "center",
                                        marginTop: "3vh",
                                        marginBottom: "15vh",
                                        fontSize: "2.5rem",
                                    }}
                                >
                                    SmartDiet
                                </Typography>
                            </Col>
                        </Row>


                        <Typography variant="h6" gutterBottom>
                            Log in to your account
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Don't have an account?{" "}
                            <Typography component="span" sx={{ color: "#007fff", fontWeight: 600, cursor: "pointer" }}
                                onClick={handleOpen}>
                                Sign Up
                            </Typography>
                        </Typography>


                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<GoogleIcon />}
                            sx={{ mb: 1, textTransform: "none" }}
                        >
                            Google
                        </Button>

                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<GitHubIcon />}
                            sx={{ mb: 2, textTransform: "none" }}
                        >
                            GitHub
                        </Button>
                        <Typography component="span" sx={{ color: "#007fff", fontWeight: 600, cursor: "pointer" }}
                            onClick={() => alert("Open forget password modal")}>
                            Forgot password?
                        </Typography>

                        <Divider sx={{ my: 2 }}>Or with email and password</Divider>

                        <TextField
                            label="Email Address"
                            fullWidth
                            sx={{ mb: 2 }}
                        />

                        <Button
                            variant="contained"
                            fullWidth
                            disabled
                        >
                            Next
                        </Button>
                    </Box>
                </Col>

                <Col className="no-padding">
                    <img
                        src={foodImage}
                        alt="Full size"
                        className="image-full"
                    />
                </Col>
            </Row>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <UserProfileForm />
                </Box>
            </Modal>
        </Container>
    );
}
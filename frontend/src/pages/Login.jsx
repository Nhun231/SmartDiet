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
import Snackbar from '@mui/material/Snackbar';
import ForgotPassword from '../components/login/ForgotPassword';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',        
    maxWidth: '90vw',      
    height: 'auto',         
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    overflowY: 'auto',  
};




export default function Login() {
    const [openRegister, setOpenRegister] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState('');
    const [successSendEmail, setSuccessSendEmail] = useState(false)
    const [openForgotPassword, setOpenForgotPassword] = useState(false)
    const handleOpenRegister = () => setOpenRegister(true);
    const handleOpenForgotPassword = () => setOpenForgotPassword(true);
    const handleCloseModal = () => {
        setOpenRegister(false)
        setOpenForgotPassword(false)
    };

    const handleClose = () => {
        setSuccessOpen(false);
        setSuccessSendEmail(false)
        setErrorOpen('');
    }

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
                                onClick={handleOpenRegister}>
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
                            onClick={handleOpenForgotPassword}>
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
                open={openRegister}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <UserProfileForm setSuccess={setSuccessOpen} setError={setErrorOpen} />
                </Box>
            </Modal>
            <Modal
                open={openForgotPassword}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <ForgotPassword setOpenForgotPassword={setOpenForgotPassword} setSuccess={setSuccessSendEmail}/>
                </Box>
            </Modal>
            <Snackbar
                open={errorOpen}
                autoHideDuration={2500}
                onClose={handleClose}
                message={errorOpen}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{
                    top: '5 !important',
                    position: 'fixed',
                    '& .MuiSnackbarContent-root': {
                        backgroundColor: theme => theme.palette.error.main,
                        color: 'white',
                    }
                }}
            />
            <Snackbar
                open={successOpen}
                autoHideDuration={2500}
                onClose={handleClose}
                message="Đăng ký thành công!"
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{
                    top: '5 !important',
                    position: 'fixed',
                    '& .MuiSnackbarContent-root': {
                        backgroundColor: theme => theme.palette.success.main,
                        color: 'white',
                    }
                }}
            />
            <Snackbar
                open={successSendEmail}
                autoHideDuration={2500}
                onClose={handleClose}
                message="Chúng tôi đã gửi cho bạn một Email để đổi mật khẩu."
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{
                    top: '5 !important',
                    position: 'fixed',
                    '& .MuiSnackbarContent-root': {
                        backgroundColor: theme => theme.palette.success.main,
                        color: 'white',
                    }
                }}
            />
        </Container>
    );
}
import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import foodImage from '../assets/pexels-mvdheuvel-2284166.jpg';
import '../styles/login.css';
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import React from "react";
import {Box, Button, TextField, Typography, Divider, Alert, CircularProgress} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import Modal from '@mui/material/Modal';
import UserProfileForm from '../components/login/Register';
import loginService from "../service/auth-service.jsx";


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
    const [emailOrName, setEmailOrName] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await loginService(emailOrName, password);
            setLoading(true);
            console.log(res);
            localStorage.setItem("accessToken", res.accessToken);
            navigate("/home");
        } catch (err) {
            const backendMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Có lỗi xảy ra khi đăng nhập";

            setErrorMsg(backendMessage);
            console.log(err);
        }finally {
            setLoading(false); // re-enable the button
        }
    };
    return (
        <Container fluid>
            <Row style={{ position: "relative", height: "100vh" }}>
                <Col md={4} className="sidebar">
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
                            Đăng nhập vào tài khoản của bạn
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Bạn chưa có tài khoản?{" "}
                            <Typography component="span" sx={{ color: "#007fff", fontWeight: 600, cursor: "pointer" }}
                                onClick={handleOpen}>
                                Đăng kí
                            </Typography>
                        </Typography>


                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<GoogleIcon />}
                            sx={{ mb: 1, textTransform: "none" }}
                        >
                            Đăng nhập bằng Google
                        </Button>
                        <Typography component="span" sx={{ color: "#007fff", fontWeight: 600, cursor: "pointer" }}
                            onClick={() => alert("Open forget password modal")}>
                            Quên mật khẩu?
                        </Typography>

                        <Divider sx={{ my: 2 }}>Hoặc đăng nhập bằng email/tên đăng nhập</Divider>
                        {errorMsg && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {errorMsg}
                            </Alert>
                        )}
                        <TextField
                            label="Email hoặc Tên đăng nhập"
                            type={"text"}
                            fullWidth
                            size="small"
                            autoFocus={true}
                            sx={{ mb: 2 }}
                            onChange={(e)=>setEmailOrName(e.target.value)}
                        />

                        <TextField
                            label="Mật khẩu"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            size="small"
                            sx={{ mb: 2 }}
                            onChange={(e)=>setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={()=>setShowPassword((prev) => !prev)} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                "Đăng nhập"
                            )}
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
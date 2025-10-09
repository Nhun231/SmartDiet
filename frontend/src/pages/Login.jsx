import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import foodImage from '../assets/pexels-mvdheuvel-2284166.jpg';
import '../styles/login.css';
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { Box, Button, TextField, Typography, Divider, Alert, CircularProgress } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import Modal from '@mui/material/Modal';
import UserProfileForm from '../components/login/Register';
import Snackbar from '@mui/material/Snackbar';
import ForgotPassword from '../components/login/ForgotPassword';
import loginService from "../service/auth-service.jsx";
import { jwtDecode } from "jwt-decode";


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




export default function Login({register}) {
    const [openRegister, setOpenRegister] = useState(!!register);
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
    const location = useLocation();

    useEffect(() => {
        if (location.state?.register) {
            setOpenRegister(true);
        }
    }, [location.state]);
    const handleClose = () => {
        setSuccessOpen(false);
        setSuccessSendEmail(false)
        setErrorOpen('');
    }
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
            navigate("/");
        } catch (err) {
            const backendMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Có lỗi xảy ra khi đăng nhập";

            setErrorMsg(backendMessage);
            console.log(err);
        } finally {
            setLoading(false); // re-enable the button
        }
    };
    const [oauthError, setOauthError] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const errorMsg = params.get("error");
        if (errorMsg) {
            setOauthError(decodeURIComponent(errorMsg));
        }
    }, [location.search]);
    return (
        <>
            <Dialog open={!!oauthError} onClose={() => setOauthError("")}>
                <DialogTitle>Google Login Error</DialogTitle>
                <DialogContent>
                    {oauthError}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOauthError("")} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
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
                                    <Typography variant="h3" fontWeight={500} gutterBottom
                                        className="title"
                                    >
                                        SmartDiet
                                    </Typography>
                                </Col>
                            </Row>


                            <Typography variant="h6" gutterBottom className="label">
                                Đăng nhập vào tài khoản của bạn
                            </Typography>

                            <Typography variant="body2" sx={{ mb: 2 }}>
                                Bạn chưa có tài khoản?{" "}
                                <Typography component="span" sx={{ color: "#4caf50", fontWeight: 600, cursor: "pointer" }}
                                    onClick={handleOpenRegister} >
                                    Đăng kí
                                </Typography>
                            </Typography>


                            <Button
                                variant="outlined"
                                fullWidth
                                startIcon={<GoogleIcon />}
                                sx={{ color: "#4caf50", mb: 1, textTransform: "none" }}
                                href={`${import.meta.env.VITE_API_BASE_URL}/auth/google`}
                            >
                                Đăng nhập bằng Google
                            </Button>
                            <Typography component="span" sx={{ color: "#4caf50", fontWeight: 600, cursor: "pointer" }}
                                onClick={handleOpenForgotPassword}>
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
                                onChange={(e) => setEmailOrName(e.target.value)}
                            />

                            <TextField
                                label="Mật khẩu"
                                type={showPassword ? "text" : "password"}
                                fullWidth
                                size="small"
                                sx={{ mb: 2 }}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
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
                                className="login-buttons"
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
                        <ForgotPassword setOpenForgotPassword={setOpenForgotPassword} setSuccess={setSuccessSendEmail} />
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
        </>
    );
}
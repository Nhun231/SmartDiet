import React, { useState } from "react";
import {
    TextField,
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    Alert,
    CircularProgress,
} from "@mui/material";
import baseAxios from "../../api/axios";
import { generateEncodedToken } from "../../utils/base64TokenUtils";

const textFieldSx = {
    "& .MuiInputBase-root": {
        backgroundColor: "#fff3e0",
        borderRadius: 1,
    },
    "& label": {
        color: "#a67843",
    },
    "& label.Mui-focused": {
        color: "#7a4f01",
    },
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            borderColor: "#a67843",
        },
        "&:hover fieldset": {
            borderColor: "#8c5e12",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#7a4f01",
            borderWidth: 2,
        },
    },
    "& input[type=date]": {
        color: "#7a4f01",
    },
};

export default function ForgotPassword({setOpenForgotPassword, setSuccess}) {
    const [email, setEmail] = useState("");
    const [errorEmail, setErrorEmail] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const handleChange = (e) => {
        setEmail(e.target.value);
        setErrorEmail(!emailRegex.test(e.target.value));
    };

    const handleSubmit = async () => {
        if (!email || errorEmail) {
            setMessage({ type: "error", text: "Hãy nhập email và kiểm tra lại định dạng email." });
            return;
        }
        setLoading(true);
        setMessage(null);

        try {
            const body = {
                email: email,
                token: generateEncodedToken(email, 10)
            }
            await baseAxios.post('email/forgotPassword', body)
            setSuccess(true)
            setOpenForgotPassword(false);
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.message || "Gửi email không thành công!",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f8f1e7",
            }}
        >
            <Card
                elevation={8}
                sx={{
                    width: "100%",
                    maxWidth: 480,
                    borderRadius: 3,
                    boxShadow: "0 4px 15px rgba(156, 102, 31, 0.25)",
                    backgroundColor: "#fff7ed",
                }}
            >
                <CardContent sx={{ padding: 4 }}>
                    <Typography variant="h5" fontWeight={600} textAlign="center" mb={3} sx={{ color: "#7a4f01" }}>
                        Nhập Email của bạn để nhận được đường dẫn đến trang đổi mật khẩu.
                    </Typography>

                    {message && (
                        <Alert
                            severity={message.type}
                            sx={{ mb: 2 }}
                            onClose={() => setMessage(null)}
                        >
                            {message.text}
                        </Alert>
                    )}

                    <TextField
                        label="Địa chỉ Email của bạn"
                        fullWidth
                        margin="normal"
                        type="email"
                        value={email}
                        onChange={handleChange}
                        error={errorEmail}
                        helperText={errorEmail ? "Hãy nhập đúng định dạng Email" : ""}
                        sx={textFieldSx}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        color="primary"
                        disabled={loading}
                        onClick={handleSubmit}
                        sx={{
                            mt: 3,
                            backgroundColor: "#a67843",
                            color: "#fff",
                            fontWeight: "bold",
                            "&:hover": {
                                backgroundColor: "#7a4f01",
                            },
                        }}
                    >
                        {loading ? <CircularProgress size={24} style={{ color: '#7a4f01' }} /> : "Gửi Email"}
                    </Button>

                </CardContent>
            </Card>
        </Box>
    );
}

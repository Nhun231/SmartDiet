import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Alert,
} from "@mui/material";
import backgroundImage from "../assets/homemade-orange-curd-with-juicy-oranges.jpg"
import { useParams, useNavigate } from "react-router-dom"
import { decodeToken } from "../utils/base64TokenUtils";
import baseAxios from "../api/axios";

const brownPalette = {
    light: "#fff3e0",
    main: "#a67843",
    dark: "#7a4f01",
};

const textFieldSx = {
    "& .MuiInputBase-root": {
        backgroundColor: brownPalette.light,
        borderRadius: 1,
    },
    "& label": {
        color: brownPalette.main,
    },
    "& label.Mui-focused": {
        color: brownPalette.dark,
    },
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            borderColor: brownPalette.main,
        },
        "&:hover fieldset": {
            borderColor: brownPalette.dark,
        },
        "&.Mui-focused fieldset": {
            borderColor: brownPalette.dark,
            borderWidth: 2,
        },
    },
    "& input": {
        color: brownPalette.dark,
    },
};

export default function ChangePassword() {
    const navigate = useNavigate();
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [disabled, setDisabled] = useState(true)
    const [errorPasswordFormat, setErrorPasswordFormat] = useState(false);
    const data = decodeToken(useParams().token);
    const [available, setAvailable] = useState()

    useEffect(() => {
        const current = Date.now();
        if (current > data.exp) {
            setAvailable(false);
            console.log('non available')
        } else {
            setAvailable(true)
            console.log('available')
        }
    }, [])

    const handleSubmit = () => {
        if (password.length < 6) {
            setMessage({ type: "error", text: "Hãy nhập mật khẩu mới" });
            return;
        }

        const body = {
            email: data.email,
            password: password
        }

        try {
            const result = baseAxios.put('users/update', body)

            if (result.status === 200) {
                setMessage({ type: "success", text: "Đổi mật khẩu thành công! Bạn sẽ được chuyển về trang chủ" });
                setDisabled(true);
            }

            setTimeout(() => {
                navigate('/home')
            }, 2000)
        } catch (e) {
            setMessage({ type: "error", text: "Đổi mật khẩu không thành công!" });
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (!passwordRegex.test(value)) {
            setDisabled(true)
            setErrorPasswordFormat(!passwordRegex.test(value));
        } else {
            setDisabled(false)
            setErrorPasswordFormat(!passwordRegex.test(value));
        }
    };



    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"
            sx={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                padding: 4
            }}
        >
            <Card
                elevation={6}
                sx={{
                    width: "100%",
                    maxWidth: 500,
                    borderRadius: 3,
                    backgroundColor: "#fff7ed",
                    boxShadow: "0 4px 15px rgba(156, 102, 31, 0.25)",
                    marginTop: "-15vh"
                }}
            >
                {available ? (<CardContent sx={{ padding: 4 }}>
                    <Typography
                        variant="h5"
                        textAlign="center"
                        fontWeight={600}
                        mb={3}
                        sx={{ color: brownPalette.dark }}
                    >
                        Nhập mật khẩu mới của bạn
                    </Typography>

                    {message && (
                        <Alert severity={message.type} sx={{ mb: 2 }}>
                            {message.text}
                        </Alert>
                    )}

                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={handlePasswordChange}
                        error={errorPasswordFormat}
                        helperText={
                            errorPasswordFormat
                                ? "Mật khẩu phải chứa chữ cái in hoa, số và ký tự đặc biệt (!@#$%^&*) và dài hơn 6 kí tự"
                                : ""
                        }
                        sx={textFieldSx}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={disabled}
                        sx={{
                            mt: 2,
                            backgroundColor: brownPalette.main,
                            color: "#fff",
                            fontWeight: "bold",
                            "&:hover": {
                                backgroundColor: brownPalette.dark,
                            },
                        }}
                    >
                        Đổi mật khẩu
                    </Button>
                </CardContent>) : (
                    <CardContent sx={{ padding: 4 }}>
                        <Typography
                            variant="h5"
                            textAlign="center"
                            fontWeight={600}
                            mb={3}
                            sx={{ color: brownPalette.dark }}
                        >
                            Đường dẫn của bạn đã hết hạn!
                        </Typography>
                    </CardContent>
                )}

            </Card>
        </Box>
    );
}

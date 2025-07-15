import React, { useState } from "react";
import {
    TextField,
    Typography,
    Box,
    Button,
    Card,
    CardContent
} from "@mui/material";
import baseAxios from "../../api/axios";
import { useNavigate } from "react-router-dom";

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

export default function UserProfileForm({ setSuccess, setError }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [errorEmail, setErrorEmail] = useState(false);
    const [password, setPassword] = useState("");
    const [cfPassword, setCfPassword] = useState("");
    const [dob, setDob] = useState();
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorPasswordFormat, setErrorPasswordFormat] = useState(false);

    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;

    const handleChangeEmailChange = (event) => {
        const value = event.target.value;
        setEmail(value);
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@.]+(?:\.[^\s@.]+)?$/;
        setErrorEmail(!emailPattern.test(value));
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setErrorPasswordFormat(!passwordRegex.test(value));
    };


    const submitRegister = async () => {
        if (password !== cfPassword) {
            setErrorPassword(true);
        } else {
            try {
                const body = {
                    email,
                    password,
                    username,
                    dob,
                };

                const result = await baseAxios.post("users/create", body);

                const { _id: userId } = result.data;
                console.log("User ID:", userId);
                localStorage.setItem("userId", userId);
                localStorage.setItem("dob", dob);
                console.log("DOB:", dob);

                setSuccess(true);
                console.log(result.response?.data);
            } catch (error) {
                setError(error.response?.data?.message || "Registration error");
                console.log(error.response?.data);
            }
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
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        align="center"
                        gutterBottom
                        sx={{ color: "#7a4f01" }}
                    >
                        User Registration
                    </Typography>

                    <TextField
                        label="Full Name"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={textFieldSx}
                    />
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={handleChangeEmailChange}
                        error={errorEmail}
                        helperText={errorEmail ? "Invalid email format." : ""}
                        sx={textFieldSx}
                    />
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
                                ? "Password must contain uppercase, number, and special character (!@#$%^&*)."
                                : ""
                        }
                        sx={textFieldSx}
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={cfPassword}
                        onChange={(e) => setCfPassword(e.target.value)}
                        error={errorPassword}
                        helperText={
                            errorPassword
                                ? "Passwords do not match."
                                : ""
                        }
                        sx={textFieldSx}
                    />
                    <TextField
                        label="Date of Birth"
                        type="date"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        sx={textFieldSx}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            mt: 3,
                            backgroundColor: "#a67843",
                            color: "#fff",
                            fontWeight: "bold",
                            "&:hover": {
                                backgroundColor: "#7a4f01",
                            },
                        }}
                        onClick={submitRegister}
                    >
                        Register
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}

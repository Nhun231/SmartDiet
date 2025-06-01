import React from "react";
import { useState } from "react";
import {
    Box,
    Grid,
    TextField,
    Typography,
    MenuItem,
    Button,
} from "@mui/material";
import { Container, Row, Col } from "react-bootstrap";

export default function UserProfileForm() {
    const [email, setEmail] = useState("");
    const [errorEmail, setErrorEmail] = useState(false);

    const handleChangeEmailChange = (event) => {
        const value = event.target.value;
        setEmail(value);
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        setErrorEmail(!emailPattern.test(value));
    };

    return (
        <Container>
            <Row>
                <Col>
                    <Typography
                        variant="h5"
                        fontWeight={600}
                        gutterBottom
                        textAlign={"center"}
                        marginTop={-2}>
                        User Registration
                    </Typography>
                </Col>
            </Row>
            <Row>
                <Col>
                    <TextField
                        label="Full Name"
                        name="fullName"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={handleChangeEmailChange}
                        error={errorEmail}
                        helperText={errorEmail ? "Email không hợp lệ, hãy nhập đúng định dạng!" : ""}
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Date of Birth"
                        name="dob"
                        type="date"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                </Col>
                <Col>
                    <TextField
                        label="Height (cm)"
                        name="height"
                        type="number"
                        fullWidth
                        margin="normal"
                        inputProps={{ min: 0 }}
                    />
                    <TextField
                        label="Weight (kg)"
                        name="weight"
                        type="number"
                        fullWidth
                        margin="normal"
                        inputProps={{ min: 0 }}
                    />
                    <TextField
                        label="Gender"
                        name="gender"
                        select
                        fullWidth
                        margin="normal"
                    >
                        {["Nam", "Nữ", "Khác"].map((gender) => (
                            <MenuItem key={gender} value={gender}>
                                {gender}
                            </MenuItem>
                        ))}
                    </TextField>
                </Col>

                <Button
                    variant="contained"
                    color="info"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => alert("Registration submitted")}
                >
                    Register
                </Button>
            </Row>
        </Container>
    );
}

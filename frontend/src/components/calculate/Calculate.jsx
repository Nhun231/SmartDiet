import React, { useState } from "react";
import {
    Box,
    Container,
    Typography,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    Paper,
    Button,
    Grid,
} from "@mui/material";
import "../../styles/themeCalculate.css";

const activityLevels = [
    { value: "ít", label: "Vận động ít", desc: "Vận động cơ bản" },
    { value: "nhẹ", label: "Vận động nhẹ", desc: "Tập luyện 1-3 buổi/tuần" },
    { value: "vừa", label: "Vận động vừa", desc: "Tập luyện 4-5 buổi/tuần" },
    { value: "nhiều", label: "Vận động nhiều", desc: "Tập luyện 6-7 buổi/tuần" },
    { value: "cực_nhiều", label: "Vận động cực nhiều", desc: "Cấp độ vận động viên" },
];

const Calculate = () => {
    const [form, setForm] = useState({
        email: "",
        gender: "Nam",
        age: "",
        height: "",
        weight: "",
        activity: "ít",
    });

    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleGender = (gender) => {
        setForm({ ...form, gender });
    };

    const handleSubmit = async () => {
        try {
            const res = await fetch("http://localhost:8080/smartdiet/customers/calculate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    userId: "USER_ID",
                }),
            });

            const data = await res.json();
            setResult(data);
        } catch (error) {
            alert("Có lỗi xảy ra khi gửi request.");
        }
    };

    return (
        <Container maxWidth="lg" className="tdee-wrapper">
            <Typography variant="h4" align="center" className="title">
                CÔNG CỤ TÍNH BMI, TDEE VÀ BMR ONLINE
            </Typography>
            <Typography align="center" className="subtitle">
                Tính lượng calo cần thiết cho cơ thể bạn mỗi ngày
                <br />
                Hãy cho SmartDiet một vài thông tin để tính cho bạn nhé:
            </Typography>

            <Box className="main-form-box">
                <Grid container spacing={12}>
                    {/* LEFT */}
                    <Grid item xs={12} md={6}>
                        <Typography className="label">Giới tính</Typography>
                        <Box className="gender-buttons">
                            <button
                                className={form.gender === "Nam" ? "active" : ""}
                                onClick={() => handleGender("Nam")}
                            >
                                NAM
                            </button>
                            <button
                                className={form.gender === "Nữ" ? "active" : ""}
                                onClick={() => handleGender("Nữ")}
                            >
                                NỮ
                            </button>
                        </Box>

                        <Typography className="label">Tuổi</Typography>
                        <TextField
                            fullWidth
                            name="age"
                            value={form.age}
                            onChange={handleChange}
                            placeholder="Nhập độ tuổi..."
                            className="input-box"
                        />

                        <Typography className="label">Chiều cao</Typography>
                        <TextField
                            fullWidth
                            name="height"
                            value={form.height}
                            onChange={handleChange}
                            placeholder="Nhập chiều cao... (cm)"
                            className="input-box"
                        />

                        <Typography className="label">Cân nặng</Typography>
                        <TextField
                            fullWidth
                            name="weight"
                            value={form.weight}
                            onChange={handleChange}
                            placeholder="Nhập cân nặng... (kg)"
                            className="input-box"
                        />

                        <Box textAlign="center" mt={3}>
                            <Button variant="contained" color="success" onClick={handleSubmit}>
                                TÍNH TOÁN
                            </Button>
                        </Box>
                    </Grid>

                    {/* RIGHT */}
                    <Grid item xs={12} md={6}>
                        <Paper className="activity-box">
                            <Typography align="center" className="activity-title">
                                CƯỜNG ĐỘ
                            </Typography>
                            <Grid container className="activity-header">
                                <Grid item xs={6}><strong>Cường độ vận động</strong></Grid>
                                <Grid item xs={6}><strong>Mô tả</strong></Grid>
                            </Grid>
                            <RadioGroup
                                name="activity"
                                value={form.activity}
                                onChange={handleChange}
                                className="activity-group"
                            >
                                {activityLevels.map((item) => (
                                    <Grid container key={item.value} className="activity-row">
                                        <Grid item xs={6}>
                                            <FormControlLabel
                                                value={item.value}
                                                control={<Radio />}
                                                label={item.label}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography>{item.desc}</Typography>
                                        </Grid>
                                    </Grid>
                                ))}
                            </RadioGroup>
                        </Paper>
                    </Grid>
                </Grid>



                {result && (
                    <Box className="result-box" mt={5}>
                        <Typography align="center" fontWeight="bold" fontSize={20} mb={2}>
                            CHỈ SỐ CALO CỦA BẠN
                        </Typography>
                        <Typography align="center" mb={1}>
                            <strong>BMR của bạn là:</strong> {result.bmr} Calo / ngày
                        </Typography>
                        <Typography align="center" mb={1}>
                            <strong>TDEE của bạn là:</strong> {result.tdee} Calo / ngày
                        </Typography>
                        <Typography align="center" mb={1}>
                            <strong>BMI của bạn là:</strong> {result.bmi}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default Calculate;

import React, { useState, useRef } from "react";
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../../styles/themeCalculate.css";
import baseAxios from "../../api/axios";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const activityLevels = [
    { value: "ít", label: "Vận động ít", desc: "Vận động cơ bản" },
    { value: "nhẹ", label: "Vận động nhẹ", desc: "Tập luyện 1-3 buổi/tuần" },
    { value: "vừa", label: "Vận động vừa", desc: "Tập luyện 4-5 buổi/tuần" },
    { value: "nhiều", label: "Vận động nhiều", desc: "Tập luyện 6-7 buổi/tuần" },
    { value: "cực_nhiều", label: "Vận động cực nhiều", desc: "Cấp độ vận động viên" },
];

const Calculate = () => {
    const [form, setForm] = useState({
        gender: "Nam",
        age: "",
        height: "",
        weight: "",
        activity: "ít",
    });

    const [result, setResult] = useState(null);
    const resultRef = useRef(null);
    const [errorAge, setErrorAge] = useState(false);
    const [helperAge, setHelperAge] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleGender = (gender) => {
        setForm({ ...form, gender });
    };

    const handleSubmit = async () => {

        const accessToken = localStorage.getItem("accessToken");
        const storedDob = localStorage.getItem("dob");
        if (storedDob) {
            const birthYear = new Date(storedDob).getFullYear();
            const inputAge = parseInt(form.age, 10);
            const currentYear = new Date().getFullYear();
            const expectedAge = currentYear - birthYear;
            if (Math.abs(expectedAge - inputAge) > 1) {
                setErrorAge(true);
                setHelperAge(`Tuổi bạn nhập (${inputAge}) không khớp với ngày sinh (${storedDob}).`);
                return;
            }
        }
        try {
            const res = await baseAxios.post("customer/calculate", {
                ...form,

            });
            setResult(res.data);
            setTimeout(() => {
                resultRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
            if (accessToken) {
                await baseAxios.put("users/update", {
                    gender: form.gender,
                    age: form.age,
                    height: form.height,
                    weight: form.weight,
                    activity: form.activity,
                },);
                console.log("Đã update hồ sơ user thành công!");
            }

        } catch (error) {
            console.error("Lỗi khi gửi request:", error);
            alert(error.response?.data?.message || "Có lỗi xảy ra khi gửi request.");
        }
    };

    const handleModalClose = (answer) => {
        setOpenModal(false);
        if (answer === "yes") {
            navigate("/setgoal");
        } else {
            navigate("/homepage");
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
                Hãy cho SmartDiet một vài thông tin để tính cho bạn nhé!
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
                            onChange={(e) => {
                                handleChange(e);
                                setErrorAge(false);
                                setHelperAge("");
                            }}
                            placeholder="Nhập độ tuổi..."
                            className="input-box"
                            error={errorAge}
                            helperText={helperAge}
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
                    <Box className="result-box" mt={6} ref={resultRef}>
                        <Typography align="center" fontWeight="bold" fontSize={24} color="#4CAF50" mb={2}>
                            CHỈ SỐ CALO CỦA BẠN
                        </Typography>
                        <Typography align="center" fontWeight="bold" mb={4}>
                            Dựa trên thông tin bạn đã cung cấp<br />
                            SmartDiet đã tính ra các chỉ số calo của bạn như sau:
                        </Typography>

                        <Grid container spacing={4} justifyContent="center">
                            <Grid item xs={12} md={3}>
                                <Typography align="center" fontWeight="bold" color="#2e7d32">
                                    BMR của bạn là:
                                </Typography>
                                <Typography align="center" fontSize={50} color="red" fontWeight="bold">
                                    {result.bmr}
                                </Typography>
                                <Typography align="center" color="gray">Calo / ngày</Typography>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <Typography align="center" fontWeight="bold" color="#2e7d32">
                                    TDEE của bạn là:
                                </Typography>
                                <Typography align="center" fontSize={50} color="red" fontWeight="bold">
                                    {result.tdee}
                                </Typography>
                                <Typography align="center" color="gray">Calo / ngày</Typography>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <Typography align="center" fontWeight="bold" color="#2e7d32">
                                    BMI của bạn là:
                                </Typography>
                                <Typography align="center" fontSize={50} color="red" fontWeight="bold">
                                    {result.bmi}
                                </Typography>
                                <Typography align="center" color="gray">Chỉ số khối cơ thể</Typography>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <Typography align="center" fontWeight="bold" color="#2e7d32">
                                    Lượng nước cần uống:
                                </Typography>
                                <Typography align="center" fontSize={50} color="red" fontWeight="bold">
                                    {result.waterIntake}
                                </Typography>
                                <Typography align="center" color="gray">Lít / ngày</Typography>
                            </Grid>
                        </Grid>
                        <Box textAlign="center" mt={4}>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => setOpenModal(true)}
                            >
                                Tạo kế hoạch ăn uống
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>

            <Dialog open={openModal} onClose={() => handleModalClose("no")}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningAmberIcon color="warning" />
                    Xác nhận tạo kế hoạch ăn uống
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có muốn tạo kế hoạch ăn uống dựa trên dữ liệu vừa tính toán không?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => handleModalClose("no")}
                        variant="outlined"
                        color="inherit"
                    >
                        Không
                    </Button>
                    <Button
                        onClick={() => handleModalClose("yes")}
                        variant="contained"
                        color="success"
                    >
                        Có, tạo ngay
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
};

export default Calculate;

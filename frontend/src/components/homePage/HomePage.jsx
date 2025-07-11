import React from "react";
import { Box, Typography, Button, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import heroBanner from "../../assets/healthyfood.jpg";
import Register from "../login/Register";
import { Apple, Calculate, Favorite, Restaurant } from "@mui/icons-material";
import FloatingChatBox from "../OpenAIChatbox/Chatbox.jsx";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <>
            {/* Banner Section */}
            <Box
                sx={{
                    width: "100%",
                    height: { xs: "auto", md: "400px" },
                    backgroundImage: `url(${heroBanner})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    px: 2,
                    py: 6,
                    position: "relative",
                    marginTop: 3
                }}
            >
                <Box
                    sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                        color: "white",
                        padding: 4,
                        borderRadius: 2,
                        maxWidth: "900px",
                    }}
                >
                    <Typography variant="h4" fontWeight={600} mb={2}>
                        Công cụ tính chỉ số BMI – TDEE – BMR chuẩn Việt
                    </Typography>
                    <Typography variant="body1" fontWeight={200} mb={3}>
                        Quản lý sức khỏe bắt đầu từ những con số – Dễ dùng, khoa học, gần gũi
                    </Typography>
                    <Button
                        variant="contained"
                        color="success"
                        size="large"
                        onClick={() => navigate("/login")}
                        sx={{ fontWeight: 600 }}
                    >
                        Bắt đầu ngay
                    </Button>
                </Box>
            </Box>

            {/* Features Section */}
            <Box
                width="100%"
                sx={{
                    px: { xs: 2, md: 6, lg: 10 },
                    maxWidth: "1600px",
                    mx: "auto",
                    color: "#2e7d32",
                    my: 10,
                }}
            >
                <Grid container spacing={4} justifyContent="center">
                    {[
                        {
                            icon: <Calculate fontSize="large" sx={{ color: "#4CAF50" }} />, title: "Công cụ tính toán",
                            desc: "Tính chỉ số BMI, BMR, và TDEE một cách chính xác",
                        },
                        {
                            icon: <Favorite fontSize="large" sx={{ color: "#4CAF50" }} />, title: "Theo dõi sức khỏe",
                            desc: "Kiểm tra và theo dõi sức khỏe của bạn dễ dàng",
                        },
                        {
                            icon: <Restaurant fontSize="large" sx={{ color: "#4CAF50" }} />, title: "Lập kế hoạch ăn uống",
                            desc: "Tùy chỉnh chế độ ăn phù hợp với mục tiêu của bạn",
                        },
                        {
                            icon: <Apple fontSize="large" sx={{ color: "#4CAF50" }} />, title: "Lên thực đơn khoa học",
                            desc: "Đề xuất món ăn cân bằng dinh dưỡng mỗi ngày",
                        },
                    ].map((item, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 3,
                                    textAlign: "center",
                                    height: "100%",
                                    borderRadius: 3,
                                    transition: "all 0.3s",
                                    '&:hover': {
                                        transform: "translateY(-5px)",
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                <Box mb={1}>{item.icon}</Box>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    {item.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.desc}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <FloatingChatBox />
        </>
    );
};

export default HomePage;

import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import heroBanner from "../assets/healthyfood.jpg";
import { useNavigate } from "react-router-dom";

import { MenuItem, Select, FormControl, InputLabel, Button } from "@mui/material";
import {
    CircularProgressbar,
    buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import { Nav } from "react-bootstrap";

const UserHomePage = () => {
    const navigate = useNavigate();
    const caloriesTaken = 500;
    const caloriesTarget = 2279;
    const percentage = Math.min(100, (caloriesTaken / caloriesTarget) * 100);
    const totalWaterCups = 8;
    const waterPerCup = 296;
    const [cupsDrank, setCupsDrank] = useState(0);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedMeal, setSelectedMeal] = useState("");
    const meals = {
        "Bữa sáng": ["Trứng chiên", "Bánh mì nguyên cám", "Sữa đậu nành"],
        "Bữa trưa": ["Cơm gạo lứt", "Ức gà", "Rau xanh luộc"],
        "Bữa tối": ["Salad cá ngừ", "Khoai lang", "Súp rau củ"]
    };
    const handleDrinkClick = (index) => {
        const newCups = index + 1;
        setCupsDrank(newCups);
    };

    return (
        <Box sx={{ backgroundColor: "#F1F8E9", minHeight: "100vh", fontFamily: "sans-serif" }}>
            <Header />
            <Box
                sx={{
                    backgroundColor: "rgb(91, 122, 72)",
                    padding: 3,
                    borderBottomLeftRadius: "50% 60px",
                    borderBottomRightRadius: "50% 60px",
                    width: "100%",
                    mx: "auto",
                    color: "#fff"
                }}
            >
                <Box sx={{ width: "75%", alignItems: "center", mx: "auto" }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body1" fontSize={25}>{dayjs().format("HH:mm")}</Typography>

                            <Box display="flex" alignItems="center">
                                <IconButton size="small" sx={{ color: "#fff" }} onClick={() => setSelectedDate(prev => prev.subtract(1, "day"))}>
                                    <ArrowBackIosIcon fontSize="small" />
                                </IconButton>

                                <DatePicker
                                    value={selectedDate}
                                    onChange={(newDate) => setSelectedDate(newDate)}
                                    slotProps={{
                                        textField: {
                                            variant: "standard",
                                            InputProps: {
                                                disableUnderline: true,
                                                sx: {
                                                    color: "#fff",
                                                    textAlign: "center",
                                                    width: 170,
                                                    fontSize: 20,
                                                    svg: {
                                                        color: "#fff"
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                />

                                <IconButton size="small" sx={{ color: "#fff" }} onClick={() => setSelectedDate(prev => prev.add(1, "day"))}>
                                    <ArrowForwardIosIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>
                    </LocalizationProvider>

                    <Box mt={3} textAlign="center">
                        <Typography variant="h5">Calories Hôm Nay</Typography>
                        <Box display="flex" justifyContent="space-around" alignItems="center" mt={2}>
                            <Typography fontSize={20}>{caloriesTaken} đã nạp</Typography>
                            <Box sx={{ width: 200, height: 200 }}>
                                <CircularProgressbar
                                    value={percentage}
                                    text={`${caloriesTaken}/${caloriesTarget}`}
                                    styles={buildStyles({
                                        pathColor: "#ffffff",
                                        trailColor: "rgba(255,255,255,0.3)",
                                        textColor: "#ffffff",
                                        textSize: "12px"
                                    })}
                                />
                            </Box>
                            <Typography fontSize={20}>0 tiêu hao</Typography>
                        </Box>
                    </Box>

                    <Box mt={4} display="flex" justifyContent="space-around">
                        {[
                            { label: "Carbs", value: "0/199" },
                            { label: "Chất đạm", value: "0/199" },
                            { label: "Chất béo", value: "0/76" }
                        ].map((item, index) => (
                            <Box key={index} textAlign="center">
                                <Typography variant="body2" fontSize={19}>{item.label}</Typography>
                                <Box sx={{ height: 4, width: 80, backgroundColor: "#fff", mt: 1, mb: 0.5 }} />
                                <Typography variant="caption" fontSize={17}>{item.value}</Typography>
                            </Box>
                        ))}
                    </Box>

                    <Box mt={4}>
                        <Typography>Bạn đã uống bao nhiêu nước?</Typography>
                        <Typography variant="h6" sx={{ mt: 1 }}>
                            {cupsDrank * waterPerCup}/{totalWaterCups * waterPerCup} ml
                        </Typography>

                        <Box display="flex" justifyContent="center" mt={2}>
                            {[...Array(totalWaterCups)].map((_, i) => (
                                <IconButton
                                    key={i}
                                    onClick={() => handleDrinkClick(i)}
                                    sx={{
                                        mx: 0.5,
                                        transform: cupsDrank > i ? "scale(1.2)" : "scale(1)",
                                        transition: "transform 0.2s ease",
                                        color: cupsDrank > i ? "#fff" : "rgba(255,255,255,0.3)"
                                    }}
                                >
                                    <EmojiFoodBeverageIcon sx={{ fontSize: 32 }} />
                                </IconButton>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Intro Section */}
            <Box sx={{ mt: 6, px: 4, textAlign: "center" }}>
                <Typography variant="h5" fontWeight="bold" color="#00C896">
                    Giải pháp theo dõi dinh dưỡng và sức khỏe mỗi ngày
                </Typography>
                <Typography sx={{ mt: 1, fontSize: 16 }}>
                    SmartDiet giúp bạn quản lý chế độ ăn, lượng nước, calo tiêu thụ và nhiều chỉ số sức khỏe khác để đạt mục tiêu cá nhân một cách khoa học.
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 3,
                    mt: 5,
                    px: 2
                }}
            >
                {[
                    {
                        title: "Tính chỉ số BMI/BMR",
                        icon: <LocalFireDepartmentIcon sx={{ fontSize: 40, color: "#00C896" }} />,
                        onClick: () => console.log("Đi tới BMI")
                    },
                    {
                        title: "Thực đơn theo mục tiêu",
                        icon: <EmojiFoodBeverageIcon sx={{ fontSize: 40, color: "#00C896" }} />,
                        onClick: () => console.log("Đi tới thực đơn")
                    },
                    {
                        title: "Theo dõi nước & dinh dưỡng",
                        icon: <Typography sx={{ fontSize: 40, color: "#00C896" }}>💧</Typography>,
                        onClick: () => console.log("Đi tới nước & dinh dưỡng")
                    },
                    {
                        title: "Thực đơn hôm nay",
                        icon: <Typography sx={{ fontSize: 40, color: "#00C896" }}>📋</Typography>,
                        onClick: () => navigate("/meal")
                    }
                ].map((item, i) => (
                    <Box
                        key={i}
                        onClick={item.onClick}
                        sx={{
                            width: 200,
                            textAlign: "center",
                            borderRadius: 2,
                            p: 2,
                            boxShadow: 2,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            "&:hover": {
                                transform: "scale(1.03)",
                                boxShadow: 4
                            }
                        }}
                    >
                        {item.icon}
                        <Typography fontWeight="bold" mt={1}>{item.title}</Typography>
                    </Box>
                ))}
            </Box>



            <Box sx={{ mt: 8, py: 4, textAlign: "center", backgroundColor: "#F1F8E9", color: "#4E944F" }}>

            </Box>
            <Footer />
        </Box>
    );
};

export default UserHomePage;

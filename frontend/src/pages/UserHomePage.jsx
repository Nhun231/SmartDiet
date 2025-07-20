import React, { useEffect, useState } from "react";
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
import baseAxios from "../api/axios";

const UserHomePage = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const [caloriesTarget, setCaloriesTarget] = useState(0);
    const [totalWater, setTotalWater] = useState(0);
    const [caloriesTaken, setCaloriesTaken] = useState(0);
    const [carbs, setCarbs] = useState(0);
    const [protein, setProtein] = useState(0);
    const [fat, setFat] = useState(0);
    const percentage = Math.min(100, (caloriesTaken / caloriesTarget) * 100);
    const totalWaterCups = 8;
    const [waterPerCup, setWaterPerCup] = useState(0);
    const [cupsDrank, setCupsDrank] = useState(0);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedMeal, setSelectedMeal] = useState("");
    const [consumption, setConsumption] = useState(0);
    const meals = {
        "Bữa sáng": ["Trứng chiên", "Bánh mì nguyên cám", "Sữa đậu nành"],
        "Bữa trưa": ["Cơm gạo lứt", "Ức gà", "Rau xanh luộc"],
        "Bữa tối": ["Salad cá ngừ", "Khoai lang", "Súp rau củ"]
    };
    const handleDrinkClick = async (index) => {
        const newCups = index + 1;
        console.log(`Cups clicked: ${newCups}`);
        const newAmount = newCups * waterPerCup;
        console.log(`Cups drank: ${newCups}, Amount: ${newAmount}`);
        if (cupsDrank == 0) {
            try {
                const create = await baseAxios.post("/water-intake", {
                    userId: userId,
                    amount: newAmount,
                    date: selectedDate.format("YYYY-MM-DD")
                });
                console.log("Water intake created:", create.data);
            } catch (error) {
                console.error("Error creating water intake:", error);
            }
        } else {
            try {
                const update = await baseAxios.put("/water-intake", {
                    userId: userId,
                    date: selectedDate.format("YYYY-MM-DD"),
                    amount: newAmount
                });
                console.log("Water intake updated:", update.data);
            } catch (error) {
                console.error("Error creating water intake:", error);
            }
        }

        setCupsDrank(newCups);
    };

    const getTarget = async () => {
        try {
            const response = await baseAxios.get("/customer/calculate/newest");
            console.log("Latest calculate data:", response.data);
            if (response.status == 200) {
                setCaloriesTarget(response.data.tdee);
                setConsumption(response.data.tdee - response.data.bmr);
                setTotalWater(response.data.waterIntake);
                setWaterPerCup((response.data.waterIntake * 1000) / 8);
            }
            return response;
        } catch (error) {
            console.error("Error fetching latest calculate data:", error);
        }
    }

    const getMeal = async () => {
        try {
            const response = await baseAxios.get("/meals", {
                params: {
                    userId: userId,
                    date: selectedDate.format("YYYY-MM-DD")
                }
            });
            if (response.status == 200) {
                let totalCalories = 0;
                let totalCarbs = 0;
                let totalProtein = 0;
                let totalFat = 0;
                response.data.forEach(meal => {
                    if (meal.totals && typeof meal.totals.calories === 'number') {
                        totalCalories += meal.totals.calories || 0;
                        totalCarbs += meal.totals.carbs || 0;
                        totalProtein += meal.totals.protein || 0;
                        totalFat += meal.totals.fat || 0;
                    }
                });
                setCaloriesTaken(totalCalories);
                setCarbs(totalCarbs);
                setProtein(totalProtein);
                setFat(totalFat);
            }
            return response;
        } catch (error) {
            console.error("Error fetchin meals data:", error);
        }
    }

    // const getWaterIntake = async () => {
    //     try {
    //         console.log("Fetching water intake for user:", userId, "on date:", selectedDate.format("YYYY-MM-DD"));
    //         const response = await baseAxios.get("/water-intake", {
    //             params: { userId, date: selectedDate.format("YYYY-MM-DD") }
    //         });
    //         if (response.status === 200 && response.data) {
    //             const calculatedCups = response.data.amount / waterPerCup;
    //             console.log("Caulate cups", calculatedCups);
    //             if (cupsDrank !== calculatedCups) {
    //                 setCupsDrank(calculatedCups);
    //             }
    //         } else {
    //             setCupsDrank(0);
    //         }

    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    const getWaterIntake = async () => {
        try {
            console.log("Fetching water intake for user:", userId, "on date:", selectedDate.format("YYYY-MM-DD"));
            const response = await baseAxios.get("/water/water-bydate", {
                params: { date: selectedDate.format("YYYY-MM-DD") }
            });
            if (response.status === 200 && response.data) {
                const calculatedCups = response.data.consumed / waterPerCup;
                console.log("Caulate cups", calculatedCups);
                if (cupsDrank !== calculatedCups) {
                    setCupsDrank(calculatedCups);
                }
            } else {
                setCupsDrank(0);
            }

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        try {
            getTarget();
            getMeal();
        } catch (error) {
            console.error("Error fetching latest calculate data:", error);
        }
    }, []);

    useEffect(() => {
        if (totalWater > 0) {
            getWaterIntake();
        }
    }, [totalWater]);

    useEffect(() => {
        getMeal();
        if (totalWater > 0) {
            getWaterIntake();
        }
    }, [selectedDate]);

    useEffect(() => {

    }, [cupsDrank]);

    return (
        <Box sx={{ backgroundColor: "#F1F8E9", minHeight: "100vh", fontFamily: "sans-serif" }}>
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
                        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                            <Typography sx={{ position: 'absolute', left: '28vw' }} fontSize={20}>{caloriesTaken} đã nạp</Typography>
                            <Box sx={{ width: 200, height: 200, position: "relative" }}>
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
                            <Typography sx={{ position: 'absolute', right: '28vw' }} fontSize={20}>{consumption} tiêu hao</Typography>
                        </Box>
                    </Box>

                    <Box mt={4} display="flex" justifyContent="space-around">
                        {[
                            { label: "Carbs", value: carbs.toFixed(1) },
                            { label: "Chất đạm", value: protein.toFixed(1) },
                            { label: "Chất béo", value: fat.toFixed(1) }
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
                            {(cupsDrank * waterPerCup).toFixed(1)}/{(totalWater * 1000).toFixed(1)} ml
                        </Typography>

                        <Box display="flex" justifyContent="center" mt={2}>
                            {[...Array(totalWaterCups)].map((_, i) => (
                                <IconButton
                                    key={i}
                                    // onClick={() => handleDrinkClick(i)}
                                    sx={{
                                        mx: 0.5,
                                        // transform: cupsDrank > i ? "scale(1.2)" : "scale(1)",
                                        // transition: "transform 0.2s ease",
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
        </Box>
    );
};

export default UserHomePage;

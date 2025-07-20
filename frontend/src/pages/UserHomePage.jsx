import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
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
    const [loading, setLoading] = useState(true);
    const [calculationData, setCalculationData] = useState(null);
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [waterConsum, setWaterConsum] = useState(0)
    const currentCupIndex = Math.floor(cupsDrank);
    const [isToday, setIsToday] = useState(new Date(selectedDate).toDateString() === new Date().toDateString());

    const handleDrinkClick = async (index) => {
        const newCups = index + 1;
        const newAmount = newCups * waterPerCup - waterConsum;
        console.log(`Cups drank: ${newCups}, Amount: ${newAmount}`);

        try {
            const response = await baseAxios.post('/water/add-water', {
                amount: newAmount
            })

            if (response.status == 200) {
                setCupsDrank(newCups);
                getWaterIntake()
            }
        } catch (error) {
            console.log(error)
        }
    };

    const checkValidCurrentTime = () => {
        return new Date(selectedDate).toDateString() === new Date().toDateString();
    }

    const getTarget = async () => {
        try {
            const response1 = await baseAxios.get("/customer/dietplan/get-by-date", {
                params: { date: selectedDate.format("YYYY-MM-DD") }
            });

            const response2 = await baseAxios.get("/customer/calculate/newest")
            console.log("Latest calculate data:", response1.data);
            console.log("Latest calculate data:", response2.data);

            if (response2.status == 200 && response1.status == 200) {
                setCaloriesTarget(response1.data.referenceTDEE);
                setConsumption(response1.data.referenceTDEE - response2.data.bmr);
                setTotalWater(response2.data.waterIntake);
                setWaterPerCup((response2.data.waterIntake * 1000) / 8);
            } else if (response2.status == 200 && response1.status != 200) {
                setCaloriesTarget(response2.data.tdee);
                setConsumption(response2.data.tdee - response2.data.bmr);
                setTotalWater(response2.data.waterIntake);
                setWaterPerCup((response2.data.waterIntake * 1000) / 8);
            }
            return response2;
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

    const getWaterIntake = async () => {
        try {
            const response = await baseAxios.get("/water/water-bydate", {
                params: { date: selectedDate.format("YYYY-MM-DD") }
            });
            if (response.status === 200 && response.data) {
                setWaterConsum(response.data.consumed)
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
        getTarget();
        setIsToday(checkValidCurrentTime());
        if (totalWater > 0) {
            getWaterIntake();
        }
    }, [selectedDate]);

    useEffect(() => {

    }, [cupsDrank]);

    useEffect(() => {
        const checkCalculateData = async () => {
            try {
                const res = await baseAxios.get('/customer/calculate/newest');
                if (res.data && res.data.tdee) {
                    setCalculationData(res.data);
                } else {
                    setShouldRedirect(true);
                }
            } catch (err) {
                setShouldRedirect(true);
            } finally {
                setLoading(false);
            }
        };

        checkCalculateData();
    }, []);

    useEffect(() => {
        if (shouldRedirect) {
            navigate('/calculate');
        }
    }, [shouldRedirect, navigate]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }
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
                                    onClick={isToday && i === currentCupIndex ? () => handleDrinkClick(i) : undefined}
                                    sx={{
                                        mx: 0.5,
                                        cursor: isToday && i === currentCupIndex ? "pointer" : "default",
                                        pointerEvents: isToday && i === currentCupIndex ? "auto" : "none",
                                        color:
                                            i < currentCupIndex
                                                ? "#fff"
                                                : i === currentCupIndex
                                                    ? "#6db0b4ff"
                                                    : "rgba(255,255,255,0.3)",
                                        position: "relative"
                                    }}
                                >
                                    <EmojiFoodBeverageIcon sx={{ fontSize: 32 }} />

                                    {isToday && i === currentCupIndex && (
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                top: -8,
                                                right: -8,
                                                backgroundColor: "#1976d2",
                                                borderRadius: "50%",
                                                width: 20,
                                                height: 20,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#fff",
                                                fontSize: 14
                                            }}
                                        >
                                            +
                                        </Box>
                                    )}
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
                        onClick: () => navigate("/my-profile")
                    },
                    {
                        title: "Thực đơn theo mục tiêu",
                        icon: <EmojiFoodBeverageIcon sx={{ fontSize: 40, color: "#00C896" }} />,
                        onClick: () => navigate("/dietplan/create")
                    },
                    {
                        title: "Theo dõi nước & dinh dưỡng",
                        icon: <Typography sx={{ fontSize: 40, color: "#00C896" }}>💧</Typography>,
                        onClick: () => navigate("/water-infor")
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

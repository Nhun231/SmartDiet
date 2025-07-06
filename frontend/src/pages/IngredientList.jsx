import React, { useState, useEffect } from "react";
import baseAxios from "../api/axios";
import {
    Box,
    Typography,
    TextField,
    Grid,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IngredientCard from "../components/ingredient/IngredientCard";
import IngredientDetailModal from "../components/ingredient/IngredientDetailModal";
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import axios from "axios";

const mealTypes = [
    { label: "Bữa sáng", value: "breakfast" },
    { label: "Bữa trưa", value: "lunch" },
    { label: "Bữa tối", value: "dinner" },
    { label: "Bữa phụ", value: "snack" },
];

const today = new Date().toISOString().split("T")[0];

const IngredientList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [selectedMeal, setSelectedMeal] = useState("breakfast");
    const [meals, setMeals] = useState({});
    const [modalMode, setModalMode] = useState("add"); // add | edit
    const [editIndex, setEditIndex] = useState(null);
    const userId = localStorage.getItem("userId");


    useEffect(() => {
        baseAxios.get(`/ingredients`)
            .then((res) => setIngredients(res.data))
            .catch((err) => console.error("Lỗi khi lấy nguyên liệu:", err));
    }, []);

    useEffect(() => {
        mealTypes.forEach((m) => loadMealByType(m.value));
    }, []);

    const loadMealByType = async (mealType) => {
        try {
            const res = await baseAxios.get(`/meals/by-date`, {
                params: { date: today, mealType, userId },
            });

            if (res.data) {
                setMeals((prev) => ({ ...prev, [mealType]: res.data }));
            } else {
                setMeals((prev) => ({ ...prev, [mealType]: { ingredients: [] } }));
            }
            console.log(res.data)
        } catch (err) {
            if (err.response?.status === 404) {
                setMeals((prev) => ({ ...prev, [mealType]: { ingredients: [] } }));
            } else {
                console.error("Lỗi load meal:", err);
            }
        }
    };


    const saveMeal = async (mealType, newIngredients) => {
        const existingMeal = meals[mealType];
        if (existingMeal?._id) {
            await baseAxios.put(`/meals/${existingMeal._id}`, {
                ...existingMeal,
                ingredients: newIngredients,
            });
        } else {

            await baseAxios.post(`/meals`, {
                mealType,
                date: today,
                ingredients: newIngredients,
                userId, // thêm dòng này
            });

        }
        await loadMealByType(mealType);
    };

    const handleAddToMeal = async (ingredient, quantity = 100) => {
        const payloadIngredient = {
            ingredientId: ingredient._id,
            quantity: parseFloat(quantity),
        };
        const existingMeal = meals[selectedMeal];
        const updatedIngredients = [...(existingMeal?.ingredients || []), payloadIngredient];
        await saveMeal(selectedMeal, updatedIngredients);
    };

    const handleDeleteIngredient = async (mealType, indexToDelete) => {
        const existingMeal = meals[mealType];
        if (!existingMeal?._id) return;
        const updatedIngredients = existingMeal.ingredients.filter((_, idx) => idx !== indexToDelete);
        await saveMeal(mealType, updatedIngredients);
    };

    const handleEditIngredient = (mealType, index) => {
        const ing = meals[mealType].ingredients[index];
        setSelectedIngredient(ing.ingredientId);
        setSelectedMeal(mealType);
        setModalMode("edit");
        setEditIndex(index);
    };

    const handleSaveFromModal = async (ingredient, quantity) => {
        const meal = meals[selectedMeal];
        const newItem = {
            ingredientId: ingredient._id,
            quantity: parseFloat(quantity),
        };

        let updatedIngredients = [...(meal?.ingredients || [])];

        if (modalMode === "add") {
            const existingIndex = updatedIngredients.findIndex(
                (ing) =>
                    (typeof ing.ingredientId === "string"
                        ? ing.ingredientId
                        : ing.ingredientId?._id) === ingredient._id
            );

            if (existingIndex !== -1) {
                // 👉 Gộp số gram nếu đã có
                updatedIngredients[existingIndex].quantity += newItem.quantity;
            } else {
                // 👉 Nếu chưa có thì thêm mới
                updatedIngredients.push(newItem);
            }
        } else if (modalMode === "edit") {
            // 👉 Cập nhật lại số lượng ở index đã chọn
            updatedIngredients[editIndex] = newItem;
        }

        await saveMeal(selectedMeal, updatedIngredients);
        setSelectedIngredient(null);
        setModalMode("add");
        setEditIndex(null);
    };


    const filtered = ingredients.filter((i) =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getMealColor = (mealType) => {
        switch (mealType) {
            case "breakfast":
                return "#ded35f"; // Vàng nhạt
            case "lunch":
                return "#C8E6C9"; // Xanh lá nhạt
            case "dinner":
                return "#BBDEFB"; // Xanh dương nhạt
            case "snack":
                return "#F8BBD0"; // Hồng nhạt
            default:
                return "#f5f5f5";
        }
    };

    const getMealIcon = (type) => {
        switch (type) {
            case "breakfast":
                return <FreeBreakfastIcon sx={{ mr: 1, color: "#4CAF50" }} />;
            case "lunch":
                return <LunchDiningIcon sx={{ mr: 1, color: "#FFC107" }} />;
            case "dinner":
                return <NightsStayIcon sx={{ mr: 1, color: "#3F51B5" }} />;
            case "snack":
                return <EmojiFoodBeverageIcon sx={{ mr: 1, color: "#FF5722" }} />;
            default:
                return null;
        }
    };

    return (
        <Box sx={{ display: "flex", height: "100vh", bgcolor: "#F1F8E9" }}>
            {/* Sidebar bên trái: Cố định */}
            <Box
                sx={{
                    width: 300,
                    bgcolor: "#fff",
                    p: 2,
                    borderRight: "1px solid #ccc",
                    flexShrink: 0,
                    overflow: "hidden"
                }}
            >
                <Typography variant="h5" fontWeight="bold" mb={2} ml={5} color="#4CAF50">
                    Hôm nay ăn gì?
                </Typography>

                {mealTypes.map((meal) => (
                    <Accordion
                        key={meal.value}
                        expanded={selectedMeal === meal.value}
                        onChange={() => setSelectedMeal(meal.value)}
                        sx={{ mb: 3 }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{
                            bgcolor: getMealColor(meal.value),
                            borderRadius: 1,
                            "&:hover": {
                                backgroundColor: "#f1f8ff",
                            },

                        }}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                {getMealIcon(meal.value)}
                                <Typography fontWeight="bold">{meal.label}</Typography>
                            </Box>

                        </AccordionSummary>
                        <AccordionDetails>
                            <List dense>
                                {meals[meal.value]?.ingredients?.length > 0 ? (
                                    meals[meal.value].ingredients.map((ing, idx) => (
                                        <ListItem
                                            key={idx}
                                            secondaryAction={
                                                <>
                                                    <IconButton sx={{ color: "#66BB6A" }} onClick={() => handleEditIngredient(meal.value, idx)}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton sx={{ color: "#E53935" }} onClick={() => handleDeleteIngredient(meal.value, idx)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </>
                                            }
                                        >
                                            <ListItemText
                                                primary={`${ing.ingredientId?.name || "Nguyên liệu"} - ${ing.quantity}g`}
                                                primaryTypographyProps={{ fontSize: 13, color: "#37474f" }}
                                            />
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography fontSize={13} color="text.secondary">
                                        Chưa có nguyên liệu
                                    </Typography>
                                )}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>

            {/* Main content */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    height: "100vh",
                    overflow: "hidden",
                }}
            >
                {/* Thanh tìm kiếm (cố định) */}
                <Box sx={{ px: 4, py: 3 }}>
                    <TextField
                        variant="outlined"
                        placeholder="Tìm nguyên liệu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="small"
                        sx={{
                            width: 1000,
                            backgroundColor: "#fff",
                            borderRadius: "30px",
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "30px",
                                "& fieldset": {
                                    borderColor: "#4CAF50", // màu viền
                                    borderWidth: "1px",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#388E3C", // hover viền đậm hơn
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#2E7D32", // khi focus
                                },
                            },

                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        px: 4,
                        pb: 4,
                    }}
                >
                    <Grid container spacing={3}>
                        {filtered.map((i, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                <IngredientCard
                                    name={i.name}
                                    calories={i.caloriesPer100g}
                                    onAdd={() => {
                                        setSelectedIngredient(i);
                                        setModalMode("add");
                                    }}
                                    onClick={() => {
                                        setSelectedIngredient(i);
                                        setModalMode("add");
                                    }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>

            {/* Modal */}
            <IngredientDetailModal
                open={!!selectedIngredient}
                onClose={() => setSelectedIngredient(null)}
                ingredient={selectedIngredient}
                onAdd={handleSaveFromModal}
                mode={modalMode}
                initialQuantity={
                    modalMode === "edit"
                        ? meals[selectedMeal]?.ingredients?.[editIndex]?.quantity
                        : undefined
                }
            />
        </Box>
    );
};

export default IngredientList;

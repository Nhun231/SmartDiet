import React, { useState, useEffect } from "react";
import baseAxios from "../api/axios";
import {
    Box, Typography, TextField, Grid, IconButton, Accordion,
    AccordionSummary, AccordionDetails, List, ListItem,
    ListItemText, InputAdornment
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
import DishModalForMeal from "../components/dish/DishModalForMeal";

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
    const [dishes, setDishes] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [selectedMeal, setSelectedMeal] = useState("breakfast");
    const [meals, setMeals] = useState({});
    const [modalMode, setModalMode] = useState("add");
    const [editIndex, setEditIndex] = useState(null);
    const userId = localStorage.getItem("userId");
    const [selectedDish, setSelectedDish] = useState(null);
    const [dishMode, setDishMode] = useState("add"); // add | edit
    const [dishEditIndex, setDishEditIndex] = useState(null);


    useEffect(() => {
        baseAxios.get(`/ingredients`).then((res) => setIngredients(res.data));
        baseAxios.get(`/dish`, { params: { userId } }).then((res) => setDishes(res.data));
    }, []);

    useEffect(() => {
        mealTypes.forEach((m) => loadMealByType(m.value));
    }, []);

    const loadMealByType = async (mealType) => {
        try {
            const res = await baseAxios.get(`/meals/by-date`, {
                params: { date: today, mealType, userId },
            });
            setMeals((prev) => ({ ...prev, [mealType]: res.data || { ingredients: [], dish: [] } }));
        } catch (err) {
            if (err.response?.status === 404) {
                setMeals((prev) => ({ ...prev, [mealType]: { ingredients: [], dish: [] } }));
            } else {
                console.error("Lỗi load meal:", err);
            }
        }
    };

    const saveMeal = async (mealType, newIngredients, newDishes) => {
        const existingMeal = meals[mealType];
        const payload = {
            mealType,
            date: today,
            ingredients: newIngredients,
            dish: newDishes ?? existingMeal?.dish ?? [],
            userId,
        };

        if (existingMeal?._id) {
            await baseAxios.put(`/meals/${existingMeal._id}`, payload);
        } else {
            await baseAxios.post(`/meals`, payload);
        }

        await loadMealByType(mealType);
    };

    const handleAddDishToMeal = async (dish) => {
        const payload = {
            dishId: dish._id,
            quantity: 1,
        };
        const existingMeal = meals[selectedMeal];
        const updatedDishes = [...(existingMeal?.dish || []), payload];
        await saveMeal(selectedMeal, existingMeal?.ingredients || [], updatedDishes);
    };

    const handleDeleteIngredient = async (mealType, index) => {
        const meal = meals[mealType];
        const updated = meal.ingredients.filter((_, i) => i !== index);
        await saveMeal(mealType, updated, meal.dish);
    };

    const handleDeleteDish = async (mealType, index) => {
        const meal = meals[mealType];
        const updated = meal.dish.filter((_, i) => i !== index);
        await saveMeal(mealType, meal.ingredients, updated);
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
        const newItem = { ingredientId: ingredient._id, quantity: parseFloat(quantity) };
        const updated = [...(meal?.ingredients || [])];

        if (modalMode === "add") {
            const index = updated.findIndex((i) =>
                (typeof i.ingredientId === "string" ? i.ingredientId : i.ingredientId?._id) === ingredient._id
            );
            if (index !== -1) updated[index].quantity += newItem.quantity;
            else updated.push(newItem);
        } else {
            updated[editIndex] = newItem;
        }

        await saveMeal(selectedMeal, updated);
        setSelectedIngredient(null);
        setModalMode("add");
        setEditIndex(null);
    };

    const openAddDishModal = (dish) => {
        setSelectedDish(dish);
        setDishMode("add");
        setDishEditIndex(null);
    };

    const handleSaveDish = async (dish, quantity) => {
        const meal = meals[selectedMeal];
        let updated = [...(meal?.dish || [])];

        if (dishMode === "add") {
            const idx = updated.findIndex((it) =>
                (typeof it.dishId === "string" ? it.dishId : it.dishId?._id) === dish._id
            );
            if (idx !== -1) updated[idx].quantity += quantity;
            else updated.push({ dishId: dish._id, quantity });
        } else {
            updated[dishEditIndex] = { dishId: dish._id, quantity };
        }

        await saveMeal(selectedMeal, meal?.ingredients || [], updated);
    };


    const filtered = ingredients.filter((i) =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getMealColor = (mealType) => ({
        breakfast: "#ded35f",
        lunch: "#C8E6C9",
        dinner: "#BBDEFB",
        snack: "#F8BBD0",
    }[mealType] || "#f5f5f5");

    const getMealIcon = (type) => ({
        breakfast: <FreeBreakfastIcon sx={{ mr: 1, color: "#4CAF50" }} />,
        lunch: <LunchDiningIcon sx={{ mr: 1, color: "#FFC107" }} />,
        dinner: <NightsStayIcon sx={{ mr: 1, color: "#3F51B5" }} />,
        snack: <EmojiFoodBeverageIcon sx={{ mr: 1, color: "#FF5722" }} />,
    }[type] || null);

    return (
        <Box sx={{ display: "flex", height: "100vh", bgcolor: "#F1F8E9" }}>
            <Box sx={{ width: 400, bgcolor: "#fff", p: 2, borderRight: "1px solid #ccc", flexShrink: 0 }}>
                <Typography variant="h5" fontWeight="bold" mb={2} ml={11} color="#4CAF50">
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
                            "&:hover": { backgroundColor: "#f1f8ff" },
                        }}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                {getMealIcon(meal.value)}
                                <Typography fontWeight="bold">{meal.label}</Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List dense>
                                {meals[meal.value]?.ingredients?.map((ing, idx) => (
                                    <ListItem key={`ing-${idx}`}
                                        secondaryAction={
                                            <>
                                                <IconButton sx={{ color: "#66BB6A" }} onClick={() => handleEditIngredient(meal.value, idx)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton sx={{ color: "#E53935" }} onClick={() => handleDeleteIngredient(meal.value, idx)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </>
                                        }>
                                        <ListItemText
                                            primary={`${ing.ingredientId?.name || "Nguyên liệu"} - ${ing.quantity}g`}
                                            primaryTypographyProps={{ fontSize: 13, color: "#37474f" }}
                                        />
                                    </ListItem>
                                ))}

                                {meals[meal.value]?.dish?.length > 0 && (
                                    <>
                                        <Typography fontSize={13} fontWeight="bold" mt={1} color="#4E342E">Món ăn</Typography>
                                        {meals[meal.value].dish.map((d, idx) => (
                                            <ListItem key={`dish-${idx}`}
                                                secondaryAction={
                                                    <>
                                                        <IconButton sx={{ color: "#66BB6A" }} onClick={() => handleEditDish(meal.value, idx)}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton sx={{ color: "#E53935" }} onClick={() => handleDeleteDish(meal.value, idx)}>
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </>
                                                }>
                                                <ListItemText
                                                    primary={`🍽️ ${d.dishId.name || "Món ăn"}- ${d.quantity} suất`}
                                                    primaryTypographyProps={{ fontSize: 13, color: "#4E342E" }}
                                                />
                                            </ListItem>
                                        ))}
                                    </>
                                )}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
                <Box sx={{ px: 4, py: 3 }}>
                    <TextField
                        variant="outlined"
                        placeholder="Tìm nguyên liệu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="small"
                        sx={{
                            width: 1000, backgroundColor: "#fff", borderRadius: "30px",
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "30px",
                                "& fieldset": { borderColor: "#4CAF50", borderWidth: "1px" },
                                "&:hover fieldset": { borderColor: "#388E3C" },
                                "&.Mui-focused fieldset": { borderColor: "#2E7D32" },
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

                <Box sx={{ flex: 1, overflowY: "auto", px: 4, pb: 4 }}>
                    <Grid container spacing={3}>

                        {dishes.map((d, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={`dish-${idx}`}>
                                <IngredientCard
                                    name={`🍽️ ${d.name}`}
                                    calories={d.total?.calories}
                                    onAdd={() => openAddDishModal(d)}
                                    onClick={() => openAddDishModal(d)}
                                />
                            </Grid>
                        ))}
                        {filtered.map((i, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={`ing-${idx}`}>
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

            <DishModalForMeal
                open={!!selectedDish}
                onClose={() => setSelectedDish(null)}
                dish={selectedDish}
                mode={dishMode}
                initialQuantity={
                    dishMode === "edit"
                        ? meals[selectedMeal]?.dish?.[dishEditIndex]?.quantity
                        : 1
                }
                onSave={handleSaveDish}
            />
        </Box>
    );
};

export default IngredientList;

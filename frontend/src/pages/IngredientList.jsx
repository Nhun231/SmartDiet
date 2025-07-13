import React, { useState, useEffect } from "react";
import baseAxios from "../api/axios";
import {
    Box, Typography, TextField, Grid, IconButton, Accordion,
    AccordionSummary, AccordionDetails, List, ListItem,
    ListItemText, InputAdornment, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
    InputLabel,
    Select,
    MenuItem
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
import FloatingChatBox from "../components/OpenAIChatbox/Chatbox.jsx";
import EditIngredient from "../components/ingredient/EditIngredient.jsx";
import dayjs from 'dayjs';
const mealTypes = [
    { label: "Bữa sáng", value: "breakfast" },
    { label: "Bữa trưa", value: "lunch" },
    { label: "Bữa tối", value: "dinner" },
    { label: "Bữa phụ", value: "snack" },
];

const today = dayjs().format('YYYY-MM-DD');

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
    const [dishMode, setDishMode] = useState("add");
    const [categoryError, setCategoryError] = useState(false);
    const [dishEditIndex, setDishEditIndex] = useState(null);
    const [addIngredientOpen, setAddIngredientOpen] = useState(false);
    const [newIngredientImage, setNewIngredientImage] = useState(null);
    const [editIngredient, setEditIngredient] = useState(false);
    const [newIngredient, setNewIngredient] = useState({
        name: "",
        quantity: "",
        caloriesPer100g: "",
        proteinPer100g: "",
        fatPer100g: "",
        carbsPer100g: "",
        fiberPer100g: "",
        imageUrl: "",
        description: "",
        userId: userId
    });

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

    const openEditIgredientModal = (i) => {
        setNewIngredient(i);
        setEditIngredient(true);
    }


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

    const handleAddIngredient = async (ingredient) => {
        if (!newIngredient.category) {
            setCategoryError(true);
            return;
        }
        try {
            const response = await baseAxios.post("/ingredients", ingredient);
            setIngredients((prev) => [...prev, response.data]);
            setAddIngredientOpen(false);
            setNewIngredient({
                name: "",
                quantity: "",
                caloriesPer100g: "",
                proteinPer100g: "",
                fatPer100g: "",
                carbsPer100g: "",
                fiberPer100g: "",
                imageUrl: "",
                description: "",
                userId: userId
            });
            window.location.reload();
        } catch (error) {
            console.error("Lỗi khi thêm nguyên liệu:", error);
        }
    }

    const handleCloseAddIngredient = () => {
        setAddIngredientOpen(false);
        setNewIngredient({
            name: "",
            quantity: "",
            caloriesPer100g: "",
            proteinPer100g: "",
            fatPer100g: "",
            carbsPer100g: "",
            fiberPer100g: "",
            imageUrl: "",
            description: "",
            userId: userId
        });
        setNewIngredientImage(null);
        setCategoryError(false);
    }

    useEffect(() => {
        console.log("UserID:", userId);
    }, []);

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
                <Box sx={{ px: 4, py: 3, display: "flex", alignItems: "center", justifyContent: "left" }}>
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

                    <Button
                        variant="contained"
                        size="medium"
                        sx={{
                            backgroundColor: "#4CAF50",
                            color: "#fff",
                            textTransform: "none",
                            borderRadius: "20px",
                            marginLeft: 10,
                            px: 3,
                            "&:hover": {
                                backgroundColor: "#388E3C"
                            }
                        }}
                        onClick={() => setAddIngredientOpen(true)}
                    >
                        Thêm nguyên liệu
                    </Button>
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
                                    onEdit={() => { console.log("Edit dish") }}
                                    onDelete={() => { console.log("Delete dish") }}
                                    userID={d?.userId?._id}
                                />
                            </Grid>
                        ))}
                        {filtered.map((i, idx) =>
                            console.log("UserID:", userId) || console.log("Ingredient UserID:", i.userId?._id) ||
                            (i.userId?._id === userId || i.userId == null) && (
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
                                        onEdit={() => openEditIgredientModal(i)}
                                        userID={i?.userId?._id}
                                        id={i._id}
                                    />
                                </Grid>
                            )
                        )}
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
            <FloatingChatBox />

            <Dialog
                open={addIngredientOpen}
                onClose={handleCloseAddIngredient}
                fullWidth
                maxWidth="md"
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        padding: 3,
                        backgroundColor: "#F9FFF8",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.12)"
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: "bold", fontSize: 22, color: "#388E3C", textAlign: "center" }}>
                    ✨ Thêm nguyên liệu mới
                </DialogTitle>

                <DialogContent>
                    <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4} mt={2}>
                        <Box flex={1} display="flex" flexDirection="column" gap={2} sx={{ marginTop: 5 }}>
                            <TextField
                                label="Tên nguyên liệu"
                                required
                                fullWidth
                                value={newIngredient.name}
                                onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                                InputProps={{ startAdornment: <InputAdornment position="start">🍃</InputAdornment> }}
                            />

                            {/* <Box>
                                <Typography fontWeight="bold" mb={1}>🖼️ Ảnh minh họa</Typography>

                                <Button
                                    variant="outlined"
                                    component="label"
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: "none",
                                        px: 3,
                                        py: 1,
                                        fontWeight: "bold",
                                        color: "#4CAF50",
                                        borderColor: "#4CAF50",
                                        "&:hover": {
                                            backgroundColor: "#E8F5E9"
                                        }
                                    }}
                                >
                                    Chọn ảnh từ máy
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = () => {
                                                    setNewIngredientImage(reader.result); // lưu ảnh đã chọn
                                                    setNewIngredient({ ...newIngredient, imageUrl: reader.result }); // nếu dùng base64
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </Button>

                                {newIngredientImage && (
                                    <Box mt={2} position="relative" display="inline-block">
                                        <Typography variant="body2" mb={1}>📌 Xem trước:</Typography>

                                        <Box
                                            component="img"
                                            src={newIngredientImage}
                                            alt="Preview"
                                            sx={{
                                                maxWidth: "100%",
                                                height: "auto",
                                                borderRadius: 2,
                                                boxShadow: 1
                                            }}
                                        />

                                        <IconButton
                                            size="small"
                                            sx={{
                                                position: "absolute",
                                                right: 4,
                                                backgroundColor: "rgba(255,255,255,0.8)",
                                                "&:hover": { backgroundColor: "rgba(255,255,255,1)" }
                                            }}
                                            onClick={() => {
                                                setNewIngredientImage(null);
                                                setNewIngredient({ ...newIngredient, imageUrl: "" });
                                            }}
                                        >
                                            ❌
                                        </IconButton>
                                    </Box>
                                )}

                            </Box> */}


                            <TextField
                                label="Mô tả"
                                fullWidth
                                multiline
                                rows={2}
                                value={newIngredient.description}
                                onChange={(e) => setNewIngredient({ ...newIngredient, description: e.target.value })}
                                InputProps={{ startAdornment: <InputAdornment position="start">📝</InputAdornment> }}
                            />

                            <FormControl fullWidth error={categoryError}>
                                <InputLabel>Loại nguyên liệu</InputLabel>
                                <Select
                                    value={newIngredient.category}
                                    onChange={(e) => {
                                        setNewIngredient({ ...newIngredient, category: e.target.value });
                                        setCategoryError(false); // đã chọn → xoá lỗi
                                    }}
                                    label="Loại nguyên liệu"
                                    sx={{
                                        backgroundColor: "#fff",
                                        borderRadius: 2
                                    }}
                                    required
                                >
                                    {["Thịt", "Hải sản", "Đậu", "Thực phẩm khác", "Rau củ", "Trái cây"].map((option, idx) => (
                                        <MenuItem key={idx} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {categoryError && (
                                    <Typography variant="caption" color="error" mt={1}>
                                        Vui lòng chọn loại nguyên liệu.
                                    </Typography>
                                )}
                            </FormControl>
                        </Box>

                        {/* DINH DƯỠNG */}
                        <Box flex={1} display="flex" flexDirection="column" gap={2}>
                            <Typography fontWeight="bold" color="#2E7D32">Thông tin dinh dưỡng (trên 100g)</Typography>

                            <TextField
                                label="Calo (kcal)"
                                type="number"
                                fullWidth
                                value={newIngredient.caloriesPer100g}
                                onChange={(e) => setNewIngredient({ ...newIngredient, caloriesPer100g: e.target.value })}
                                InputProps={{ startAdornment: <InputAdornment position="start">🔥</InputAdornment> }}
                            />
                            <TextField
                                label="Protein (g)"
                                type="number"
                                fullWidth
                                value={newIngredient.proteinPer100g}
                                onChange={(e) => setNewIngredient({ ...newIngredient, proteinPer100g: e.target.value })}
                                InputProps={{ startAdornment: <InputAdornment position="start">🍗</InputAdornment> }}
                            />
                            <TextField
                                label="Chất béo (g)"
                                type="number"
                                fullWidth
                                value={newIngredient.fatPer100g}
                                onChange={(e) => setNewIngredient({ ...newIngredient, fatPer100g: e.target.value })}
                                InputProps={{ startAdornment: <InputAdornment position="start">🥑</InputAdornment> }}
                            />
                            <TextField
                                label="Carbs (g)"
                                type="number"
                                fullWidth
                                value={newIngredient.carbsPer100g}
                                onChange={(e) => setNewIngredient({ ...newIngredient, carbsPer100g: e.target.value })}
                                InputProps={{ startAdornment: <InputAdornment position="start">🍞</InputAdornment> }}
                            />
                            <TextField
                                label="Chất xơ (g)"
                                type="number"
                                fullWidth
                                value={newIngredient.fiberPer100g}
                                onChange={(e) => setNewIngredient({ ...newIngredient, fiberPer100g: e.target.value })}
                                InputProps={{ startAdornment: <InputAdornment position="start">🌿</InputAdornment> }}
                            />
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ justifyContent: "center", mt: 3 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setAddIngredientOpen(false)}
                        sx={{
                            borderRadius: 3,
                            px: 4,
                            color: "#388E3C",
                            borderColor: "#388E3C",
                            "&:hover": { backgroundColor: "#E8F5E9" }
                        }}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#00C896",
                            color: "#fff",
                            px: 4,
                            borderRadius: 3,
                            textTransform: "none",
                            fontWeight: "bold",
                            "&:hover": { backgroundColor: "#00b583" }
                        }}
                        onClick={() => {
                            handleAddIngredient(newIngredient);
                        }}
                        disabled={!newIngredient.name || !newIngredient.category || !newIngredient.caloriesPer100g || !newIngredient.proteinPer100g || !newIngredient.fatPer100g || !newIngredient.carbsPer100g || !newIngredient.fiberPer100g}
                    >
                        Thêm nguyên liệu
                    </Button>
                </DialogActions>
            </Dialog>

            {(editIngredient && newIngredient.name) && <EditIngredient editIngredient={editIngredient} setEditIngredient={setEditIngredient} newObject={newIngredient} setNewIngredient={setNewIngredient} filter={filtered} ingredients={ingredients} setIngredients={setIngredients} />}


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

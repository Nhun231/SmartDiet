import { useState, useEffect } from "react";
import baseAxios from "../../api/axios";
import {
    Box, Typography, TextField, Grid, IconButton, Accordion,
    AccordionSummary, AccordionDetails, List, ListItem,
    ListItemText, InputAdornment, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";


const EditIngredient = ({ editIngredient, setEditIngredient, newObject, setNewIngredient, filtered, ingredients, }) => {
    const [newIngredientForEdit, setNewIngredientForEdit] = useState(newObject);
    const [categoryError, setCategoryError] = useState(false);

    useEffect(() => {
        console.log("EditIngredient mounted with newObject:", newIngredientForEdit);
    }, []);

    const handleClose = () => {
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
            userId: newIngredientForEdit.userId._id
        });
        setEditIngredient(false);
    }

    const handleEditIngredient = async () => {
        try {
            const response = await baseAxios.put(`/ingredients/${newIngredientForEdit._id}`, newIngredientForEdit);
            if (response.status === 200) {
                window.location.reload();
            }
        } catch (error) {
            console.error("Lỗi khi chỉnh sửa nguyên liệu:", error);
        }
    };

    return (
        editIngredient && (
            <Dialog
                open={editIngredient}
                onClose={handleClose}
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
                    ✨ Chỉnh sửa nguyên liệu
                </DialogTitle>

                <DialogContent>
                    <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4} mt={2}>
                        <Box flex={1} display="flex" flexDirection="column" gap={2} sx={{ marginTop: 5 }}>
                            <TextField
                                label="Tên nguyên liệu"
                                required
                                fullWidth
                                value={newIngredientForEdit?.name}
                                onChange={(e) => setNewIngredientForEdit({ ...newIngredientForEdit, name: e.target.value })}
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

                            </Box> */}


                            <TextField
                                label="Mô tả"
                                fullWidth
                                multiline
                                rows={2}
                                value={newIngredientForEdit?.description}
                                onChange={(e) => setNewIngredientForEdit({ ...newIngredientForEdit, description: e.target.value })}
                                InputProps={{ startAdornment: <InputAdornment position="start">📝</InputAdornment> }}
                            />

                            <FormControl fullWidth error={categoryError}>
                                <InputLabel>Loại nguyên liệu</InputLabel>
                                <Select
                                    value={newIngredientForEdit?.category}
                                    onChange={(e) => {
                                        setNewIngredientForEdit({ ...newIngredientForEdit, category: e.target.value });
                                        setCategoryError(false);
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
                                value={newIngredientForEdit?.caloriesPer100g}
                                onChange={(e) => setNewIngredientForEdit({ ...newIngredientForEdit, caloriesPer100g: e.target.value })}
                                InputProps={{ startAdornment: <InputAdornment position="start">🔥</InputAdornment> }}
                            />
                            <TextField
                                label="Protein (g)"
                                type="number"
                                fullWidth
                                value={newIngredientForEdit?.proteinPer100g}
                                onChange={(e) => setNewIngredientForEdit({ ...newIngredientForEdit, proteinPer100g: e.target.value })}
                                InputProps={{ startAdornment: <InputAdornment position="start">🍗</InputAdornment> }}
                            />
                            <TextField
                                label="Chất béo (g)"
                                type="number"
                                fullWidth
                                value={newIngredientForEdit?.fatPer100g}
                                onChange={(e) => setNewIngredientForEdit({ ...newIngredientForEdit, fatPer100g: e.target.value })}
                                InputProps={{ startAdornment: <InputAdornment position="start">🥑</InputAdornment> }}
                            />
                            <TextField
                                label="Carbs (g)"
                                type="number"
                                fullWidth
                                value={newIngredientForEdit?.carbsPer100g}
                                onChange={(e) => setNewIngredientForEdit({ ...newIngredientForEdit, carbsPer100g: e.target.value })}
                                InputProps={{ startAdornment: <InputAdornment position="start">🍞</InputAdornment> }}
                            />
                            <TextField
                                label="Chất xơ (g)"
                                type="number"
                                fullWidth
                                value={newIngredientForEdit?.fiberPer100g}
                                onChange={(e) => setNewIngredientForEdit({ ...newIngredientForEdit, fiberPer100g: e.target.value })}
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
                            handleEditIngredient(newIngredientForEdit);
                        }}
                        disabled={!newIngredientForEdit?.name || !newIngredientForEdit?.category || !newIngredientForEdit?.caloriesPer100g || !newIngredientForEdit?.proteinPer100g || !newIngredientForEdit?.fatPer100g || !newIngredientForEdit?.carbsPer100g || !newIngredientForEdit?.fiberPer100g}
                    >
                        Lưu nguyên liệu
                    </Button>
                </DialogActions>
            </Dialog>
        )
    );
}

export default EditIngredient;
import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Grid,
    Divider,
    Snackbar,
    Alert,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import IngredientAdminCard from "../components/ingredient/IngredientAdminCard.jsx"; // ✅ Component hiển thị nguyên liệu
import EditIngredient from "../components/ingredient/EditIngredient.jsx"; // ✅ Component hiển thị nguyên liệu
import IngredientDetailModal from "../components/ingredient/IngredientDetailModal.jsx"; // ✅ Component hiển thị nguyên liệu
import baseAxios from "../api/axios";
import FloatingChatBox from "../components/OpenAIChatbox/Chatbox.jsx";

const AdminIngredient = () => {
    const [ingredients, setIngredients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [addIngredientOpen, setAddIngredientOpen] = useState(false);
    const [categoryError, setCategoryError] = useState(false);
    const [editIngredient, setEditIngredient] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [modalMode, setModalMode] = useState("view"); // "view" or "add/edit"

    const [toast, setToast] = useState({ open: false, msg: "" });
    const [newIngredient, setNewIngredient] = useState({
        name: "",
        caloriesPer100g: "",
        proteinPer100g: "",
        fatPer100g: "",
        carbsPer100g: "",
        fiberPer100g: "",
        imageUrl: "",
        description: "",
        userId: null
    });
    const handleViewIngredient = (ingredient) => {
        setSelectedIngredient(ingredient);
        setModalMode("view");
    };

    const openEditIgredientModal = (i) => {
        setNewIngredient(i);
        setEditIngredient(true);
    }
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
                caloriesPer100g: "",
                proteinPer100g: "",
                fatPer100g: "",
                carbsPer100g: "",
                fiberPer100g: "",
                imageUrl: "",
                description: "",
                userId: null
            });
            window.location.reload();
        } catch (error) {
            console.error("Lỗi khi thêm nguyên liệu:", error);
        }
    }

    const fetchIngredients = async () => {
        try {
            const res = await baseAxios.get(`/ingredients`);
            const publicIngredients = res.data.filter(ingredient => !ingredient.userId);
            setIngredients(publicIngredients);
            return publicIngredients;
        } catch (error) {
            console.error("Lỗi khi fetch nguyên liệu:", error);
        }
    };
    const filtered = ingredients.filter((i) =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleCloseAddIngredient = () => {
        setAddIngredientOpen(false);
        setNewIngredient({
            name: "",
            caloriesPer100g: "",
            proteinPer100g: "",
            fatPer100g: "",
            carbsPer100g: "",
            fiberPer100g: "",
            imageUrl: "",
            description: "",
            userId: null
        });
        setCategoryError(false);
    }
    useEffect(() => {
        fetchIngredients();
    }, []);

    return (
        <Box sx={{ p: 4, bgcolor: "#F1F8E9", minHeight: "100vh" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold" color="green">
                    Nguyên liệu
                </Typography>


            </Box>

            <Typography variant="h6" color="green" mb={1}>
                Danh sách nguyên liệu
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box>
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
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
                {filtered.map((ingredient) => (
                    <Grid item xs={12} sm={6} md={4} key={ingredient._id}>
                        <IngredientAdminCard
                            name={ingredient?.name}
                            onEdit={() => openEditIgredientModal(ingredient)}
                            onClick={() => handleViewIngredient(ingredient)}
                            calories={ingredient.caloriesPer100g}
                            id={ingredient?._id}
                        />
                    </Grid>
                ))}
            </Grid>



            {/* Snackbar thông báo */}
            <Snackbar
                open={toast.open}
                autoHideDuration={2500}
                onClose={() => setToast({ ...toast, open: false })}
            >
                <Alert severity="success">{toast.msg}</Alert>
            </Snackbar>

            <IngredientDetailModal
                open={!!selectedIngredient}
                onClose={() => setSelectedIngredient(null)}
                ingredient={selectedIngredient}
                readonly={true}
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

        </Box>
    );
};

export default AdminIngredient;

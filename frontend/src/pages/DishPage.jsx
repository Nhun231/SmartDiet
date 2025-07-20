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
} from "@mui/material";
import DishCard from "../components/dish/DishCard";
import DishForm from "../components/dish/DishForm";
import DishDetailModal from "../components/dish/DishModal";
import baseAxios from "../api/axios";
import FloatingChatBox from "../components/OpenAIChatbox/Chatbox.jsx";

const DishesPage = () => {
    const [dishes, setDishes] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [selectedDish, setSelectedDish] = useState(null);
    const [editingDish, setEditingDish] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [toast, setToast] = useState({ open: false, msg: "" });

    const userId = localStorage.getItem("userId");

    // ⬇️ Trích xuất ra thành hàm riêng
    const fetchDishes = async () => {
        const res = await baseAxios.get(`/dish`, { params: { userId } });
        setDishes(res.data);
        return res.data;
    };

    useEffect(() => {
        (async () => {
            try {
                const [dishRes, ingRes] = await Promise.all([
                    fetchDishes(),
                    baseAxios.get("/ingredients"),
                ]);
                setIngredients(ingRes.data);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        })();
    }, [userId]);

    const saveDish = async (formData) => {
        try {
            if (editingDish) {
                const res = await baseAxios.put(`/dish/${editingDish._id}`, {
                    ...formData,
                    userId,
                });
                setDishes((prev) =>
                    prev.map((d) => (d._id === editingDish._id ? res.data : d))
                );
                setToast({ open: true, msg: "Đã cập nhật!" });
            } else {
                const res = await baseAxios.post("/dish", { ...formData, userId });
                const updated = await fetchDishes();
                const createdDish = updated.find((d) => d._id === res.data._id);
                setToast({ open: true, msg: "Đã thêm món mới!" });
            }
            closeForm();
        } catch (err) {
            console.error("Save dish error:", err);
        }
    };

    const deleteDish = async (dish) => {
        if (!window.confirm(`Xóa "${dish.name}"?`)) return;
        try {
            await baseAxios.delete(`/dish/${dish._id}`);
            setDishes((prev) => prev.filter((d) => d._id !== dish._id));
            setToast({ open: true, msg: "Đã xóa món!" });
        } catch (err) {
            console.error("Delete dish error:", err);
        }
    };

    const openCreateForm = () => {
        setEditingDish(null);
        setOpenForm(true);
    };

    const openEditForm = (dish) => {
        setEditingDish(dish);
        setOpenForm(true);
    };

    const closeForm = () => {
        setOpenForm(false);
        setEditingDish(null);
    };

    return (
        <Box sx={{ p: 4, bgcolor: "#F1F8E9", minHeight: "100vh" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold" color="green">
                    Món ăn cá nhân
                </Typography>

                <Box display="flex" gap={2}>
                    <Button
                        variant="contained"
                        size="medium"
                        sx={{
                            textTransform: "none",
                            borderRadius: "20px",
                            backgroundColor: "#4CAF50",
                            color: "#fff",
                            borderColor: "#4CAF50",
                            "&:hover": {
                                backgroundColor: "#E8F5E9",
                                borderColor: "#388E3C",
                                color: "#388E3C",
                            },
                        }}
                        onClick={() => window.history.back()}
                    >
                        ← Quay lại thực đơn
                    </Button>

                    <Button
                        variant="contained"
                        size="medium"
                        sx={{
                            backgroundColor: "#4CAF50",
                            color: "#fff",
                            textTransform: "none",
                            borderRadius: "20px",
                            px: 3,
                            height: 50,
                            whiteSpace: "nowrap",
                            "&:hover": {
                                backgroundColor: "#388E3C",
                            },
                        }}
                        onClick={openCreateForm}
                    >
                        Tạo món ăn mới
                    </Button>
                </Box>
            </Box>


            <Typography variant="h6" color="green" mb={1}>
                Danh sách món ăn
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
                {dishes.map((dish) => (
                    <Grid item xs={12} sm={6} md={4} key={dish._id}>
                        <DishCard
                            dish={dish}
                            onClick={() => setSelectedDish(dish)}
                            onEdit={openEditForm}
                            onDelete={deleteDish}
                        />
                    </Grid>
                ))}
            </Grid>

            <Dialog
                open={openForm}
                onClose={closeForm}
                fullWidth
                maxWidth="md"
                PaperProps={{ sx: { borderRadius: 5, p: 1 } }}
            >
                <DialogContent>
                    <DishForm
                        ingredients={ingredients}
                        initialData={editingDish}
                        onSubmit={saveDish}
                    />
                </DialogContent>
            </Dialog>

            <DishDetailModal
                open={!!selectedDish}
                onClose={() => setSelectedDish(null)}
                dish={selectedDish}
            />

            <Snackbar
                open={toast.open}
                autoHideDuration={2500}
                onClose={() => setToast({ ...toast, open: false })}
            >
                <Alert severity="success">{toast.msg}</Alert>
            </Snackbar>

            <FloatingChatBox />
        </Box>
    );
};

export default DishesPage;

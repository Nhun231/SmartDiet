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
import DishDetailModal from "../components/dish/DishModalDetail";
import baseAxios from "../api/axios";

const DishesPage = () => {
    /* ─────────────── state */
    const [dishes, setDishes] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [selectedDish, setSelectedDish] = useState(null);   // xem chi tiết
    const [editingDish, setEditingDish] = useState(null);   // đang sửa
    const [openForm, setOpenForm] = useState(false);  // modal tạo/sửa
    const [toast, setToast] = useState({ open: false, msg: "" });

    const userId = localStorage.getItem("userId");

    /* ─────────────── initial fetch */
    useEffect(() => {
        (async () => {
            try {
                const [dishRes, ingRes] = await Promise.all([
                    baseAxios.get(`/dish`, { params: { userId } }),
                    baseAxios.get("/ingredients"),
                ]);
                setDishes(dishRes.data);
                setIngredients(ingRes.data);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        })();
    }, [userId]);

    /* ─────────────── create / update */
    const saveDish = async (formData) => {
        try {
            let res;
            if (editingDish) {
                res = await baseAxios.put(`/dish/${editingDish._id}`, { ...formData, userId });
                setDishes(prev =>
                    prev.map(d => (d._id === editingDish._id ? res.data : d))
                );
            } else {
                res = await baseAxios.post("/dish", { ...formData, userId });
                setDishes(prev => [...prev, res.data]);
            }

            setToast({ open: true, msg: editingDish ? "Đã cập nhật!" : "Đã thêm món mới!" });
            closeForm();
        } catch (err) {
            console.error("Save dish error:", err);
        }
    };

    /* ─────────────── delete */
    const deleteDish = async (dish) => {
        if (!window.confirm(`Xóa "${dish.name}"?`)) return;
        try {
            await baseAxios.delete(`/dish/${dish._id}`);
            setDishes(prev => prev.filter(d => d._id !== dish._id));
            setToast({ open: true, msg: "Đã xóa món!" });
        } catch (err) {
            console.error("Delete dish error:", err);
        }
    };

    /* ─────────────── helpers */
    const openCreateForm = () => { setEditingDish(null); setOpenForm(true); };
    const openEditForm = (dish) => { setEditingDish(dish); setOpenForm(true); };
    const closeForm = () => { setOpenForm(false); setEditingDish(null); };

    /* ─────────────── render */
    return (
        <Box sx={{ p: 4, bgcolor: "#f5fef9", minHeight: "100vh" }}>
            {/* header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold" color="green">
                    Món ăn cá nhân
                </Typography>
                <Button variant="contained" color="success" onClick={openCreateForm}>
                    + Tạo món ăn mới
                </Button>
            </Box>

            {/* list */}
            <Typography variant="h6" color="green" mb={1}>Danh sách món ăn</Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
                {dishes.map(dish => (
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

            {/* modal form (create / edit) */}
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
                        initialData={editingDish}   /* <= form sẽ preload khi sửa */
                        onSubmit={saveDish}
                    />
                </DialogContent>
            </Dialog>

            {/* modal detail */}
            <DishDetailModal
                open={!!selectedDish}
                onClose={() => setSelectedDish(null)}
                dish={selectedDish}
            />

            {/* snackbar */}
            <Snackbar
                open={toast.open}
                autoHideDuration={2500}
                onClose={() => setToast({ ...toast, open: false })}
            >
                <Alert severity="success">{toast.msg}</Alert>
            </Snackbar>
        </Box>
    );
};

export default DishesPage;

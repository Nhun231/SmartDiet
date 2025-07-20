import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    IconButton,
    Box,
    TextField
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DishModalForMeal = ({
    open,
    onClose,
    dish,
    onSave,
    mode = "add",
    initialQuantity = 1
}) => {
    const [quantity, setQuantity] = useState(initialQuantity);

    useEffect(() => {
        if (open) {
            setQuantity(initialQuantity || 1);
        }
    }, [open, initialQuantity]);

    if (!dish) return null;

    const { name, totals = {}, description } = dish;

    const scaledCalories = (totals.calories || 0) * quantity;
    const scaledProtein = (totals.protein || 0) * quantity;
    const scaledFat = (totals.fat || 0) * quantity;
    const scaledCarbs = (totals.carbs || 0) * quantity;
    const scaledFiber = (totals.fiber || 0) * quantity;

    const data = {
        labels: ["Tinh bột", "Chất đạm", "Chất béo", "Chất xơ"],
        datasets: [
            {
                data: [scaledCarbs, scaledProtein, scaledFat, scaledFiber],
                backgroundColor: [
                    "#2196f3", // Carbs
                    "#ffb74d", // Protein
                    "#9c27b0", // Fat
                    "#4caf50", // Fiber
                ],
                borderWidth: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "50%",
        plugins: {
            legend: {
                position: "right",
                labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                    boxWidth: 10,
                    padding: 20,
                    color: "#333",
                    font: { size: 14 },
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.label}: ${context.parsed.toFixed(1)} g`,
                },
            },
        },
    };

    const handleConfirm = () => {
        if (!quantity || isNaN(quantity) || quantity <= 0) {
            alert("Vui lòng nhập số khẩu phần hợp lệ");
            return;
        }
        onSave(dish, parseFloat(quantity));
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: 7, boxShadow: 12 } }}
        >
            <DialogTitle>
                {mode === "edit" ? "Chỉnh sửa món ăn" : "Chi tiết món ăn"}
                <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Typography variant="h6" fontWeight="bold" mt={1} mb={2}>
                    🍽️ {name}
                </Typography>

                <Typography variant="subtitle1" fontWeight="bold" color="#000" mb={1}>
                    {mode === "edit" ? "Chỉnh sửa khẩu phần" : "Thêm vào bữa ăn"}
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mt: 1,
                        mb: 3,
                        justifyContent: "flex-start",
                    }}
                >
                    <TextField
                        type="number"
                        label="Số khẩu phần"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        size="small"
                        variant="outlined"
                        InputProps={{ sx: { borderRadius: 8 } }}
                        sx={{
                            width: 200,
                            "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": {
                                    borderColor: "#4CAF50",
                                },
                            },
                        }}
                    />
                    <IconButton
                        onClick={handleConfirm}
                        sx={{
                            bgcolor: "#4CAF50",
                            color: "#fff",
                            width: 33,
                            height: 33,
                            "&:hover": {
                                bgcolor: "#388E3C",
                            },
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </Box>

                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    Thành phần dinh dưỡng
                </Typography>

                <Box
                    sx={{
                        position: "relative",
                        width: "100%",
                        height: 255,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Doughnut data={data} options={options} />
                    <Box
                        sx={{
                            position: "absolute",
                            textAlign: "center",
                            pointerEvents: "none",
                            mr: 13,
                        }}
                    >
                        <Typography variant="h4" fontWeight="bold" color="red">
                            {scaledCalories.toFixed(0)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Kcal ({quantity} khẩu phần)
                        </Typography>
                    </Box>
                </Box>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    Nguyên liệu trong món ăn
                </Typography>

                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                    {dish.ingredients?.map((ing, idx) => (
                        <li key={idx}>
                            <Typography variant="body2">
                                {ing.ingredientId?.name || "Nguyên liệu"} - {ing.quantity}g
                            </Typography>
                        </li>
                    ))}
                </Box>
                {description && (
                    <>
                        <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                            Mô tả món ăn
                        </Typography>
                        <Typography variant="body2">
                            {description}
                        </Typography>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default DishModalForMeal;

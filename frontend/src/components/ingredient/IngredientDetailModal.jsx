import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    IconButton,
    Box,
    TextField,
    Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";
import AddIcon from "@mui/icons-material/Add";

ChartJS.register(ArcElement, Tooltip, Legend);

const IngredientDetailModal = ({
    open,
    onClose,
    ingredient,
    onAdd,
    mode = "add", // "add" or "edit"
    initialQuantity = 100
}) => {
    const [quantity, setQuantity] = useState(initialQuantity);

    useEffect(() => {
        if (open) {
            setQuantity(initialQuantity || 100);
        }
    }, [open, initialQuantity]);

    if (!ingredient) return null;

    const {
        proteinPer100g,
        fatPer100g,
        carbsPer100g,
        fiberPer100g,
        caloriesPer100g,
        description,
        name
    } = ingredient;

    const scaledProtein = (proteinPer100g * quantity) / 100;
    const scaledFat = (fatPer100g * quantity) / 100;
    const scaledCarbs = (carbsPer100g * quantity) / 100;
    const scaledFiber = (fiberPer100g * quantity) / 100;
    const totalCalories = (caloriesPer100g * quantity) / 100;

    const data = {
        labels: ["Tinh bột", "Chất đạm", "Chất béo", "Chất xơ"],
        datasets: [
            {
                data: [scaledCarbs, scaledProtein, scaledFat, scaledFiber],
                backgroundColor: [
                    "#2196f3", // Carbs - blue
                    "#ffb74d", // Protein - orange
                    "#9c27b0", // Fat - purple
                    "#4caf50", // Fiber - green
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
                    label: (context) => `${context.label}: ${context.parsed} g`,
                },
            },
        },
    };

    const handleConfirm = () => {
        if (!quantity || isNaN(quantity) || quantity <= 0) {
            alert("Vui lòng nhập số gram hợp lệ");
            return;
        }
        onAdd(ingredient, parseFloat(quantity));
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
                {mode === "edit" ? "Chỉnh sửa nguyên liệu" : "Chi tiết nguyên liệu"}
                <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="#000"
                    mb={1}
                    mt={1}
                >
                    Thêm vào bữa ăn
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mt: 2,
                        mb: 3,
                        justifyContent: "flex-start",
                    }}
                >
                    <TextField
                        type="number"
                        label="Gram"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        size="small"
                        variant="outlined"
                        InputProps={{
                            sx: {
                                borderRadius: 8,
                            },
                        }}
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
                        onClick={() => onAdd(ingredient, quantity)}
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
                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="#000"
                    mb={1}
                    mt={1}
                >
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
                            {((caloriesPer100g * quantity) / 100).toFixed(0)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Kcal ({quantity}g)
                        </Typography>
                    </Box>
                </Box>
                {/* {description && (
                    <Typography variant="body2" mb={2}>{description}</Typography>
                )} */}

            </DialogContent>
        </Dialog>
    );
};

export default IngredientDetailModal;

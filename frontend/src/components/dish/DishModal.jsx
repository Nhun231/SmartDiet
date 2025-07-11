import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Box,
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

ChartJS.register(ArcElement, Tooltip, Legend);

const DishDetailModal = ({ open, onClose, dish }) => {
    if (!dish) return null;

    const {
        name,
        description,
        totals = {},
        ingredients = [],
    } = dish;

    const data = {
        labels: ["Tinh bột", "Chất đạm", "Chất béo", "Chất xơ"],
        datasets: [
            {
                data: [
                    totals.carbs || 0,
                    totals.protein || 0,
                    totals.fat || 0,
                    totals.fiber || 0
                ],
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

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: 7, boxShadow: 12 } }}
        >
            <DialogTitle>
                Chi tiết món ăn
                <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Typography variant="h6" fontWeight="bold" color="green" gutterBottom>
                    {name}
                </Typography>

                {description && (
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        {description}
                    </Typography>
                )}

                <Typography variant="subtitle1" fontWeight="bold" mt={2} mb={1}>
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
                            {totals.calories?.toFixed(0) || 0}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Kcal / khẩu phần
                        </Typography>
                    </Box>
                </Box>

                <Typography variant="subtitle1" fontWeight="bold" mt={3} mb={1}>
                    Nguyên liệu
                </Typography>
                <Box component="ul" sx={{ pl: 3 }}>
                    {ingredients.map((ing, idx) => (
                        <li key={idx}>
                            <Typography variant="body2">
                                {ing.ingredientId?.name || "Nguyên liệu"} - {ing.quantity}g
                            </Typography>
                        </li>
                    ))}
                </Box>

                <Box display="flex" justifyContent="flex-end" mt={3}>
                    <Button onClick={onClose} variant="contained" color="primary">
                        Đóng
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default DishDetailModal;

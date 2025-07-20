import React from "react";
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Tooltip,
    Box
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const DishCard = ({ dish, onClick, onEdit, onDelete }) => {
    if (!dish) return null;

    const { name, description, totals } = dish;

    return (
        <Card
            onClick={onClick}
            sx={{
                borderRadius: 5,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                px: 3,
                py: 2,
                minWidth: 300,
                maxWidth: 300,
                width: "100%",
                boxSizing: "border-box",
                margin: "1%",
                cursor: "pointer",
                position: "relative",
            }}
        >
            <CardContent sx={{ p: 0 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Tooltip title={name} arrow>
                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            noWrap
                            sx={{ maxWidth: "70%", cursor: "default" }}
                        >
                            {name}
                        </Typography>
                    </Tooltip>

                    <Box>
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit?.(dish);
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.(dish);
                            }}
                        >
                            <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                    </Box>
                </Box>

                {description && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontStyle: "italic", mb: 1 }}
                    >
                        {description}
                    </Typography>
                )}

                <Typography variant="body2">
                    {totals?.calories?.toFixed(0) || 0} kcal
                </Typography>
            </CardContent>
        </Card>
    );
};

export default DishCard;

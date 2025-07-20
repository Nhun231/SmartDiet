import React from "react";
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Tooltip,
    Box
} from "@mui/material";
import { useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import baseAxios from "../../api/axios";
const DishCardOnMeal = ({ name, calories, onAdd, onClick, userID, id }) => {
    useEffect(() => {
        console.log("🔍 Kiểm tra props:");
        console.log("userID:", name);
    }, [userID]);

    const handleDelete = async (e) => {
        e.stopPropagation();
        try {
            try {
                const response = await baseAxios.delete(`/dish/${id}`);
                if (response.status === 200) {
                    window.location.reload();
                }
            } catch (error) {
                console.error("Error deleting dish:", error);
            }
        } catch (error) {
            console.error("Error deleting dish:", error);
        }
    }

    return (
        <Card
            onClick={onClick}
            sx={{
                borderRadius: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 5,
                py: 1,
                width: "50%",
                minWidth: 300,
                maxWidth: 300,
                boxSizing: "border-box",
                margin: "1%",
                cursor: "pointer",
            }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                <Tooltip title={name} arrow>
                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        noWrap
                        sx={{ maxWidth: "calc(100% - 20px)", cursor: "default" }}
                    >
                        {name}
                    </Typography>
                </Tooltip>
                <Typography variant="body2">100g - {calories} calo</Typography>
            </CardContent>

            {/* Nhóm các nút hành động với icon nhỏ */}
            <Box sx={{ display: "flex", gap: 0.5 }}>
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAdd();
                    }}
                >
                    <AddIcon fontSize="small" />
                </IconButton>
                {userID != null && (
                    <>

                        <IconButton
                            size="small"
                            onClick={handleDelete}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </>
                )}


            </Box>
        </Card>
    )
};

export default DishCardOnMeal;

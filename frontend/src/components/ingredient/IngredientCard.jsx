import React from "react";
import { Card, CardContent, Typography, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const IngredientCard = ({ name, calories, onAdd, onClick }) => (
    <Card onClick={onClick}
        sx={{
            borderRadius: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 5,
            py: 1,
            width: "50%",   // mỗi card chiếm ~23% chiều ngang
            minWidth: 300,
            maxWidth: 300,   // có thể set tối thiểu nếu muốn
            boxSizing: "border-box",
            margin: "1%",   // khoảng cách giữa các card
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
        <IconButton
            onClick={(e) => {
                e.stopPropagation(); // 👈 Dòng quan trọng
                onAdd();
            }}
        >
            <AddIcon />
        </IconButton>
    </Card>
);

export default IngredientCard;
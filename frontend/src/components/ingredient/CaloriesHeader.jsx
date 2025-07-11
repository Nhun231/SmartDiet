// src/components/ingredient/IngredientHeader.jsx

import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

const IngredientHeader = ({ total }) => {
    return (
        <Box sx={{ bgcolor: "#2FEE6F", p: 3, color: "white", display: "flex", gap: 4 }}>
            {/* Calories Circle */}
            <Box
                sx={{
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    border: "4px solid white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                    fontSize: 18,
                    ml: 30
                }}
            >
                {total.calories}
                <Typography variant="body2">Calories</Typography>
            </Box>

            {/* Macro Progress */}
            <Box sx={{ flexGrow: 1 }}>
                {[
                    { label: "Tinh bột", value: total.carbs },
                    { label: "Chất đạm", value: total.protein },
                    { label: "Chất béo", value: total.fat },
                    { label: "Chất xơ", value: total.fiber }
                ].map((item, idx) => (
                    <React.Fragment key={idx}>
                        <Typography sx={{ ml: 25 }}>{item.label}</Typography>
                        <LinearProgress
                            variant="determinate"
                            value={Math.min(item.value, 100)}
                            sx={{
                                width: 600,
                                backgroundColor: "rgba(255,255,255,0.3)",
                                "& .MuiLinearProgress-bar": {
                                    backgroundColor: "#fff",
                                },
                                mb: 1,
                                height: 8,
                                borderRadius: 4,
                                ml: 25
                            }}
                        />
                    </React.Fragment>
                ))}
            </Box>
        </Box>
    );
};

export default IngredientHeader;

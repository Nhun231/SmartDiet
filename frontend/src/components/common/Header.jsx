import React, { useState } from "react";
import { Box, Button, Typography, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import UserLevelBadge from './UserLevelBadge';
import { useAuth } from "../../context/AuthProvider";

const Header = () => {
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);

    const isLoggedIn = !!accessToken;

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("email");
        navigate("/login");
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box
            sx={{
                backgroundColor: "#4CAF50",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                position: "sticky",
                top: 0,
                zIndex: 1000,
                width: "100%",
                fontFamily: '"Segoe UI", sans-serif',
            }}
        >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                maxWidth="1600px"
                mx="auto"
                px={4}
                py={2}
            >
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="white"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => window.location.href = "https://health-mate-gamma.vercel.app/dashboard"}
                >
                    HealthMate
                </Typography>

                <Box display="flex" gap={2}>
                    <Button
                        onClick={() => navigate("/calculate")}
                        sx={{ color: "#ffffff", fontWeight: "bold" }}
                    >
                        Công cụ tính toán
                    </Button>
                    <Button onClick={() => navigate("/meal")}
                        sx={{ color: "#ffffff", fontWeight: "bold" }}>
                        Thực đơn hôm nay
                    </Button>
                    <Button onClick={() => navigate("/dietplan/create")}
                        sx={{ color: "#ffffff", fontWeight: "bold" }}>
                        Lập kế hoạch ăn uống
                    </Button>
                    <Button onClick={() => navigate("/premium-packages")}
                        sx={{ color: "#ffffff", fontWeight: "bold" }}>
                        Gói Premium
                    </Button>

                    {isLoggedIn ? (
                        <>
                            <Button
                                onClick={handleMenuClick}
                                sx={{ color: "#ffffff", fontWeight: "bold" }}
                            >
                                Tài khoản
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={() => { navigate("/my-profile"); handleMenuClose(); }}>
                                    Hồ sơ
                                </MenuItem>
                                <MenuItem onClick={() => { navigate("/add-coins"); handleMenuClose(); }}>
                                    Nạp xu
                                </MenuItem>
                                <MenuItem onClick={() => { navigate("/coin-transactions"); handleMenuClose(); }}>
                                    Lịch sử giao dịch
                                </MenuItem>
                                <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>
                                    Đăng xuất
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Button
                                onClick={() => navigate("/login")}
                                sx={{ color: "#ffffff", fontWeight: "bold" }}
                            >
                                Đăng nhập
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate("/login", { state: { register: true } })}
                                sx={{
                                    borderColor: "#ffffff",
                                    color: "#ffffff",
                                    fontWeight: "bold",
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                                        borderColor: "#ffffff",
                                    },
                                }}
                            >
                                Đăng ký
                            </Button>
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default Header;

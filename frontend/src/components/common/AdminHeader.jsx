import React, { useState } from "react";
import { Box, Button, Typography, Menu, MenuItem, Chip } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import UserLevelBadge from './UserLevelBadge';
import { useAuth } from "../../context/AuthProvider";
import { 
  Dashboard, 
  Restaurant, 
  AccountBalance, 
  People, 
  Assessment,
  AdminPanelSettings
} from '@mui/icons-material';

const AdminHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, accessToken } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);

    const isLoggedIn = !!accessToken;

    const isActiveRoute = (path) => {
        return location.pathname === path;
    };

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
                backgroundColor: "#2E7D32",
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
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AdminPanelSettings sx={{ mr: 1, fontSize: 28 }} />
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        color="white"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate("/admin/dashboard")}
                    >
                        HealthMate Admin
                    </Typography>
                    <Chip 
                        label="ADMIN" 
                        size="small" 
                        sx={{ 
                            ml: 2, 
                            backgroundColor: '#FFD700', 
                            color: '#000',
                            fontWeight: 'bold',
                            fontSize: '0.7rem'
                        }} 
                    />
                </Box>

                <Box display="flex" gap={1}>
                    {/* Admin Dashboard */}
                    <Button
                        onClick={() => navigate("/admin/dashboard")}
                        startIcon={<Dashboard />}
                        sx={{ 
                            color: "#ffffff", 
                            fontWeight: "bold",
                            backgroundColor: isActiveRoute("/admin/dashboard") ? "rgba(255,255,255,0.2)" : "transparent",
                            "&:hover": {
                                backgroundColor: "rgba(255,255,255,0.1)"
                            }
                        }}
                    >
                        Tổng quan
                    </Button>
                    
                    {/* Transaction Management */}
                    <Button
                        onClick={() => navigate("/admin/coin-transactions")}
                        startIcon={<AccountBalance />}
                        sx={{ 
                            color: "#ffffff", 
                            fontWeight: "bold",
                            backgroundColor: isActiveRoute("/admin/coin-transactions") ? "rgba(255,255,255,0.2)" : "transparent",
                            "&:hover": {
                                backgroundColor: "rgba(255,255,255,0.1)"
                            }
                        }}
                    >
                        Giao dịch xu
                    </Button>
                    
                    {/* Ingredient Management */}
                    <Button
                        onClick={() => navigate("/create-ingredient")}
                        startIcon={<Restaurant />}
                        sx={{ 
                            color: "#ffffff", 
                            fontWeight: "bold",
                            backgroundColor: isActiveRoute("/create-ingredient") ? "rgba(255,255,255,0.2)" : "transparent",
                            "&:hover": {
                                backgroundColor: "rgba(255,255,255,0.1)"
                            }
                        }}
                    >
                        Nguyên liệu
                    </Button>
                    
                    {/* User Management */}
                    <Button
                        onClick={() => navigate("/admin/dashboard")}
                        startIcon={<People />}
                        sx={{ 
                            color: "#ffffff", 
                            fontWeight: "bold",
                            backgroundColor: "transparent",
                            "&:hover": {
                                backgroundColor: "rgba(255,255,255,0.1)"
                            }
                        }}
                    >
                        Người dùng
                    </Button>
                    
                    {/* Reports */}
                    <Button
                        onClick={() => navigate("/admin/dashboard")}
                        startIcon={<Assessment />}
                        sx={{ 
                            color: "#ffffff", 
                            fontWeight: "bold",
                            backgroundColor: "transparent",
                            "&:hover": {
                                backgroundColor: "rgba(255,255,255,0.1)"
                            }
                        }}
                    >
                        Báo cáo
                    </Button>

                    {isLoggedIn ? (
                        <>
                            <Button
                                onClick={handleMenuClick}
                                sx={{ color: "#ffffff", fontWeight: "bold" }}
                            >
                                Tài khoản Admin
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={() => { navigate("/my-profile"); handleMenuClose(); }}>
                                    Hồ sơ cá nhân
                                </MenuItem>
                                <MenuItem onClick={() => { navigate("/admin/dashboard"); handleMenuClose(); }}>
                                    Bảng điều khiển
                                </MenuItem>
                                <MenuItem onClick={() => { navigate("/premium-packages"); handleMenuClose(); }}>
                                    Gói Premium
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

export default AdminHeader;

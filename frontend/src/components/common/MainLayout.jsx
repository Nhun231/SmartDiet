import React from "react";
import Header from "./Header";
import AdminHeader from "./AdminHeader";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import {Box} from "@mui/material";
import { useAuth } from "../../context/AuthProvider";

const MainLayout = () => {
    const { user } = useAuth();

    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                {user?.role === "admin" ? <AdminHeader /> : <Header />}
                <Box sx={{ flexGrow: 1}}>
                    <Outlet  />
                </Box>
                <Footer />
            </Box>

        </>
    );
};

export default MainLayout;

import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import {Box} from "@mui/material";

const MainLayout = () => {
    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <Header />
                <Box sx={{ flexGrow: 1}}>
                    <Outlet  />
                </Box>
                <Footer />
            </Box>

        </>
    );
};

export default MainLayout;

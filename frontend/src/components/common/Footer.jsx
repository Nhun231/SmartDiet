import React from "react";
import { Box, Typography, Link, Stack } from "@mui/material";

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: "#4CAF50",
                color: "white",
                py: 4,
                width: "100%",
            }}
        >
            <Box maxWidth="1600px" mx="auto" px={4}>
                {/* Thông tin chính */}
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={3}
                    justifyContent="space-between"
                    alignItems="flex-start"
                    flexWrap="wrap"
                >

                    <Box>
                        <Typography variant="h6" fontWeight="bold">
                            SmartDiet
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Nền tảng hỗ trợ tính toán dinh dưỡng, theo dõi sức khỏe và gợi ý thực đơn khoa học cho bạn.
                        </Typography>
                    </Box>


                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Liên kết nhanh
                        </Typography>
                        <Stack spacing={1}>
                            <Link href="/calculate" color="inherit" underline="hover">Công cụ tính toán</Link>
                            <Link href="#" color="inherit" underline="hover">Lập kế hoạch ăn uống</Link>
                            <Link href="/login" color="inherit" underline="hover">Đăng nhập</Link>
                            <Link href="/register" color="inherit" underline="hover">Đăng ký</Link>
                        </Stack>
                    </Box>

                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Liên hệ
                        </Typography>
                        <Typography variant="body2">
                            Email: smartdiet.sdn@gmail.com
                        </Typography>
                        <Typography variant="body2">
                            Hotline: 0987654321
                        </Typography>
                        <Typography variant="body2">
                            Địa chỉ: Trường Đại học FPT Hà Nội
                        </Typography>
                    </Box>
                </Stack>

                <Box textAlign="center" mt={4}>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        © {new Date().getFullYear()} SmartDiet. All rights reserved.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Footer;

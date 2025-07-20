
import {
    Box,
    Button,
    Container,
    Typography,
    ThemeProvider,
    createTheme,
    CssBaseline,
    Paper,
    Stack,
} from "@mui/material"
import { Lock, Login, ArrowBack, Home } from "@mui/icons-material"

// Create a custom green theme (same as 404 page)
const greenTheme = createTheme({
    palette: {
        primary: {
            main: "#2e7d32", // Green 800
            light: "#4caf50", // Green 500
            dark: "#1b5e20", // Green 900
        },
        secondary: {
            main: "#66bb6a", // Green 400
            light: "#81c784", // Green 300
            dark: "#388e3c", // Green 700
        },
        background: {
            default: "#f1f8e9", // Light green 50
            paper: "#ffffff",
        },
        text: {
            primary: "#1b5e20",
            secondary: "#2e7d32",
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: "6rem",
            "@media (max-width:600px)": {
                fontSize: "4rem",
            },
        },
        h2: {
            fontWeight: 600,
            fontSize: "2.5rem",
            "@media (max-width:600px)": {
                fontSize: "2rem",
            },
        },
        h4: {
            fontWeight: 500,
            fontSize: "1.5rem",
            "@media (max-width:600px)": {
                fontSize: "1.25rem",
            },
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: "none",
                    fontWeight: 600,
                    padding: "12px 24px",
                },
            },
        },
    },
})

export default function UnauthorizedPage() {
    const handleLogin = () => {
        window.location.href = "/login"
    }

    const handleGoHome = () => {
        window.location.href = "/homepage"
    }

    const handleGoBack = () => {
        window.history.back()
    }

    return (
        <ThemeProvider theme={greenTheme}>
            <CssBaseline />
            <Box
                sx={{
                    minHeight: "100vh",
                    background: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 2,
                }}
            >
                <Container maxWidth="md">
                    <Paper
                        elevation={8}
                        sx={{
                            padding: { xs: 4, md: 6 },
                            textAlign: "center",
                            borderRadius: 4,
                            background: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        <Box sx={{ mb: 4 }}>
                            {/* Large 401 Text */}
                            <Typography
                                variant="h1"
                                color="primary"
                                sx={{
                                    background: "linear-gradient(45deg, #2e7d32, #66bb6a)",
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                                    mb: 2,
                                }}
                            >
                                401
                            </Typography>

                            {/* Lock Icon */}
                            <Box sx={{ mb: 3 }}>
                                <Lock
                                    sx={{
                                        fontSize: 80,
                                        color: "primary.light",
                                        opacity: 0.7,
                                    }}
                                />
                            </Box>

                            {/* Main heading */}
                            <Typography variant="h2" color="text.primary" gutterBottom sx={{ mb: 2 }}>
                                Access Denied
                            </Typography>

                            {/* Description */}
                            <Typography variant="h4" color="text.secondary" sx={{ mb: 4, fontWeight: 400 }}>
                                You don't have permission to access this page.
                            </Typography>

                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ mb: 4, maxWidth: 500, mx: "auto", lineHeight: 1.6 }}
                            >
                                This page requires authentication or you may not have the necessary permissions. Please log in with the
                                appropriate credentials or contact your administrator.
                            </Typography>
                        </Box>

                        {/* Action buttons */}
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" alignItems="center">
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<Login />}
                                onClick={handleLogin}
                                sx={{
                                    minWidth: 160,
                                    background: "linear-gradient(45deg, #2e7d32, #4caf50)",
                                    "&:hover": {
                                        background: "linear-gradient(45deg, #1b5e20, #2e7d32)",
                                    },
                                }}
                            >
                                Sign In
                            </Button>

                            <Button
                                variant="outlined"
                                size="large"
                                startIcon={<Home />}
                                onClick={handleGoHome}
                                sx={{
                                    minWidth: 160,
                                    borderColor: "primary.main",
                                    color: "primary.main",
                                    "&:hover": {
                                        borderColor: "primary.dark",
                                        backgroundColor: "rgba(46, 125, 50, 0.04)",
                                    },
                                }}
                            >
                                Go Home
                            </Button>

                            <Button
                                variant="text"
                                size="large"
                                startIcon={<ArrowBack />}
                                onClick={handleGoBack}
                                sx={{
                                    minWidth: 160,
                                    color: "primary.main",
                                    "&:hover": {
                                        backgroundColor: "rgba(46, 125, 50, 0.04)",
                                    },
                                }}
                            >
                                Go Back
                            </Button>
                        </Stack>

                        {/* Additional help text */}
                        <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid", borderColor: "divider" }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                If you believe this is an error, please contact your administrator or support team

                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                                Error Code: 401 - Unauthorized Access
                            </Typography>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    )
}

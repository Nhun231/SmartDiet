import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider.jsx";

const DefaultRedirect = () => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/homepage" replace />;
    }
    if (user.role === "admin") {
        return <Navigate to="/create-ingredient" replace />;
    }

    if (user.role === "customer") {
        return <Navigate to="/dashboard" replace />;
    }

    // Optional fallback
    return <Navigate to="/unauthorized" replace />;
};

export default DefaultRedirect;

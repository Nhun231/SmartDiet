
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const RequireRole = ({ allowedRoles, children }) => {
    const { user } = useAuth();

    if (!user) {
        console.warn("User not logged in");
        return <Navigate to="/login" replace />;
    }

    const userRole = user?.role; // adapt based on JWT payload
    
    console.log("User role:", userRole);

    if (!allowedRoles.includes(userRole)) {
        console.warn("Access denied for role:", userRole);
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default RequireRole;


import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const RequireRole = ({ allowedRoles, children }) => {
    const { user, loading } = useAuth();

    console.log("RequireRole - user:", user);
    console.log("RequireRole - allowedRoles:", allowedRoles);
    if (loading) {
        return <div>Loading...</div>; // or null, or a spinner
    }

    if (!user) {
        console.warn("User not logged in");
        alert('You must login to action')
        return <Navigate to="/login" replace />;
    }

    const userRole = user?.role; // adapt based on JWT payload
    console.log("RequireRole - userRole:", userRole);

    if (!allowedRoles.includes(userRole)) {
        console.warn("Access denied for role:", userRole, "Allowed roles:", allowedRoles);
        return <Navigate to="/unauthorized" replace />;
    }

    console.log("RequireRole - Access granted for role:", userRole);
    return children;
};

export default RequireRole;

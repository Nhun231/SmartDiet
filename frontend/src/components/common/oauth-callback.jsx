import {useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider.jsx";
import { jwtDecode } from "jwt-decode";
const OAuthCallback = () => {
    const navigate = useNavigate();
    const hasRun = useRef(false);
    const { setAuth } = useAuth();

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const token = new URLSearchParams(window.location.search).get("access_token");
       console.log(`access token: ${token}`);

        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log("Decoded JWT payload:", decoded);

                // Set context state (giữ nguyên nếu bạn để role trong user)
            setAuth({
                accessToken: token,
                    user: decoded,
            });

            localStorage.setItem("accessToken", token);
            navigate("/dashboard");
            } catch (err) {
                console.error("Invalid access token:", err);
                navigate("/login?error=Invalid token");
            }
        } else {
            navigate("/login?error=OAuth failed");
        }
    }, [navigate, setAuth]);

    return null;
};

export default OAuthCallback;

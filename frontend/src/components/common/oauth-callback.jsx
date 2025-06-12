import {useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";

const OAuthCallback = () => {
    const navigate = useNavigate();
    const hasRun = useRef(false); // without this it runs twice
    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;
        const token = new URLSearchParams(window.location.search).get("access_token");
       console.log(`access token: ${token}`);
        if (token) {
            localStorage.setItem("accessToken", token);
            navigate("/home");
        } else {
            navigate("/login?error=OAuth failed");
        }

    }, [navigate]);

    return null;
};

export default OAuthCallback;

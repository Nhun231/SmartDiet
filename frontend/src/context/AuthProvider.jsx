//import axios from "axios";
import axios from "../api/axios";
import { useLayoutEffect, useState, useEffect, useRef } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return authContext;
};

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const alertShownRef = useRef(false);
  const nav = useNavigate();
  useLayoutEffect(() => {
    const authInterceptor = axios.interceptors.request.use((config) => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });
    return () => {
      axios.interceptors.request.eject(authInterceptor);
    };
  }, [token]);
  useLayoutEffect(() => {
    const refreshInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        // save error.config(as a configuration object) to retry request later
        const originalRequest = error.config;
        if (originalRequest._retry) {
          return Promise.reject(error);
        }
        if (
          error.response?.status === 401 &&
          error.response?.data.code === 4003
        ) {
          if (isRefreshing) {
            return Promise.reject(error);
          }
          setIsRefreshing(true);
          originalRequest._retry = true;
          try {
            // call to refresh Refresh token
            const response = await axios.get(`${BASE_URL}/auth/refresh`, {
              withCredentials: true,
            });
            console.log("Through cookie refresh");
            // console.log("csrf response",response);
            // localStorage.setItem("csrfToken",response.data.data);
            //marked as retried
            setIsRefreshing(false);
            // Save new access token
            const newAccessToken = response.data.accessToken;
            localStorage.setItem("accessToken", newAccessToken);
            //retry failed request
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            setIsRefreshing(false);
            console.log("Request refresh token failed: ", refreshError);
            if (!alertShownRef.current) {
              // Show alert only once
              alertShownRef.current = true;
              alert(
                "This account is offline too long! Please try to login again."
              );
              //await logoutUser();
              setTimeout(() => {
                alertShownRef.current = false; // Reset after navigation
                nav("/login");
              }, 0);
            }
            return Promise.reject(refreshError);
          }
        }
        // if not 401, reject error
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(refreshInterceptor);
    };
  }, [nav, isRefreshing]);
  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;

import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import AuthProvider from "../context/AuthProvider.jsx";
import OAuthCallback from "../components/common/oauth-callback.jsx";
import Calculator from "../pages/Calculator";
import ChangePassword from "../pages/ChangePassword";
import HomePage from "../pages/HomePage";
import MainLayout from "../components/common/mainLayout";
import ProfilePage from "../pages/ProfilePage";
import EditProfilePage from "../pages/EditProfilePage";

const AuthLayout = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
);
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/changepassword/:token",
    element: <ChangePassword />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/calculate",
        element: <Calculator />,
      },
      {
        path: "/my-profile",
        element: <ProfilePage />,
      },
      {
        path: "/edit-profile",
        element: <EditProfilePage />,
      },
      {
        path: "homepage",
        element: <HomePage />,
      },

    ],
  },
]);

export default router;

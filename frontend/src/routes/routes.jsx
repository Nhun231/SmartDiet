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
import RequireRole from "../components/common/RequireRole";
import NotFoundPage from "../components/common/NotFound404.jsx";
import UnauthorizedPage from "../components/common/Unautorized401.jsx";

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
        element: <MainLayout />,
        children: [
          {
            path: "/calculate",
            element: <Calculator />
          },
          {
            path: "/my-profile",
            element: <RequireRole allowedRoles={["admin", "user"]}>
                          <ProfilePage />
                     </RequireRole>,
          },
          {
            path: "/edit-profile",
            element: <RequireRole allowedRoles={["admin", "user"]}>
                         <EditProfilePage />
                    </RequireRole>,
          },
          {
            path: "/homepage",
            element: <HomePage />,
          },
          {
            path: "*",
            element: <NotFoundPage/>,
          },
          {
            path: "/unauthorized",
            element: <UnauthorizedPage/>,
          }
        ],
      },
    ],
  },
]);

export default router;

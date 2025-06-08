import { createBrowserRouter,Outlet } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import AuthProvider from "../context/AuthProvider.jsx";
import OAuthCallback from "../components/common/oauth-callback.jsx";

const AuthLayout = () => (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
);
const router = createBrowserRouter([
  {
    element: <AuthLayout/>,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/oauth-callback",
        element: <OAuthCallback />,
      },
    ],
  }
]);

export default router;

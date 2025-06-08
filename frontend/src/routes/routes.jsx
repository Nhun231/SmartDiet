import { createBrowserRouter,Outlet } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import AuthProvider from "../context/AuthProvider.jsx";

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
    ],
  }
]);

export default router;

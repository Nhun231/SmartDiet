import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Calculator from "../pages/Calculator";
import ChangePassword from "../pages/ChangePassword";
import HomePage from "../pages/HomePage";
import MainLayout from "../components/common/mainLayout";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: "calculate",
        element: <Calculator />,
      },
      {
        path: "changepassword/:token",
        element: <ChangePassword />,
      },
      {
        path: "homepage",
        element: <HomePage />,
      },
    ],
  },
]);

export default router;

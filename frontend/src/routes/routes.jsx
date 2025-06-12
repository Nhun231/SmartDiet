import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ChangePassword from "../pages/ChangePassword";
import Calculator from "../pages/Calculator";
import ProfilePage from "../pages/ProfilePage";
import EditProfilePage from "../pages/EditProfilePage";

const router = createBrowserRouter([
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/calculate",
    element: <Calculator />,
  },
  {
    path: "/changepassword/:token",
    element: <ChangePassword />,
  },
  {
    path: "/my-profile",
    element: <ProfilePage />,
  },
  {
    path: "/edit-profile",
    element: <EditProfilePage />,
  },
]);

export default router;

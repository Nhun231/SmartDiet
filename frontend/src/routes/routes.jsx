import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import AuthProvider from "../context/AuthProvider.jsx";
import OAuthCallback from "../components/common/oauth-callback.jsx";
import Calculator from "../pages/Calculator";
import ChangePassword from "../pages/ChangePassword";
import HomePage from "../pages/HomePage";
import MainLayout from "../components/common/MainLayout.jsx";
import ProfilePage from "../pages/ProfilePage";
import EditProfilePage from "../pages/EditProfilePage";
import RequireRole from "../components/common/RequireRole";
import NotFoundPage from "../components/common/NotFound404.jsx";
import UnauthorizedPage from "../components/common/Unautorized401.jsx";
import IngredientList from "../pages/IngredientList.jsx";
import SetGoal from "../components/dietPlan/SetGoal.jsx";
import DietPlan from "../components/dietPlan/DietPlan.jsx"
import UpdateNutrition from "../components/nutritions/UpdateNutrition.jsx"
import Daily from "../components/common/Daily.jsx";
import DishesPage from "../pages/DishPage.jsx";
import UserHomePage from "../pages/UserHomePage.jsx";
import WaterInformationPage from "../pages/WaterInformationPage.jsx";
import { Navigate } from "react-router-dom";
import DefaultRedirect from "../components/common/DefaultRedirect.jsx";

//For token, logout provide
import AdminIngredientPage from "../pages/AdminIngredient.jsx";

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
                path: "/oauth-callback",
                element: <OAuthCallback />,
            },
            {
                path: "/",
                element: <DefaultRedirect />
            },
          {
            path: "/calculate",
            element: (
                <RequireRole allowedRoles={["customer"]}>
                  <Calculator />
                </RequireRole>
            )
          },
          {
            path: "/meal",
            element: (
                <RequireRole allowedRoles={["customer"]}>
                  <IngredientList />
                </RequireRole>
            )
          },
          {
            path: "/dishes",
            element: (
                <RequireRole allowedRoles={["customer"]}>
                  <DishesPage />
                </RequireRole>
            )
          },
          {
            path: "/daily",
            element: (
                <RequireRole allowedRoles={["customer"]}>
                  <Daily />
                </RequireRole>
            )
          },
          {
            path: "/update-nutrition",
            element: (
                <RequireRole allowedRoles={["customer"]}>
                  <UpdateNutrition />
                </RequireRole>
            )
          },
          {
            path: "/setgoal",
            element: (
                <RequireRole allowedRoles={["customer"]}>
                  <SetGoal />
                </RequireRole>
            )
          },
          {
            path: "/dietplan/create",
            element: (
                <RequireRole allowedRoles={["customer"]}>
                  <DietPlan />
                </RequireRole>
            )
          },
          {
            path: "/dashboard",
            element: (
                <RequireRole allowedRoles={["customer"]}>
                  <UserHomePage />
                </RequireRole>
            )
          },
          {
            path: "/my-profile",
            element: (
                <RequireRole allowedRoles={["admin", "customer"]}>
                  <ProfilePage />
                </RequireRole>
            )
          },
          {
            path: "/edit-profile",
            element: <RequireRole allowedRoles={["admin", "customer"]}>
              <EditProfilePage />
            </RequireRole>,
          },
          {
            path: "/create-ingredient",
            element: <RequireRole allowedRoles={["admin"]}>
              <AdminIngredientPage />
            </RequireRole>,
          },
          {
            path: "/water-infor",
            element: (
                <RequireRole allowedRoles={["customer"]}>
                  <WaterInformationPage />
                </RequireRole>
            )
          },
          {
            path: "/homepage",
            element: (
              <HomePage />
            )
          },
          {
            path: "/unauthorized",
            element: <UnauthorizedPage />,
          },
          {
            path: "*",
            element: <NotFoundPage />,
          }
        ],
      },
    ],
  },
]);

export default router;

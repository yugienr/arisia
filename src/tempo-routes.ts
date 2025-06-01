import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { PrivateRoute } from "./components/common/PrivateRoute"; // Buat file ini jika belum ada
import { DashboardRoute } from "./App"; // Atau pindahkan fungsi ini ke `PrivateRoute.tsx`

// Public pages
const Home = lazy(() => import("@/components/pages/home"));
const LoginForm = lazy(() => import("@/components/auth/LoginForm"));
const SignUpForm = lazy(() => import("@/components/auth/SignUpForm"));
const Success = lazy(() => import("@/components/pages/success"));

// Dashboard pages
const CustomerDashboard = lazy(() => import("@/components/pages/customer-dashboard"));
const AdminDashboard = lazy(() => import("@/components/pages/admin-dashboard"));
const ProfilePage = lazy(() => import("@/components/pages/profile"));
const OrdersPage = lazy(() => import("@/components/pages/orders"));
const NewOrderPage = lazy(() => import("@/components/pages/new-order"));
const OrderDetailsPage = lazy(() => import("@/components/pages/order-details"));
const UsersManagementPage = lazy(() => import("@/components/pages/users-management"));

const routes = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <LoginForm /> },
  { path: "/signup", element: <SignUpForm /> },
  { path: "/success", element: <Success /> },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardRoute />
      </PrivateRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <PrivateRoute>
        <ProfilePage />
      </PrivateRoute>
    ),
  },
  {
    path: "/orders",
    element: (
      <PrivateRoute>
        <OrdersPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/orders/:id",
    element: (
      <PrivateRoute>
        <OrderDetailsPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/new-order",
    element: (
      <PrivateRoute>
        <NewOrderPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <PrivateRoute adminOnly={true}>
        <UsersManagementPage />
      </PrivateRoute>
    ),
  },
  { path: "*", element: <Navigate to="/" /> },
];

export default routes;

//Layout
import AdminLayout from "../components/AdminLayout";

// Pages
import { Login } from "../pages/Login/Login";
import DashboardPage from "../pages/Dashboard/Dashboard";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import Employees from "../pages/Employees/Employees";

const publicRoutes = [
  { path: "/", component: <Login /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgotPassword /> },
];

const privateRoutes = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "peopleHub/employees",
        element: <Employees />,
      },
    ],
  },
];

export { publicRoutes, privateRoutes };

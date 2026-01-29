//Layout
import AdminLayout from "../components/AdminLayout";

// Pages
import { Login } from "../pages/Login/Login";
import DashboardPage from "../pages/Dashboard/Dashboard";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import Employees from "../pages/Employees/Employees";
import EmployeeProfile from "../pages/EmployeeProfile/EmployeeProfile";

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
      {
        path: "peopleHub/employees/employeeProfile",
        element: <EmployeeProfile />,
      },
    ],
  },
];

export { publicRoutes, privateRoutes };

//Layout
import AdminLayout from "../components/AdminLayout";

// Pages
import { Login } from "../pages/Login/Login";
import DashboardPage from "../pages/Dashboard/Dashboard";

const publicRoutes = [
  { path: "/", component: <Login /> },
  { path: "/login", component: <Login /> },
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
    ],
  },
];

export { publicRoutes, privateRoutes };

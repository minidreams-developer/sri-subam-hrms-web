//Layout
import AdminLayout from "../components/AdminLayout";

// Pages
import { Login } from "../pages/Login/Login";
import DashboardPage from "../pages/Dashboard/Dashboard";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import Employees from "../pages/Employees/Employees";
import EmployeeProfile from "../pages/EmployeeProfile/EmployeeProfile";
import Teams from "../pages/Teams/Teams";
import TeamDetails from "../pages/Teams/TeamDetails";
import Branches from "../pages/Branches/Branches";
import LeaveAttendance from "../pages/Leave Attendance/LeaveAttendance";
import AddLeave from "../pages/Leave Attendance/Add Leave/AddLeave";
import OverTimeManage from "../pages/OverTime Management";
import ShiftManagement from "../pages/Shift Management/ShiftManagement";
import AddShift from "../pages/Shift Management/AddShift";

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
      {
        path: "peopleHub/teams",
        element: <Teams />,
      },
      {
        path: "peopleHub/teams/teamDetails",
        element: <TeamDetails />,
      },
      {
        path: "peopleHub/branch",
        element: <Branches />,
      },
      {
        path: "peopleHub/branches",
        element: <Branches />,
      },
      {
        path: "time-hub/leaveAttendance",
        element: <LeaveAttendance />,
      },
      {
        path: "time-hub/leaveAttendance/add-Leave",
        element: <AddLeave />,
      },
      {
        path: "time-hub/overTime-management",
        element: <OverTimeManage />,
      },
      {
        path: "time-hub/shiftManagement",
        element: <ShiftManagement />,
      },
      {
        path: "time-hub/shiftManagement/addNewShift",
        element: <AddShift />,
      },
    ],
  },
];

export { publicRoutes, privateRoutes };

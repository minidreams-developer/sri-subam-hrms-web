//Layout
import AdminLayout from "../components/AdminLayout";

// Pages
import { Login } from "../pages/Login/Login";
import DashboardPage from "../pages/Dashboard/Dashboard";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import Employees from "../pages/Employees/Employees";
import EmployeeProfile from "../pages/EmployeeProfile/EmployeeProfile";
import EditAttendanceDetails from "../pages/EmployeeProfile/Attendance/EditAttendanceDetails";
import CreateEmployee from "../pages/Create Employee/CreateEmployee";
import Teams from "../pages/Teams/Teams";
import TeamDetails from "../pages/Teams/TeamDetails";
import Hierarchy from "../pages/Hierarchy/Hierarchy";
import Branches from "../pages/Branches/Branches";
import CreateBranch from "../pages/Branches/CreateBranch";
import LeaveAttendance from "../pages/Leave Attendance/LeaveAttendance";
import AddLeave from "../pages/Leave Attendance/Add Leave/AddLeave";
import EditLeave from "../pages/Leave Attendance/Edit Leave/EditLeave";
import OverTimeManage from "../pages/OverTime Management";
import ShiftManagement from "../pages/Shift Management/ShiftManagement";
import AddShift from "../pages/Shift Management/AddShift";
import OffBoarding from "../pages/OffBoarding/OffBoarding";
import EmployeeOffboardDetails from "../pages/OffBoarding/EmployeeOffboardDetails";
import CreateEmployeeOffboard from "../pages/OffBoarding/CreateEmployeeOffboard";
import Leaderboard from "../pages/Leaderboard/Leaderboard";
import DayOffAndHoliday from "../pages/DayOffAndHoliday/DayOffAndHoliday";
import AddHoliday from "../pages/DayOffAndHoliday/AddHoliday";

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
        path: "peopleHub/employees/create",
        element: <CreateEmployee />,
      },
      {
        path: "peopleHub/employees/employeeProfile",
        element: <EmployeeProfile />,
      },
      {
        path: "peopleHub/employees/attendance/edit",
        element: <EditAttendanceDetails />,
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
        path: "peopleHub/hierarchy",
        element: <Hierarchy />,
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
        path: "peopleHub/branch/createBranch",
        element: <CreateBranch />,
      },
      {
        path: "time-hub/leaveAttendance",
        element: <LeaveAttendance />,
      },
      {
        path: "time-hub/leaveAttendance/add-LeaveOrPermissions",
        element: <AddLeave />,
      },
      {
        path: "time-hub/leaveAttendance/edit-Leave",
        element: <EditLeave />,
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
      {
        path: "peopleHub/off-boarding",
        element: <OffBoarding />,
      },
      {
        path: "peopleHub/off-boarding/createEmployeeOffBoard",
        element: <CreateEmployeeOffboard />,
      },
      {
        path: "peopleHub/off-boarding/EmployeeOffBoardingDetails",
        element: <EmployeeOffboardDetails />,
      },
      {
        path: "time-hub/leaderboard",
        element: <Leaderboard />,
      },
      {
        path: "time-hub/dayOffHolidays",
        element: <DayOffAndHoliday />,
      },
      {
        path: "time-hub/dayOffHolidays/createNewHoliday",
        element: <AddHoliday />,
      },
    ],
  },
];

export { publicRoutes, privateRoutes };

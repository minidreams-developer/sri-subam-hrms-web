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
import Payroll from "../pages/Payroll/Payroll";
import Paysheet from "../pages/Paysheet/Paysheet";
import StopPayroll from "../pages/StopPayroll/StopPayroll";
import NewStopPayroll from "../pages/StopPayroll/NewStopPayroll";
import Addition from "../pages/Addition/Addition";
import AddAdjustment from "../pages/Addition/AddAdjustment";
import GeneralSettings from "../pages/Settings/GeneralSettings/GeneralSettings";
import OrganizationDetails from "../pages/Settings/OrganizationDetails";
import Departments from "../pages/Settings/Departments/Departments";
import Roles from "../pages/Settings/Roles/Roles";
import RolesConfig from "../pages/Settings/Roles/RolesConfig";
import DaySettings from "../pages/Settings/DaySettings/DaySettings";
import SeriesConfigurationPage from "../pages/Settings/SeriesConfiguration";
import AddSeriesPage from "../pages/Settings/AddSeriesPage";
import AttendancePage from "../pages/Attendance/Attendance";
import AddAttendance from "../pages/Attendance/Add";
import ContractorOverview from "../pages/Contractors/Overview";
import ContractorOverviewAnalysis from "../pages/Contractors/OverviewAnalysis";
import ContractorList from "../pages/Contractors/Contractors";
import ContractorPayments from "../pages/Contractors/Payments";
import BioDatReport from "../pages/Contractors/BioDatReport";
import AddContractor from "../pages/Contractors/AddContractor";
import WorkJobDetails from "../pages/Contractors/WorkJobDetails";
import AllContractorsReport from "../pages/Contractors/AllContractorsReport";
import PaymentReport from "../pages/Contractors/PaymentReport";
import MakePayment from "../pages/Contractors/MakePayment";
import PaymentReceipt from "../pages/Contractors/PaymentReceipt";


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
        path: "time-hub/attendance",
        element: <AttendancePage />,
      },
      {
        path: "time-hub/attendance/add",
        element: <AddAttendance />,
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
      {
        path: "pay-hub/payroll",
        element: <Payroll />,
      },
      {
        path: "pay-hub/paysheet",
        element: <Paysheet />,
      },
      {
        path: "pay-hub/stopPayroll",
        element: <StopPayroll />,
      },
      {
        path: "pay-hub/stopPayroll/new",
        element: <NewStopPayroll />,
      },
      {
        path: "pay-hub/additionDeductions",
        element: <Addition />,
      },
      {
        path: "pay-hub/additionDeductions/add",
        element: <AddAdjustment />,
      },
      {
        path: "settings/generalSettings",
        element: <GeneralSettings />,
      },
      {
        path: "settings/organizationDetails",
        element: <OrganizationDetails />,
      },
      {
        path: "settings/departments",
        element: <Departments />,
      },
      {
        path: "settings/roles",
        element: <Roles />,
      },
      {
        path: "settings/roles/roleConfigure",
        element: <RolesConfig />,
      },
      {
        path: "settings/daySettings",
        element: <DaySettings />,
      },
      {
        path: "settings/seriesConfiguration",
        element: <SeriesConfigurationPage />,
      },
      {
        path: "settings/seriesConfiguration/add",
        element: <AddSeriesPage />,
      },
      {
        path: "contractors/overview",
        element: <ContractorOverview />,
      },
      {
        path: "contractors/overviewanalysis",
        element: <ContractorOverviewAnalysis />,
      },
      {
        path: "contractors/contractors",
        element: <ContractorList />,
      },
      {
        path: "contractors/add",
        element: <AddContractor />,
      },
      {
        path: "contractors/work-job-details",
        element: <WorkJobDetails />,
      },
      {
        path: "contractors/payments",
        element: <ContractorPayments />,
      },
      {
        path: "contractors/bio-data-report",
        element: <BioDatReport />,
      },
      {
        path: "contractors/report/all-contractors",
        element: <AllContractorsReport />,
      },
      {
        path: "contractors/payment-report",
        element: <PaymentReport />,
      },
      {
        path: "contractors/pay/:contractorName",
        element: <MakePayment />,
      },
      {
        path: "contractors/payment-receipt/:contractorName",
        element: <PaymentReceipt />,
      },
    ],
  },
];

export { publicRoutes, privateRoutes };

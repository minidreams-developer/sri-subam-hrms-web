//icons
import DashboardIcon from "../assets/images/DashboardImages/dashboardIcon_light.svg";
import DashboardIconDark from "../assets/images/DashboardImages/dashboardIcon_light.svg";
import AnnIcon from "../assets/images/DashboardImages/megaphone_svgrepo.com.svg";
import GroupIcon from "../assets/images/DashboardImages/group_svgrepo.com.svg";
import TimeIcon from "../assets/images/DashboardImages/calendar_svgrepo.com.svg";
import MoneyIcon from "../assets/images/DashboardImages/money-bag_svgrepo.com.svg";
import MessageIcon from "../assets/images/DashboardImages/message-text-1_svgrepo.com.svg";
import SettingsIcon from "../assets/images/DashboardImages/settings_svgrepo.com.svg";

const SidebarItems = [
  {

    name:"Face Camera",
    path:"/admin/face-capture-test",
  },

  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: DashboardIcon,
    iconDark: DashboardIconDark,
  },
  {
    name: "Announcement",
    path: "/admin/announcement",
    icon: AnnIcon,
    iconDark: AnnIcon,
  },
  {
    name: "People Hub",
    icon: GroupIcon,
    iconDark: GroupIcon,
    submenu: [
      {
        name: "Onboarding",
        path: "/admin/peopleHub/employees/create",
        state: { from: "onboarding" },
      },
      {
        name: "Employees",
        path: "/admin/peopleHub/employees",
        activePaths: ["/admin/peopleHub/staff/create"],
      },
      {
        name: "Agents",
        path: "/admin/people/agents",
      },
      {
        name: "Teams",
        path: "/admin/peopleHub/teams",
      },
      {
        name: "Branch",
        path: "/admin/peopleHub/branch",
      },
      {
        name: "Hierarchy",
        path: "/admin/peopleHub/hierarchy",
      },
      {
        name: "Off-Boarding",
        path: "/admin/peopleHub/off-boarding",
      },
    ],
  },
  {
    name: "Contractors",
    icon: GroupIcon,
    iconDark: GroupIcon,
    submenu: [
      {
        name: "Overview",
        path: "/admin/contractors/overview",
        activePaths: ["/admin/contractors/overviewanalysis"],
      },
      {
        name: "Contractors",
        path: "/admin/contractors/contractors",
        activePaths: [
          "/admin/contractors/add",
          "/admin/contractors/work-job-details",
          "/admin/contractors/add-work-entry",
          "/admin/contractors/bio-data-report",
          "/admin/contractors/report/all-contractors",
          "/admin/contractors/:id/details",
          "/admin/contractors/:id/print",
          "/admin/contractors/:id/report",
        ],
      },
      {
        name: "Payments",
        path: "/admin/contractors/payments",
        activePaths: [
          "/admin/contractors/payment-report",
          "/admin/contractors/pay/:contractorName",
          "/admin/contractors/payment-receipt/:contractorName",
        ],
      },
    ],
  },
  {
    name: "Time Hub",
    icon: TimeIcon,
    iconDark: TimeIcon,
    submenu: [
      {
        name: "Attendance",
        path: "/admin/time-hub/attendance",
        activePaths: ["/admin/time-hub/attendance/add", "/admin/peopleHub/employees/attendance/edit"],
      },
      {
        name: "Timesheet",
        path: "/admin/time-hub/timesheet",
      },
      {
        name: "Roster Schedule",
        path: "/admin/time-hub/roster-schedule",
      },
      {
        name: "Leave Attendance",
        path: "/admin/time-hub/leaveAttendance",
        activePaths: ["/admin/time-hub/leaveAttendance/add-LeaveOrPermissions", "/admin/time-hub/leaveAttendance/edit-Leave"],
      },
      {
        name: "Shift Management",
        path: "/admin/time-hub/shiftManagement",
        activePaths: ["/admin/time-hub/shiftManagement/addNewShift"],
      },
      {
        name: "Overtime Management",
        path: "/admin/time-hub/overTime-management",
      },
      {
        name: "Leaderboard",
        path: "/admin/time-hub/leaderboard",
      },
      {
        name: "Day Off & Holidays",
        path: "/admin/time-hub/dayOffHolidays",
        activePaths: ["/admin/time-hub/dayOffHolidays/createNewHoliday"],
      },
    ],
  },
  {
    name: "Pay Hub",
    icon: MoneyIcon,
    iconDark: MoneyIcon,
    submenu: [
      {
        name: "Payroll",
        path: "/admin/pay-hub/payroll",
        activePaths: ["/admin/pay-hub/payslip"],
      },
      {
        name: "Paysheet",
        path: "/admin/pay-hub/paySheet",
      },
      {
        name: "Stop Payroll",
        path: "/admin/pay-hub/stopPayroll",
      },
      {
        name: "Addition & Deductions",
        path: "/admin/pay-hub/additionDeductions",
      },
    ],
  },
  {
    name: "Help",
    path: "/admin/help",
    icon: MessageIcon,
    iconDark: MessageIcon,
  },
  {
    name: "Settings",
    icon: SettingsIcon,
    iconDark: SettingsIcon,
    submenu: [
      {
        name: "General Settings",
        path: "/admin/settings/generalSettings",
      },
      {
        name: "Organization Details",
        path: "/admin/settings/organizationDetails",
      },
      {
        name: "Day Settings",
        path: "/admin/settings/daySettings",
      },
      {
        name: "Series Configuration",
        path: "/admin/settings/seriesConfiguration",
      },
      {
        name: "Departments",
        path: "/admin/settings/departments",
      },
      {
        name: "Designations",
        path: "/admin/settings/designations",
      },
      {
        name: "Roles",
        path: "/admin/settings/roles",
      },
    ],
  },
];

export default SidebarItems;

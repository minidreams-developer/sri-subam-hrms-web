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
        path: "/admin/people/onboarding",
      },
      {
        name: "Employees",
        path: "/admin/peopleHub/employees",
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
    name: "Time Hub",
    icon: TimeIcon,
    iconDark: TimeIcon,
    submenu: [
      {
        name: "Attendance",
        path: "/admin/time-hub/attendance",
      },
      {
        name: "Leave Attendance",
        path: "/admin/time-hub/leaveAttendance",
      },
      {
        name: "Shift Management",
        path: "/admin/time-hub/shiftManagement",
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
    path: "/admin/settings",
    icon: SettingsIcon,
    iconDark: SettingsIcon,
  },
];

export default SidebarItems;

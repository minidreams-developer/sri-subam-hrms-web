//icons
import DashboardIcon from "../assets/images/Dashboard Images/dashboardIcon_light.svg";
import DashboardIconDark from "../assets/images/Dashboard Images/dashboardIcon_light.svg";
import AnnIcon from "../assets/images/Dashboard Images/megaphone_svgrepo.com.svg";
import GroupIcon from "../assets/images/Dashboard Images/group_svgrepo.com.svg";
import TimeIcon from "../assets/images/Dashboard Images/calendar_svgrepo.com.svg";
import MoneyIcon from "../assets/images/Dashboard Images/money-bag_svgrepo.com.svg";
import MessageIcon from "../assets/images/Dashboard Images/message-text-1_svgrepo.com.svg";
import SettingsIcon from "../assets/images/Dashboard Images/settings_svgrepo.com.svg";

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
        path: "/admin/people/hierarchy",
      },
      {
        name: "Off-Boarding",
        path: "/admin/people/off-boarding",
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
        name: "A",
        path: "/admin/pay-hub/a",
      },
      {
        name: "B",
        path: "/admin/pay-hub/b",
      },
      {
        name: "C",
        path: "/admin/pay-hub/c",
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

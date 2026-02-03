export const dashboardStats = [
  { title: "Total Employees", value: "300", percent: "12 %", type: "down" },
  { title: "Active Employees", value: "256", percent: "20.5 %", type: "up" },
  { title: "In-Active Employees", value: "39", percent: "12 %", type: "down" },
  { title: "New Employee", value: "03", percent: "20.5 %", type: "up" },
];

export const employeeStats = [
  { title: "Leaves Today", value: "300", percent: "12 %", type: "down" },
  { title: "Pending Request", value: "256", percent: "20.5 %", type: "up" },
  { title: "Approved Request", value: "39", percent: "12 %", type: "down" },
  { title: "Rejected Request", value: "03", percent: "20.5 %", type: "up" },
];

export const overTimeStats = [
  { title: "Requested", value: "256", percent: "20.5 %", type: "up" },
  { title: "Approved", value: "39", percent: "12 %", type: "down" },
  { title: "Rejected", value: "03", percent: "20.5 %", type: "up" },
  { title: "Pending", value: "03", percent: "20.5 %", type: "up" },
];

export const employeeTableColumns = [
  { header: "Employee ID", accessor: "employeeId" },
  { header: "Name", accessor: "name" },
  { header: "Designation", accessor: "designation" },
  { header: "Dept.", accessor: "department" },
  { header: "Shift", accessor: "shift" },
  { header: "Joined Date", accessor: "joinedDate" },
  { header: "Status", accessor: "status" },
  { header: "Action", accessor: "action" },
];

export const employeeTableData = [
  {
    employeeId: "EMP001",
    name: "John Doe",
    designation: "Software Engineer",
    department: "IT",
    shift: "Day",
    joinedDate: "2023-01-15",
    status: "Active",
    action: "...",
  },
  {
    employeeId: "EMP002",
    name: "Jane Smith",
    designation: "HR Manager",
    department: "HR",
    shift: "Day",
    joinedDate: "2023-02-20",
    status: "Inactive",
    action: "...",
  },
  {
    employeeId: "EMP003",
    name: "Bob Johnson",
    designation: "Sales Executive",
    department: "Sales",
    shift: "Night",
    joinedDate: "2023-03-10",
    status: "Active",
    action: "...",
  },
  {
    employeeId: "EMP004",
    name: "Emily Richards",
    designation: "QA Engineer",
    department: "IT",
    shift: "Day",
    joinedDate: "2021-08-22",
    status: "Relieved",
    action: "...",
  },
];

export const staffTableColumns = [
  { header: "Staff ID", accessor: "staffId" },
  { header: "Name", accessor: "name" },
  { header: "Role", accessor: "role" },
  { header: "Dept.", accessor: "department" },
  { header: "Shift", accessor: "shift" },
  { header: "Joined Date", accessor: "joinedDate" },
  { header: "Status", accessor: "status" },
  { header: "Action", accessor: "action" },
];

export const staffTableData = [
  {
    staffId: "STF101",
    name: "Alice Brown",
    role: "Office Admin",
    department: "Operations",
    shift: "Day",
    joinedDate: "2022-09-01",
    status: "Active",
    action: "...",
  },
  {
    staffId: "STF102",
    name: "Mark Lee",
    role: "Receptionist",
    department: "Front Desk",
    shift: "Day",
    joinedDate: "2023-05-18",
    status: "Inactive",
    action: "...",
  },
  {
    staffId: "STF103",
    name: "Sara Khan",
    role: "Facilities",
    department: "Admin",
    shift: "Night",
    joinedDate: "2021-11-10",
    status: "Active",
    action: "...",
  },
  {
    staffId: "STF104",
    name: "Vikram Rao",
    role: "Security",
    department: "Admin",
    shift: "Night",
    joinedDate: "2020-04-12",
    status: "Relieved",
    action: "...",
  },
];

export const staffLeavesColumns = [
  { header: "Staff ID", accessor: "staffId" },
  { header: "Name", accessor: "name" },
  { header: "Department", accessor: "department" },
  { header: "Type", accessor: "type" },
  { header: "From", accessor: "from" },
  { header: "To", accessor: "to" },
  { header: "Action", accessor: "action" },
];

export const staffLeavesData = [
  {
    staffId: "STF101",
    name: "Alice Brown",
    department: "Operations",
    type: "Sick Leave",
    from: "2026-01-05",
    to: "2026-01-07",
    action: "...",
    status: "approved",
  },
  {
    staffId: "STF102",
    name: "Mark Lee",
    department: "Front Desk",
    type: "Casual Leave",
    from: "2026-01-10",
    to: "2026-01-11",
    status: "approved",
    action: "...",
  },
  {
    staffId: "STF103",
    name: "Sara Khan",
    department: "Admin",
    type: "Annual Leave",
    from: "2026-01-20",
    to: "2026-01-25",
    action: "...",
  },
  {
    staffId: "STF104",
    name: "Vikram Rao",
    department: "Admin",
    type: "Permission",
    from: "2026-01-12",
    to: "2026-01-12",
    action: "...",
  },
];

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReusableTable from "../../../components/ReusableTable";
import TableToolbar from "../../../components/TableToolbar";
import PlusIcon from "../../../assets/images/Dashboard Images/plus-large_svgrepo.com.svg";

const EmployeeLeaves = () => {
  const navigate = useNavigate();
  const columns = [
    { header: "Employee ID", accessor: "employeeId" },
    { header: "Name", accessor: "name" },
    { header: "Department", accessor: "department" },
    { header: "Type", accessor: "type" },
    { header: "From", accessor: "from" },
    { header: "To", accessor: "to" },
    { header: "Action", accessor: "action" },
  ];

  // Sample data - you can move this to utils/data.jsx later
  const employeeLeavesData = [
    {
      employeeId: "EMP001",
      name: "John Doe",
      department: "IT",
      type: "Sick Leave",
      from: "2026-04-10",
      to: "2026-04-12",
      action: "...",
    },
    {
      employeeId: "EMP002",
      name: "Jane Smith",
      department: "HR",
      type: "Casual Leave",
      from: "2026-04-15",
      to: "2026-04-16",
      action: "...",
    },
    {
      employeeId: "EMP003",
      name: "Bob Johnson",
      department: "Sales",
      type: "Annual Leave",
      from: "2026-04-20",
      to: "2026-04-25",
      action: "...",
    },
    {
      employeeId: "EMP004",
      name: "Emily Richards",
      department: "IT",
      type: "Permission",
      from: "2026-04-18",
      to: "2026-04-18",
      action: "...",
    },
  ];

  const [search, setSearch] = useState("");
  const [leaveType, setLeaveType] = useState("All Types");

  const handleAddLeave = () => {
    navigate("/admin/time-hub/leaveAttendance/add-LeaveOrPermissions");
  };

  const filtered = employeeLeavesData.filter((row) => {
    const m1 =
      leaveType === "All Types" ||
      String(row.type).toLowerCase() === String(leaveType).toLowerCase();
    const m2 =
      !search ||
      String(row.name).toLowerCase().includes(search.toLowerCase()) ||
      String(row.employeeId).toLowerCase().includes(search.toLowerCase()) ||
      String(row.department).toLowerCase().includes(search.toLowerCase());
    return m1 && m2;
  });

  return (
    <>
      <TableToolbar
        title={`All Leaves (${String(filtered.length).padStart(2, "0")})`}
        searchPosition="right"
        searchPlaceholder="Search Employee"
        searchValue={search}
        onSearchChange={setSearch}
        select1Options={[
          "All Types",
          "Sick Leave",
          "Casual Leave",
          "Annual Leave",
          "Permission",
        ]}
        select1Value={leaveType}
        onSelect1Change={setLeaveType}
        showFilter={false}
        filterText="Filter"
        actionText="Add Leaves"
        actionIcon={<img src={PlusIcon} alt="add" width="16" height="16" />}
        onActionClick={handleAddLeave}
      />
      <ReusableTable
        columns={columns}
        data={filtered}
        rowsPerPage={5}
        totalResults={filtered.length}
        alwaysShowPagination
      />
    </>
  );
};

export default EmployeeLeaves;

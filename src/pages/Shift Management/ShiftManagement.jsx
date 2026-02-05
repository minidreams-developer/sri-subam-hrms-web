import { useState } from "react";
import TableToolbar from "../../components/TableToolbar";
import { staffLeavesData } from "../../utils/data";
import PlusIcon from "../../assets/images/Dashboard Images/plus-large_svgrepo.com.svg";
import actionDot from "../../assets/images/Over time/actionDot.svg";
import ReusableTable from "../../components/ReusableTable";
import ShiftDetailsSidebar from "./ShiftDetailsSidebar";
import { useNavigate } from "react-router-dom";

const ShiftManagement = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [leaveType, setLeaveType] = useState("All Types");
  const [selectedShift, setSelectedShift] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const columns = [
    { header: "Shift Code", accessor: "shiftCode" },
    { header: "Shift Name", accessor: "shiftName" },
    { header: "Start Time", accessor: "startTime" },
    { header: "End Time", accessor: "endTime" },
    { header: "Working Hours", accessor: "workingHours" },
    { header: "Shift Type", accessor: "shifttype" },
    { header: "Status", accessor: "status" },
    { header: "Action", accessor: "action" },
  ];

  const filtered = staffLeavesData.filter((row) => {
    const m1 =
      leaveType === "All Types" ||
      String(row.type).toLowerCase() === String(leaveType).toLowerCase();
    const m2 =
      !search ||
      String(row.name).toLowerCase().includes(search.toLowerCase()) ||
      String(row.staffId).toLowerCase().includes(search.toLowerCase()) ||
      String(row.department).toLowerCase().includes(search.toLowerCase());
    return m1 && m2;
  });

  const handleRowClick = (row) => {
    setSelectedShift(row);
    setIsSidebarOpen(true);
  };

  return (
    <>
      <TableToolbar
        title={`All Shifts`}
        searchPosition="right"
        searchPlaceholder="Search Employee"
        searchValue={search}
        onSearchChange={setSearch}
        select1Options={false}
        select1Value={leaveType}
        onSelect1Change={setLeaveType}
        showFilter={false}
        actionText="Add Shifts"
        actionIcon={<img src={PlusIcon} alt="add" width="16" height="16" />}
        showDotIcon={true}
        dotIcon={actionDot}
        onActionClick={() => navigate("addNewShift")}
      />
      <ReusableTable
        columns={columns}
        data={filtered}
        rowsPerPage={5}
        totalResults={filtered.length}
        alwaysShowPagination
        actionType="default"
        onRowClick={handleRowClick}
      />
      <ShiftDetailsSidebar
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        data={selectedShift}
      />
    </>
  );
};

export default ShiftManagement;

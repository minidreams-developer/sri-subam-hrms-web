import React, { useState } from "react";
import ReusableTable from "../../../components/ReusableTable";
import { staffLeavesData } from "../../../utils/data";
import TableToolbar from "../../../components/TableToolbar";
import PlusIcon from "../../../assets/images/Dashboard Images/plus-large_svgrepo.com.svg";

const Permissions = () => {
  const columns = [
    { header: "Staff ID", accessor: "staffId" },
    { header: "Name", accessor: "name" },
    { header: "Department", accessor: "department" },
    { header: "Total Hrs", accessor: "type" },
    { header: "From", accessor: "from" },
    { header: "To", accessor: "to" },
    { header: "Action", accessor: "action" },
  ];
  const [search, setSearch] = useState("");
  const [leaveType, setLeaveType] = useState("All Types");

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

  return (
    <>
      <TableToolbar
        title={`All Leaves (${String(filtered.length).padStart(2, "0")})`}
        searchPosition="right"
        searchPlaceholder="Search Agents"
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
        actionText="Add Permissions"
        actionIcon={<img src={PlusIcon} alt="add" width="16" height="16" />}
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

export default Permissions;

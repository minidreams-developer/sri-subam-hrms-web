import { useState } from "react";
import TableToolbar from "../../../components/TableToolbar";
import { staffLeavesData } from "../../../utils/data";
import ReusableTable from "../../../components/ReusableTable";

const Pending = () => {
  const [search, setSearch] = useState("");
  const [leaveType, setLeaveType] = useState("All Types");

  const columns = [
    { header: "Requested Date", accessor: "staffId" },
    { header: "OT Date", accessor: "name" },
    { header: "Department", accessor: "department" },
    { header: "Employee", accessor: "type" },
    { header: "Duration", accessor: "from" },
    { header: "Over Time", accessor: "to" },
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

  return (
    <>
      <TableToolbar
        title={`Pending Requests (${String(filtered.length).padStart(2, "0")})`}
        searchPosition="right"
        searchPlaceholder="Search Agents"
        searchValue={search}
        onSearchChange={setSearch}
        select1Options={["Today"]}
        select1Value={leaveType}
        onSelect1Change={setLeaveType}
        showFilter={false}
        actionText="Approve All"
        actionIcon={false}
      />
      <ReusableTable
        columns={columns}
        data={filtered}
        rowsPerPage={5}
        totalResults={filtered.length}
        alwaysShowPagination
        actionType="buttons"
        onApprove={(row) => alert(`Approved request for ${row.name}`)}
        onReject={(row) => alert(`Rejected request for ${row.name}`)}
      />
    </>
  );
};

export default Pending;

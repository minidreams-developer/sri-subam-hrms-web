import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReusableTable from "../../../components/ReusableTable";
import { deleteLeaveRequest, getLeaveRequests, updateLeaveRequestStatus } from "../../../services/apiServices";
import TableToolbar from "../../../components/TableToolbar";
import PlusIcon from "../../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import { toast } from "react-toastify";

const StaffLeaves = () => {
  const navigate = useNavigate();
  const columns = [
    { header: "Staff ID", accessor: "staffId" },
    { header: "Name", accessor: "name" },
    { header: "Department", accessor: "department" },
    { header: "Type", accessor: "type" },
    { header: "From", accessor: "from" },
    { header: "To", accessor: "to" },
    { header: "Status", accessor: "status" },
    {
      header: "Approval",
      key: "approvalActions",
      render: (row) => String(row.status).toLowerCase() !== "pending" ? (
        <span style={{ color: String(row.status).toLowerCase() === "approved" ? "#087c86" : "#dc2626", fontWeight: 600, fontSize: "0.75rem", textTransform: "capitalize" }}>
          {row.status}
        </span>
      ) : (
        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
          <button
            type="button"
            style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "0.375rem", padding: "0.45rem 0.65rem", fontSize: "0.625rem", fontWeight: 600, cursor: "pointer" }}
            onClick={(event) => { event.stopPropagation(); handleLeaveStatus(row, "Rejected"); }}
          >Reject</button>
          <button
            type="button"
            style={{ background: "#087c86", color: "#fff", border: "none", borderRadius: "0.375rem", padding: "0.45rem 0.65rem", fontSize: "0.625rem", fontWeight: 600, cursor: "pointer" }}
            onClick={(event) => { event.stopPropagation(); handleLeaveStatus(row, "Approved"); }}
          >Approve</button>
        </div>
      ),
    },
    { header: "Action", key: "actions", accessor: "actions", useDefaultActionMenu: true },
  ];

  const [staffLeaveData, setStaffLeaveData] = useState([]);
  const [search, setSearch] = useState("");
  const [leaveType, setLeaveType] = useState("All Types");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch staff leaves (all leave requests except Permission) from API
  useEffect(() => {
    const fetchStaffLeaves = async () => {
      try {
        setLoading(true);
        const response = await getLeaveRequests({ page: currentPage, limit: pageSize, role: "staff" });

        const results = response.results || response.data || [];
        // Filter out Permission type leaves
        const filteredResults = results.filter(
          (leave) => leave.leaveType !== "Permission"
        );

        const transformedData = filteredResults.map((leave) => ({
          id: leave._id || leave.id,
          staffId: leave.employeeId?.employeeId || leave.employeeId || "N/A",
          name: leave.employeeId?.name || "N/A",
          department: leave.employeeId?.department?.name || leave.employeeId?.department || "N/A",
          type: leave.leaveType || "N/A",
          from: leave.singleDate
            ? new Date(leave.singleDate).toLocaleDateString()
            : new Date(leave.startDate).toLocaleDateString(),
          to: leave.singleDate
            ? new Date(leave.singleDate).toLocaleDateString()
            : new Date(leave.endDate).toLocaleDateString(),
          status: leave.status || "pending",
          raw: leave, actions: "",
        }));

        setStaffLeaveData(transformedData);
        setTotalResults(response.totalResults || 0);
        setTotalPages(response.totalPages || 1);
      } catch (error) {
        console.error("Error fetching staff leaves:", error);
        toast.error("Failed to fetch staff leaves");
        setStaffLeaveData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffLeaves();
  }, [currentPage, pageSize]);

  const handleAddLeave = () => {
    navigate("/admin/time-hub/leaveAttendance/add-LeaveOrPermissions");
  };

  const handleLeaveStatus = async (row, status) => {
    try {
      await updateLeaveRequestStatus(row.id, status.toLowerCase());
      setStaffLeaveData((items) => items.map((item) => (
        item.id === row.id ? { ...item, status: status.toLowerCase() } : item
      )));
      toast.success(`Leave request ${status.toLowerCase()}`);
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${status.toLowerCase()} leave request`);
    }
  };

  const filtered = staffLeaveData.filter((row) => {
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
        title={`All Leaves (${String(totalResults).padStart(2, "0")})`}
        searchPosition="right"
        searchPlaceholder="Search Staff"
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
        rowsPerPage={pageSize}
        totalResults={totalResults}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        alwaysShowPagination
        loading={loading}
        onView={(row) => navigate("/admin/time-hub/leaveAttendance/edit-Leave", { state: { leave: row.raw, leaveId: row.id, returnTo: "/admin/time-hub/leaveAttendance", returnTab: "Staffs Leaves", readOnly: true } })}
        onEdit={(row) => navigate("/admin/time-hub/leaveAttendance/edit-Leave", { state: { leave: row.raw, leaveId: row.id, returnTo: "/admin/time-hub/leaveAttendance", returnTab: "Staffs Leaves" } })}
        onDelete={async (row) => { if (!window.confirm("Delete this leave request?")) return; try { await deleteLeaveRequest(row.id); setStaffLeaveData((items) => items.filter((item) => item.id !== row.id)); toast.success("Leave request deleted"); } catch (error) { toast.error(error.response?.data?.message || "Failed to delete leave request"); } }}
      />
    </>
  );
};

export default StaffLeaves;

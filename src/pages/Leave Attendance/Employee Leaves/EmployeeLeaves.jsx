import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReusableTable from "../../../components/ReusableTable";
import TableToolbar from "../../../components/TableToolbar";
import PlusIcon from "../../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import { deleteLeaveRequest, getLeaveRequests, updateLeaveRequestStatus } from "../../../services/apiServices";
import { toast } from "react-toastify";

const EmployeeLeaves = () => {
  const navigate = useNavigate();
  const columns = [
    { header: "Employee ID", accessor: "employeeId" },
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
          <button type="button" style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "0.375rem", padding: "0.45rem 0.65rem", fontSize: "0.625rem", fontWeight: 600, cursor: "pointer" }} onClick={(event) => { event.stopPropagation(); handleLeaveStatus(row, "Rejected"); }}>Reject</button>
          <button type="button" style={{ background: "#087c86", color: "#fff", border: "none", borderRadius: "0.375rem", padding: "0.45rem 0.65rem", fontSize: "0.625rem", fontWeight: 600, cursor: "pointer" }} onClick={(event) => { event.stopPropagation(); handleLeaveStatus(row, "Approved"); }}>Approve</button>
        </div>
      ),
    },
    { header: "Action", key: "actions", accessor: "actions", useDefaultActionMenu: true },
  ];

  const [leaveData, setLeaveData] = useState([]);
  const [search, setSearch] = useState("");
  const [leaveType, setLeaveType] = useState("All Types");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch leave requests from API
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        setLoading(true);
        const response = await getLeaveRequests({ page: currentPage, limit: pageSize, role: "employee" });

        const results = response.results || response.data || [];
        const transformedData = results.map((leave) => ({
          id: leave._id || leave.id,
          employeeId: leave.employeeId?.employeeId || leave.employeeId || "N/A",
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

        setLeaveData(transformedData);
        setTotalResults(response.totalResults || 0);
        setTotalPages(response.totalPages || 1);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
        toast.error("Failed to fetch leave requests");
        setLeaveData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, [currentPage, pageSize]);

  const handleAddLeave = () => {
    navigate("/admin/time-hub/leaveAttendance/add-LeaveOrPermissions");
  };

  const handleLeaveStatus = async (row, status) => {
    try {
      await updateLeaveRequestStatus(row.id, status.toLowerCase());
      setLeaveData((items) => items.map((item) => item.id === row.id ? { ...item, status: status.toLowerCase() } : item));
      toast.success(`Leave request ${status.toLowerCase()}`);
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${status.toLowerCase()} leave request`);
    }
  };

  const filtered = leaveData.filter((row) => {
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
        title={`All Leaves (${String(totalResults).padStart(2, "0")})`}
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
        rowsPerPage={pageSize}
        totalResults={totalResults}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        alwaysShowPagination
        loading={loading}
        onView={(row) => navigate("/admin/time-hub/leaveAttendance/edit-Leave", { state: { leave: row.raw, leaveId: row.id, returnTo: "/admin/time-hub/leaveAttendance", returnTab: "Employee Leaves", readOnly: true } })}
        onEdit={(row) => navigate("/admin/time-hub/leaveAttendance/edit-Leave", { state: { leave: row.raw, leaveId: row.id, returnTo: "/admin/time-hub/leaveAttendance", returnTab: "Employee Leaves" } })}
        onDelete={async (row) => { if (!window.confirm("Delete this leave request?")) return; try { await deleteLeaveRequest(row.id); setLeaveData((items) => items.filter((item) => item.id !== row.id)); toast.success("Leave request deleted"); } catch (error) { toast.error(error.response?.data?.message || "Failed to delete leave request"); } }}
      />
    </>
  );
};

export default EmployeeLeaves;

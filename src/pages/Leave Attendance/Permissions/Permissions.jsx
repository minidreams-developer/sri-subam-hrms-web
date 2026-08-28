import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReusableTable from "../../../components/ReusableTable";
import { deleteLeaveRequest, getLeaveRequests } from "../../../services/apiServices";
import TableToolbar from "../../../components/TableToolbar";
import PlusIcon from "../../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import { toast } from "react-toastify";

const Permissions = () => {
  const navigate = useNavigate();
  const columns = [
    { header: "Staff ID", accessor: "staffId" },
    { header: "Name", accessor: "name" },
    { header: "Department", accessor: "department" },
    { header: "Total Hrs", accessor: "type" },
    { header: "From", accessor: "from" },
    { header: "To", accessor: "to" },
    { header: "Status", accessor: "status" }, { header: "Action", accessor: "actions" },
  ];

  const [permissionData, setPermissionData] = useState([]);
  const [search, setSearch] = useState("");
  const [leaveType, setLeaveType] = useState("All Types");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch permissions (leave requests with type "Permission") from API
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        const response = await getLeaveRequests({ page: currentPage, limit: pageSize, leaveType: "Permission" });

        const results = response.results || response.data || [];
        const transformedData = results.map((permission) => ({
          id: permission._id || permission.id,
          staffId: permission.employeeId?.employeeId || permission.employeeId || "N/A",
          name: permission.employeeId?.name || "N/A",
          department: permission.employeeId?.department?.name || permission.employeeId?.department || "N/A",
          type: permission.leaveType || "Permission",
          from: permission.singleDate
            ? new Date(permission.singleDate).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "N/A",
          to: permission.singleDate
            ? new Date(permission.singleDate).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "N/A",
          status: permission.status || "pending",
          raw: permission, actions: "",
        }));

        setPermissionData(transformedData);
        setTotalResults(response.totalResults || 0);
        setTotalPages(response.totalPages || 1);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        toast.error("Failed to fetch permissions");
        setPermissionData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [currentPage, pageSize]);

  const handleAddPermission = () => {
    navigate("/admin/time-hub/leaveAttendance/add-LeaveOrPermissions?type=permission");
  };

  const filtered = permissionData.filter((row) => {
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
        title={`All Permissions (${String(totalResults).padStart(2, "0")})`}
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
        onActionClick={handleAddPermission}
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
        onView={(row) => navigate("/admin/time-hub/leaveAttendance/edit-Leave", { state: { leave: row.raw, leaveId: row.id, returnTo: "/admin/time-hub/leaveAttendance", returnTab: "Permissions", readOnly: true } })}
        onEdit={(row) => navigate("/admin/time-hub/leaveAttendance/edit-Leave", { state: { leave: row.raw, leaveId: row.id, returnTo: "/admin/time-hub/leaveAttendance", returnTab: "Permissions" } })}
        onDelete={async (row) => { if (!window.confirm("Delete this permission?")) return; try { await deleteLeaveRequest(row.id); setPermissionData((items) => items.filter((item) => item.id !== row.id)); toast.success("Permission deleted"); } catch (error) { toast.error(error.response?.data?.message || "Failed to delete permission"); } }}
      />
    </>
  );
};

export default Permissions;

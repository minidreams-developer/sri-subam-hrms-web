import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReusableTable from "../../../components/ReusableTable";
import TableToolbar from "../../../components/TableToolbar";
import PlusIcon from "../../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import { get } from "../../../helpers/api_helper";
import { GET_LEAVE_REQUESTS } from "../../../helpers/url_helper";
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
        const response = await get(
          `${GET_LEAVE_REQUESTS}?page=${currentPage}&limit=${pageSize}`
        );

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
      />
    </>
  );
};

export default EmployeeLeaves;

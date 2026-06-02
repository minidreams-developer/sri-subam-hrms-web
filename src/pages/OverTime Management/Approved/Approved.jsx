import { useState, useEffect } from "react";
import TableToolbar from "../../../components/TableToolbar";
import ReusableTable from "../../../components/ReusableTable";
import { get } from "../../../helpers/api_helper";
import { OVERTIME_RECORDS } from "../../../helpers/url_helper";
import { toast } from "react-toastify";

const Approved = ({ statusFilter = "approved" }) => {
  const [search, setSearch] = useState("");
  const [leaveType, setLeaveType] = useState("All Types");
  const [overtimeData, setOvertimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchOvertimeData();
  }, [statusFilter]);

  const fetchOvertimeData = async () => {
    try {
      setLoading(true);
      const response = await get(`${OVERTIME_RECORDS}?status=${statusFilter}&limit=100`);
      
      const records = response.results || response.data || [];
      
      // Transform API data to match table format
      const transformedData = records.map((record) => {
        // Extract employee name - from employee object
        const employeeName = typeof record.employee === "object" 
          ? record.employee?.name || record.employee?.employeeName || "N/A"
          : record.employeeName || "N/A";

        // Extract employee ID - from employee object
        const empId = typeof record.employee === "object"
          ? record.employee?.employeeId || record.employee?.id || "N/A"
          : record.employeeId || "N/A";

        // Format requested date
        const requestedDate = record.requestedDate 
          ? new Date(record.requestedDate).toLocaleDateString("en-GB")
          : "N/A";

        // Format overtime date
        const overtimeDate = record.OvertimeDate 
          ? new Date(record.OvertimeDate).toLocaleDateString("en-GB")
          : "N/A";

        // Format start time (time only)
        const startTime = record.startTime
          ? new Date(record.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
          : "N/A";

        // Format end time (time only)
        const endTime = record.endTime
          ? new Date(record.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
          : "N/A";

        // Duration with hours
        const duration = record.totalDuration ? `${record.totalDuration} Hrs` : "N/A";

        return {
          id: record._id || record.id,
          staffId: empId,
          name: employeeName,
          requestedDate: requestedDate,
          overtimeDate: overtimeDate,
          startTime: startTime,
          endTime: endTime,
          duration: duration,
          status: record.status || statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1),
          action: record.action || statusFilter,
        };
      });

      setOvertimeData(transformedData);
      filterData(transformedData, search, leaveType);
    } catch (error) {
      console.error("Error fetching overtime data:", error);
      toast.error("Failed to fetch overtime records");
      setOvertimeData([]);
    } finally {
      setLoading(false);
    }
  };

  const filterData = (data, searchTerm, typeFilter) => {
    const filtered = data.filter((row) => {
      const m1 =
        typeFilter === "All Types" ||
        String(row.type).toLowerCase() === String(typeFilter).toLowerCase();
      const m2 =
        !searchTerm ||
        String(row.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(row.staffId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(row.department).toLowerCase().includes(searchTerm.toLowerCase());
      return m1 && m2;
    });
    setFilteredData(filtered);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    filterData(overtimeData, value, leaveType);
  };

  const handleLeaveTypeChange = (value) => {
    setLeaveType(value);
    filterData(overtimeData, search, value);
  };

  const columns = [
    { header: "Requested Date", accessor: "requestedDate" },
    { header: "Employee Name", accessor: "name" },
    { header: "Employee ID", accessor: "staffId" },
    { header: "OT Date", accessor: "overtimeDate" },
    { header: "Start Time", accessor: "startTime" },
    { header: "End Time", accessor: "endTime" },
    { header: "Duration", accessor: "duration" },
    { header: "Status", accessor: "status" },
    { header: "Action", accessor: "action" },
  ];

  return (
    <>
      <TableToolbar
        title={`${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} (${String(filteredData.length).padStart(2, "0")})`}
        searchPosition="right"
        searchPlaceholder="Search Agents"
        searchValue={search}
        onSearchChange={handleSearchChange}
        select1Options={["Today"]}
        select1Value={leaveType}
        onSelect1Change={handleLeaveTypeChange}
        showFilter={false}
        actionText={false}
        actionIcon={false}
      />
      <ReusableTable
        columns={columns}
        data={filteredData}
        rowsPerPage={5}
        totalResults={filteredData.length}
        alwaysShowPagination
        isLoading={loading}
        actionType="default"
      />
    </>
  );
};

export default Approved;

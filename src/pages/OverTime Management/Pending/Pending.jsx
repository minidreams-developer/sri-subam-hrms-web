import { useState, useEffect } from "react";
import TableToolbar from "../../../components/TableToolbar";
import ReusableTable from "../../../components/ReusableTable";
import { getOvertimeRecords, updateOvertime } from "../../../services/apiServices";
import { toast } from "react-toastify";

const Pending = ({ onStatusChange, onApproveAll, refreshKey = 0 }) => {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("Today");
  const [overtimeData, setOvertimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchOvertimeData();
  }, [refreshKey, dateFilter]);

  const getDateRange = () => {
    const today = new Date();
    const toDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const from = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    from.setDate(from.getDate() - ({ Today: 0, "Last 7 days": 6, "Last 30 days": 29, "Last 90 days": 89 }[dateFilter]));
    return {
      fromDate: `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, "0")}-${String(from.getDate()).padStart(2, "0")}`,
      toDate,
    };
  };

  const fetchOvertimeData = async () => {
    try {
      setLoading(true);
      const response = await getOvertimeRecords({ status: "pending", page: 1, limit: 100, ...getDateRange() });
      
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
          overtime: `${startTime}  -  ${endTime}`,
          status: record.status || "Pending",
          action: record.action || "pending",
        };
      });

      // The API is the only source of pending overtime rows.
      setOvertimeData(transformedData);
      filterData(transformedData, search);
    } catch (error) {
      console.error("Error fetching overtime data:", error);
      toast.error("Failed to fetch overtime records");
      setOvertimeData([]);
    } finally {
      setLoading(false);
    }
  };

  const filterData = (data, searchTerm) => {
    const filtered = data.filter((row) => {
      return (
        !searchTerm ||
        String(row.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(row.staffId || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredData(filtered);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    filterData(overtimeData, value);
  };

  const handleStatusChange = async (row, status) => {
    if (!String(row.id).startsWith("preview-")) {
      try { await updateOvertime(row.id, { status: status.toLowerCase() }); }
      catch (error) { toast.error(error.response?.data?.message || `Failed to ${status.toLowerCase()} overtime`); return; }
    }
    const remaining = overtimeData.filter((item) => item.id !== row.id);
    setOvertimeData(remaining);
    filterData(remaining, search);
    onStatusChange?.(row, status);
  };

  const handleApproveAll = async () => {
    if (!filteredData.length) return;
    try { await Promise.all(filteredData.filter((item) => !String(item.id).startsWith("preview-")).map((item) => updateOvertime(item.id, { status: "approved" }))); }
    catch (error) { toast.error(error.response?.data?.message || "Failed to approve overtime requests"); return; }
    const approvedIds = new Set(filteredData.map((item) => item.id));
    const remaining = overtimeData.filter((item) => !approvedIds.has(item.id));
    setOvertimeData(remaining);
    filterData(remaining, search);
    onApproveAll?.(filteredData);
    toast.success("All pending overtime requests approved");
  };

  const columns = [
    { header: "Requested Date", accessor: "requestedDate" },
    { header: "OT Date", accessor: "overtimeDate" },
    { header: "Employee", accessor: "name" },
    { header: "Duration", accessor: "duration" },
    { header: "Over Time", accessor: "overtime", noWrap: true },
    { header: "Action", key: "actions", accessor: "action", align: "left" },
  ];

  return (
    <>
      <TableToolbar
        searchPosition="left"
        searchPlaceholder="Search Agents"
        searchValue={search}
        onSearchChange={handleSearchChange}
        select1Options={["Today", "Last 7 days", "Last 30 days", "Last 90 days"]}
        select1Value={dateFilter}
        onSelect1Change={setDateFilter}
        showFilter={false}
        actionText="Approve All"
        actionIcon={false}
        onActionClick={handleApproveAll}
      />
      <ReusableTable
        columns={columns}
        data={filteredData}
        rowsPerPage={5}
        totalResults={filteredData.length}
        alwaysShowPagination
        actionType="buttons"
        isLoading={loading}
        onApprove={(row) => {
          toast.success(`Approved request for ${row.name}`);
          handleStatusChange(row, "Approved");
        }}
        onReject={(row) => {
          toast.info(`Rejected request for ${row.name}`);
          handleStatusChange(row, "Rejected");
        }}
      />
    </>
  );
};

export default Pending;

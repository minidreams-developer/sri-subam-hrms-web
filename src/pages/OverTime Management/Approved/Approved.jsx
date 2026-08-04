import { useState, useEffect } from "react";
import TableToolbar from "../../../components/TableToolbar";
import ReusableTable from "../../../components/ReusableTable";
import { get } from "../../../helpers/api_helper";
import { OVERTIME_RECORDS } from "../../../helpers/url_helper";
import { toast } from "react-toastify";

const Approved = ({ statusFilter = "approved", injectedRecords = [] }) => {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("Today");
  const [overtimeData, setOvertimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchOvertimeData();
  }, [statusFilter, injectedRecords]);

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
          overtime: `${startTime}  -  ${endTime}`,
          status: record.status || statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1),
          action: record.action || statusFilter,
        };
      });

      const mergedData = [
        ...injectedRecords,
        ...transformedData.filter(
          (record) =>
            !injectedRecords.some((injected) => injected.id === record.id),
        ),
      ];

      setOvertimeData(mergedData);
      filterData(mergedData, search);
    } catch (error) {
      console.error("Error fetching overtime data:", error);
      toast.error("Failed to fetch overtime records");
      setOvertimeData(injectedRecords);
      filterData(injectedRecords, search);
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

  const columns = [
    { header: "Requested Date", accessor: "requestedDate" },
    { header: "OT Date", accessor: "overtimeDate" },
    { header: "Employee", accessor: "name" },
    { header: "Duration", accessor: "duration" },
    { header: "Over Time", accessor: "overtime", noWrap: true },
    { header: "Status", accessor: "status" },
  ];

  return (
    <>
      <TableToolbar
        searchPosition="left"
        searchPlaceholder="Search Agents"
        searchValue={search}
        onSearchChange={handleSearchChange}
        select1Options={["Today"]}
        select1Value={dateFilter}
        onSelect1Change={setDateFilter}
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

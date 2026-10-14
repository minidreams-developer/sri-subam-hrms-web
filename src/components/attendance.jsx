import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../theme/theme";
import Button from "./Button";
import ReusableTable from "./ReusableTable";
import SearchInputComponent from "./SearchInputComponent";
import DropdownComponent from "./DropdownComponent";
import FilterIcon from "../assets/images/DashboardImages/filtericon.svg";
import Filter from "./filter";
import { getAttendance, getAttendanceQuickStats, getDepartments, getShifts } from "../services/apiServices";
import { toast } from "react-toastify";

const Attendance = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Employees");
  const [searchValue, setSearchValue] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Department");
  const [shiftFilter, setShiftFilter] = useState("All Shifts");
  const [currentPage, setCurrentPage] = useState(1);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [loadingShifts, setLoadingShifts] = useState(false);
  const [fromDate, setFromDate] = useState(getTodayDate());
  const [toDate, setToDate] = useState(getTodayDate());
  const [quickStats, setQuickStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const rowsPerPage = 10;

  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleFilterApply = (filters) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
    setShowFilter(false);
  };

  // Fetch attendance data from API
  useEffect(() => {
    fetchAttendanceData();
  }, [currentPage, activeTab, searchValue, departmentFilter, shiftFilter, appliedFilters, fromDate, toDate]);

  useEffect(() => {
    fetchQuickStats();
  }, [fromDate, toDate]);

  useEffect(() => {
    fetchDepartmentsAndShifts();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 100,
      };

      if (activeTab === "Employees") params.role = "employee";
      if (activeTab === "Staffs") params.role = "staff";
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;
      if (departmentFilter !== "All Department") params.departmentId = departmentFilter;
      if (shiftFilter !== "All Shifts") params.shiftId = shiftFilter;

      const response = await getAttendance(params);
      
      const records = Array.isArray(response)
        ? response
        : response.results || response.data || response.attendance || [];
      
      // Transform API data to match table format
      const transformedData = records.map((record) => {
        const employee = record.employee || record.employeeId;
        const employeeName = typeof employee === "object"
          ? employee?.name || employee?.employeeName || "N/A"
          : record.employeeName || "N/A";

        const empId = typeof employee === "object"
          ? employee?.employeeId || employee?.id || "N/A"
          : employee || "N/A";

        const shiftValue = record.shift || record.shiftId;
        let shiftName = "N/A";
        if (typeof shiftValue === "object") {
          shiftName = shiftValue?.shiftName || shiftValue?.name || "N/A";
        } else if (typeof shiftValue === "string") {
          try {
            const parsedShift = JSON.parse(shiftValue);
            shiftName = parsedShift?.shiftName || parsedShift?.name || shiftValue;
          } catch {
            shiftName = shiftValue;
          }
        }

        // Extract designation - nested in employeeId.workInformation.designation or direct field
        let designation = "N/A";
        if (typeof employee === "object" && employee?.workInformation?.designation) {
          designation = employee.workInformation.designation;
        } else if (typeof record.designation === "object" && record.designation?.name) {
          designation = record.designation.name;
        } else if (typeof record.designation === "string") {
          designation = record.designation;
        }

        // Extract working hours - handle 0 as valid value
        const workingHours = record.totalWorkedHours !== undefined && record.totalWorkedHours !== null
          ? record.totalWorkedHours > 0 
            ? `${record.totalWorkedHours} Hrs`
            : "0 Hrs"
          : "N/A";

        return {
          id: record.attendanceId || record._id || record.id,
          employeeId: empId,
          name: employeeName,
          designation: designation,
          shift: shiftName,
          checkIn: record.loginTime ? new Date(record.loginTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "N/A",
          checkOut: record.logoutTime ? new Date(record.logoutTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "N/A",
          workingHrs: workingHours,
          status: record.timingStatus === "onTime" ? "On Time" : record.timingStatus === "earlyOut" ? "Early Out" : "Arrived Late",
          remarks: record.remarks || "N/A",
          raw: record,
        };
      });

      setAttendanceData(transformedData);
      setTotalResults(response.totalResults || response.total || transformedData.length || 0);
      setTotalPages(response.totalPages || response.pages || 1);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("Failed to fetch attendance records");
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuickStats = async () => {
    if (!fromDate || !toDate || fromDate > toDate) {
      setQuickStats(null);
      return;
    }
    try {
      setStatsLoading(true);
      const response = await getAttendanceQuickStats({ fromDate, toDate });
      setQuickStats(response?.data || response?.stats || response || {});
    } catch (error) {
      console.error("Error fetching attendance quick stats:", error);
      setQuickStats(null);
    } finally {
      setStatsLoading(false);
    }
  };

  const columns = [
    { label: "Employee ID", key: "employeeId" },
    { label: "Name", key: "name" },
    { label: "Designation", key: "designation" },
    { label: "Shift", key: "shift" },
    { label: "Check-in", key: "checkIn" },
    { label: "Check-out", key: "checkOut" },
    { label: "Working Hrs", key: "workingHrs" },
    {
      label: "Status",
      key: "status",
      render: (row) => <StatusBadge $status={row.status}>{row.status}</StatusBadge>,
    },
  ];

  const filteredData = attendanceData;
  const attendanceStats = attendanceData.reduce(
    (stats, row) => {
      stats[row.status] = (stats[row.status] || 0) + 1;
      return stats;
    },
    { "On Time": 0, "Early Out": 0, "Arrived Late": 0 },
  );

  // Reset to page 1 when search changes
  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (value) => {
    setDepartmentFilter(value);
    setCurrentPage(1);
  };

  const handleShiftChange = (value) => {
    setShiftFilter(value);
    setCurrentPage(1);
  };

  // Fetch departments and shifts for filter dropdowns
  const fetchDepartmentsAndShifts = async () => {
    // Fetch departments
    setLoadingDepts(true);
    try {
      const deptResponse = await getDepartments();
      console.log("Departments response:", deptResponse);
      
      // Handle different response structures
      const deptList = deptResponse?.results || deptResponse?.data || deptResponse || [];
      
      // Transform to dropdown options
      const deptOptions = deptList.map((dept) => ({
        value: dept.id || dept._id,
        label: dept.departmentName || dept.name || "N/A",
      }));
      
      setDepartmentOptions(deptOptions);
      console.log("Department options:", deptOptions);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to load departments");
    } finally {
      setLoadingDepts(false);
    }

    // Fetch shifts
    setLoadingShifts(true);
    try {
      const shiftResponse = await getShifts();
      console.log("Shifts response:", shiftResponse);
      
      // Handle different response structures
      const shiftList = shiftResponse?.results || shiftResponse?.data || shiftResponse || [];
      
      // Transform to dropdown options
      const shiftOpts = shiftList.map((shift) => ({
        value: shift.id || shift._id,
        label: shift.shiftName || shift.name || "N/A",
      }));
      
      setShiftOptions(shiftOpts);
      console.log("Shift options:", shiftOpts);
    } catch (error) {
      console.error("Error fetching shifts:", error);
      toast.error("Failed to load shifts");
    } finally {
      setLoadingShifts(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAddManually = () => {
    navigate("/admin/time-hub/attendance/add");
  };

  return (
    <Container>
      <Top>
        <TopTitle>Quick Stats</TopTitle>
        <Controls>
          <DateFilter>
            <DateField>
              <DateLabel htmlFor="attendance-from-date">From date</DateLabel>
              <DateInput id="attendance-from-date" type="date" value={fromDate} max={toDate || undefined} onChange={(event) => setFromDate(event.target.value)} />
            </DateField>
            <DateField>
              <DateLabel htmlFor="attendance-to-date">To date</DateLabel>
              <DateInput id="attendance-to-date" type="date" value={toDate} min={fromDate || undefined} onChange={(event) => setToDate(event.target.value)} />
            </DateField>
          </DateFilter>
          <Button
            text="Export Data"
            bg={theme.colors.white}
            color={theme.colors.primary}
            border={`1px solid ${theme.colors.primary}`}
            width="9.625rem"
            radius="0.625rem"
          />
        </Controls>
      </Top>

      <StatsGrid>
        <StatCard>
          <CardTitle>Total Records</CardTitle>
          <CardFooter>
            <CardValue>{statsLoading ? "..." : quickStats?.totalRecords ?? quickStats?.total ?? totalResults}</CardValue>
          </CardFooter>
        </StatCard>
        <StatCard>
          <CardTitle>On Time</CardTitle>
          <CardFooter>
            <CardValue>{statsLoading ? "..." : quickStats?.onTime ?? quickStats?.on_time ?? attendanceStats["On Time"]}</CardValue>
          </CardFooter>
        </StatCard>
        <StatCard>
          <CardTitle>Early Out</CardTitle>
          <CardFooter>
            <CardValue>{statsLoading ? "..." : quickStats?.earlyOut ?? quickStats?.early_out ?? attendanceStats["Early Out"]}</CardValue>
          </CardFooter>
        </StatCard>
        <StatCard>
          <CardTitle>Arrived Late</CardTitle>
          <CardFooter>
            <CardValue>{statsLoading ? "..." : quickStats?.arrivedLate ?? quickStats?.arrived_late ?? quickStats?.late ?? attendanceStats["Arrived Late"]}</CardValue>
          </CardFooter>
        </StatCard>
      </StatsGrid>

      <TabsAndButtonSection>
        <TabsSection>
          <Tab $active={activeTab === "Employees"} onClick={() => setActiveTab("Employees")}>
            Employees
          </Tab>
          <Tab $active={activeTab === "Staffs"} onClick={() => setActiveTab("Staffs")}>
            Staffs
          </Tab>
        </TabsSection>
        <AddButton onClick={handleAddManually}>
          + Add Manually
        </AddButton>
      </TabsAndButtonSection>

      <ControlsSection>
        <SearchWrap>
          <SearchInputComponent
            placeholder="Search Employee"
            value={searchValue}
            onSearchChange={handleSearch}
            width="100%"
            height="40px"
          />
        </SearchWrap>

        <SelectWrap>
          <DropdownComponent
            options={[{ value: "All Department", label: "All Department" }, ...departmentOptions]}
            value={departmentFilter}
            onChange={handleDepartmentChange}
            placeholder="All Department"
          />
        </SelectWrap>

        <SelectWrap>
          <DropdownComponent
            options={[{ value: "All Shifts", label: "All Shifts" }, ...shiftOptions]}
            value={shiftFilter}
            onChange={handleShiftChange}
            placeholder="All Shifts"
          />
        </SelectWrap>

        <FilterButton onClick={() => setShowFilter(true)}>
          <img src={FilterIcon} alt="filter" width="16" height="16" />
          Filter
        </FilterButton>
      </ControlsSection>

      <TableWrapper>
        {loading ? (
          <LoadingMessage>Loading attendance records...</LoadingMessage>
        ) : filteredData.length > 0 ? (
          <ReusableTable
            columns={columns}
            data={filteredData}
            rowsPerPage={rowsPerPage}
            totalResults={filteredData.length}
            emptyStateText="No attendance records found"
            onRowClick={(row) => navigate("/admin/peopleHub/employees/attendance/edit", { state: { attendance: row.raw, attendanceId: row.id, returnTo: "/admin/time-hub/attendance" } })}
          />
        ) : (
          <LoadingMessage>No attendance records found</LoadingMessage>
        )}
      </TableWrapper>

      <PaginationSection>
        <PaginationInfo>
          Page: {currentPage} of {totalPages || 1} | Total Records: {totalResults}
        </PaginationInfo>
        <PaginationControls>
          <PaginationButton 
            onClick={handlePreviousPage} 
            disabled={currentPage === 1}
          >
            Previous
          </PaginationButton>
          <PaginationButton 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next Page
          </PaginationButton>
        </PaginationControls>
      </PaginationSection>

      {showFilter && (
        <Filter
          onClose={() => setShowFilter(false)}
          onApply={handleFilterApply}
        />
      )}
    </Container>
  );
};

export default Attendance;

const Container = styled.div`
  width: 100%;
  padding: 1.5rem 0;
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 1.25rem 0;
`;

const TopTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  line-height: 160%;
  margin: 0;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FilterSelect = styled.div`
  width: 12rem;

  select {
    width: 100%;
    padding: 0.625rem 0.875rem;
    border: 1px solid #e5e5e5;
    border-radius: 0.375rem;
    font-size: 0.8125rem;
    font-family: "Inter-Regular", sans-serif;
    color: ${theme.colors.textColor};
    background: white;
    cursor: pointer;
    outline: none;
    transition: all 0.2s ease;

    &:hover {
      border-color: ${theme.colors.primary};
    }

    &:focus {
      border-color: ${theme.colors.primary};
      box-shadow: 0 0 0 3px rgba(0, 128, 128, 0.1);
    }
  }
`;

const DateFilter = styled.div`
  display: flex;
  align-items: end;
  gap: 0.75rem;
`;

const DateField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DateLabel = styled.label`
  font-size: 0.6875rem;
  color: #777;
  font-family: "Inter-Medium", sans-serif;
`;

const DateInput = styled.input`
  width: 8.75rem;
  padding: 0.625rem 0.75rem;
  border: 1px solid #e5e5e5;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-family: "Inter-Regular", sans-serif;
  color: ${theme.colors.textColor};
  background: white;
  outline: none;

  &:focus {
    border-color: ${theme.colors.primary};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div`
  background: #ffffff;
  padding: 0.704rem;
  border-radius: 0.625rem;
`;

const CardTitle = styled.p`
  font-size: 0.875rem;
  color: ${theme.colors.textColor};
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  margin-bottom: 3.125rem;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardValue = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  font-family: "Inter-Bold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const TabsSection = styled.div`
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 0;
`;

const TabsAndButtonSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 0.75rem 0;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  color: ${(props) => (props.$active ? theme.colors.primary : "#999")};
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;

  &::after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${(props) => (props.$active ? theme.colors.primary : "transparent")};
    transition: all 0.2s ease;
  }

  &:hover {
    color: ${theme.colors.primary};
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1.25rem;
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    opacity: 0.8;
  }
`;

const ControlsSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  margin-bottom: 1.5rem;
`;

const SearchWrap = styled.div`
  width: 18rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SelectWrap = styled.div`
  select {
    padding: 0.625rem 0.875rem;
    border: 1px solid #e5e5e5;
    border-radius: 0.375rem;
    font-size: 0.8125rem;
    font-family: "Inter-Regular", sans-serif;
    color: ${theme.colors.textColor};
    background: white;
    cursor: pointer;
    outline: none;
    transition: all 0.2s ease;

    &:hover {
      border-color: ${theme.colors.primary};
    }

    &:focus {
      border-color: ${theme.colors.primary};
      box-shadow: 0 0 0 3px rgba(0, 128, 128, 0.1);
    }
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border: 1px solid #e5e5e5;
  background: white;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.textColor};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.primary};
    color: ${theme.colors.primary};
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  background: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
  margin-bottom: 1.5rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  
  ${(props) => {
    switch (props.$status) {
      case "On Time":
        return `
          background: #dcfce7;
          color: #16a34a;
        `;
      case "Early Out":
        return `
          background: #fef3c7;
          color: #d97706;
        `;
      case "Arrived Late":
        return `
          background: #fee2e2;
          color: #dc2626;
        `;
      default:
        return `
          background: #f3f4f6;
          color: ${theme.colors.textColor};
        `;
    }
  }}
`;

const PaginationSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem 0;
  margin-top: 1rem;
`;

const PaginationInfo = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.textColor};
`;

const PaginationControls = styled.div`
  display: flex;
  gap: 1rem;
`;

const PaginationButton = styled.button`
  padding: 0.625rem 1.5rem;
  background: ${(props) => (props.disabled ? "#e5e5e5" : theme.colors.primary)};
  color: ${(props) => (props.disabled ? "#999" : "white")};
  border: none;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:active:not(:disabled) {
    opacity: 0.8;
  }
`;

const LoadingMessage = styled.div`
  padding: 2rem;
  text-align: center;
  font-size: 0.875rem;
  color: ${theme.colors.textColor};
  font-family: "Inter-Regular", sans-serif;
`;

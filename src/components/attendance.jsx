import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../theme/theme";
import Button from "./Button";
import GreenArrow from "../assets/images/DashboardImages/green.svg";
import RedArrow from "../assets/images/DashboardImages/red.svg";
import ReusableTable from "./ReusableTable";
import SearchInputComponent from "./SearchInputComponent";
import FilterIcon from "../assets/images/DashboardImages/filtericon.svg";
import { get } from "../helpers/api_helper";
import { ATTENDANCE_RECORDS } from "../helpers/url_helper";
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
  const rowsPerPage = 10;

  // Fetch attendance data from API
  useEffect(() => {
    fetchAttendanceData();
  }, [currentPage]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const response = await get(`${ATTENDANCE_RECORDS}?page=${currentPage}&limit=${rowsPerPage}`);
      
      const records = response.results || [];
      
      // Transform API data to match table format
      const transformedData = records.map((record) => {
        // Extract employee name - handle object or string
        const employeeName = typeof record.employeeId === "object" 
          ? record.employeeId?.name || record.employeeId?.employeeName || "N/A"
          : record.employeeName || "N/A";

        // Extract employee ID - handle object or string
        const empId = typeof record.employeeId === "object"
          ? record.employeeId?.employeeId || record.employeeId?.id || "N/A"
          : record.employeeId || "N/A";

        // Extract shift name - handle object or string
        const shiftName = typeof record.shiftId === "object" 
          ? record.shiftId?.shiftName || record.shiftId?.name || "N/A" 
          : record.shiftId || "N/A";

        // Extract designation - nested in employeeId.workInformation.designation or direct field
        let designation = "N/A";
        if (typeof record.employeeId === "object" && record.employeeId?.workInformation?.designation) {
          designation = record.employeeId.workInformation.designation;
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
          id: empId,
          employeeId: empId,
          name: employeeName,
          designation: designation,
          shift: shiftName,
          checkIn: record.loginTime ? new Date(record.loginTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "N/A",
          checkOut: record.logoutTime ? new Date(record.logoutTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "N/A",
          workingHrs: workingHours,
          status: record.attendanceStatus === "onTime" ? "On Time" : record.attendanceStatus === "earlyOut" ? "Early Out" : "Arrived Late",
          remarks: record.remarks || "N/A",
        };
      });

      setAttendanceData(transformedData);
      setTotalResults(response.totalResults || 0);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("Failed to fetch attendance records");
      setAttendanceData([]);
    } finally {
      setLoading(false);
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

  // Filter data based on search
  const filteredData = attendanceData.filter((item) =>
    item.name.toLowerCase().includes(searchValue.toLowerCase())
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
          <FilterSelect>
            <select className="form-select" defaultValue="Today">
              <option>Today</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </FilterSelect>
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
            <CardValue>{totalResults}</CardValue>
            <Badge type="up">
              {totalPages} pages
              <img src={GreenArrow} alt="trend" />
            </Badge>
          </CardFooter>
        </StatCard>
        <StatCard>
          <CardTitle>On Time</CardTitle>
          <CardFooter>
            <CardValue>-</CardValue>
            <Badge type="up">
              Loading
              <img src={GreenArrow} alt="trend" />
            </Badge>
          </CardFooter>
        </StatCard>
        <StatCard>
          <CardTitle>Early Out</CardTitle>
          <CardFooter>
            <CardValue>-</CardValue>
            <Badge type="down">
              Loading
              <img src={RedArrow} alt="trend" />
            </Badge>
          </CardFooter>
        </StatCard>
        <StatCard>
          <CardTitle>Arrived Late</CardTitle>
          <CardFooter>
            <CardValue>-</CardValue>
            <Badge type="down">
              Loading
              <img src={RedArrow} alt="trend" />
            </Badge>
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
          <select
            value={departmentFilter}
            onChange={(e) => handleDepartmentChange(e.target.value)}
          >
            <option>All Department</option>
            <option>HR</option>
            <option>IT</option>
            <option>Sales</option>
          </select>
        </SelectWrap>

        <SelectWrap>
          <select
            value={shiftFilter}
            onChange={(e) => handleShiftChange(e.target.value)}
          >
            <option>All Shifts</option>
            <option>Day</option>
            <option>Night</option>
          </select>
        </SelectWrap>

        <FilterButton>
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

const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.2rem 0.45rem;
  border-radius: 999px;
  color: ${({ type }) => (type === "up" ? "#16a34a" : "#dc2626")};
  background: ${({ type }) => (type === "up" ? "#dcfce7" : "#fee2e2")};

  img {
    width: 12px;
    height: 12px;
  }
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

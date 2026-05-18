import { useState } from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import ReusableTable from "./ReusableTable";
import SearchInputComponent from "./SearchInputComponent";
import FilterIcon from "../assets/images/DashboardImages/filtericon.svg";

const Attendance = () => {
  const [activeTab, setActiveTab] = useState("Employees");
  const [searchValue, setSearchValue] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Department");
  const [shiftFilter, setShiftFilter] = useState("All Shifts");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const attendanceData = [
    {
      id: "EMP0142",
      name: "Manoj Kumar",
      designation: "UI/UX Designer",
      dept: "Dept.",
      fullDays: 0,
      halfDays: 0,
      absentDays: 0,
      weekOff: 0,
      leaves: 0,
      holidays: 0,
      checkInTime: "8:23 Hrs",
      checkOutTime: "Absent",
      jan23: "8:23 Hrs",
      jan24: "8:23 Hrs",
      jan25: "8:23 Hrs",
    },
    {
      id: "EMP0152",
      name: "Chiranjeevi",
      designation: "UX Designer",
      dept: "Dept.",
      fullDays: 0,
      halfDays: 0,
      absentDays: 0,
      weekOff: 0,
      leaves: 0,
      holidays: 0,
      checkInTime: "8:23 Hrs",
      checkOutTime: "8:23 Hrs",
      jan23: "8:23 Hrs",
      jan24: "8:23 Hrs",
      jan25: "8:23 Hrs",
    },
    {
      id: "EMP0142",
      name: "Jacqlyn Bergain",
      designation: "UI/UX Designer",
      dept: "Dept.",
      fullDays: 0,
      halfDays: 0,
      absentDays: 0,
      weekOff: 0,
      leaves: 0,
      holidays: 0,
      checkInTime: "8:23 Hrs",
      checkOutTime: "Absent",
      jan23: "8:23 Hrs",
      jan24: "8:23 Hrs",
      jan25: "8:23 Hrs",
    },
    {
      id: "EMP0163",
      name: "Nolan Diedels",
      designation: "UI/UX Designer",
      dept: "Dept.",
      fullDays: 0,
      halfDays: 0,
      absentDays: 0,
      weekOff: 0,
      leaves: 0,
      holidays: 0,
      checkInTime: "8:23 Hrs",
      checkOutTime: "Absent",
      jan23: "8:23 Hrs",
      jan24: "8:23 Hrs",
      jan25: "8:23 Hrs",
    },
    {
      id: "EMP0163",
      name: "Marlyn Preis",
      designation: "UI/UX Designer",
      dept: "Dept.",
      fullDays: 0,
      halfDays: 0,
      absentDays: 0,
      weekOff: 0,
      leaves: 0,
      holidays: 0,
      checkInTime: "8:23 Hrs",
      checkOutTime: "8:23 Hrs",
      jan23: "8:23 Hrs",
      jan24: "8:23 Hrs",
      jan25: "8:23 Hrs",
    },
    {
      id: "EMP0142",
      name: "Chayeneon Winklevat",
      designation: "UI/UX Designer",
      dept: "Dept.",
      fullDays: 0,
      halfDays: 0,
      absentDays: 0,
      weekOff: 0,
      leaves: 0,
      holidays: 0,
      checkInTime: "8:23 Hrs",
      checkOutTime: "8:23 Hrs",
      jan23: "8:23 Hrs",
      jan24: "8:23 Hrs",
      jan25: "8:23 Hrs",
    },
  ];

  const columns = [
    { label: "Employee ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Designation", key: "designation" },
    { label: "Dept", key: "dept" },
    { label: "Full Days", key: "fullDays" },
    { label: "Half Days", key: "halfDays" },
    { label: "Absent Days", key: "absentDays" },
    { label: "Week Off", key: "weekOff" },
    { label: "Leaves", key: "leaves" },
    { label: "Holidays", key: "holidays" },
    { label: "Check In Time", key: "checkInTime" },
    {
      label: "Check Out Time",
      key: "checkOutTime",
      render: (row) => <StatusText $status={row.checkOutTime}>{row.checkOutTime}</StatusText>,
    },
    { label: "01 Jan, Sat", key: "jan23" },
    { label: "02 Jan, Sun", key: "jan24" },
    { label: "03 Jan, Mon", key: "jan25" },
  ];

  // Filter data based on search and filters
  const filteredData = attendanceData.filter((item) =>
    item.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Reset to page 1 when search/filter changes
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

  return (
    <Container>
      <TabsSection>
        <Tab $active={activeTab === "Employees"} onClick={() => setActiveTab("Employees")}>
          Employees
        </Tab>
        <Tab $active={activeTab === "Staffs"} onClick={() => setActiveTab("Staffs")}>
          Staffs
        </Tab>
      </TabsSection>

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
        <ReusableTable
          columns={columns}
          data={paginatedData}
          rowsPerPage={rowsPerPage}
          totalResults={filteredData.length}
          emptyStateText="No attendance records found"
        />
      </TableWrapper>

      <PaginationSection>
        <PaginationInfo>
          Page: {currentPage} of {totalPages || 1}
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
            disabled={currentPage === totalPages}
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
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem 0;
`;

const TabsSection = styled.div`
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 0;
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

const ControlsSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
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
`;

const StatusText = styled.span`
  color: ${(props) => {
    if (props.$status === "Absent") return "#ef4444";
    if (props.$status === "8:23 Hrs") return theme.colors.textColor;
    return theme.colors.textColor;
  }};
  font-weight: ${(props) => (props.$status === "Absent" ? "600" : "500")};
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

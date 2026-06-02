import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ReusableTable from "../../components/ReusableTable";
import GreenArrow from "../../assets/images/dashboardImages/green.svg";
import RedArrow from "../../assets/images/dashboardImages/red.svg";
import theme from "../../theme/theme";
import Button from "../../components/Button";
import TableToolbar from "../../components/TableToolbar";
import PlusIcon from "../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import TabSwitcher from "../../components/TabSwitcher";
import Filter from "../../components/filter";
import { get } from "../../helpers/api_helper";
import { GET_ALL_EMPLOYEES } from "../../helpers/url_helper";
import { toast } from "react-toastify";
import {
  dashboardStats,
  employeeTableColumns,
  employeeTableData,
  staffTableColumns,
  staffTableData,
} from "../../utils/data";

const Employees = () => {
  const navigate = useNavigate();
  const stats = dashboardStats;

  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedRange, setSelectedRange] = useState("Last 7 days");
  const [activeTab, setActiveTab] = useState("Employee");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employeeDept, setEmployeeDept] = useState("All Department");
  const [employeeShift, setEmployeeShift] = useState("All Shifts");
  const [staffSearch, setStaffSearch] = useState("");
  const [staffRole, setStaffRole] = useState("All Roles");
  const [staffShift, setStaffShift] = useState("All Shifts");
  const [showFilter, setShowFilter] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt:desc");

  // Fetch employees on component mount and when pagination changes
  useEffect(() => {
    fetchEmployees(currentPage, pageSize, sortBy);
  }, [currentPage, pageSize, sortBy]);

  const fetchEmployees = async (page = 1, limit = 10, sort = "createdAt:desc") => {
    setIsLoading(true);
    try {
      const response = await get(`${GET_ALL_EMPLOYEES}?page=${page}&limit=${limit}&sortBy=${sort}`);
      console.log("API Response:", response);
      
      // Handle different response structures
      let employeeList = [];
      let total = 0;
      let pages = 0;
      
      if (response && Array.isArray(response)) {
        // If response is directly an array
        employeeList = response;
        total = response.length;
        pages = 1;
      } else if (response && response.results && Array.isArray(response.results)) {
        // If response has a results property (pagination format)
        employeeList = response.results;
        total = response.totalResults || response.results.length;
        pages = response.totalPages || 1;
      } else if (response && response.data && Array.isArray(response.data)) {
        // If response has a data property
        employeeList = response.data;
        total = response.totalResults || response.data.length;
        pages = response.totalPages || 1;
      } else if (response && response.users && Array.isArray(response.users)) {
        // If response has a users property
        employeeList = response.users;
        total = response.totalResults || response.users.length;
        pages = response.totalPages || 1;
      }
      
      console.log("Employee List:", employeeList);
      
      if (employeeList.length > 0) {
        // Transform API response to match table format
        const transformedEmployees = employeeList.map((emp) => {
          // Extract joined date
          const joinedDate = emp.workInformation?.joinedDate || emp.dateOfJoining;
          const formattedDate = joinedDate 
            ? new Date(joinedDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "N/A";

          // Extract department name from object or use as string
          const departmentValue = emp.workInformation?.department || emp.department || "N/A";
          const departmentName = typeof departmentValue === "object" 
            ? departmentValue?.departmentName || departmentValue?.name || "N/A"
            : departmentValue;

          // Extract shift name from object or use as string
          const shiftValue = emp.workInformation?.shiftId || emp.shift || "N/A";
          const shiftName = typeof shiftValue === "object"
            ? shiftValue?.shiftName || shiftValue?.name || "N/A"
            : shiftValue;

          return {
            id: emp.id || emp._id,
            employeeId: emp.employeeId || "N/A",
            name: emp.name || emp.employeeName || "N/A",
            email: emp.email || "N/A",
            phone: emp.phone || "N/A",
            department: departmentName,
            designation: emp.workInformation?.designation || emp.designation || "N/A",
            shift: shiftName,
            status: emp.isActive ? "Active" : "Inactive",
            joinedDate: formattedDate,
            gender: emp.gender || "N/A",
            role: emp.role || "employee",
          };
        });
        console.log("Transformed Employees:", transformedEmployees);
        setEmployees(transformedEmployees);
        setTotalResults(total);
        setTotalPages(pages);
      } else {
        console.warn("No employees found in response");
        setEmployees([]);
        setTotalResults(0);
        setTotalPages(0);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch employees";
      toast.error(errorMessage);
      console.error("Fetch employees error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (row) => {
    navigate("/admin/peopleHub/employees/employeeProfile");
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleNewEmployee = () => {
    navigate("/admin/peopleHub/employees/create", {
      state: { from: "employees" },
    });
  };

  const handleFilterOpen = () => {
    setShowFilter(true);
  };

  const handleFilterClose = () => {
    setShowFilter(false);
  };

  const handleFilterApply = (filters) => {
    console.log("Applied filters:", filters);
    // Apply filters to the data
    if (filters.department.length > 0) {
      setEmployeeDept(filters.department[0]);
    }
    if (filters.shift.length > 0) {
      setEmployeeShift(filters.shift[0]);
    }
    setShowFilter(false);
  };

  const filteredEmployeeData = employees.filter((row) => {
    const m1 =
      employeeDept === "All Department" || row.department === employeeDept;
    const m2 = employeeShift === "All Shifts" || row.shift === employeeShift;
    const m3 =
      !employeeSearch ||
      row.name.toLowerCase().includes(employeeSearch.toLowerCase());
    return m1 && m2 && m3;
  });

  const filteredStaffData = staffTableData.filter((row) => {
    const m1 = staffRole === "All Roles" || row.role === staffRole;
    const m2 = staffShift === "All Shifts" || row.shift === staffShift;
    const m3 =
      !staffSearch ||
      row.name.toLowerCase().includes(staffSearch.toLowerCase());
    return m1 && m2 && m3;
  });

  return (
    <Container>
      {showFilter && (
        <Filter onClose={handleFilterClose} onApply={handleFilterApply} />
      )}
      <Top>
        <TopTitle>Quick Stats</TopTitle>
        <Controls>
          <FilterSelect>
            <select
              className="form-select"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option>All</option>
              <option>Active</option>
              <option>In-Active</option>
            </select>
          </FilterSelect>
          <FilterSelect>
            <select
              className="form-select"
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
            >
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
      {/* QUICK STATS */}
      <StatsGrid>
        {stats.map((item, index) => (
          <StatCard key={index}>
            <CardTitle>{item.title}</CardTitle>

            <CardFooter>
              <CardValue>{item.value}</CardValue>

              <Badge type={item.type}>
                {item.percent}
                <img
                  src={item.type === "up" ? GreenArrow : RedArrow}
                  alt="trend"
                />
              </Badge>
            </CardFooter>
          </StatCard>
        ))}
      </StatsGrid>

      <TabSwitcher
        tabs={[
          { label: "Employee", value: "Employee" },
          { label: "Staffs", value: "Staffs" },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "Employee" ? (
        <>
          <TableToolbar
            searchPlaceholder="Search Employee"
            searchValue={employeeSearch}
            onSearchChange={setEmployeeSearch}
            select1Options={["All Department", "HR", "IT", "Sales"]}
            select1Value={employeeDept}
            onSelect1Change={setEmployeeDept}
            select2Options={["All Shifts", "Day", "Night"]}
            select2Value={employeeShift}
            onSelect2Change={setEmployeeShift}
            filterText="Filter"
            onFilterClick={handleFilterOpen}
            actionText="New Employee"
            actionIcon={<img src={PlusIcon} alt="add" width="16" height="16" />}
            onActionClick={handleNewEmployee}
          />
          <ReusableTable
            columns={employeeTableColumns}
            data={employees}
            rowsPerPage={pageSize}
            totalResults={totalResults}
            totalPages={totalPages}
            currentPage={currentPage}
            server={true}
            onPageChange={handlePageChange}
            alwaysShowPagination
            onRowClick={handleRowClick}
          />
        </>
      ) : (
        <>
          <TableToolbar
            searchPlaceholder="Search Staff"
            searchValue={staffSearch}
            onSearchChange={setStaffSearch}
            select1Options={[
              "All Roles",
              "Office Admin",
              "Receptionist",
              "Facilities",
              "Security",
            ]}
            select1Value={staffRole}
            onSelect1Change={setStaffRole}
            select2Options={["All Shifts", "Day", "Night"]}
            select2Value={staffShift}
            onSelect2Change={setStaffShift}
            filterText="Filter"
            onFilterClick={handleFilterOpen}
            actionText="New Staff"
            actionIcon={<img src={PlusIcon} alt="add" width="16" height="16" />}
          />
          <ReusableTable
            columns={staffTableColumns}
            data={filteredStaffData}
            rowsPerPage={5}
            totalResults={filteredStaffData.length}
            onRowClick={handleRowClick}
          />
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 1.5rem 0;
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
`;

export default Employees;

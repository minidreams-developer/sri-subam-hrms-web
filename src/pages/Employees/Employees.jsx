import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { GET_EMPLOYEES_BY_ROLE, GET_STAFF_BY_ROLE } from "../../helpers/url_helper";
import { toast } from "react-toastify";
import {
  dashboardStats,
  employeeTableColumns,
  staffTableColumns,
} from "../../utils/data";

const Employees = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt:desc");

  // Handle navigation state from Create Employee/Staff pages
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      // Clear the state so it doesn't persist on page reload
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Fetch data based on active tab
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when switching tabs
    if (activeTab === "Employee") {
      fetchEmployeeData(1, pageSize, sortBy);
    } else {
      fetchStaffData(1, pageSize, sortBy);
    }
  }, [activeTab, pageSize, sortBy]);

  const fetchEmployeeData = async (page = 1, limit = 10, sort = "createdAt:desc") => {
    setIsLoading(true);
    try {
      const response = await get(`${GET_EMPLOYEES_BY_ROLE}?role=employee&page=${page}&limit=${limit}&sortBy=${sort}`);
      console.log("Employee API Response:", response);
      transformAndSetData(response, setEmployees, setTotalResults, setTotalPages);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch employees";
      toast.error(errorMessage);
      console.error("Fetch employees error:", error);
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStaffData = async (page = 1, limit = 10, sort = "createdAt:desc") => {
    setIsLoading(true);
    try {
      const response = await get(`/v1/users?role=staff&page=${page}&limit=${limit}&sortBy=${sort}`);
      console.log("Staff API Response:", response);
      transformAndSetData(response, setStaff, setTotalResults, setTotalPages);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch staff";
      toast.error(errorMessage);
      console.error("Fetch staff error:", error);
      setStaff([]);
    } finally {
      setIsLoading(false);
    }
  };

  const transformAndSetData = (response, setter, setTotal, setPages) => {
    let dataList = [];
    let total = 0;
    let pages = 0;
    
    if (response && Array.isArray(response)) {
      dataList = response;
      total = response.length;
      pages = 1;
    } else if (response?.results && Array.isArray(response.results)) {
      dataList = response.results;
      total = response.totalResults || response.results.length;
      pages = response.totalPages || 1;
    } else if (response?.data && Array.isArray(response.data)) {
      dataList = response.data;
      total = response.totalResults || response.data.length;
      pages = response.totalPages || 1;
    } else if (response?.users && Array.isArray(response.users)) {
      dataList = response.users;
      total = response.totalResults || response.users.length;
      pages = response.totalPages || 1;
    }
    
    if (dataList.length > 0) {
      const transformedData = dataList.map((item) => {
        const joinedDate = item.workInformation?.joinedDate || item.dateOfJoining;
        const formattedDate = joinedDate 
          ? new Date(joinedDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "N/A";

        const departmentValue = item.workInformation?.department || item.department || "N/A";
        const departmentName = typeof departmentValue === "object" 
          ? departmentValue?.departmentName || departmentValue?.name || "N/A"
          : departmentValue;

        const shiftValue = item.workInformation?.shiftId || item.shift || "N/A";
        const shiftName = typeof shiftValue === "object"
          ? shiftValue?.shiftName || shiftValue?.name || "N/A"
          : shiftValue;

        return {
          id: item.id || item._id,
          employeeId: item.employeeId || "N/A",
          name: item.name || item.employeeName || "N/A",
          email: item.email || "N/A",
          phone: item.phone || "N/A",
          department: departmentName,
          designation: item.workInformation?.designation || item.designation || "N/A",
          shift: shiftName,
          status: item.isActive ? "Active" : "Inactive",
          joinedDate: formattedDate,
          gender: item.gender || "N/A",
          role: item.role || "employee",
        };
      });
      setter(transformedData);
      setTotal(total);
      setPages(pages);
    } else {
      setter([]);
      setTotal(0);
      setPages(0);
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

  const handleNewStaff = () => {
    navigate("/admin/peopleHub/staff/create", {
      state: { from: "staff" },
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

  const filteredStaffData = staff.filter((row) => {
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
            data={filteredEmployeeData}
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
            onActionClick={handleNewStaff}
          />
          <ReusableTable
            columns={staffTableColumns}
            data={filteredStaffData}
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

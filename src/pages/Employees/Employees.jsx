import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import ReusableTable from "../../components/ReusableTable";
import theme from "../../theme/theme";
import Button from "../../components/Button";
import TableToolbar from "../../components/TableToolbar";
import PlusIcon from "../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import TabSwitcher from "../../components/TabSwitcher";
import Filter from "../../components/filter";
import { deleteUser, getDepartments, getShifts, getUserCount, getUsers } from "../../services/apiServices";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { employeeTableColumns, staffTableColumns } from "../../utils/data";

const emptyStats = (role) => {
  const pluralLabel = role === "employee" ? "Employees" : "Staff";
  const singularLabel = role === "employee" ? "Employee" : "Staff";
  return [
    { title: `Total ${pluralLabel}`, value: null },
    { title: `Active ${pluralLabel}`, value: null },
    { title: `In-Active ${pluralLabel}`, value: null },
    { title: `New ${singularLabel}`, value: null },
  ];
};

const Employees = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState(() => emptyStats("employee"));
  const statsRequestId = useRef(0);

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
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [loadingShifts, setLoadingShifts] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle navigation state from Create Employee/Staff pages
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      // Clear the state so it doesn't persist on page reload
      window.history.replaceState({}, document.title);
    }
    // Fetch departments and shifts on component mount
    fetchDepartmentsAndShifts();
  }, [location.state]);

  const fetchUserStats = async () => {
    const requestId = ++statsRequestId.current;
    const role = activeTab === "Employee" ? "employee" : "staff";
    setStats(emptyStats(role));
    try {
      const query = new URLSearchParams({ role });

      if (selectedDepartment !== "All") {
        query.set("status", selectedDepartment);
      }

      const rangeDays = {
        "Last 7 days": 7,
        "Last 30 days": 30,
        "Last 90 days": 90,
      }[selectedRange];
      if (rangeDays) {
        const joinedTo = new Date();
        const joinedFrom = new Date(joinedTo);
        joinedFrom.setDate(joinedFrom.getDate() - rangeDays);
        query.set("joinedFrom", joinedFrom.toISOString().slice(0, 10));
        query.set("joinedTo", joinedTo.toISOString().slice(0, 10));
      }

      const response = await getUserCount(Object.fromEntries(query));
      if (requestId !== statsRequestId.current) return;
      const root = response?.data ?? response;
      const counts = root?.counts ?? root?.statusCounts ?? root;
      const valueOf = (keys, fallback = 0) => {
        for (const key of keys) {
          if (counts?.[key] !== undefined && counts?.[key] !== null) return counts[key];
        }
        return fallback;
      };

      setStats([
        { title: `Total ${role === "employee" ? "Employees" : "Staff"}`, value: String(valueOf(["total", "totalCount", "count", "totalEmployees", "totalStaff"])) },
        { title: `Active ${role === "employee" ? "Employees" : "Staff"}`, value: String(valueOf(["active", "activeCount", "activeEmployees", "activeStaff"])) },
        { title: `In-Active ${role === "employee" ? "Employees" : "Staff"}`, value: String(valueOf(["inactive", "inActive", "inactiveCount", "inActiveCount", "inactiveEmployees", "inactiveStaff"])) },
        { title: `New ${role === "employee" ? "Employee" : "Staff"}`, value: String(valueOf(["new", "newCount", "newEmployee", "newEmployees", "newStaff"])) },
      ]);
    } catch (error) {
      if (requestId !== statsRequestId.current) return;
      console.error("Fetch user counts error:", error);
      toast.error(error.response?.data?.message || "Failed to load status counts");
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, [activeTab, selectedDepartment, selectedRange]);

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === "Employee") {
      const timeoutId = window.setTimeout(() => {
        fetchEmployeeData(currentPage, pageSize, sortBy);
      }, employeeSearch.trim() ? 350 : 0);
      return () => window.clearTimeout(timeoutId);
    } else {
      const timeoutId = window.setTimeout(() => {
        fetchStaffData(currentPage, pageSize, sortBy);
      }, staffSearch.trim() ? 350 : 0);
      return () => window.clearTimeout(timeoutId);
    }
  }, [
    activeTab, currentPage, pageSize, sortBy,
    employeeSearch, employeeDept, employeeShift,
    staffSearch, staffRole, staffShift,
    selectedDepartment, selectedRange,
  ]);

  const applyQuickFilters = (query) => {
    if (selectedDepartment !== "All") {
      query.set("status", selectedDepartment);
    }

    const rangeDays = {
      "Last 7 days": 7,
      "Last 30 days": 30,
      "Last 90 days": 90,
    }[selectedRange];

    if (rangeDays) {
      const joinedTo = new Date();
      const joinedFrom = new Date(joinedTo);
      joinedFrom.setDate(joinedFrom.getDate() - rangeDays);
      query.set("joinedFrom", joinedFrom.toISOString().slice(0, 10));
      query.set("joinedTo", joinedTo.toISOString().slice(0, 10));
    }
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
      })).filter((option) => option.value);
      
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
      })).filter((option) => option.value);
      
      setShiftOptions(shiftOpts);
      console.log("Shift options:", shiftOpts);
    } catch (error) {
      console.error("Error fetching shifts:", error);
      toast.error("Failed to load shifts");
    } finally {
      setLoadingShifts(false);
    }
  };

  const fetchEmployeeData = async (page = 1, limit = 10, sort = "createdAt:desc") => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        role: "employee",
        page: String(page),
        limit: String(limit),
        sortBy: sort,
      });
      if (employeeSearch.trim()) query.set("search", employeeSearch.trim());
      if (employeeDept !== "All Department") query.set("departmentId", employeeDept);
      if (employeeShift !== "All Shifts") query.set("shiftId", employeeShift);
      applyQuickFilters(query);

      const response = await getUsers(Object.fromEntries(query));
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
      const query = new URLSearchParams({
        role: "staff",
        page: String(page),
        limit: String(limit),
        sortBy: sort,
      });
      if (staffSearch.trim()) query.set("search", staffSearch.trim());
      if (staffRole !== "All Roles") query.set("designation", staffRole);
      if (staffShift !== "All Shifts") query.set("shiftId", staffShift);
      applyQuickFilters(query);

      const response = await getUsers(Object.fromEntries(query));
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
          status: typeof item.isActive === "string"
            ? item.isActive
            : item.status || (item.isActive ? "Active" : "In-Active"),
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
    navigate("/admin/peopleHub/employees/employeeProfile", {
      state: { employeeId: row.id },
    });
  };

  const handleDeleteEmployee = async (employee) => {
    const employeeId = employee?.id;

    if (!employeeId) {
      toast.error("Employee ID is missing");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteUser(employeeId);
      toast.success("Employee deleted successfully");
      setEmployeeToDelete(null);
      fetchUserStats();

      // If the final row on this page was deleted, return to the previous page.
      if (employees.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      } else {
        fetchEmployeeData(currentPage, pageSize, sortBy);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to delete employee";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteStaff = async (staffMember) => {
    const staffId = staffMember?.id;

    if (!staffId) {
      toast.error("Staff ID is missing");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteUser(staffId);
      toast.success("Staff deleted successfully");
      setStaffToDelete(null);
      fetchUserStats();

      if (staff.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      } else {
        fetchStaffData(currentPage, pageSize, sortBy);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to delete staff";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleNewEmployee = () => {
    navigate("/admin/peopleHub/employees/create", {
      state: { from: "onboarding", employeeType: "employee" },
    });
  };

  const handleNewStaff = () => {
    navigate("/admin/peopleHub/staff/create", {
      state: { from: "onboarding", employeeType: "staff" },
    });
  };

  const handleFilterOpen = () => {
    setShowFilter(true);
  };

  const handleFilterClose = () => {
    setShowFilter(false);
  };

  const handleFilterApply = (queryParams) => {
    console.log("Applied filter query params:", queryParams);
    // Build the API URL with query parameters based on user-filters.md spec
    let url = `/v1/users?role=employee`;
    
    // Add all filter parameters
    if (queryParams.departmentId) {
      url += `&departmentId=${queryParams.departmentId}`;
    }
    if (queryParams.designation) {
      url += `&designation=${encodeURIComponent(queryParams.designation)}`;
    }
    if (queryParams.joinedFrom) {
      url += `&joinedFrom=${queryParams.joinedFrom}`;
    }
    if (queryParams.joinedTo) {
      url += `&joinedTo=${queryParams.joinedTo}`;
    }
    if (queryParams.status) {
      url += `&status=${queryParams.status}`;
    }
    if (queryParams.shiftId) {
      url += `&shiftId=${queryParams.shiftId}`;
    }
    if (queryParams.sortBy) {
      url += `&sortBy=${queryParams.sortBy}`;
    }
    
    // Add pagination
    url += `&page=${queryParams.page || 1}&limit=${queryParams.limit || 10}`;
    
    setShowFilter(false);
    setCurrentPage(1);
    
    // Fetch data with filters applied
    fetchEmployeeDataWithFilters(url);
  };

  const fetchEmployeeDataWithFilters = async (url) => {
    setIsLoading(true);
    try {
      const response = await getUsers(Object.fromEntries(new URL(url, window.location.origin).searchParams));
      console.log("Filtered employees API Response:", response);
      transformAndSetData(response, setEmployees, setTotalResults, setTotalPages);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch employees with filters";
      toast.error(errorMessage);
      console.error("Fetch filtered employees error:", error);
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEmployeeData = employees;

  const filteredStaffData = staff;

  return (
    <Container>
      <DeleteConfirmationModal
        isOpen={Boolean(employeeToDelete)}
        title="Delete employee?"
        message={`Are you sure you want to delete ${employeeToDelete?.name || "this employee"}? This action cannot be undone.`}
        isDeleting={isDeleting}
        onCancel={() => !isDeleting && setEmployeeToDelete(null)}
        onConfirm={() => handleDeleteEmployee(employeeToDelete)}
      />
      <DeleteConfirmationModal
        isOpen={Boolean(staffToDelete)}
        title="Delete staff?"
        message={`Are you sure you want to delete ${staffToDelete?.name || "this staff member"}? This action cannot be undone.`}
        isDeleting={isDeleting}
        onCancel={() => !isDeleting && setStaffToDelete(null)}
        onConfirm={() => handleDeleteStaff(staffToDelete)}
      />
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
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setCurrentPage(1);
              }}
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
              onChange={(e) => {
                setSelectedRange(e.target.value);
                setCurrentPage(1);
              }}
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
              <CardValue>{item.value ?? "—"}</CardValue>
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
        onChange={(tab) => {
          const role = tab === "Employee" ? "employee" : "staff";
          setStats(emptyStats(role));
          setActiveTab(tab);
          setCurrentPage(1);
        }}
      />

      {activeTab === "Employee" ? (
        <>
          <TableToolbar
            searchPlaceholder="Search Employee"
            searchValue={employeeSearch}
            onSearchChange={(value) => {
              setEmployeeSearch(value);
              setCurrentPage(1);
            }}
            select1Options={[{ value: "All Department", label: "All Department" }, ...departmentOptions]}
            select1Value={employeeDept}
            onSelect1Change={(value) => {
              setEmployeeDept(value);
              setCurrentPage(1);
            }}
            select2Options={[{ value: "All Shifts", label: "All Shifts" }, ...shiftOptions]}
            select2Value={employeeShift}
            onSelect2Change={(value) => {
              setEmployeeShift(value);
              setCurrentPage(1);
            }}
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
            isLoading={isLoading}
            showEditAction={false}
            onDelete={setEmployeeToDelete}
            alwaysShowPagination
            onRowClick={handleRowClick}
          />
        </>
      ) : (
        <>
          <TableToolbar
            searchPlaceholder="Search Staff"
            searchValue={staffSearch}
            onSearchChange={(value) => {
              setStaffSearch(value);
              setCurrentPage(1);
            }}
            select1Options={[
              "All Roles",
              "Office Admin",
              "Receptionist",
              "Facilities",
              "Security",
            ]}
            select1Value={staffRole}
            onSelect1Change={(value) => {
              setStaffRole(value);
              setCurrentPage(1);
            }}
            select2Options={[{ value: "All Shifts", label: "All Shifts" }, ...shiftOptions]}
            select2Value={staffShift}
            onSelect2Change={(value) => {
              setStaffShift(value);
              setCurrentPage(1);
            }}
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
            isLoading={isLoading}
            showEditAction={false}
            onDelete={setStaffToDelete}
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

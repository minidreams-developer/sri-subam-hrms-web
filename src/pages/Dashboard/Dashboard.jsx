import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import theme from "../../theme/theme";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import SearchInputComponent from "../../components/SearchInputComponent";
import FilterIcon from "../../assets/images/DashboardImages/filtericon.svg";
import Filter from "../../components/filter";
import { getDashboard, getDepartments, getShifts, getUsers } from "../../services/apiServices";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState("Today");
  const [activeTab, setActiveTab] = useState("employees");
  const [searchValue, setSearchValue] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Department");
  const [shiftFilter, setShiftFilter] = useState("All Shifts");
  const [showFilter, setShowFilter] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [employeesData, setEmployeesData] = useState([]);
  const [staffDataList, setStaffDataList] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [loadingShifts, setLoadingShifts] = useState(false);
  const navigate = useNavigate();

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
    fetchEmployeesAndStaff();
    fetchDepartmentsAndShifts();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await getDashboard();
      console.log("Dashboard data:", response);
      setDashboardData(response);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeesAndStaff = async () => {
    try {
      // Fetch employees
      const empResponse = await getUsers({ role: "employee", limit: 10 });
      let empList = [];
      if (empResponse && Array.isArray(empResponse)) {
        empList = empResponse;
      } else if (empResponse?.results && Array.isArray(empResponse.results)) {
        empList = empResponse.results;
      } else if (empResponse?.data && Array.isArray(empResponse.data)) {
        empList = empResponse.data;
      }

      // Transform employees
      const transformedEmployees = empList.map((emp) => ({
        id: emp.id || emp._id,
        employeeId: emp.employeeId || "N/A",
        name: emp.name || emp.employeeName || "N/A",
        position: emp.workInformation?.designation || emp.designation || "N/A",
        shift: emp.workInformation?.shift || emp.shift || "Morning",
        checkIn: "08:50 AM",
        checkOut: "06:45 PM",
        working: "8.36 hrs",
        status: "-",
        department: emp.workInformation?.department || emp.department || "N/A",
        type: "employee",
      }));
      setEmployeesData(transformedEmployees);

      // Fetch staff
      const staffResponse = await getUsers({ role: "staff", page: 1, limit: 10, sortBy: "createdAt:desc" });
      let staffList = [];
      if (staffResponse && Array.isArray(staffResponse)) {
        staffList = staffResponse;
      } else if (
        staffResponse?.results &&
        Array.isArray(staffResponse.results)
      ) {
        staffList = staffResponse.results;
      } else if (staffResponse?.data && Array.isArray(staffResponse.data)) {
        staffList = staffResponse.data;
      }

      // Transform staff
      const transformedStaff = staffList.map((staff) => ({
        id: staff.id || staff._id,
        employeeId: staff.employeeId || "N/A",
        name: staff.name || staff.employeeName || "N/A",
        position:
          staff.workInformation?.designation || staff.designation || "Manager",
        shift: staff.workInformation?.shift || staff.shift || "Morning",
        checkIn: "08:00 AM",
        checkOut: "05:00 PM",
        working: "9 hrs",
        status: "-",
        department:
          staff.workInformation?.department || staff.department || "Operations",
        type: "staff",
      }));
      setStaffDataList(transformedStaff);
    } catch (error) {
      console.error("Error fetching employees and staff:", error);
      toast.error("Failed to fetch employees and staff");
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
      const deptList =
        deptResponse?.results || deptResponse?.data || deptResponse || [];

      // Transform to dropdown options
      const deptOptions = deptList.map((dept) => ({
        value: dept.departmentName || dept.name || "N/A",
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
      const shiftList =
        shiftResponse?.results || shiftResponse?.data || shiftResponse || [];

      // Transform to dropdown options
      const shiftOpts = shiftList.map((shift) => ({
        value: shift.shiftName || shift.name || "N/A",
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

  // Handle search with state reset
  const handleSearch = (value) => {
    setSearchValue(value);
  };

  // Handle applying filters - only update display when Apply button is clicked
  const handleApplyFiltersToDisplay = (dept, shift) => {
    setDepartmentFilter(dept);
    setShiftFilter(shift);
  };

  // Build quick stats from API data
  const quickStats = dashboardData?.quickStats
    ? [
        {
          label: "Total Employees",
          value:
            dashboardData.quickStats.totalEmployees?.count?.toString() || "0",
          change: `${dashboardData.quickStats.totalEmployees?.percentageChange || 0}%`,
          positive: dashboardData.quickStats.totalEmployees?.trend === "up",
        },
        {
          label: "Present Today",
          value:
            dashboardData.quickStats.presentToday?.count?.toString() || "0",
          change: `${dashboardData.quickStats.presentToday?.percentageChange || 0}%`,
          positive: dashboardData.quickStats.presentToday?.trend === "up",
        },
        {
          label: "On Leave",
          value: dashboardData.quickStats.onLeave?.count?.toString() || "0",
          change: `${dashboardData.quickStats.onLeave?.percentageChange || 0}%`,
          positive: dashboardData.quickStats.onLeave?.trend === "up",
        },
        {
          label: "OT Employees",
          value: dashboardData.quickStats.otEmployees?.count?.toString() || "0",
          change: `${dashboardData.quickStats.otEmployees?.percentageChange || 0}%`,
          positive: dashboardData.quickStats.otEmployees?.trend === "up",
        },
        {
          label: "Payroll",
          value: `₹${(dashboardData.quickStats.payroll?.amount || 0).toLocaleString("en-IN")}`,
          change: `${dashboardData.quickStats.payroll?.percentageChange || 0}%`,
          positive: dashboardData.quickStats.payroll?.trend === "up",
        },
      ]
    : [
        { label: "Total Employees", value: "0", change: "0%", positive: true },
        { label: "Present Today", value: "0", change: "0%", positive: true },
        { label: "On Leave", value: "0", change: "0%", positive: true },
        { label: "OT Employees", value: "0", change: "0%", positive: false },
        { label: "Payroll", value: "₹0", change: "0%", positive: true },
      ];

  // Handle department filter dropdown - only updates UI state
  const handleDepartmentChange = (value) => {
    setDepartmentFilter(value);
    // No API call here - client-side filtering only
  };

  // Handle shift filter dropdown - only updates UI state
  const handleShiftChange = (value) => {
    setShiftFilter(value);
    // No API call here - client-side filtering only
  };

  // Handle filter modal apply with API query parameters (per user-filters.md spec)
  const handleFilterApply = (queryParams) => {
    console.log("Applied filter query params:", queryParams);
    // Build the API URL with query parameters
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

    setAppliedFilters(queryParams);
    setShowFilter(false);

    // Fetch employees with applied filters
    fetchEmployeesAndStaffWithFilters(url);
  };

  const fetchEmployeesAndStaffWithFilters = async (url) => {
    try {
      const empResponse = await getUsers(Object.fromEntries(new URL(url, window.location.origin).searchParams));
      console.log("Filtered employees data:", empResponse);

      let empList = [];
      if (empResponse && Array.isArray(empResponse)) {
        empList = empResponse;
      } else if (empResponse?.results && Array.isArray(empResponse.results)) {
        empList = empResponse.results;
      } else if (empResponse?.data && Array.isArray(empResponse.data)) {
        empList = empResponse.data;
      }

      // Transform employees
      const transformedEmployees = empList.map((emp) => ({
        id: emp.id || emp._id,
        employeeId: emp.employeeId || "N/A",
        name: emp.name || emp.employeeName || "N/A",
        position: emp.workInformation?.designation || emp.designation || "N/A",
        shift: emp.workInformation?.shift || emp.shift || "Morning",
        checkIn: "08:50 AM",
        checkOut: "06:45 PM",
        working: "8.36 hrs",
        status: "-",
        department: emp.workInformation?.department || emp.department || "N/A",
        type: "employee",
      }));
      setEmployeesData(transformedEmployees);
    } catch (error) {
      console.error("Error fetching filtered employees:", error);
      toast.error("Failed to fetch filtered employees");
    }
  };

  // Build attendance data from API
  const attendanceData = dashboardData?.attendanceOverview?.dailyData?.map(
    (item) => ({
      date: item.label,
      present: item.present,
      onLeave: item.onLeave,
      late: item.late,
    }),
  ) || [
    { date: "14-07", present: 200, onLeave: 100, late: 20 },
    { date: "15-07", present: 220, onLeave: 80, late: 25 },
    { date: "16-07", present: 210, onLeave: 95, late: 18 },
    { date: "17-07", present: 240, onLeave: 60, late: 22 },
    { date: "18-07", present: 195, onLeave: 110, late: 28 },
    { date: "19-07", present: 230, onLeave: 75, late: 20 },
    { date: "20-07", present: 250, onLeave: 50, late: 15 },
  ];

  // Build payroll breakdown from API
  const payrollData = dashboardData?.payrollBreakdown?.categories
    ? [
        {
          name: "Salary",
          value:
            dashboardData.payrollBreakdown.categories.salary?.percentage || 0,
          percentage: `₹ ${dashboardData.payrollBreakdown.categories.salary?.amount?.toLocaleString("en-IN") || 0}`,
          color: "#0B7A75",
        },
        {
          name: "Allowances",
          value:
            dashboardData.payrollBreakdown.categories.allowances?.percentage ||
            0,
          percentage: `₹ ${dashboardData.payrollBreakdown.categories.allowances?.amount?.toLocaleString("en-IN") || 0}`,
          color: "#FDB750",
        },
        {
          name: "Deduction",
          value:
            dashboardData.payrollBreakdown.categories.deductions?.percentage ||
            0,
          percentage: `₹ ${dashboardData.payrollBreakdown.categories.deductions?.amount?.toLocaleString("en-IN") || 0}`,
          color: "#E0E3E6",
        },
        {
          name: "Incentives",
          value:
            dashboardData.payrollBreakdown.categories.incentives?.percentage ||
            0,
          percentage: `₹ ${dashboardData.payrollBreakdown.categories.incentives?.amount?.toLocaleString("en-IN") || 0}`,
          color: "#0B7A75",
        },
        {
          name: "Overtimes",
          value:
            dashboardData.payrollBreakdown.categories.overtime?.percentage || 0,
          percentage: `₹ ${dashboardData.payrollBreakdown.categories.overtime?.amount?.toLocaleString("en-IN") || 0}`,
          color: "#2C2C2C",
        },
      ]
    : [
        { name: "Salary", value: 88.3, percentage: "₹ 0", color: "#0B7A75" },
        { name: "Allowances", value: 8.3, percentage: "₹ 0", color: "#FDB750" },
        { name: "Deduction", value: 2.1, percentage: "₹ 0", color: "#E0E3E6" },
        { name: "Incentives", value: 0.5, percentage: "₹ 0", color: "#0B7A75" },
        { name: "Overtimes", value: 0.8, percentage: "₹ 0", color: "#2C2C2C" },
      ];

  const employees =
    employeesData.length > 0
      ? employeesData
      : [
          {
            id: 1,
            employeeId: "EMP001",
            name: "Marlyn Pines",
            position: "UI/UX Designer",
            shift: "Morning",
            checkIn: "08:50 AM",
            checkOut: "06:45 PM",
            working: "8.36 hrs",
            status: "-",
            department: "Design",
            type: "employee",
          },
          {
            id: 2,
            employeeId: "EMP002",
            name: "Arjun Stanton",
            position: "Developer",
            shift: "Afternoon",
            checkIn: "09:00 AM",
            checkOut: "06:45 PM",
            working: "8.36 hrs",
            status: "-",
            department: "Engineering",
            type: "employee",
          },
          {
            id: 3,
            employeeId: "EMP003",
            name: "Marlyn Pines",
            position: "UI/UX Designer",
            shift: "Night",
            checkIn: "08:50 AM",
            checkOut: "06:45 PM",
            working: "8.36 hrs",
            status: "-",
            department: "Design",
            type: "employee",
          },
        ];

  const staffData =
    staffDataList.length > 0
      ? staffDataList
      : [
          {
            id: 4,
            employeeId: "STF001",
            name: "John Smith",
            position: "Manager",
            shift: "Morning",
            checkIn: "08:00 AM",
            checkOut: "05:00 PM",
            working: "9 hrs",
            status: "-",
            department: "Management",
            type: "staff",
          },
          {
            id: 5,
            employeeId: "STF002",
            name: "Sarah Johnson",
            position: "Supervisor",
            shift: "Afternoon",
            checkIn: "09:30 AM",
            checkOut: "06:30 PM",
            working: "9 hrs",
            status: "-",
            department: "Operations",
            type: "staff",
          },
        ];

  // Filter employees based on search and filter criteria
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchValue.toLowerCase());
    const matchesDepartment =
      departmentFilter === "All Department" ||
      emp.department === departmentFilter;
    const matchesShift =
      shiftFilter === "All Shifts" || emp.shift === shiftFilter;

    return matchesSearch && matchesDepartment && matchesShift;
  });

  // Filter staff based on search and filter criteria
  const filteredStaff = staffData.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchValue.toLowerCase());
    const matchesDepartment =
      departmentFilter === "All Department" ||
      staff.department === departmentFilter;
    const matchesShift =
      shiftFilter === "All Shifts" || staff.shift === shiftFilter;

    return matchesSearch && matchesDepartment && matchesShift;
  });

  // Use appropriate data based on active tab
  const tableData =
    activeTab === "employees" ? filteredEmployees : filteredStaff;

  return (
    <Container>
      {/* Quick Stats Section */}
      <QuickStatsSection>
        <SectionHeader>
          <SectionTitle>Quick Stats</SectionTitle>
          <HeaderRight>
            <DateSelect
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </DateSelect>
          </HeaderRight>
        </SectionHeader>

        <StatsGrid>
          {quickStats.map((stat, idx) => (
            <StatCard key={idx}>
              <StatHeader>
                <StatLabel>{stat.label}</StatLabel>
                <StatChangeIndicator $positive={stat.positive}>
                  <ChangeIcon $positive={stat.positive}>
                    {stat.positive ? <FiTrendingUp /> : <FiTrendingDown />}
                  </ChangeIcon>
                  {stat.change}
                </StatChangeIndicator>
              </StatHeader>
              <StatValue>{stat.value}</StatValue>
            </StatCard>
          ))}
        </StatsGrid>
      </QuickStatsSection>

      {/* Charts Section */}
      <SectionTitle style={{ marginTop: "1.5rem" }}>
        Attendance & Payroll
      </SectionTitle>
      <ChartsSection>
        <AttendanceCard>
          <ChartHeader>
            <ChartTitle>Attendance Overview</ChartTitle>
            <PeriodSelect>
              <option>This Week</option>
              <option>This Month</option>
            </PeriodSelect>
          </ChartHeader>
          <ChartContainer>
            <Legend>
              <LegendItem>
                <LegendBox color="#0B7A75" /> Present
              </LegendItem>
              <LegendItem>
                <LegendBox color="#FDB750" /> On Leave
              </LegendItem>
              <LegendItem>
                <LegendBox color="#E0E3E6" /> Late
              </LegendItem>
            </Legend>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={attendanceData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="present" fill="#0B7A75" radius={[4, 4, 0, 0]} />
                <Bar dataKey="onLeave" fill="#FDB750" radius={[4, 4, 0, 0]} />
                <Bar dataKey="late" fill="#E0E3E6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </AttendanceCard>

        <PayrollCard>
          <ChartHeader>
            <ChartTitle>Payroll Breakdown</ChartTitle>
            <PeriodSelect>
              <option>This Month</option>
              <option>This Year</option>
            </PeriodSelect>
          </ChartHeader>
          <PayrollContent>
            <PayrollMain>
              <PayrollAmount>
                ₹
                {(
                  dashboardData?.payrollBreakdown?.totalPayThisMonth || 0
                ).toLocaleString("en-IN")}
              </PayrollAmount>
              <PayrollLabel>Total Pay This Month</PayrollLabel>
            </PayrollMain>
            <BreakdownBars>
              {[...Array(50)].map((_, idx) => (
                <BreakdownBar
                  key={idx}
                  $color={
                    idx < 20
                      ? "#0B7A75"
                      : idx < 35
                        ? "#FDB750"
                        : idx < 45
                          ? "#E0E3E6"
                          : "#2C2C2C"
                  }
                />
              ))}
            </BreakdownBars>
            <PayrollLegend>
              {payrollData.map((item, idx) => (
                <PayrollLegendItem key={idx}>
                  <PayrollLegendBox color={item.color} />
                  <PayrollLegendText>
                    <PayrollLegendName>
                      {item.name} · {item.value}%
                    </PayrollLegendName>
                    <PayrollLegendValue>{item.percentage}</PayrollLegendValue>
                  </PayrollLegendText>
                </PayrollLegendItem>
              ))}
            </PayrollLegend>
          </PayrollContent>
        </PayrollCard>
      </ChartsSection>

      {/* Employees Section */}
      <EmployeesSection>
        <TabsAndButtonSection>
          <TabsSection>
            <Tab
              $active={activeTab === "employees"}
              onClick={() => setActiveTab("employees")}
            >
              Employees
            </Tab>
            <Tab
              $active={activeTab === "staffs"}
              onClick={() => setActiveTab("staffs")}
            >
              Staffs
            </Tab>
          </TabsSection>
        </TabsAndButtonSection>
        <AttendanceHeading>
          <RightControls>
            <DateText>Today (18 Aug 2025)</DateText>
            <AddEmployeeButton
              onClick={() => navigate("/admin/time-hub/attendance/add")}
            >
              <span aria-hidden="true">＋</span> Add Manually
            </AddEmployeeButton>
          </RightControls>
        </AttendanceHeading>

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
              disabled={loadingDepts}
            >
              <option>All Department</option>
              {departmentOptions.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
          </SelectWrap>

          <SelectWrap>
            <select
              value={shiftFilter}
              onChange={(e) => handleShiftChange(e.target.value)}
              disabled={loadingShifts}
            >
              <option>All Shifts</option>
              {shiftOptions.map((shift) => (
                <option key={shift.value} value={shift.value}>
                  {shift.label}
                </option>
              ))}
            </select>
          </SelectWrap>

          <FilterButton onClick={() => setShowFilter(true)}>
            <img src={FilterIcon} alt="filter" width="16" height="16" />
            Filter
          </FilterButton>
        </ControlsSection>

        <EmployeesTable>
          <TableHead>
            <TableRow>
              <Th>Employee ID</Th>
              <Th>Name</Th>
              <Th>Position</Th>
              <Th>Shift</Th>
              <Th>Check-In</Th>
              <Th>Check-Out</Th>
              <Th>Working Hrs</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.length > 0 ? (
              tableData.map((emp) => (
                <TableRow key={emp.id}>
                  <Td>{emp.employeeId}</Td>
                  <Td>
                    <EmployeeName>{emp.name}</EmployeeName>
                  </Td>
                  <Td>{emp.position}</Td>
                  <Td>{emp.shift}</Td>
                  <Td>{emp.checkIn}</Td>
                  <Td>{emp.checkOut}</Td>
                  <Td>{emp.working}</Td>
                  <Td>
                    <StatusBadge>{emp.status}</StatusBadge>
                  </Td>
                  <Td>
                    <ActionButton>⋯</ActionButton>
                  </Td>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <Td
                  colSpan="9"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  No {activeTab === "employees" ? "employees" : "staff"} found
                </Td>
              </TableRow>
            )}
          </TableBody>
        </EmployeesTable>
      </EmployeesSection>

      {/* Filter Modal */}
      {showFilter && (
        <Filter
          onClose={() => setShowFilter(false)}
          onApply={handleFilterApply}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  max-width: none;
  margin: 0;
`;

const QuickStatsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  font-family: "Inter", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const DateSelect = styled.select`
  width: 130px;
  height: 40px;
  padding: 0 12px;
  border: 1px solid ${theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: "Inter", sans-serif;
  color: ${theme.colors.textColor};
  background: ${theme.colors.white};
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: ${theme.colors.primary};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: ${theme.colors.white};
  border: 0;
  border-radius: 10px;
  padding: 14px;
  height: 130px;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const StatLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${theme.colors.textColor};
  font-family: "Inter", sans-serif;
  flex: 1;
  min-width: 0;
`;

const StatValue = styled.h3`
  font-size: 1.75rem;
  font-weight: 600;
  font-family: "Inter", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
  word-break: break-word;
  overflow-wrap: break-word;
`;

const StatChangeIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 3px 8px;
  background: ${(props) => (props.$positive ? "#d1fae5" : "#fee2e2")};
  color: ${(props) => (props.$positive ? "#10B981" : "#dc2626")};
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  font-family: "Inter", sans-serif;
  border: 1px solid ${(props) => (props.$positive ? "#10B981" : "#dc2626")};
  flex-shrink: 0;
  white-space: nowrap;
`;

const ChangeIcon = styled.span`
  font-size: 0.8rem;
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 14px;
  width: 100%;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const AttendanceCard = styled.div`
  background: ${theme.colors.white};
  border: 0;
  border-radius: 10px;
  padding: 14px;
  height: 342px;
  width: 100%;
  flex: 1;
  overflow: hidden;
`;

const PayrollCard = styled.div`
  background: ${theme.colors.white};
  border: 0;
  border-radius: 10px;
  padding: 14px;
  height: 342px;
  width: 100%;
  flex: 1;
  overflow: hidden;
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ChartTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const PeriodSelect = styled.select`
  width: 106px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid ${theme.colors.border};
  border-radius: 4px;
  font-family: "Inter", sans-serif;
  font-size: 0.75rem;
  background: white;
  cursor: pointer;
`;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Legend = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: ${theme.colors.textColor};
  font-family: "Inter", sans-serif;
`;

const LegendBox = styled.div`
  width: 12px;
  height: 12px;
  background: ${(props) => props.color};
  border-radius: 2px;
`;

const PayrollContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PayrollMain = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
`;

const PayrollAmount = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.textColor};
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const PayrollLabel = styled.p`
  font-size: 0.875rem;
  color: ${theme.colors.secondaryTextColor};
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const BreakdownBars = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  gap: 4px;
`;

const BreakdownBar = styled.div`
  flex: 1;
  background: ${(props) => props.$color};
  border-radius: 4px;
`;

const PayrollLegend = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const PayrollLegendItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
`;

const PayrollLegendBox = styled.div`
  width: 10px;
  height: 10px;
  background: ${(props) => props.color};
  border-radius: 2px;
  margin-top: 0.2rem;
  flex-shrink: 0;
`;

const PayrollLegendText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
`;

const PayrollLegendName = styled.span`
  font-size: 0.75rem;
  color: ${theme.colors.textColor};
  font-weight: 600;
  font-family: "Inter", sans-serif;
`;

const PayrollLegendValue = styled.span`
  font-size: 0.7rem;
  color: ${theme.colors.secondaryTextColor};
  font-family: "Inter", sans-serif;
`;

const EmployeesSection = styled.div`
  margin-top: 26px;
`;

const TabsSection = styled.div`
  display: flex;
  gap: 2rem;
  border-bottom: 0;
  padding-bottom: 0;
`;

const TabsAndButtonSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${theme.colors.border};
`;

const AttendanceHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 18px;
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
    background: ${(props) =>
      props.$active ? theme.colors.primary : "transparent"};
    transition: all 0.2s ease;
  }

  &:hover {
    color: ${theme.colors.primary};
  }
`;

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const DateText = styled.span`
  font-size: 1.125rem;
  color: ${theme.colors.textColor};
  font-family: "Inter", sans-serif;
  font-weight: 500;
`;

const ControlsSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  margin-bottom: 14px;
  justify-content: flex-end;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    flex-wrap: wrap;
  }
`;

const SearchWrap = styled.div`
  width: 356px;
  margin-right: auto;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SelectWrap = styled.div`
  width: 226px;
  flex-shrink: 0;

  select {
    width: 100%;
    min-width: 0;
    height: 40px;
    padding: 0 12px;
    border: 1px solid ${theme.colors.border};
    border-radius: 6px;
    font-family: "Inter", sans-serif;
    font-size: 0.875rem;
    background: white;
    cursor: pointer;
    outline: none;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    &:hover {
      border-color: ${theme.colors.primary};
    }

    &:focus {
      border-color: ${theme.colors.primary};
      box-shadow: 0 0 0 3px rgba(0, 128, 128, 0.1);
    }

    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 40px;
  padding: 0 12px;
  border: 1px solid ${theme.colors.border};
  background: white;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.primary};
    color: ${theme.colors.primary};
  }
`;

const AddEmployeeButton = styled.button`
  height: 40px;
  padding: 0 14px;
  background: #066c78;
  color: white;
  border: none;
  border-radius: 6px;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: #065855;
  }
`;

const EmployeesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
`;

const TableHead = styled.thead`
  background: white;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${theme.colors.border};

  &:hover {
    background: #f9fafb;
  }
`;

const Th = styled.th`
  padding: 12px 10px;
  text-align: left;
  font-family: "Inter", sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${theme.colors.secondaryTextColor};
`;

const TableBody = styled.tbody``;

const Td = styled.td`
  padding: 12px 10px;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  color: ${theme.colors.textColor};
`;

const EmployeeName = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${theme.colors.textColor};
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 16px;
  font-size: 0.75rem;
  font-family: "Inter", sans-serif;
  font-weight: 600;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: ${theme.colors.secondaryTextColor};
`;

export default Dashboard;

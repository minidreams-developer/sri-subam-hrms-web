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
import SearchInputComponent from "../../components/SearchInputComponent";
import FilterIcon from "../../assets/images/DashboardImages/filtericon.svg";
import Filter from "../../components/filter";
import {
  getDashboard,
  getDashboardAttendanceOverview,
  getDashboardPayrollBreakdown,
  getDepartments,
  getShifts,
  getUsers,
  getPresentToday,
} from "../../services/apiServices";
import { toast } from "react-toastify";
import DropdownComponent from "../../components/DropdownComponent";

const formatAttendanceTime = (value) => {
  if (!value || value === "N/A") return "N/A";
  if (typeof value === "string" && !value.includes("T")) return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
};

const formatDashboardValue = (value) => {
  if (value == null || value === "") return "N/A";
  if (typeof value !== "object") return String(value);
  return value.shiftName || value.name || value.departmentName || value.designation || value.code || value._id || "N/A";
};

const Dashboard = () => {
  const today = new Date();
  const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const dateRange = "today";
  const [attendancePeriod, setAttendancePeriod] = useState("week");
  const [payrollPeriod, setPayrollPeriod] = useState("month");
  const [activeTab, setActiveTab] = useState("employees");
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Department");
  const [shiftFilter, setShiftFilter] = useState("All Shifts");
  const [showFilter, setShowFilter] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [attendanceOverview, setAttendanceOverview] = useState(null);
  const [payrollBreakdown, setPayrollBreakdown] = useState(null);
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
    fetchDepartmentsAndShifts();
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchAttendanceOverview();
  }, [attendancePeriod, appliedFilters]);

  useEffect(() => {
    fetchPayrollBreakdown();
  }, [payrollPeriod, appliedFilters]);

  useEffect(() => {
    const debounceTimer = window.setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 400);

    return () => window.clearTimeout(debounceTimer);
  }, [searchValue]);

  useEffect(() => {
    fetchPresentToday(activeTab === "employees" ? "employee" : "staff");
  }, [activeTab, debouncedSearchValue, departmentFilter, shiftFilter, appliedFilters]);

  const fetchPresentToday = async (role) => {
    try {
      const params = {
        role,
        date: todayDate,
      };

      if (debouncedSearchValue.trim()) params.search = debouncedSearchValue.trim();
      if (departmentFilter !== "All Department") params.departmentId = departmentFilter;
      if (shiftFilter !== "All Shifts") params.shiftId = shiftFilter;

      Object.entries(appliedFilters || {}).forEach(([key, value]) => {
        if (["departmentId", "shiftId"].includes(key) && value) {
          params[key] = Array.isArray(value) ? value[0] : value;
        }
      });

      const response = await getPresentToday(params);
      const records = Array.isArray(response)
        ? response
        : response?.results || response?.data || response?.attendance || [];
      const rows = records.map((record) => {
        const user = record.employee || record.user || record.staff || record.employeeDetails || {};
        return {
          id: record.id || record._id,
          employeeId: user.employeeId || record.employeeId || "N/A",
          name: user.name || record.employeeName || record.name || "N/A",
          position: user.workInformation?.designation || user.designation || record.designation || "N/A",
          shift: formatDashboardValue(user.workInformation?.shift || user.shift || record.shift),
          checkIn: formatAttendanceTime(record.checkIn || record.loginTime || record.checkInTime),
          checkOut: formatAttendanceTime(record.checkOut || record.logoutTime || record.checkOutTime),
          working: record.totalWorkedHours != null
            ? `${record.totalWorkedHours} Hrs`
            : record.workingHours != null
              ? `${Number(record.workingHours).toFixed(2)} Hrs`
              : record.working || "N/A",
          department: user.workInformation?.department || user.department || record.department || "N/A",
          type: role,
        };
      });
      if (role === "employee") setEmployeesData(rows);
      else setStaffDataList(rows);
    } catch (error) {
      console.error(`Error fetching present-today ${role} attendance:`, error);
      if (role === "employee") setEmployeesData([]);
      else setStaffDataList([]);
      toast.error("Failed to fetch today attendance");
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await getDashboard({ period: dateRange });
      console.log("Dashboard data:", response);
      setDashboardData(response);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getDashboardFilters = () => {
    const filters = appliedFilters || {};
    return {
      branchId: filters.branchId,
      departmentId: filters.departmentId,
      teamId: filters.teamId,
    };
  };

  const fetchAttendanceOverview = async () => {
    try {
      const response = await getDashboardAttendanceOverview({
        period: attendancePeriod,
        ...getDashboardFilters(),
      });
      setAttendanceOverview(response);
    } catch (error) {
      console.error("Error fetching attendance overview:", error);
      setAttendanceOverview(null);
      toast.error("Failed to fetch attendance overview");
    }
  };

  const fetchPayrollBreakdown = async () => {
    try {
      const response = await getDashboardPayrollBreakdown({
        period: payrollPeriod,
        ...getDashboardFilters(),
      });
      setPayrollBreakdown(response);
    } catch (error) {
      console.error("Error fetching payroll breakdown:", error);
      setPayrollBreakdown(null);
      toast.error("Failed to fetch payroll breakdown");
    }
  };

  const fetchEmployeesAndStaff = async () => {
    try {
    
      const empResponse = await getUsers({ role: "employee", limit: 10 });
      let empList = [];
      if (empResponse && Array.isArray(empResponse)) {
        empList = empResponse;
      } else if (empResponse?.results && Array.isArray(empResponse.results)) {
        empList = empResponse.results;
      } else if (empResponse?.data && Array.isArray(empResponse.data)) {
        empList = empResponse.data;
      }

     
      const transformedEmployees = empList.map((emp) => ({
        id: emp.id || emp._id,
        employeeId: emp.employeeId || "N/A",
        name: emp.name || emp.employeeName || "N/A",
        position: emp.workInformation?.designation || emp.designation || "N/A",
        shift: formatDashboardValue(emp.workInformation?.shift || emp.shift),
        checkIn: emp.checkIn || emp.loginTime || "N/A",
        checkOut: emp.checkOut || emp.logoutTime || "N/A",
        working: emp.workingHours || emp.working || "N/A",
        status: emp.status || "N/A",
        department: emp.workInformation?.department || emp.department || "N/A",
        type: "employee",
      }));
      setEmployeesData(transformedEmployees);

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


      const transformedStaff = staffList.map((staff) => ({
        id: staff.id || staff._id,
        employeeId: staff.employeeId || "N/A",
        name: staff.name || staff.employeeName || "N/A",
        position:
          staff.workInformation?.designation || staff.designation || "N/A",
        shift: formatDashboardValue(staff.workInformation?.shift || staff.shift),
        checkIn: staff.checkIn || staff.loginTime || "N/A",
        checkOut: staff.checkOut || staff.logoutTime || "N/A",
        working: staff.workingHours || staff.working || "N/A",
        status: staff.status || "N/A",
        department:
          staff.workInformation?.department || staff.department || "N/A",
        type: "staff",
      }));
      setStaffDataList(transformedStaff);
    } catch (error) {
      console.error("Error fetching employees and staff:", error);
      toast.error("Failed to fetch employees and staff");
    }
  };


  const fetchDepartmentsAndShifts = async () => {
    // Fetch departments
    setLoadingDepts(true);
    try {
      const deptResponse = await getDepartments();
      console.log("Departments response:", deptResponse);


      const deptList =
        deptResponse?.results || deptResponse?.data || deptResponse || [];

   
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


    setLoadingShifts(true);
    try {
      const shiftResponse = await getShifts();
      console.log("Shifts response:", shiftResponse);

      const shiftList =
        shiftResponse?.results || shiftResponse?.data || shiftResponse || [];

 
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

  const handleSearch = (value) => {
    setSearchValue(value);
  };


  
  const quickStats = dashboardData?.quickStats
    ? [
        {
          label: "Total Employees",
          value:
            dashboardData.quickStats.totalEmployees?.count?.toString() || "0",
          change: `${dashboardData.quickStats.totalEmployees?.percentageChange || 0}%`,
          // positive: dashboardData.quickStats.totalEmployees?.trend === "up",
        },
        {
          label: "Present Today",
          value:
            dashboardData.quickStats.presentToday?.count?.toString() || "0",
          change: `${dashboardData.quickStats.presentToday?.percentageChange || 0}%`,
          // positive: dashboardData.quickStats.presentToday?.trend === "up",
        },
        {
          label: "On Leave",
          value: dashboardData.quickStats.onLeave?.count?.toString() || "0",
          change: `${dashboardData.quickStats.onLeave?.percentageChange || 0}%`,
          // positive: dashboardData.quickStats.onLeave?.trend === "up",
        },
        {
          label: "OT Employees",
          value: dashboardData.quickStats.otEmployees?.count?.toString() || "0",
          change: `${dashboardData.quickStats.otEmployees?.percentageChange || 0}%`,
          // positive: dashboardData.quickStats.otEmployees?.trend === "up",
        },
        {
          label: "Payroll",
          value: `₹${(dashboardData.quickStats.payroll?.amount || 0).toLocaleString("en-IN")}`,
          change: `${dashboardData.quickStats.payroll?.percentageChange || 0}%`,
          // positive: dashboardData.quickStats.payroll?.trend === "up",
        },
      ]
    : [];
  /*
        { label: "Total Employees", value: "0", change: "0%", positive: true },
        { label: "Present Today", value: "0", change: "0%", positive: true },
        { label: "On Leave", value: "0", change: "0%", positive: true },
        { label: "OT Employees", value: "0", change: "0%", positive: false },
        { label: "Payroll", value: "₹0", change: "0%", positive: true },
      */

  // Handle department filter dropdown - only updates UI state
  const handleDepartmentChange = (value) => {
    setDepartmentFilter(value);
  };

  // Handle shift filter dropdown - only updates UI state
  const handleShiftChange = (value) => {
    setShiftFilter(value);
  };

  // Handle filter modal apply with API query parameters (per user-filters.md spec)
  const handleFilterApply = (queryParams) => {
    console.log("Applied filter query params:", queryParams);
    setAppliedFilters(queryParams);
    setShowFilter(false);
  };

  const fetchEmployeesAndStaffWithFilters = async (url) => {
    try {
      const queryParams = Object.fromEntries(new URL(url, window.location.origin).searchParams);
      const empResponse = await getPresentToday(queryParams);
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
        shift: formatDashboardValue(emp.workInformation?.shift || emp.shift),
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
  const attendanceData = attendanceOverview?.dailyData?.map(
    (item) => ({
      date: item.label,
      present: item.present,
      onLeave: item.onLeave,
      late: item.late,
    }),
  ) || [];

  // Build payroll breakdown from API
  const payrollData = payrollBreakdown?.categories
    ? [
        {
          name: "Salary",
          value:
            payrollBreakdown.categories.salary?.percentage || 0,
          percentage: `₹ ${payrollBreakdown.categories.salary?.amount?.toLocaleString("en-IN") || 0}`,
          color: "#0B7A75",
        },
        {
          name: "Allowances",
          value:
            payrollBreakdown.categories.allowances?.percentage ||
            0,
          percentage: `₹ ${payrollBreakdown.categories.allowances?.amount?.toLocaleString("en-IN") || 0}`,
          color: "#FDB750",
        },
        {
          name: "Deduction",
          value:
            payrollBreakdown.categories.deductions?.percentage ||
            0,
          percentage: `₹ ${payrollBreakdown.categories.deductions?.amount?.toLocaleString("en-IN") || 0}`,
          color: "#E0E3E6",
        },
        {
          name: "Incentives",
          value:
            payrollBreakdown.categories.incentives?.percentage ||
            0,
          percentage: `₹ ${payrollBreakdown.categories.incentives?.amount?.toLocaleString("en-IN") || 0}`,
          color: "#0B7A75",
        },
        {
          name: "Overtimes",
          value:
            payrollBreakdown.categories.overtime?.percentage || 0,
          percentage: `₹ ${payrollBreakdown.categories.overtime?.amount?.toLocaleString("en-IN") || 0}`,
          color: "#2C2C2C",
        },
      ]
    : [];
  /*
        { name: "Salary", value: 88.3, percentage: "₹ 0", color: "#0B7A75" },
        { name: "Allowances", value: 8.3, percentage: "₹ 0", color: "#FDB750" },
        { name: "Deduction", value: 2.1, percentage: "₹ 0", color: "#E0E3E6" },
        { name: "Incentives", value: 0.5, percentage: "₹ 0", color: "#0B7A75" },
        { name: "Overtimes", value: 0.8, percentage: "₹ 0", color: "#2C2C2C" },
      */

  const employees = employeesData;
  /*
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

  */
  const staffData = staffDataList;
  /*
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
  */

  // The present-today API already applies search and filter parameters.
  const tableData = activeTab === "employees" ? employees : staffData;

  return (
    <Container>
      {/* Quick Stats Section */}
      <QuickStatsSection>
        <SectionHeader>
          <SectionTitle>Quick Stats</SectionTitle>
          <HeaderRight>
            <FixedPeriod>Today</FixedPeriod>
          </HeaderRight>
        </SectionHeader>

        <StatsGrid>
          {quickStats.map((stat, idx) => (
            <StatCard key={idx}>
              <StatHeader>
                <StatLabel>{stat.label}</StatLabel>
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
            <ChartFilter>
              <DropdownComponent value={attendancePeriod} onChange={setAttendancePeriod} options={[{ value: "today", label: "Today" }, { value: "week", label: "This Week" }, { value: "month", label: "This Month" }]} />
            </ChartFilter>
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
            <ChartFilter>
              <DropdownComponent value={payrollPeriod} onChange={setPayrollPeriod} options={[{ value: "today", label: "Today" }, { value: "week", label: "This Week" }, { value: "month", label: "This Month" }]} />
            </ChartFilter>
          </ChartHeader>
          <PayrollContent>
            <PayrollMain>
              <PayrollAmount>
                ₹
                {(
                  payrollBreakdown?.totalPayThisMonth || 0
                ).toLocaleString("en-IN")}
              </PayrollAmount>
              <PayrollLabel>Total Pay {payrollPeriod === "today" ? "Today" : payrollPeriod === "week" ? "This Week" : "This Month"}</PayrollLabel>
            </PayrollMain>
            {payrollData.length > 0 && <BreakdownBars>
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
            </BreakdownBars>}
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
            <DateText>
              Today ({new Intl.DateTimeFormat("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }).format(new Date())})
            </DateText>
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
            <DropdownComponent value={departmentFilter} onChange={handleDepartmentChange} options={[{ value: "All Department", label: "All Department" }, ...departmentOptions]} />
          </SelectWrap>

          <SelectWrap>
            <DropdownComponent value={shiftFilter} onChange={handleShiftChange} options={[{ value: "All Shifts", label: "All Shifts" }, ...shiftOptions]} />
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
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.length > 0 ? (
            tableData.map((emp, index) => (
                <TableRow key={emp.id || emp.employeeId || `${emp.type}-${index}`}>
                  <Td>{emp.employeeId}</Td>
                  <Td>
                    <EmployeeName>{emp.name}</EmployeeName>
                  </Td>
                  <Td>{emp.position}</Td>
                  <Td>{emp.shift}</Td>
                  <Td>{emp.checkIn}</Td>
                  <Td>{emp.checkOut}</Td>
                  <Td>{emp.working}</Td>
                </TableRow>
              ))
            ) : (
              <TableRow key="empty-state">
                <Td
                  colSpan="7"
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

const ChartFilter = styled.div`
  width: 220px;
  flex-shrink: 0;

  @media (max-width: 600px) {
    width: 160px;
  }
`;

const FixedPeriod = styled.div`
  width: 100px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  border: 1px solid ${theme.colors.border};
  border-radius: 10px;
  background: ${theme.colors.white};
  color: ${theme.colors.textColor};
  font-size: 0.875rem;

  &::after {
    content: "";
    width: 7px;
    height: 7px;
    border-right: 2px solid #666;
    border-bottom: 2px solid #666;
    transform: rotate(45deg) translateY(-2px);
  }
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

export default Dashboard;

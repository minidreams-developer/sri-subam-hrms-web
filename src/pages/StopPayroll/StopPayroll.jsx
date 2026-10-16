import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import GreenArrow from "../../assets/images/DashboardImages/green.svg";
import RedArrow from "../../assets/images/DashboardImages/red.svg";
import DotMenuIcon from "../../assets/images/DayOff/dot-menu.svg";
import TabSwitcher from "../../components/TabSwitcher";
import ReusableTable from "../../components/ReusableTable";
import TableToolbar from "../../components/TableToolbar";
import ProfileImage from "../../assets/images/employee/sampleProfile.jpg";
import PlusIcon from "../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import DetailsSidebar from "../../components/DetailsSidebar";
import CardDetails from "../../components/CardDetails";
import EditIcon from "../../assets/images/employee/editIcon.svg";
import Filter from "../../components/filter";
import {
  getDepartments,
  getShifts,
  getStoppedPayroll,
  getStoppedPayrollQuickStats,
} from "../../services/apiServices";
import { toast } from "react-toastify";
import {
  employeeStopPayroll,
  staffColumnStopPayroll,
} from "../../utils/data";

const fallbackStoppedPayroll = [];
/*
  ["Manoj Kumar", "Addition", "Resigned", "-", "Approved"],
  ["Cristofer Dias", "Addition", "Tax Issues", "-", "Stopped"],
  ["Hanna Lipshutz", "Deduction", "Advance", "-", "Stopped"],
  ["Lydia Donin", "Deduction", "Penalty", "20-01-2026", "Approved"],
  ["Jaxson Carder", "Addition", "Incentive", "-", "Stopped"],
  ["Jaxson Carder", "Deduction", "Penalty", "-", "Stopped"],
  ["Jaxson Carder", "Addition", "Incentive", "15-02-2026", "Approved"],
].map(([name, department, exitType, fnf, status], index) => ({
  _id: `demo-${index + 1}`,
  employee: { name, role: "Employee", profileImage: null },
  employeeId: `EMP00${index + 1}`,
  designation: "Employee",
  currentSalary: "₹45,000",
  payCycle: "Monthly",
  department,
  exitType,
  lwd: "14-01-2026",
  fnf,
  assets: "₹42,853",
  status,
  stopType: "Payroll Hold",
  reason: exitType,
  effectiveFrom: "2026-01-14",
  resumeOn: fnf === "-" ? null : fnf.split("-").reverse().join("-"),
  impactMonth: "January 2026",
  remarks: "Policy Issues",
  action: "•••",
}));
*/

const formatDate = (value) => value
  ? new Date(value).toLocaleDateString("en-GB").replaceAll("/", "-")
  : "-";

const getDepartmentName = (department) => {
  if (!department) return "N/A";
  if (typeof department === "string") return department;
  return department.departmentName || department.name || "N/A";
};

const StopPayroll = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState("This Month");
  const [activeTab, setActiveTab] = useState("Employee");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employeeDept, setEmployeeDept] = useState("All Department");
  const [employeeShift, setEmployeeShift] = useState("All Shifts");
  const [staffSearch, setStaffSearch] = useState("");
  const [staffRole, setStaffRole] = useState("All Roles");
  const [staffShift, setStaffShift] = useState("All Shifts");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [stoppedPayrollData, setStoppedPayrollData] = useState([]);
  const [quickStatsData, setQuickStatsData] = useState({});
  const [loading, setLoading] = useState(false);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [loadingShifts, setLoadingShifts] = useState(false);

  // Fetch stopped payroll data on component mount
  useEffect(() => {
    fetchStoppedPayrollData();
    fetchStoppedPayrollQuickStats();
    fetchDepartmentsAndShifts();
  }, [activeTab, employeeDept, employeeShift, employeeSearch]);

  const fetchStoppedPayrollQuickStats = async () => {
    try {
      const response = await getStoppedPayrollQuickStats();
      setQuickStatsData(response?.data || response || {});
    } catch (error) {
      console.error("Error fetching stopped payroll quick stats:", error);
    }
  };

  const fetchStoppedPayrollData = async () => {
    setLoading(true);
    try {
      const selectedDepartment = departmentOptions.find(
        (option) => option.value === employeeDept
      );
      const selectedShift = shiftOptions.find(
        (option) => option.value === employeeShift
      );
      const params = {
        role: activeTab === "Employee" ? "employee" : "staff",
      };

      if (employeeSearch.trim()) params.search = employeeSearch.trim();
      if (selectedDepartment?.id) params.departmentId = selectedDepartment.id;
      if (selectedShift?.id) params.shiftId = selectedShift.id;

      const response = await getStoppedPayroll(params);
      console.log("Stopped Payroll data:", response);
      
      const responseBody = response?.data || response;
      let data = [];
      if (Array.isArray(responseBody)) {
        data = responseBody;
      } else if (responseBody?.results && Array.isArray(responseBody.results)) {
        data = responseBody.results;
      }
      
      // Transform API response to match table format
      const transformedData = data.map((item) => {
        // Handle both nested employeeId object and flat structure
        const empData = typeof item.employeeId === 'object' ? item.employeeId : {};
        
        return {
          _id: item.payrollId || item._id,
          employee: {
            name: item.name || empData?.name || "N/A",
            id:
              (typeof item.employeeId === "object"
                ? item.employeeId?._id || item.employeeId?.id
                : item.employeeId) ||
              empData?._id ||
              empData?.id ||
              "",
            role: item.role || empData?.workInformation?.designation || "Employee",
            profileImage: item.profilePic || empData?.profilePic || null,
          },
          employeeId: item.employeeCode || empData?.employeeId || "N/A",
          role: item.role || empData?.role || "employee",
          shift: item.shift || empData?.shift || null,
          designation: item.role || empData?.workInformation?.designation || "N/A",
          currentSalary:
            item.currentMonthSalary !== undefined
              ? formatAmount(item.currentMonthSalary)
              : "N/A",
          currentMonthSalary: item.currentMonthSalary,
          payableAfterStop: item.payableAfterStop ?? item.amount,
          days: item.days?.total ?? item.days?.fullDays,
          deductions: item.deductions,
          payCycle: item.payCycle || "Monthly",
          department: getDepartmentName(item.department || empData?.department),
          month: item.month,
          year: item.year,
          status: item.resumedAt
            ? "Resumed"
            : item.status === "processed"
              ? "Stopped"
              : item.status,
          stopType: item.stopType || item.stopDetails?.stopType || "N/A",
          reason: item.reason || item.stopDetails?.reason || "N/A",
          effectiveFrom: item.from || item.stopDetails?.effectiveFrom,
          resumeOn: item.resumeOn || item.stopDetails?.resumeOn,
          impactMonth: item.stopDetails?.impactMonth || "N/A",
          remarks: item.stopDetails?.stopRemarks || "N/A",
          stoppedAt: item.stoppedAt || item.stopDetails?.stoppedAt,
          resumedAt: item.resumedAt || item.stopDetails?.resumedAt,
          exitType: item.reason || item.stopDetails?.reason || "N/A",
          lwd: formatDate(item.from || item.stopDetails?.effectiveFrom),
          fnf: formatDate(item.resumeOn || item.stopDetails?.resumeOn),
          assets: formatAmount(item.amount),
          action: "•••",
        };
      });

      setStoppedPayrollData(transformedData);
    } catch (error) {
      console.error("Error fetching stopped payroll data:", error);
      toast.error("Failed to fetch stopped payroll data");
      setStoppedPayrollData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterApply = (filters) => {
    setAppliedFilters(filters);
    setShowFilter(false);
    console.log("Applied filters:", filters);
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
        id: dept._id || dept.id || dept.departmentId,
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
      const shiftList = shiftResponse?.results || shiftResponse?.data || shiftResponse || [];
      
      // Transform to dropdown options
      const shiftOpts = shiftList.map((shift) => ({
        id: shift._id || shift.id || shift.shiftId,
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

  const formatAmount = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
  const quickStats = [
    { label: "Stopped Payrolls", value: String(quickStatsData.stoppedPayrolls ?? 0), percentage: "", isPositive: true },
    { label: "Released Payrolls", value: String(quickStatsData.releasedPayrolls ?? 0), percentage: "", isPositive: true },
    { label: "Pending Amount", value: formatAmount(quickStatsData.pendingAmount), percentage: "", isPositive: true },
    { label: "Released Amounts", value: formatAmount(quickStatsData.releasedAmount), percentage: "", isPositive: false },
  ];

   const handleRowClick = (row) => {
    setSelectedRow(row);
    setSidebarOpen(true);
  };

  const handleNewEmployee = () => {
    navigate("new");
  };

  const handleEditDetails = () => {
    if (!selectedRow) return;
    navigate("new", {
      state: { stopPayroll: selectedRow, editMode: true, actionType: "stop" },
    });
  };

  const handleStatusAction = () => {
    if (!selectedRow) return;
    const isResumed = selectedRow.status?.toLowerCase() === "resumed";
    navigate("new", {
      state: {
        stopPayroll: selectedRow,
        editMode: true,
        actionType: isResumed ? "stop" : "resume",
      },
    });
  };

   const filteredEmployeeData = stoppedPayrollData.filter((row) => {
      const m1 =
        employeeDept === "All Department" || row.department === employeeDept;
      const m2 = employeeShift === "All Shifts" || row.shift === employeeShift;
      const m3 =
        !employeeSearch ||
        row.employee.name.toLowerCase().includes(employeeSearch.toLowerCase());
      return m1 && m2 && m3;
    });
  
    const filteredStaffData = stoppedPayrollData.filter((row) => {
      const m1 = staffRole === "All Roles" || row.role === staffRole;
      const m2 = staffShift === "All Shifts" || row.shift === staffShift;
      const m3 =
        !staffSearch ||
        row.employee.name.toLowerCase().includes(staffSearch.toLowerCase());
      return m1 && m2 && m3;
    });

   // Custom columns with employee renderer
    const employeeColumnsWithRenderer = employeeStopPayroll.map((col) => {
      if (col.accessor === "employee") {
        return {
          ...col,
          render: (row) => (
            <EmployeeCell>
              <EmployeeAvatar
                src={row.employee.profileImage || ProfileImage}
                alt={row.employee.name}
              />
              <EmployeeInfo>
                <EmployeeName>{row.employee.name}</EmployeeName>
                <EmployeeRole>{row.employee.role}</EmployeeRole>
              </EmployeeInfo>
            </EmployeeCell>
          ),
        };
      }
      if (col.accessor === "status") {
        return {
          ...col,
          render: (row) => (
            <StatusText $status={row.status}>{row.status || "N/A"}</StatusText>
          ),
        };
      }
      return col;
    });

     const staffColumnsWithRenderer = staffColumnStopPayroll.map((col) => {
        if (col.accessor === "staff") {
          return {
            ...col,
            render: (row) => (
              <EmployeeCell>
                <EmployeeAvatar
                  src={row.employee.profileImage || ProfileImage}
                  alt={row.employee.name}
                />
                <EmployeeInfo>
                <EmployeeName>{row.employee.name}</EmployeeName>
                <EmployeeRole>{row.employee.role}</EmployeeRole>
                </EmployeeInfo>
              </EmployeeCell>
            ),
          };
        }
        if (col.accessor === "status") {
          return {
            ...col,
            render: (row) => (
              <StatusText $status={row.status}>{row.status || "N/A"}</StatusText>
            ),
          };
        }
        return col;
      });

  return (
    <Container>
      {/* Quick Stats Section */}
      <QuickStatsSection>
        <SectionHeader>
          <SectionTitle>Quick Stats</SectionTitle>
          <HeaderRight>
            <DropdownSelect value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </DropdownSelect>
            <DotMenuButton>
              <img src={DotMenuIcon} alt="menu" width="20" height="20" />
            </DotMenuButton>
          </HeaderRight>
        </SectionHeader>
        <StatsGrid>
          {quickStats.map((stat, index) => (
            <StatCard key={index}>
              <StatHeader>
                <StatLabel>{stat.label}</StatLabel>
                {stat.percentage && (
                  <PercentageBadge $isPositive={stat.isPositive}>
                    {stat.percentage}
                    <img
                      src={stat.isPositive ? GreenArrow : RedArrow}
                      alt="trend"
                      width="12"
                      height="12"
                    />
                  </PercentageBadge>
                )}
              </StatHeader>
              <StatValue>{stat.value}</StatValue>
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
                          select1Options={["All Department", ...departmentOptions.map(d => d.value)]}
                          select1Value={employeeDept}
                          onSelect1Change={setEmployeeDept}
                          select2Options={["All Shifts", ...shiftOptions.map(s => s.value)]}
                          select2Value={employeeShift}
                          onSelect2Change={setEmployeeShift}
                          filterText="Filter"
                          actionText="New Employee"
                          actionIcon={<img src={PlusIcon} alt="add" width="16" height="16" />}
                          onActionClick={handleNewEmployee}
                          onFilterClick={() => setShowFilter(true)}
                        />
                        <ReusableTable
                          columns={employeeColumnsWithRenderer}
                          data={filteredEmployeeData}
                          rowsPerPage={5}
                          totalResults={filteredEmployeeData.length}
                          onRowClick={handleRowClick}
                          alwaysShowPagination={true}
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
                          select2Options={["All Shifts", ...shiftOptions.map(s => s.value)]}
                          select2Value={staffShift}
                          onSelect2Change={setStaffShift}
                          filterText="Filter"
                          actionText="New Employee"
                          actionIcon={<img src={PlusIcon} alt="add" width="16" height="16" />}
                          onFilterClick={() => setShowFilter(true)}
                        />
                        <ReusableTable
                          columns={staffColumnsWithRenderer}
                          data={filteredStaffData}
                          rowsPerPage={5}
                          totalResults={filteredStaffData.length}
                          onRowClick={handleRowClick}
                          alwaysShowPagination={true}
                          />
                      </>
                    )}
      </QuickStatsSection>

      {/* Details Sidebar */}
      <DetailsSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title={"Stop Payroll Details"}
        variant="stop-payroll"
      >
        <Section>
          <CardDetails
            title="Employee Details"
            columns={2}
            items={[
              { 
                label: "Employee", 
                value: selectedRow?.employee?.name || "N/A"
              },
              { 
                label: "Employee ID", 
                value: selectedRow?.employeeId || "N/A"
              },
              { 
                label: "Designation", 
                value: selectedRow?.designation || "N/A" 
              },
              { 
                label: "Department", 
                value: selectedRow?.department || "N/A" 
              },
              { label: "Current Salary", value: selectedRow?.currentSalary || "₹45,000" },
              { label: "Pay Cycle", value: selectedRow?.payCycle || "Monthly" },
            ]}
          />
        </Section>

        <Section>
          <CardDetails
            title="Stop Details"
            columns={2}
            items={[
              { label: "Stop Type", value: selectedRow?.stopType || "N/A" },
              { label: "Reason", value: selectedRow?.reason || "N/A" },
              { 
                label: "Effective From", 
                value: selectedRow?.effectiveFrom 
                  ? new Date(selectedRow.effectiveFrom).toLocaleDateString()
                  : "N/A"
              },
              { 
                label: "Resume On", 
                value: selectedRow?.resumeOn 
                  ? new Date(selectedRow.resumeOn).toLocaleDateString()
                  : "N/A"
              },
              { label: "Impact Month", value: selectedRow?.impactMonth || "N/A" },
              { label: "Remarks", value: selectedRow?.remarks || "N/A" },
              { 
                label: "Status", 
                value: (
                  <StatusText $status={selectedRow?.status}>
                    {selectedRow?.status || "N/A"}
                  </StatusText>
                )
              },
            ]}
          />
        </Section>

        <Section>
          <CardDetails
            title="Payroll Impact Preview"
            columns={2}
            items={[
              { label: "Current Month Pay", value: selectedRow?.currentMonthSalary !== undefined ? formatAmount(selectedRow.currentMonthSalary) : selectedRow?.currentSalary || "N/A" },
              { label: "Payable After Stop", value: selectedRow?.payableAfterStop !== undefined ? formatAmount(selectedRow.payableAfterStop) : "N/A" },
              { label: "Days Payable", value: selectedRow?.days !== undefined ? selectedRow.days : "N/A" },
              { label: "Deductions", value: selectedRow?.deductions !== undefined ? formatAmount(selectedRow.deductions) : "N/A" },
            ]}
          />
        </Section>

        <ButtonRow>
          {selectedRow?.status?.toLowerCase() === "resumed" ? (
            <ResumeButton onClick={handleStatusAction}>Stop</ResumeButton>
          ) : (
            <ResumeButton onClick={handleStatusAction}>Resume</ResumeButton>
          )}
          <EditDetailsButton onClick={handleEditDetails}>
            <img src={EditIcon} alt="edit" width="16" height="16" />
            Edit details
          </EditDetailsButton>
        </ButtonRow>
      </DetailsSidebar>

      {showFilter && (
        <Filter
          onClose={() => setShowFilter(false)}
          onApply={handleFilterApply}
        />
      )}
    </Container>
  );
};

export default StopPayroll;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.75rem 0 0;
`;

const QuickStatsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const DropdownSelect = styled.select`
  height: 40px;
  min-width: 130px;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.textColor};
  background: ${theme.colors.white};
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: ${theme.colors.primary};
  }
`;

const DotMenuButton = styled.button`
  width: 40px;
  height: 40px;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 10px;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.7;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.875rem;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: ${theme.colors.white};
  border: none;
  border-radius: 0.625rem;
  height: 130px;
  padding: 0.875rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  font-family: "Inter-SemiBold", sans-serif;
  font-weight: 600;
  color: ${theme.colors.textColor};
  flex: 1;
  min-width: 0;
`;

const PercentageBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${(props) => (props.$isPositive ? "#10B981" : "#EF4444")};
  background: ${(props) => (props.$isPositive ? "rgba(37, 186, 85, 0.1)" : "rgba(242, 19, 19, 0.1)")};
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  border: 1px solid ${(props) => (props.$isPositive ? "#10B981" : "#EF4444")};
  flex-shrink: 0;
  white-space: nowrap;
`;

const StatValue = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  font-family: "Inter-Bold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
  word-break: break-word;
  overflow-wrap: break-word;
`;

const EmployeeCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const EmployeeAvatar = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const EmployeeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

const EmployeeName = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
  line-height: 1.2;
`;

const EmployeeRole = styled.p`
  font-size: 0.75rem;
  font-weight: 400;
  font-family: "Inter-Regular", sans-serif;
  color: ${theme.colors.secondaryText};
  margin: 0;
  line-height: 1.2;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatusText = styled.span`
  color: ${({ $status }) => {
    const s = String($status || "").toLowerCase();
    if (s === "active") return "#16a34a";
    if (s === "inactive" || s === "stopped") return "#dc2626";
    if (s === "pending") return "#f59e0b";
    return theme.colors.textColor;
  }};
  font-weight: 600;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: auto;
  padding: 0;
`;

const ResumeButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  background: ${theme.colors.primary};
  border: none;
  border-radius: 8px;
  color: ${theme.colors.white};
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const EditDetailsButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.primary};
  border-radius: 8px;
  color: ${theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;

  &:hover {
    background: ${theme.colors.secondaryWhite};
  }
`;

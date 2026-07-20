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
import { get } from "../../helpers/api_helper";
import { GET_STOPPED_PAYROLL, DEPARTMENTS, GET_SHIFTS } from "../../helpers/url_helper";
import { toast } from "react-toastify";
import {
  employeeStopPayroll,
  offboardingEmployeeData,
  staffColumnStopPayroll,
  offboardingStaffData,
} from "../../utils/data";

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
  const [loading, setLoading] = useState(false);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [loadingShifts, setLoadingShifts] = useState(false);

  // Fetch stopped payroll data on component mount
  useEffect(() => {
    fetchStoppedPayrollData();
    fetchDepartmentsAndShifts();
  }, []);

  const fetchStoppedPayrollData = async () => {
    setLoading(true);
    try {
      const response = await get(GET_STOPPED_PAYROLL);
      console.log("Stopped Payroll data:", response);
      
      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response?.results && Array.isArray(response.results)) {
        data = response.results;
      }
      
      // Transform API response to match table format
      const transformedData = data.map((item) => {
        // Handle both nested employeeId object and flat structure
        const empData = typeof item.employeeId === 'object' ? item.employeeId : {};
        
        return {
          _id: item._id,
          employee: {
            name: empData?.name || "N/A",
            id: empData?._id || "",
            role: empData?.workInformation?.designation || "Employee",
            profileImage: empData?.profilePic || null,
          },
          employeeId: empData?.employeeId || "N/A",
          designation: empData?.workInformation?.designation || "N/A",
          department: empData?.department || "N/A",
          month: item.month,
          year: item.year,
          status: item.status,
          stopType: item.stopDetails?.stopType || "N/A",
          reason: item.stopDetails?.reason || "N/A",
          effectiveFrom: item.stopDetails?.effectiveFrom,
          resumeOn: item.stopDetails?.resumeOn,
          impactMonth: item.stopDetails?.impactMonth || "N/A",
          remarks: item.stopDetails?.stopRemarks || "N/A",
          stoppedAt: item.stopDetails?.stoppedAt,
          resumedAt: item.stopDetails?.resumedAt,
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
      const deptResponse = await get(DEPARTMENTS);
      console.log("Departments response:", deptResponse);
      
      // Handle different response structures
      const deptList = deptResponse?.results || deptResponse?.data || deptResponse || [];
      
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
      const shiftResponse = await get(GET_SHIFTS);
      console.log("Shifts response:", shiftResponse);
      
      // Handle different response structures
      const shiftList = shiftResponse?.results || shiftResponse?.data || shiftResponse || [];
      
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

  const quickStats = [
    { label: "Stopped Payrolls", value: stoppedPayrollData.length.toString(), percentage: "12 %", isPositive: false },
    { label: "Released Payrolls", value: "411", percentage: "20.5 %", isPositive: true },
    { label: "Pending Amount", value: "₹15,50,000", percentage: "8.5 %", isPositive: false },
    { label: "Released Amount", value: "₹1,85,50,000", percentage: "15.3 %", isPositive: true },
  ];

   const handleRowClick = (row) => {
    setSelectedRow(row);
    setSidebarOpen(true);
  };

  const handleNewEmployee = () => {
    navigate("new");
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
  
    const filteredStaffData = offboardingStaffData.filter((row) => {
      const m1 = staffRole === "All Roles" || row.role === staffRole;
      const m2 = staffShift === "All Shifts" || row.shift === staffShift;
      const m3 =
        !staffSearch ||
        row.staff.name.toLowerCase().includes(staffSearch.toLowerCase());
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
      return col;
    });

     const staffColumnsWithRenderer = staffColumnStopPayroll.map((col) => {
        if (col.accessor === "staff") {
          return {
            ...col,
            render: (row) => (
              <EmployeeCell>
                <EmployeeAvatar
                  src={row.staff.profileImage || ProfileImage}
                  alt={row.staff.name}
                />
                <EmployeeInfo>
                  <EmployeeName>{row.staff.name}</EmployeeName>
                  <EmployeeRole>{row.staff.role}</EmployeeRole>
                </EmployeeInfo>
              </EmployeeCell>
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
                <PercentageBadge $isPositive={stat.isPositive}>
                  {stat.percentage}
                  <img
                    src={stat.isPositive ? GreenArrow : RedArrow}
                    alt="trend"
                    width="12"
                    height="12"
                  />
                </PercentageBadge>
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
                          actionText="New Stop Payroll"
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
                          actionText="New Stop Payroll"
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
              { 
                label: "Month", 
                value: `${selectedRow?.month}/${selectedRow?.year}` || "N/A"
              },
              { 
                label: "Status", 
                value: selectedRow?.status || "N/A"
              },
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
              { label: "Current Month Pay", value: "₹45,000" },
              { label: "Payable After Stop", value: "₹15,000" },
              { label: "Days Payable", value: "10 / 30" },
              { label: "Deductions", value: "₹30,000" },
            ]}
          />
        </Section>

        <ButtonRow>
          <ResumeButton>Resume</ResumeButton>
          <EditDetailsButton>
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
  gap: 2rem;
  padding: 1rem 0;
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
  font-size: 1.25rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const DropdownSelect = styled.select`
  padding: 0.5rem 1rem;
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
  background: transparent;
  border: none;
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
  gap: 1rem;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 0.75rem;
  padding: 1.5rem;
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
  font-size: 0.875rem;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.secondaryTextColor};
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
  background: ${(props) => (props.$isPositive ? "#D1FAE5" : "#FEE2E2")};
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  border: 1px solid ${(props) => (props.$isPositive ? "#10B981" : "#EF4444")};
  flex-shrink: 0;
  white-space: nowrap;
`;

const StatValue = styled.h3`
  font-size: 1.75rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
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
  padding: 1rem 0;
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
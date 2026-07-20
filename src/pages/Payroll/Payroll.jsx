import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import ReusableTable from "../../components/ReusableTable";
import TableToolbar from "../../components/TableToolbar";
import DotIcon from "../../assets/images/Overtime/actionDot.svg";
import TabSwitcher from "../../components/TabSwitcher";
import Button from "../../components/Button";
import Filter from "../../components/filter";
import { get } from "../../helpers/api_helper";
import { GET_PAYROLL, DEPARTMENTS, GET_SHIFTS } from "../../helpers/url_helper";
import { toast } from "react-toastify";

const Payroll = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [shift, setShift] = useState("All Shifts");
  const [activeTopTab, setActiveTopTab] = useState("Payroll");
  const [activeInnerTab, setActiveInnerTab] = useState("Employees");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All, Staff, Employee");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [loadingShifts, setLoadingShifts] = useState(false);

  // Fetch payroll data on component mount or page change
  useEffect(() => {
    fetchPayrollData();
    fetchDepartmentsAndShifts();
  }, [currentPage, pageSize]);

  const fetchPayrollData = async () => {
    setLoading(true);
    try {
      const response = await get(`${GET_PAYROLL}?page=${currentPage}&limit=${pageSize}`);
      console.log("Payroll data fetched:", response);
      
      let records = [];
      
      // Handle different response structures
      if (Array.isArray(response)) {
        records = response;
      } else if (response?.results && Array.isArray(response.results)) {
        records = response.results;
        setTotalResults(response.totalResults || 0);
        setTotalPages(response.totalPages || 0);
      } else if (response?.data && Array.isArray(response.data)) {
        records = response.data;
      }
      
      // Transform API data to match table format
      const transformedData = records.map((item) => ({
        employeeId: item.employeeId,
        name: item.name,
        designation: item.designation,
        department: item.department,
        fullDay: item.fullDays || 0,
        halfDay: item.halfDays || 0,
        offDays: item.offDays || 0,
        paidLeaves: item.paidLeaves || 0,
        unpaidLeaves: item.unpaidLeaves || 0,
        dailyWages: `₹${(item.dailyRate || 0).toFixed(2)}`,
        grossWages: `₹${(item.grossWages || 0).toLocaleString('en-IN')}`,
        earnedWages: `₹${(item.earnedWages || 0).toLocaleString('en-IN')}`,
        otherWages: `₹${(item.otherWages || 0).toLocaleString('en-IN')}`,
        overTime: `₹${(item.overtimeAmount || 0).toLocaleString('en-IN')}`,
        extras: `₹${(item.extras || 0).toLocaleString('en-IN')}`,
        grossEarnings: `₹${(item.grossEarnings || 0).toLocaleString('en-IN')}`,
        penalties: `₹${(item.penalties || 0).toLocaleString('en-IN')}`,
        loanAdvance: `₹${(item.loanAndAdvance || 0).toLocaleString('en-IN')}`,
        otherDeductions: `₹${(item.otherDeductions || 0).toLocaleString('en-IN')}`,
        takeHome: `₹${(item.takeHome || 0).toLocaleString('en-IN')}`,
        preview: `₹${(item.takeHome || 0).toLocaleString('en-IN')}`,
      }));
      
      setPayrollData(transformedData);
    } catch (error) {
      console.error("Error fetching payroll data:", error);
      toast.error("Failed to fetch payroll data");
      setPayrollData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterApply = (queryParams) => {
    console.log("Applied filter query params:", queryParams);
    // Build the API URL with query parameters (per user-filters.md spec)
    let url = GET_PAYROLL;
    
    // Add filter parameters
    if (queryParams.departmentId) {
      url += `?departmentId=${queryParams.departmentId}`;
    }
    if (queryParams.designation) {
      url += (url.includes('?') ? '&' : '?') + `designation=${encodeURIComponent(queryParams.designation)}`;
    }
    if (queryParams.joinedFrom) {
      url += (url.includes('?') ? '&' : '?') + `joinedFrom=${queryParams.joinedFrom}`;
    }
    if (queryParams.joinedTo) {
      url += (url.includes('?') ? '&' : '?') + `joinedTo=${queryParams.joinedTo}`;
    }
    if (queryParams.status) {
      url += (url.includes('?') ? '&' : '?') + `status=${queryParams.status}`;
    }
    if (queryParams.shiftId) {
      url += (url.includes('?') ? '&' : '?') + `shiftId=${queryParams.shiftId}`;
    }
    if (queryParams.sortBy) {
      url += (url.includes('?') ? '&' : '?') + `sortBy=${queryParams.sortBy}`;
    }
    
    // Add pagination
    url += (url.includes('?') ? '&' : '?') + `page=${queryParams.page || 1}&limit=${queryParams.limit || 10}`;
    
    setAppliedFilters(queryParams);
    setShowFilter(false);
    setCurrentPage(1);
    
    // Fetch filtered payroll data
    fetchPayrollDataWithFilters(url);
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

  const fetchPayrollDataWithFilters = async (url) => {
    setLoading(true);
    try {
      const response = await get(url);
      console.log("Filtered payroll data fetched:", response);
      
      let records = [];
      
      // Handle different response structures
      if (Array.isArray(response)) {
        records = response;
      } else if (response?.results && Array.isArray(response.results)) {
        records = response.results;
        setTotalResults(response.totalResults || 0);
        setTotalPages(response.totalPages || 0);
      } else if (response?.data && Array.isArray(response.data)) {
        records = response.data;
      }
      
      // Transform API data to match table format
      const transformedData = records.map((item) => ({
        employeeId: item.employeeId,
        name: item.name,
        designation: item.designation,
        department: item.department,
        fullDay: item.fullDays || 0,
        halfDay: item.halfDays || 0,
        offDays: item.offDays || 0,
        paidLeaves: item.paidLeaves || 0,
        unpaidLeaves: item.unpaidLeaves || 0,
        dailyWages: `₹${(item.dailyRate || 0).toFixed(2)}`,
        grossWages: `₹${(item.grossWages || 0).toLocaleString('en-IN')}`,
        earnedWages: `₹${(item.earnedWages || 0).toLocaleString('en-IN')}`,
        otherWages: `₹${(item.otherWages || 0).toLocaleString('en-IN')}`,
        overTime: `₹${(item.overtimeAmount || 0).toLocaleString('en-IN')}`,
        extras: `₹${(item.extras || 0).toLocaleString('en-IN')}`,
        grossEarnings: `₹${(item.grossEarnings || 0).toLocaleString('en-IN')}`,
        penalties: `₹${(item.penalties || 0).toLocaleString('en-IN')}`,
        loanAdvance: `₹${(item.loanAndAdvance || 0).toLocaleString('en-IN')}`,
        otherDeductions: `₹${(item.otherDeductions || 0).toLocaleString('en-IN')}`,
        takeHome: `₹${(item.takeHome || 0).toLocaleString('en-IN')}`,
        preview: `₹${(item.takeHome || 0).toLocaleString('en-IN')}`,
      }));
      
      setPayrollData(transformedData);
    } catch (error) {
      console.error("Error fetching filtered payroll data:", error);
      toast.error("Failed to fetch payroll data with filters");
      setPayrollData([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: "Employee ID", accessor: "employeeId" },
    { header: "Name", accessor: "name" },
    { header: "Designation", accessor: "designation" },
    { header: "Dept.", accessor: "department" },
    { header: "Full Day", accessor: "fullDay" },
    { header: "Half Day", accessor: "halfDay" },
    { header: "Off Days", accessor: "offDays" },
    { header: "Paid Leaves", accessor: "paidLeaves" },
    { header: "Unpaid Leaves", accessor: "unpaidLeaves" },
    { header: "Daily Wages", accessor: "dailyWages" },
    { header: "Gross Wages", accessor: "grossWages" },
    { header: "Earned Wages", accessor: "earnedWages" },
    { header: "Other Wages", accessor: "otherWages" },
    { header: "Over Time", accessor: "overTime" },
    { header: "Extras", accessor: "extras" },
    { header: "Gross Earnings", accessor: "grossEarnings" },
    { header: "Penalties", accessor: "penalties" },
    { header: "Loan & Advance", accessor: "loanAdvance" },
    { header: "Other Deductions", accessor: "otherDeductions" },
    { header: "Take Home", accessor: "takeHome" },
    { header: "Preview", accessor: "preview" },
  ];

  const data = [
    {
      employeeId: "EMP001",
      name: "John Doe",
      designation: "Software Engineer",
      department: "IT",
      fullDay: 22,
      halfDay: 2,
      offDays: 4,
      paidLeaves: 2,
      unpaidLeaves: 0,
      dailyWages: "₹2,000",
      grossWages: "₹44,000",
      earnedWages: "₹46,000",
      otherWages: "₹2,000",
      overTime: "₹5,000",
      extras: "₹1,000",
      grossEarnings: "₹54,000",
      penalties: "₹500",
      loanAdvance: "₹2,000",
      otherDeductions: "₹1,500",
      takeHome: "₹50,000",
      preview: "₹50,000",
    },
    {
      employeeId: "EMP002",
      name: "Jane Smith",
      designation: "HR Manager",
      department: "HR",
      fullDay: 24,
      halfDay: 1,
      offDays: 4,
      paidLeaves: 1,
      unpaidLeaves: 0,
      dailyWages: "₹2,500",
      grossWages: "₹60,000",
      earnedWages: "₹62,500",
      otherWages: "₹2,500",
      overTime: "₹3,000",
      extras: "₹1,500",
      grossEarnings: "₹69,500",
      penalties: "₹0",
      loanAdvance: "₹0",
      otherDeductions: "₹1,000",
      takeHome: "₹68,500",
      preview: "₹68,500",
    },
    {
      employeeId: "EMP003",
      name: "Mike Johnson",
      designation: "Sales Executive",
      department: "Sales",
      fullDay: 20,
      halfDay: 3,
      offDays: 4,
      paidLeaves: 3,
      unpaidLeaves: 1,
      dailyWages: "₹1,800",
      grossWages: "₹36,000",
      earnedWages: "₹38,700",
      otherWages: "₹2,700",
      overTime: "₹4,000",
      extras: "₹2,000",
      grossEarnings: "₹47,400",
      penalties: "₹1,000",
      loanAdvance: "₹3,000",
      otherDeductions: "₹500",
      takeHome: "₹42,900",
      preview: "₹42,900",
    },
    {
      employeeId: "EMP004",
      name: "Sarah Williams",
      designation: "Marketing Manager",
      department: "Marketing",
      fullDay: 23,
      halfDay: 1,
      offDays: 4,
      paidLeaves: 2,
      unpaidLeaves: 0,
      dailyWages: "₹2,200",
      grossWages: "₹50,600",
      earnedWages: "₹51,700",
      otherWages: "₹1,100",
      overTime: "₹2,500",
      extras: "₹1,200",
      grossEarnings: "₹56,500",
      penalties: "₹300",
      loanAdvance: "₹1,500",
      otherDeductions: "₹800",
      takeHome: "₹53,900",
      preview: "₹53,900",
    },
    {
      employeeId: "EMP005",
      name: "David Brown",
      designation: "Finance Analyst",
      department: "Finance",
      fullDay: 25,
      halfDay: 0,
      offDays: 4,
      paidLeaves: 1,
      unpaidLeaves: 0,
      dailyWages: "₹2,300",
      grossWages: "₹57,500",
      earnedWages: "₹57,500",
      otherWages: "₹0",
      overTime: "₹3,500",
      extras: "₹1,000",
      grossEarnings: "₹62,000",
      penalties: "₹0",
      loanAdvance: "₹0",
      otherDeductions: "₹1,200",
      takeHome: "₹60,800",
      preview: "₹60,800",
    },
  ];

  const finalizedPayrollData = [
    {
      month: "April 2025",
      status: "Completed",
      processedDate: "Processed on May 2, 2025",
      netPayout: "₹1,107,400.00",
      staffs: { amount: "₹502,500", count: "45 people" },
      employees: { amount: "₹495,000", count: "62 people" },
      agents: { amount: "₹9,900", count: "15 people" },
      contractors: { amount: "₹100,000", count: "20 people" }
    },
    {
      month: "March 2025",
      status: "Completed",
      processedDate: "Processed on April 2, 2025",
      netPayout: "₹1,095,200.00",
      staffs: { amount: "₹495,000", count: "44 people" },
      employees: { amount: "₹489,000", count: "61 people" },
      agents: { amount: "₹9,800", count: "14 people" },
      contractors: { amount: "₹101,400", count: "20 people" }
    },
    {
      month: "February 2025",
      status: "Completed",
      processedDate: "Processed on March 3, 2025",
      netPayout: "₹1,102,500.00",
      staffs: { amount: "₹500,000", count: "45 people" },
      employees: { amount: "₹494,000", count: "62 people" },
      agents: { amount: "₹9,900", count: "15 people" },
      contractors: { amount: "₹98,600", count: "20 people" }
    }
  ];

  const renderTopTabContent = () => {
    if (activeTopTab === "Payroll") {
      return (
        <>
          <TabSwitcher
            tabs={[
              { label: "Employees", value: "Employees" },
              { label: "Staffs", value: "Staffs" }
            ]}
            active={activeInnerTab}
            onChange={setActiveInnerTab}
          />
          <TableToolbar
            searchPlaceholder="Search Employee"
            searchValue={search}
            onSearchChange={setSearch}
            select1Options={["All Departments", ...departmentOptions.map(d => d.value)]}
            select1Value={department}
            onSelect1Change={setDepartment}
            select2Options={["All Shifts", ...shiftOptions.map(s => s.value)]}
            select2Value={shift}
            onSelect2Change={setShift}
            showFilter={true}
            filterText="Filter"
            showDotIcon={true}
            dotIcon={DotIcon}
            searchPosition="left"
            onFilterClick={() => setShowFilter(true)}
          />
          <TableContainer>
            <ReusableTable 
              columns={columns} 
              data={payrollData.length > 0 ? payrollData : []}
              rowsPerPage={pageSize}
              totalResults={totalResults}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              server={true}
              loading={loading}
            />
          </TableContainer>
        </>
      );
    } else if (activeTopTab === "Abstract") {
      return <PlaceholderContent>Abstract content coming soon...</PlaceholderContent>;
    } else if (activeTopTab === "Finalized Payroll") {
      return (
        <FinalizedPayrollContainer>
          <FinalizedPayrollHeader>
            <HeaderTitle>Finalized Payroll History</HeaderTitle>
            <HeaderControls>
              <YearSelect 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </YearSelect>
              <SearchInput 
                type="text" 
                placeholder="Search History..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </HeaderControls>
          </FinalizedPayrollHeader>
          {finalizedPayrollData.map((item, index) => (
            <PayrollCard key={index}>
              <CardTop>
                <CardLeft>
                  <MonthTitle>{item.month}</MonthTitle>
                  <StatusBadge $status={item.status}>{item.status}</StatusBadge>
                </CardLeft>
                <CardRight>
                  <ProcessedText>{item.processedDate}</ProcessedText>
                  <NetPayoutText>Total Payout {item.netPayout}</NetPayoutText>
                </CardRight>
              </CardTop>
              <StatsRow>
                <StatCard $highlight>
                  <StatLabel>Net Payout</StatLabel>
                  <StatValue>{item.netPayout}</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>Staffs</StatLabel>
                  <StatValue>{item.staffs.amount}</StatValue>
                  <StatCount>{item.staffs.count}</StatCount>
                </StatCard>
                <StatCard>
                  <StatLabel>Employees</StatLabel>
                  <StatValue>{item.employees.amount}</StatValue>
                  <StatCount>{item.employees.count}</StatCount>
                </StatCard>
                <StatCard>
                  <StatLabel>Agents</StatLabel>
                  <StatValue>{item.agents.amount}</StatValue>
                  <StatCount>{item.agents.count}</StatCount>
                </StatCard>
                <StatCard>
                  <StatLabel>Contractors</StatLabel>
                  <StatValue>{item.contractors.amount}</StatValue>
                  <StatCount>{item.contractors.count}</StatCount>
                </StatCard>
              </StatsRow>
              <CardBottom>
                <Button 
                  text="Download Payslips" 
                  bg={theme.colors.white}
                  color={theme.colors.primary}
                  border={`1px solid ${theme.colors.border}`}
                  onClick={() => setIsDownloadModalOpen(true)}
                />
                <Button 
                  text="View Abstract" 
                  bg={theme.colors.primary}
                  color={theme.colors.white}
                />
              </CardBottom>
            </PayrollCard>
          ))}
        </FinalizedPayrollContainer>
      );
    }
  };

  return (
    <Container>
      <TopTabsContainer>
        <TopTab 
          $active={activeTopTab === "Payroll"}
          onClick={() => setActiveTopTab("Payroll")}
        >
          Payroll
        </TopTab>
        <TopTab 
          $active={activeTopTab === "Abstract"}
          onClick={() => setActiveTopTab("Abstract")}
        >
          Abstract
        </TopTab>
        <TopTab 
          $active={activeTopTab === "Finalized Payroll"}
          onClick={() => setActiveTopTab("Finalized Payroll")}
        >
          Finalized Payroll
        </TopTab>
      </TopTabsContainer>
      {renderTopTabContent()}

      {/* Download Payslips Modal */}
      {isDownloadModalOpen && (
        <ModalOverlay onClick={() => setIsDownloadModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitleContainer>
                <ModalTitle>Download Payslips</ModalTitle>
                <ModalSubtitle>Choose employee type and name before viewing the payslip.</ModalSubtitle>
              </ModalTitleContainer>
              <ModalCloseIcon onClick={() => setIsDownloadModalOpen(false)}>
                ×
              </ModalCloseIcon>
            </ModalHeader>
            <ModalBody>
              <FormField>
                <FieldLabel>Category</FieldLabel>
                <FormSelect 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All, Staff, Employee">All, Staff, Employee</option>
                  <option value="All">All</option>
                  <option value="Staff">Staff</option>
                  <option value="Employee">Employee</option>
                </FormSelect>
              </FormField>
              <FormField>
                <FieldLabel>Name</FieldLabel>
                <FormSelect 
                  value={selectedEmployee} 
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  <option value="">Select employee name</option>
                  {payrollData.map((emp) => (
                    <option key={emp.employeeId} value={emp.employeeId}>{emp.name}</option>
                  ))}
                </FormSelect>
              </FormField>
              <PreviewNotice>
                <PreviewIconContainer>
                  <PreviewIcon>👁️</PreviewIcon>
                </PreviewIconContainer>
                <PreviewText>
                  <PreviewTextTitle>Preview before download</PreviewTextTitle>
                  <PreviewTextDesc>Use View to open the selected payslip and confirm details before downloading.</PreviewTextDesc>
                </PreviewText>
              </PreviewNotice>
            </ModalBody>
            <ModalFooter>
              <ModalCloseButton onClick={() => setIsDownloadModalOpen(false)}>×</ModalCloseButton>
              <ModalViewButton onClick={() => {
                setIsDownloadModalOpen(false);
                // Find the selected employee from the payrollData array
                const employee = payrollData.find(emp => emp.employeeId === selectedEmployee);
                // Navigate to payslip page with state
                navigate("/admin/pay-hub/payslip", {
                  state: {
                    employeeName: employee ? employee.name : "Sangeetha",
                    employeeId: selectedEmployee || "EMP001",
                    department: employee ? employee.department : "IT",
                    state: "Tamil Nadu",
                    dateOfJoining: "10 Apr 2021",
                    pfNo: "TN/XXX/XXXXX",
                    esiNo: "XXXXX/XXXXX",
                    designation: employee ? employee.designation : "Store Manager",
                    uanNumber: "101042309812",
                    workingDays: "22",
                    monthYear: "April 2025",
                    netPayable: employee ? employee.takeHome : "₹9,800.00",
                    netPayableWords: "Rupees Nine Thousand Eight Hundred Only",
                    earnings: [
                      { label: "Basic Pay", amount: "₹9,000.00" },
                      { label: "House Rent Allowance", amount: "₹1,000.00" },
                      { label: "Conveyance", amount: "₹500.00" },
                      { label: "Medical Allowance", amount: "₹500.00" },
                      { label: "OT Pay", amount: "₹0.00" },
                    ],
                    deductions: [
                      { label: "Provident Fund", amount: "₹1,080.00" },
                      { label: "ESI", amount: "₹0.00" },
                      { label: "Professional Tax", amount: "₹0.00" },
                      { label: "TDS", amount: "₹0.00" },
                      { label: "Loss of Pay", amount: "₹0.00" },
                    ],
                  },
                });
              }}>View &gt;</ModalViewButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {showFilter && (
        <Filter
          onClose={() => setShowFilter(false)}
          onApply={handleFilterApply}
        />
      )}
    </Container>
  );
};

export default Payroll;

const Container = styled.div`
  width: 100%;
  padding: 1.5rem 0;
`;

const TopTabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;

`;

const TopTab = styled.button`
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Inter", sans-serif;
  background: ${props => props.$active ? theme.colors.primary : theme.colors.white};
  color: ${props => props.$active ? theme.colors.white : theme.colors.textColor};
  border: none;
  border-radius:7px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: -1px;
`;

const TableContainer = styled.div`
  background: ${theme.colors.white};
  border-radius: 0.75rem;
  overflow: hidden;
`;

const PlaceholderContent = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${theme.colors.secondaryText};
  font-size: 1rem;
  font-family: "Inter", sans-serif;
`;

const FinalizedPayrollContainer = styled.div`
  width: 100%;
`;

const FinalizedPayrollHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const HeaderTitle = styled.h2`
  font-family: "Inter", sans-serif;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const HeaderControls = styled.div`
  display: flex;
  gap: 1rem;
`;

const YearSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  color: ${theme.colors.textColor};
  background: ${theme.colors.white};
`;

const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  color: ${theme.colors.textColor};
  background: ${theme.colors.white};
  width: 300px;
  &::placeholder {
    color: ${theme.colors.secondaryText};
  }
`;

const PayrollCard = styled.div`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const CardLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MonthTitle = styled.h3`
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  background: ${props => props.$status === "Completed" ? "#E6F4EA" : theme.colors.secondaryPrimary};
  color: ${props => props.$status === "Completed" ? "#1E8E3E" : theme.colors.primary};
  font-family: "Inter", sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 6px;
`;

const CardRight = styled.div`
  text-align: right;
`;

const ProcessedText = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 0.75rem;
  color: ${theme.colors.secondaryText};
  margin: 0 0 0.5rem 0;
`;

const NetPayoutText = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div`
  background: ${props => props.$highlight ? theme.colors.secondaryPrimary : theme.colors.secondaryWhite};
  border-radius: 10px;
  padding: 1rem;
`;

const StatLabel = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 0.75rem;
  color: ${theme.colors.secondaryText};
  margin: 0 0 0.5rem 0;
`;

const StatValue = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.textColor};
  margin: 0 0 0.25rem 0;
`;

const StatCount = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 0.75rem;
  color: ${theme.colors.secondaryText};
  margin: 0;
`;

const CardBottom = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${theme.colors.white};
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  padding: 0;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  border-bottom: 1px solid ${theme.colors.border};
`;

const ModalTitleContainer = styled.div`
  flex: 1;
`;

const ModalTitle = styled.h2`
  font-family: "Inter", sans-serif;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${theme.colors.textColor};
  margin: 0 0 0.25rem 0;
`;

const ModalSubtitle = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 0.8125rem;
  color: ${theme.colors.secondaryText};
  margin: 0;
`;

const ModalCloseIcon = styled.button`
  background: ${theme.colors.secondaryWhite};
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  font-size: 1rem;
  color: ${theme.colors.textColor};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`;

const ModalBody = styled.div`
  padding: 1rem;
`;

const FormField = styled.div`
  margin-bottom: 1rem;
`;

const FieldLabel = styled.label`
  display: block;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${theme.colors.textColor};
  margin-bottom: 0.5rem;
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 10px;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  color: ${theme.colors.textColor};
  background: ${theme.colors.white};
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const PreviewNotice = styled.div`
  background: ${theme.colors.secondaryPrimary};
  border-radius: 12px;
  padding: 0.875rem;
  display: flex;
  gap: 0.875rem;
  margin-top: 1rem;
`;

const PreviewIconContainer = styled.div`
  width: 36px;
  height: 36px;
  background: ${theme.colors.white};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const PreviewIcon = styled.span`
  font-size: 1.125rem;
`;

const PreviewText = styled.div`
  flex: 1;
`;

const PreviewTextTitle = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${theme.colors.textColor};
  margin: 0 0 0.25rem 0;
`;

const PreviewTextDesc = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 0.8125rem;
  color: ${theme.colors.secondaryText};
  margin: 0;
  line-height: 1.4;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1rem 1rem 1rem;
`;

const ModalCloseButton = styled.button`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  width: 40px;
  height: 40px;
  border-radius: 8px;
  font-size: 1.25rem;
  color: ${theme.colors.textColor};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`;

const ModalViewButton = styled.button`
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  padding: 0.875rem 1.75rem;
  border-radius: 8px;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;




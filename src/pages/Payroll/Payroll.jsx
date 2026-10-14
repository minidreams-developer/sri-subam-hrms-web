import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import ReusableTable from "../../components/ReusableTable";
import TableToolbar from "../../components/TableToolbar";
import DotIcon from "../../assets/images/Overtime/actionDot.svg";
import Button from "../../components/Button";
import Filter from "../../components/filter";
import { getDepartments, getFinalizedPayrollPeriods, getPayroll, getPayrollPeriods, getShifts, getPayrollPayslipOptions } from "../../services/apiServices";
import { toast } from "react-toastify";

const Payroll = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Department");
  const [departmentId, setDepartmentId] = useState("");
  const [shift, setShift] = useState("All Shifts");
  const [shiftId, setShiftId] = useState("");
  const [activeTopTab, setActiveTopTab] = useState("Payroll");
  const [activeInnerTab, setActiveInnerTab] = useState("Employees");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [payrollPeriods, setPayrollPeriods] = useState([]);
  const [periodsLoading, setPeriodsLoading] = useState(false);
  const [finalizedPeriods, setFinalizedPeriods] = useState([]);
  const [finalizedLoading, setFinalizedLoading] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [dropdownUsers, setDropdownUsers] = useState([]);
  const [dropdownUsersLoading, setDropdownUsersLoading] = useState(false);
  const [downloadPeriod, setDownloadPeriod] = useState({ year: 2026, month: 10 });
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
    if (activeTopTab === "Abstract" && !selectedPeriod) return;
    if (activeTopTab === "Payroll" || selectedPeriod) fetchPayrollData();
  }, [currentPage, pageSize, activeInnerTab, departmentId, shiftId, selectedPeriod, activeTopTab]);

  useEffect(() => {
    if (activeTopTab !== "Abstract") return;
    setPeriodsLoading(true);
    getPayrollPeriods({ year: 2026 })
      .then((response) => setPayrollPeriods(Array.isArray(response) ? response : response?.data || []))
      .catch(() => {
        setPayrollPeriods([]);
        toast.error("Failed to fetch payroll periods");
      })
      .finally(() => setPeriodsLoading(false));
  }, [activeTopTab]);

  useEffect(() => {
    if (activeTopTab !== "Finalized Payroll") return;
    setFinalizedLoading(true);
    getFinalizedPayrollPeriods({ year: selectedYear })
      .then((response) => setFinalizedPeriods(Array.isArray(response) ? response : response?.data || []))
      .catch(() => {
        setFinalizedPeriods([]);
        toast.error("Failed to fetch finalized payroll periods");
      })
      .finally(() => setFinalizedLoading(false));
  }, [activeTopTab, selectedYear]);

  // Load dropdown data once when Payroll opens.
  useEffect(() => {
    fetchDepartmentsAndShifts();
  }, []);

  useEffect(() => {
    if (!isDownloadModalOpen) return;

    setDropdownUsersLoading(true);
    setSelectedEmployee("");
    getPayrollPayslipOptions({
      year: downloadPeriod.year,
      month: downloadPeriod.month,
      category: selectedCategory.toLowerCase(),
    })
      .then((response) => setDropdownUsers(
        Array.isArray(response) ? response : response?.data || response?.results || [],
      ))
      .catch(() => {
        setDropdownUsers([]);
        toast.error("Failed to load employee names");
      })
      .finally(() => setDropdownUsersLoading(false));
  }, [isDownloadModalOpen, selectedCategory, downloadPeriod]);

  const fetchPayrollData = async () => {
    setLoading(true);
    try {
      const roleByTab = {
        Employees: "employee",
        Staff: "staff",
        Staffs: "staff",
        Contractors: "contractor",
        Agents: "agent",
      };
      const response = await getPayroll({
        page: currentPage,
        limit: pageSize,
        role: roleByTab[activeInnerTab] || "employee",
        ...(departmentId ? { departmentId } : {}),
        ...(shiftId ? { shiftId } : {}),
        ...(selectedPeriod ? { month: selectedPeriod.month, year: selectedPeriod.year } : {}),
      });
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
        payrollId: item.payrollId || item._id || item.id,
        employeeId: item.employeeId,
        name: item.name,
        designation: item.designation,
        department: item.department,
        fullDay: item.fullDays || 0,
        overTimeHours: `${item.overtimeHours || 0} hrs`,
        addition: item.additionName || "Travel allowance",
        deduction: item.deductionName || "Travel allowance",
        cash: item.cashDisbursement || 0,
        bank: item.bankDisbursement || item.takeHome || 0,
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
    let url = "/v1/payroll";
    
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
    const roleByTab = { Employees: "employee", Staff: "staff", Staffs: "staff", Contractors: "contractor", Agents: "agent" };
    url += (url.includes('?') ? '&' : '?') + `role=${roleByTab[activeInnerTab] || "employee"}`;
    
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
      const deptResponse = await getDepartments();
      console.log("Departments response:", deptResponse);
      
      // Handle different response structures
      const deptList = deptResponse?.results || deptResponse?.data || deptResponse || [];
      
      // Transform to dropdown options
      const deptOptions = deptList.map((dept) => ({
        value: dept.departmentName || dept.name || "N/A",
        id: dept._id || dept.id || dept.departmentId,
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
        value: shift.shiftName || shift.name || "N/A",
        label: shift.shiftName || shift.name || "N/A",
        id: shift._id || shift.id || shift.shiftId,
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

  const handleDepartmentChange = (value) => {
    setDepartment(value);
    const selected = departmentOptions.find((option) => option.value === value);
    setDepartmentId(value === "All Department" ? "" : selected?.id || "");
    setCurrentPage(1);
  };

  const handleShiftChange = (value) => {
    setShift(value);
    const selected = shiftOptions.find((option) => option.value === value);
    setShiftId(value === "All Shifts" ? "" : selected?.id || "");
    setCurrentPage(1);
  };

  const fetchPayrollDataWithFilters = async (url) => {
    setLoading(true);
    try {
      const response = await getPayroll(Object.fromEntries(new URL(url, window.location.origin).searchParams));
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
        payrollId: item.payrollId || item._id || item.id,
        employeeId: item.employeeId,
        name: item.name,
        designation: item.designation,
        department: item.department,
        fullDay: item.fullDays || 0,
        overTimeHours: `${item.overtimeHours || 0} hrs`,
        addition: item.additionName || "Travel allowance",
        deduction: item.deductionName || "Travel allowance",
        cash: item.cashDisbursement || 0,
        bank: item.bankDisbursement || item.takeHome || 0,
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
    { header: "S. No.", accessor: "serialNo" },
    { header: "Employee ID", accessor: "employeeId" },
    { header: "Name", accessor: "name" },
    { header: "Basic pay", accessor: "dailyWages" },
    { header: "Department", accessor: "department" },
    { header: "Position", accessor: "designation" },
    { header: "Work Days", accessor: "fullDay" },
    { header: "OT Hrs", accessor: "overTimeHours" },
    { header: "OT Pay", accessor: "overTime" },
    { header: "Gross salary", accessor: "grossWages" },
    { header: "Addition", accessor: "addition" },
    { header: "Total Salary", accessor: "grossEarnings" },
    { header: "Deduction", accessor: "deduction" },
    { header: "Payable Salary", accessor: "takeHome" },
    { header: "Disbursement type (Cash)", accessor: "cash" },
    { header: "Disbursement type (Bank)", accessor: "bank" },
  ];

  const payrollColumns = [
    { header: "S. No.", accessor: "serialNo" },
    { header: "Employee ID", accessor: "employeeId" },
    { header: "Name", accessor: "name" },
    { header: "Designation", accessor: "designation" },
    { header: "Dept.", accessor: "department" },
    { header: "Full Day", accessor: "fullDay" },
    { header: "Half Day", accessor: "halfDay" },
    { header: "Off Days", accessor: "offDays" },
    { header: "Paid Leaves", accessor: "paidLeaves" },
    { header: "Unpaid Leaves", accessor: "unpaidLeaves" },
    { header: "Basic pay", accessor: "dailyWages" },
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
      overTimeHours: "1.5 hrs",
      addition: "Travel allowance  ₹1,000",
      deduction: "Travel allowance  ₹1,000",
      cash: "₹2,000",
      bank: "₹2,000",
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
      overTimeHours: "1.5 hrs",
      addition: "Travel allowance  ₹1,000",
      deduction: "Travel allowance  ₹1,000",
      cash: "₹2,000",
      bank: "₹2,000",
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
      overTimeHours: "1.5 hrs",
      addition: "Travel allowance  ₹1,000",
      deduction: "Travel allowance  ₹1,000",
      cash: "₹2,000",
      bank: "₹2,000",
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
      overTimeHours: "1.5 hrs",
      addition: "Travel allowance  ₹1,000",
      deduction: "Travel allowance  ₹1,000",
      cash: "₹2,000",
      bank: "₹2,000",
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
      overTimeHours: "1.5 hrs",
      addition: "Travel allowance  ₹1,000",
      deduction: "Travel allowance  ₹1,000",
      cash: "₹2,000",
      bank: "₹2,000",
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
    if (activeTopTab === "Abstract" && !selectedPeriod) {
      return (
        <PeriodsContainer>
          <PeriodsHeader>
            <div>
              <HeaderTitle>Payroll Periods</HeaderTitle>
              <PeriodsSubtitle>Track live and pending payroll cycles by month.</PeriodsSubtitle>
            </div>
            <YearPill>2026 Payroll Timeline</YearPill>
          </PeriodsHeader>
          <PeriodsPanel>
            <PeriodsPanelHeader>
              <div><PanelTitle>Monthly Payroll Periods</PanelTitle><PeriodsSubtitle>Open a period to review payroll figures before finalisation.</PeriodsSubtitle></div>
              <PeriodsCount>{payrollPeriods.length} payroll periods</PeriodsCount>
            </PeriodsPanelHeader>
            {periodsLoading ? <PlaceholderContent>Loading payroll periods...</PlaceholderContent> : payrollPeriods.map((period) => (
              <PeriodCard key={`${period.year}-${period.month}`} onClick={() => { setSelectedPeriod(period); setCurrentPage(1); }}>
                <PeriodIcon>{period.status === "finalized" ? "✓" : "◷"}</PeriodIcon>
                <div><PeriodTitle>{new Date(period.year, period.month - 1).toLocaleString("en-IN", { month: "long", year: "numeric" })} <PeriodStatus $finalized={period.status === "finalized"}>{period.status === "finalized" ? "Finalized" : "Payroll Not finalised"}</PeriodStatus></PeriodTitle><PeriodDescription>Review payroll figures before sending this month to abstract and finalisation.</PeriodDescription></div>
                <PeriodPayout><PayoutLabel>{period.payoutType === "final" ? "Final payout" : "Draft payout"}</PayoutLabel><strong>₹{Number(period.payout || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></PeriodPayout>
              </PeriodCard>
            ))}
          </PeriodsPanel>
        </PeriodsContainer>
      );
    }
    if (activeTopTab === "Abstract" || activeTopTab === "Payroll") {
      return (
        <>
          <PayrollControls>
            {activeTopTab === "Abstract" && <BackToPeriods type="button" onClick={() => setSelectedPeriod(null)}>← Back to payroll periods</BackToPeriods>}
            <RoleTabs>
              {(activeTopTab === "Payroll" ? ["Employees", "Staffs"] : ["Employees", "Staff", "Contractors", "Agents"]).map((tab) => (
                <RoleTab key={tab} $active={activeInnerTab === tab} onClick={() => setActiveInnerTab(tab)}>
                  {tab}
                </RoleTab>
              ))}
            </RoleTabs>
            <TableToolbar
              searchPlaceholder="Search Employee"
              searchValue={search}
              onSearchChange={setSearch}
              select1Options={["All Department", ...departmentOptions.map(d => d.value)]}
              select1Value={department}
              onSelect1Change={handleDepartmentChange}
              select2Options={["All Shifts", ...shiftOptions.map(s => s.value)]}
              select2Value={shift}
              onSelect2Change={handleShiftChange}
              showFilter={true}
              filterText="Filter"
              showDotIcon={true}
              dotIcon={DotIcon}
              searchPosition="left"
              onFilterClick={() => setShowFilter(true)}
              widths={{ search: "22.25rem", select: "12.5rem" }}
            />
          </PayrollControls>
          <TableContainer>
            <ReusableTable 
              columns={activeTopTab === "Payroll" ? payrollColumns : columns}
              data={payrollData
                .filter((row) => !search || `${row.employeeId} ${row.name}`.toLowerCase().includes(search.toLowerCase()))
                .map((row, index) => ({ ...row, serialNo: String(index + 1).padStart(2, "0") }))}
              rowsPerPage={pageSize}
              totalResults={totalResults}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              server={true}
              isLoading={loading}
            />
          </TableContainer>
          {activeTopTab === "Abstract" && (
              <FinalizeRow>
              <FinalizeButton type="button">Finalize Payroll</FinalizeButton>
            </FinalizeRow>
          )}
        </>
      );
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
                <option value="2026">2026</option>
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
          {finalizedLoading ? <PlaceholderContent>Loading finalized payroll...</PlaceholderContent> : finalizedPeriods.length === 0 ? (
            <EmptyPayrollState>No finalized payroll available for {selectedYear}.</EmptyPayrollState>
          ) : finalizedPeriods.map((item, index) => {
            const monthLabel = new Date(item.year, item.month - 1).toLocaleString("en-IN", { month: "long", year: "numeric" });
            const breakdown = item.breakdown || {};
            const formatAmount = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
            return (
            <PayrollCard key={index}>
              <CardTop>
                <CardLeft>
                  <MonthTitle>{monthLabel}</MonthTitle>
                  <StatusBadge $status="Completed">Completed</StatusBadge>
                </CardLeft>
                <CardRight>
                  <ProcessedText>Finalized on {new Date(item.finalizedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</ProcessedText>
                  <NetPayoutText>Total Payout {formatAmount(item.totalPayout)}</NetPayoutText>
                </CardRight>
              </CardTop>
              <StatsRow>
                <StatCard $highlight>
                  <StatLabel>Net Payout</StatLabel>
                  <StatValue>{formatAmount(item.netPayout)}</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>Staff</StatLabel>
                  <StatValue>{formatAmount(breakdown.staff?.amount)}</StatValue>
                  <StatCount>{breakdown.staff?.count || 0} people</StatCount>
                </StatCard>
                <StatCard>
                  <StatLabel>Employees</StatLabel>
                  <StatValue>{formatAmount(breakdown.employees?.amount)}</StatValue>
                  <StatCount>{breakdown.employees?.count || 0} people</StatCount>
                </StatCard>
                <StatCard>
                  <StatLabel>Agents</StatLabel>
                  <StatValue>{formatAmount(breakdown.agents?.amount)}</StatValue>
                  <StatCount>{breakdown.agents?.count || 0} people</StatCount>
                </StatCard>
                <StatCard>
                  <StatLabel>Contractors</StatLabel>
                  <StatValue>{formatAmount(breakdown.contractors?.amount)}</StatValue>
                  <StatCount>{breakdown.contractors?.count || 0} people</StatCount>
                </StatCard>
              </StatsRow>
              <CardBottom>
                <Button 
                  text="Download Payslips" 
                  bg={theme.colors.white}
                  color={theme.colors.primary}
                  border={`1px solid ${theme.colors.border}`}
                  onClick={() => {
                    setDownloadPeriod({ year: item.year, month: item.month });
                    setIsDownloadModalOpen(true);
                  }}
                />
                <Button 
                  text="View Abstract" 
                  bg={theme.colors.primary}
                  color={theme.colors.white}
                  onClick={() => { setSelectedPeriod({ month: item.month, year: item.year }); setActiveTopTab("Abstract"); }}
                />
              </CardBottom>
            </PayrollCard>
            );
          })}
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
          onClick={() => { setActiveTopTab("Abstract"); setSelectedPeriod(null); }}
        >
          Abstract
        </TopTab>
        <TopTab 
          $active={activeTopTab === "Finalized Payroll"}
          onClick={() => setActiveTopTab("Finalized Payroll")}
        >
          Finalized Payroll
        </TopTab>
        {activeTopTab === "Abstract" && (
          <ExportButton type="button" onClick={() => window.print()}>Export Data</ExportButton>
        )}
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
                  <option value="All">All</option>
                  <option value="Staff">Staff</option>
                  <option value="Employee">Employee</option>
                  <option value="Agent">Agent</option>
                  <option value="Contractor">Contractor</option>
                </FormSelect>
              </FormField>
              <FormField>
                <FieldLabel>Name</FieldLabel>
                <FormSelect 
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  <option value="">Select employee name</option>
                  {dropdownUsersLoading ? (
                    <option value="" disabled>Loading names...</option>
                  ) : dropdownUsers.map((user) => (
                    <option key={user.payrollId} value={user.payrollId}>
                      {user.name}{user.employeeId ? ` (${user.employeeId})` : ""}
                    </option>
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
                const employee = dropdownUsers.find((user) => user.payrollId === selectedEmployee);
                if (!employee?.payrollId) {
                  toast.error("Please select an employee");
                  return;
                }
                setIsDownloadModalOpen(false);
                // Navigate to payslip page with state
                navigate("/admin/pay-hub/payslip", {
                  state: {
                    payrollId: employee.payrollId,
                    employeeName: employee ? employee.name : "Sangeetha",
                    employeeId: employee?.employeeId || selectedEmployee || "EMP001",
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
  padding: 0.5rem 0 1.5rem;
`;

const TopTabsContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0;
  margin-bottom: 1.5rem;
  background: transparent;
`;

const TopTab = styled.button`
  padding: 0.5rem 1rem;
  min-height: 40px;
  font-size: 14px;
  line-height: 1.6;
  font-weight: 600;
  font-family: "Inter", sans-serif;
  background: ${props => props.$active ? theme.colors.primary : "transparent"};
  color: ${props => props.$active ? theme.colors.white : theme.colors.textColor};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const ExportButton = styled.button`
  margin-left: auto;
  width: 154px;
  height: 40px;
  border: 1px solid ${theme.colors.primary};
  border-radius: 10px;
  background: transparent;
  color: ${theme.colors.primary};
  font: 600 14px/1.6 "Inter", sans-serif;
  cursor: pointer;
`;

const RoleTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  min-height: 40px;
  border-bottom: 1px solid #e0e3e6;
`;

const RoleTab = styled.button`
  align-self: stretch;
  padding: 0 4px;
  border: 0;
  border-bottom: 2px solid ${(props) => props.$active ? theme.colors.primary : "transparent"};
  background: transparent;
  color: ${(props) => props.$active ? theme.colors.primary : theme.colors.textColor};
  font: 600 14px/1.6 "Inter", sans-serif;
  cursor: pointer;
`;

const PayrollControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  > div:first-child {
    margin: 0;
  }

  > div:nth-child(2) {
    margin-bottom: 1.5rem;
  }

  @media (max-width: 1100px) {
    > div:nth-child(2) {
      align-items: flex-start;
      flex-direction: column;
    }
  }
`;

const TableContainer = styled.div`
  background: ${theme.colors.white};
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid #e0e3e6;
  padding: 1rem;

  table {
    min-width: 2788px;
  }

  th {
    padding-top: 0.25rem;
    padding-bottom: 0.75rem;
  }

  th:first-child,
  td:first-child {
    min-width: 64px;
  }

  th:nth-child(2),
  td:nth-child(2) {
    min-width: 120px;
  }

  th:nth-child(3),
  td:nth-child(3) {
    min-width: 190px;
  }

  th:nth-child(4),
  td:nth-child(4) {
    min-width: 180px;
  }

  td {
    height: 48px;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    white-space: nowrap;
  }
`;

const FinalizeRow = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;
`;

const FinalizeButton = styled.button`
  min-width: 212px;
  height: 40px;
  padding: 8px 16px;
  border: 0;
  border-radius: 8px;
  background: ${theme.colors.primary};
  color: #edf6f9;
  font: 600 16px/1.5 "Inter", sans-serif;
  cursor: pointer;
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

const EmptyPayrollState = styled.div`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 12px;
  padding: 3rem 1rem;
  text-align: center;
  color: ${theme.colors.secondaryText};
  font-size: 0.875rem;
`;

const PeriodsContainer = styled.div`
  background: ${theme.colors.white};
  border-radius: 12px;
  padding: 2rem;
  min-height: 520px;
`;

const PeriodsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const PeriodsSubtitle = styled.p`
  margin: 0.25rem 0 0;
  color: ${theme.colors.secondaryText};
  font-size: 0.8125rem;
`;

const YearPill = styled.div`
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: ${theme.colors.secondaryText};
  font-size: 0.8125rem;
`;

const PeriodsPanel = styled.div`
  border: 1px solid ${theme.colors.border};
  border-radius: 10px;
  padding: 1rem;
`;

const PeriodsPanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 0.25rem 1rem;
  border-bottom: 1px solid ${theme.colors.border};
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 0.875rem;
`;

const PeriodsCount = styled.span`
  color: ${theme.colors.secondaryText};
  font-size: 0.8125rem;
`;

const PeriodCard = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
  margin-top: 0.75rem;
  padding: 1rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 10px;
  background: ${theme.colors.white};
  cursor: pointer;
  &:hover { border-color: ${theme.colors.primary}; background: #f4fbfc; }
`;

const PeriodIcon = styled.span`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: #f1f3f4;
  color: ${theme.colors.primary};
  font-size: 1.1rem;
`;

const PeriodTitle = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
`;

const PeriodStatus = styled.span`
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  font-size: 0.6875rem;
  color: ${theme.colors.white};
  background: ${(props) => props.$finalized ? "#16808b" : "#16808b"};
`;

const PeriodDescription = styled.p`
  margin: 0.3rem 0 0;
  color: ${theme.colors.secondaryText};
  font-size: 0.75rem;
`;

const PeriodPayout = styled.div`
  margin-left: auto;
  text-align: right;
  min-width: 130px;
  strong { display: block; font-size: 0.875rem; }
`;

const PayoutLabel = styled.span`
  color: ${theme.colors.secondaryText};
  font-size: 0.75rem;
`;

const BackToPeriods = styled.button`
  align-self: flex-start;
  border: 0;
  background: transparent;
  color: ${theme.colors.primary};
  font-weight: 600;
  cursor: pointer;
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




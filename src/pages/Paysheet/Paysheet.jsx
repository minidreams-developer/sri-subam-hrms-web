import { useState, useEffect } from "react";
import styled from "styled-components";
import theme from "../../theme/theme";
import SearchInputComponent from "../../components/SearchInputComponent";
import Button from "../../components/Button";
import ReusableTable from "../../components/ReusableTable";
import FilterIcon from "../../assets/images/DashboardImages/filtericon.svg";
import DotMenuIcon from "../../assets/images/DayOff/dot-menu.svg";
import PlusIcon from "../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import GreenArrow from "../../assets/images/DashboardImages/green.svg";
import RedArrow from "../../assets/images/DashboardImages/red.svg";
import Filter from "../../components/filter";
import AddPayroll from "./AddPayroll";
import { getPaysheetBreakdown, getPaysheetDetail, getPaysheetOverview, getPaysheetQuickStats, getPaysheets, updatePaysheetStatus } from "../../services/apiServices";
import { toast } from "react-toastify";

const Paysheet = () => {
  const [selectedMonth, setSelectedMonth] = useState("This Month");
  const [selectedYear, setSelectedYear] = useState("This Year");
  const [selectedPayrollMonth, setSelectedPayrollMonth] = useState("This Month");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showAddPayroll, setShowAddPayroll] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [quickStatsData, setQuickStatsData] = useState(null);
  const [payrollOverviewData, setPayrollOverviewData] = useState(null);
  const [payrollBreakdownData, setPayrollBreakdownData] = useState(null);
  const [payrollListData, setPayrollListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openActionId, setOpenActionId] = useState(null);
  const [modal, setModal] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const unwrap = (response) => response?.data || response;
  const getRows = (response) => {
    const payload = unwrap(response);
    return payload?.results || payload?.items || payload?.paysheets || (Array.isArray(payload) ? payload : []);
  };

  // Get current month and year for API
  const getCurrentMonth = () => new Date().getMonth() + 1;
  const getCurrentYear = () => new Date().getFullYear();

  useEffect(() => {
    fetchPaysheetData();
  }, [currentPage, selectedMonth, selectedPayrollMonth, searchQuery, appliedFilters]);

  useEffect(() => {
    const year = selectedYear === "Last Year" ? getCurrentYear() - 1 : getCurrentYear();
    getPaysheetOverview({ year })
      .then((response) => setPayrollOverviewData(unwrap(response)))
      .catch((error) => console.error("Error fetching payroll overview:", error));
  }, [selectedYear]);

  const fetchPaysheetData = async () => {
    setLoading(true);
    try {
      const month = getCurrentMonth();
      const year = getCurrentYear();
      const listParams = {
        month,
        year,
        page: currentPage,
        limit: 10,
        ...(searchQuery ? { search: searchQuery } : {}),
        ...(appliedFilters || {}),
      };

      // Fetch quick stats
      const quickStats = await getPaysheetQuickStats({ month, year });
      if (quickStats) {
        setQuickStatsData(quickStats.quickStats);
      }

      // Fetch payroll breakdown
      const payrollBreakdown = await getPaysheetBreakdown({ month, year });
      if (payrollBreakdown) {
        setPayrollBreakdownData(payrollBreakdown.payrollBreakdown);
      }

      // Fetch payroll list
      const payrollList = await getPaysheets(listParams);
      if (payrollList) {
        const payload = unwrap(payrollList);
        setPayrollListData(getRows(payrollList));
        setTotalPages(payload.totalPages || payload.pagination?.totalPages || Math.ceil((payload.total || payload.pagination?.total || 0) / 10) || 1);
      }
    } catch (error) {
      console.error("Error fetching paysheet data:", error);
      toast.error("Failed to fetch paysheet data");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterApply = (queryParams) => {
    console.log("Applied filter query params:", queryParams);
    setAppliedFilters(queryParams);
    setShowFilter(false);
    setCurrentPage(1);
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    setCurrentPage(1);
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
    setCurrentPage(1);
  };

  const handlePayrollMonthChange = (value) => {
    setSelectedPayrollMonth(value);
    setCurrentPage(1);
  };

  const handleAddPayrollSubmit = (payrollData) => {
    console.log("Payroll data submitted:", payrollData);
    toast.success("Payroll added successfully");
    setShowAddPayroll(false);
    fetchPaysheetData();
  };

  const openViewModal = async (row) => {
    setOpenActionId(null);
    setModal({ type: "view", row });
    setSelectedDetail(null);
    try {
      const detail = await getPaysheetDetail(row.id);
      setSelectedDetail(detail?.data || detail);
    } catch (error) {
      toast.error("Failed to load payroll details");
    }
  };

  const openStatusModal = (row) => {
    setOpenActionId(null);
    setSelectedStatus(String(row.status || "draft").toLowerCase());
    setModal({ type: "status", row });
  };

  const saveStatus = async () => {
    if (!modal?.row?.id || !selectedStatus) return;
    setActionLoading(true);
    try {
      await updatePaysheetStatus(modal.row.id, { status: selectedStatus });
      toast.success("Payroll status updated");
      setModal(null);
      await fetchPaysheetData();
    } catch (error) {
      toast.error("Failed to update payroll status");
    } finally {
      setActionLoading(false);
    }
  };

  const quickStats = quickStatsData ? [
    { 
      label: "Total Salary", 
      value: `₹${(quickStatsData.totalSalary?.amount || 0).toLocaleString('en-IN')}`, 
      percentage: `${quickStatsData.totalSalary?.percentageChange || 0}%`, 
      isPositive: (quickStatsData.totalSalary?.percentageChange || 0) >= 0 
    },
    { 
      label: "Total Incentive", 
      value: `₹${(quickStatsData.totalIncentive?.amount || 0).toLocaleString('en-IN')}`, 
      percentage: `${quickStatsData.totalIncentive?.percentageChange || 0}%`, 
      isPositive: (quickStatsData.totalIncentive?.percentageChange || 0) >= 0 
    },
    { 
      label: "Total Deductions", 
      value: `₹${(quickStatsData.totalDeductions?.amount || 0).toLocaleString('en-IN')}`, 
      percentage: `${quickStatsData.totalDeductions?.percentageChange || 0}%`, 
      isPositive: (quickStatsData.totalDeductions?.percentageChange || 0) >= 0 
    },
    { 
      label: "Payable Employees", 
      value: (quickStatsData.payableEmployees?.count || 0).toString(), 
      percentage: `${quickStatsData.payableEmployees?.percentageChange || 0}%`, 
      isPositive: (quickStatsData.payableEmployees?.percentageChange || 0) >= 0 
    },
    { 
      label: "On Hold Employees", 
      value: (quickStatsData.onHoldEmployees?.count || 0).toString(), 
      percentage: `${quickStatsData.onHoldEmployees?.percentageChange || 0}%`, 
      isPositive: (quickStatsData.onHoldEmployees?.percentageChange || 0) >= 0 
    },
  ] : [
    { label: "Total Salary", value: "₹0", percentage: "0%", isPositive: true },
    { label: "Total Incentive", value: "₹0", percentage: "0%", isPositive: true },
    { label: "Total Deductions", value: "₹0", percentage: "0%", isPositive: true },
    { label: "Payable Employees", value: "0", percentage: "0%", isPositive: false },
    { label: "On Hold Employees", value: "0", percentage: "0%", isPositive: true },
  ];

  const payrollBreakdown = payrollBreakdownData ? [
    { 
      label: "Salary", 
      value: `₹ ${(payrollBreakdownData.categories?.salary?.amount || 0).toLocaleString('en-IN')}`, 
      percentage: `${payrollBreakdownData.categories?.salary?.percentage || 0}%`, 
      color: "#0B7A75" 
    },
    { 
      label: "Allowances", 
      value: `₹ ${(payrollBreakdownData.categories?.allowances?.amount || 0).toLocaleString('en-IN')}`, 
      percentage: `${payrollBreakdownData.categories?.allowances?.percentage || 0}%`, 
      color: "#FDB750" 
    },
    { 
      label: "Deduction", 
      value: `₹ ${(payrollBreakdownData.categories?.deductions?.amount || 0).toLocaleString('en-IN')}`, 
      percentage: `${payrollBreakdownData.categories?.deductions?.percentage || 0}%`, 
      color: "#E0E3E6" 
    },
    { 
      label: "Incentives", 
      value: `₹ ${(payrollBreakdownData.categories?.incentives?.amount || 0).toLocaleString('en-IN')}`, 
      percentage: `${payrollBreakdownData.categories?.incentives?.percentage || 0}%`, 
      color: "#0B7A75" 
    },
    { 
      label: "Overtime", 
      value: `₹ ${(payrollBreakdownData.categories?.overtime?.amount || 0).toLocaleString('en-IN')}`, 
      percentage: `${payrollBreakdownData.categories?.overtime?.percentage || 0}%`, 
      color: "#2C2C2C" 
    },
  ] : [
    { label: "Salary", value: "₹ 0", percentage: "0%", color: "#0B7A75" },
    { label: "Allowances", value: "₹ 0", percentage: "0%", color: "#FDB750" },
    { label: "Deduction", value: "₹ 0", percentage: "0%", color: "#E0E3E6" },
    { label: "Incentives", value: "₹ 0", percentage: "0%", color: "#0B7A75" },
    { label: "Overtime", value: "₹ 0", percentage: "0%", color: "#2C2C2C" },
  ];

  const payrollData = payrollListData.map((item) => ({
    id: item._id,
    name: item.name || "N/A",
    employeeId: `#${item.empCode || "N/A"}`,
    department: item.designation || "N/A",
    subDepartment: item.department || "N/A",
    issueDate: item.issueDate ? new Date(item.issueDate).toLocaleDateString('en-IN') : "N/A",
    ot: `₹${(item.overtime || 0).toLocaleString('en-IN')}`,
    total: `₹${(item.salary || 0).toLocaleString('en-IN')}`,
    amount: `₹${(item.total || 0).toLocaleString('en-IN')}`,
    status: item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || "N/A",
    avatar: item.profilePic,
  }));

  const chartMonths = payrollOverviewData?.monthlyData || [
    { month: "Jan", salary: 0, overtime: 0, incentives: 0 },
    { month: "Feb", salary: 0, overtime: 0, incentives: 0 },
    { month: "Mar", salary: 0, overtime: 0, incentives: 0 },
    { month: "Apr", salary: 0, overtime: 0, incentives: 0 },
    { month: "May", salary: 0, overtime: 0, incentives: 0 },
    { month: "Jun", salary: 0, overtime: 0, incentives: 0 },
    { month: "Jul", salary: 0, overtime: 0, incentives: 0 },
  ];
  const chartMax = Math.max(
    ...chartMonths.map((item) =>
      Math.max(item.salary || 0, item.overtime || 0, item.incentives || 0),
    ),
    1,
  );
  const chartAxisValues = [1, 0.75, 0.5, 0.25, 0].map((ratio) =>
    `₹ ${Math.round((chartMax * ratio) / 1000).toLocaleString('en-IN')}K`,
  );

  const totalPayThisMonth = payrollBreakdownData?.totalPayThisMonth || 0;

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "#10B981";
      case "Pending":
        return "#F59E0B";
      case "Canceled":
        return "#EF4444";
      default:
        return theme.colors.textColor;
    }
  };

  const columns = [
    {
      header: "Name",
      key: "name",
      render: (row) => (
        <EmployeeInfo>
          <Avatar>{row.name.charAt(0)}</Avatar>
          <EmployeeDetails>
            <EmployeeName>{row.name}</EmployeeName>
            <EmployeeId>{row.employeeId}</EmployeeId>
          </EmployeeDetails>
        </EmployeeInfo>
      ),
    },
    {
      header: "Department",
      key: "department",
      render: (row) => (
        <DepartmentInfo>
          <DepartmentName>{row.department}</DepartmentName>
          <SubDepartment>{row.subDepartment}</SubDepartment>
        </DepartmentInfo>
      ),
    },
    {
      header: "Issue Date",
      key: "issueDate",
    },
    {
      header: "OT",
      key: "ot",
    },
    {
      header: "Total",
      key: "total",
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <StatusBadge $color={getStatusColor(row.status)}>{row.status}</StatusBadge>
      ),
    },
    {
      header: "Action",
      key: "actions",
      render: (row) => (
        <ActionCell>
          <ActionButton type="button" aria-label="Payroll actions" onClick={() => setOpenActionId(openActionId === row.id ? null : row.id)}>
            <img src={DotMenuIcon} alt="menu" width="20" height="20" />
          </ActionButton>
          {openActionId === row.id && (
            <ActionMenu>
              <MenuButton type="button" onClick={() => openViewModal(row)}>View</MenuButton>
              <MenuButton type="button" onClick={() => openStatusModal(row)}>Change Status</MenuButton>
              <MenuButton type="button" onClick={() => setOpenActionId(null)}>Close</MenuButton>
            </ActionMenu>
          )}
        </ActionCell>
      ),
    },
  ];

  return (
    <Container>
      {/* Quick Stats Section */}
      <QuickStatsSection>
        <SectionHeader>
          <SectionTitle>Quick Stats</SectionTitle>
          <HeaderRight>
            <DropdownSelect value={selectedMonth} onChange={(e) => handleMonthChange(e.target.value)}>
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
      </QuickStatsSection>

      {/* Charts Section */}
      
      <ChartsSection>
        {/* Payroll Overview */}
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Payroll Overview</ChartTitle>
            <DropdownSelect value={selectedYear} onChange={(e) => handleYearChange(e.target.value)}>
              <option>This Year</option>
              <option>Last Year</option>
            </DropdownSelect>
          </ChartHeader>
          <ChartLegend>
            <LegendItem>
              <LegendDot $color="#0B7A75" />
              <LegendText>Salary</LegendText>
            </LegendItem>
            <LegendItem>
              <LegendDot $color="#FDB750" />
              <LegendText>Overtime</LegendText>
            </LegendItem>
            <LegendItem>
              <LegendDot $color="#E0E3E6" />
              <LegendText>Incentives</LegendText>
            </LegendItem>
          </ChartLegend>
          <ChartPlaceholder>
            {/* Bar chart with Y-axis */}
            <YAxisLabels>
              {chartAxisValues.map((label) => <YAxisLabel key={label}>{label}</YAxisLabel>)}
            </YAxisLabels>
            <BarChartContainer>
              {chartMonths.map((item) => (
                <BarGroup key={item.month}>
                  <BarStack>
                    <ChartBar
                      $tooltip={`${item.month} Incentives: ₹${(item.incentives || 0).toLocaleString('en-IN')}`}
                      $height={((item.incentives || 0) / chartMax) * 100}
                      $color="#E0E3E6" 
                    />
                    <ChartBar
                      $tooltip={`${item.month} Salary: ₹${(item.salary || 0).toLocaleString('en-IN')}`}
                      $height={((item.salary || 0) / chartMax) * 100}
                      $color="#0B7A75" 
                    />
                    <ChartBar
                      $tooltip={`${item.month} Overtime: ₹${(item.overtime || 0).toLocaleString('en-IN')}`}
                      $height={((item.overtime || 0) / chartMax) * 100}
                      $color="#FDB750" 
                    />
                  </BarStack>
                  <BarLabel>{item.month}</BarLabel>
                </BarGroup>
              ))}
            </BarChartContainer>
          </ChartPlaceholder>
        </ChartCard>

        {/* Payroll Breakdown */}
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Payroll Breakdown</ChartTitle>
            <DropdownSelect value={selectedPayrollMonth} onChange={(e) => handlePayrollMonthChange(e.target.value)}>
              <option>This Month</option>
              <option>Last Month</option>
            </DropdownSelect>
          </ChartHeader>
          <BreakdownContent>
            <TotalAmountRow>
              <TotalAmount>₹{totalPayThisMonth.toLocaleString('en-IN')}</TotalAmount>
              <TotalLabel>Total Pay This Month</TotalLabel>
            </TotalAmountRow>
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
            <BreakdownGrid>
              {payrollBreakdown.map((item, idx) => (
                <BreakdownItem key={idx}>
                  <BreakdownItemHeader>
                    <LegendDot $color={item.color} />
                    <BreakdownLabel>
                      {item.label} - {item.percentage}
                    </BreakdownLabel>
                  </BreakdownItemHeader>
                  <BreakdownValue>{item.value}</BreakdownValue>
                </BreakdownItem>
              ))}
            </BreakdownGrid>
          </BreakdownContent>
        </ChartCard>
      </ChartsSection>

      {/* Payroll Table Section */}
      <TableSection>
        <TableHeader>
          <TableTitle>Payroll</TableTitle>
          <TableControls>
            <DropdownSelect value={selectedPayrollMonth} onChange={(e) => handlePayrollMonthChange(e.target.value)}>
              <option>This Month</option>
              <option>Last Month</option>
            </DropdownSelect>
            <FilterButton onClick={() => setShowFilter(true)}>
              <img src={FilterIcon} alt="filter" width="16" height="16" />
              Filter
            </FilterButton>
            <SearchInputComponent
              placeholder="Search Agents"
              value={searchQuery}
              onSearchChange={setSearchQuery}
              width="300px"
              height="45px"
            />
            <AddPayrollButton onClick={() => setShowAddPayroll(true)}>
              <img src={PlusIcon} alt="add" width="16" height="16" />
              Add Payroll
            </AddPayrollButton>
          </TableControls>
        </TableHeader>

        <TableWrapper>
          <ReusableTable
            columns={columns}
            data={payrollData}
            rowsPerPage={10}
            alwaysShowPagination={true}
            paginationBorder={true}
            server={true}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            isLoading={loading}
          />
        </TableWrapper>
      </TableSection>

      {showFilter && (
        <Filter
          onClose={() => setShowFilter(false)}
          onApply={handleFilterApply}
        />
      )}

      {showAddPayroll && (
        <AddPayroll
          onClose={() => setShowAddPayroll(false)}
          onSubmit={handleAddPayrollSubmit}
        />
      )}

      {modal && (
        <ModalOverlay onClick={() => !actionLoading && setModal(null)}>
          <SmallModal onClick={(event) => event.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{modal.type === "view" ? "Payroll Details" : "Change Payroll Status"}</ModalTitle>
              <ModalClose type="button" onClick={() => !actionLoading && setModal(null)}>×</ModalClose>
            </ModalHeader>
            {modal.type === "view" ? (
              <DetailGrid>
                <DetailRow><span>Name</span><strong>{modal.row.name}</strong></DetailRow>
                <DetailRow><span>Employee ID</span><strong>{modal.row.employeeId}</strong></DetailRow>
                <DetailRow><span>Department</span><strong>{modal.row.department}</strong></DetailRow>
                <DetailRow><span>Issue Date</span><strong>{modal.row.issueDate}</strong></DetailRow>
                <DetailRow><span>Status</span><strong>{selectedDetail?.status || modal.row.status}</strong></DetailRow>
                <DetailRow><span>Total</span><strong>{selectedDetail?.total || modal.row.total}</strong></DetailRow>
              </DetailGrid>
            ) : (
              <StatusForm>
                <label htmlFor="paysheet-status">Status</label>
                <DropdownSelect id="paysheet-status" value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
                  <option value="draft">Draft</option>
                  <option value="processed">Processed</option>
                  <option value="paid">Paid</option>
                  <option value="stopped">Stopped</option>
                  <option value="resumed">Resumed</option>
                </DropdownSelect>
                <ModalActions>
                  <SecondaryButton type="button" onClick={() => setModal(null)}>Cancel</SecondaryButton>
                  <PrimaryButton type="button" disabled={actionLoading} onClick={saveStatus}>{actionLoading ? "Saving..." : "Save Status"}</PrimaryButton>
                </ModalActions>
              </StatusForm>
            )}
          </SmallModal>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Paysheet;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
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
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
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

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 0.75rem;
  padding: 1.5rem;
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
  font-size: 1.125rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const ChartLegend = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LegendDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: ${(props) => props.$color};
  flex-shrink: 0;
`;

const LegendText = styled.span`
  font-size: 0.875rem;
  font-family: "Inter-Regular", sans-serif;
  color: ${theme.colors.textColor};
`;

const ChartPlaceholder = styled.div`
  width: 100%;
  height: 250px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 1rem;
  position: relative;
`;

const YAxisLabels = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 200px;
  padding-bottom: 1.5rem;
`;

const YAxisLabel = styled.span`
  font-size: 0.75rem;
  font-family: "Inter-Regular", sans-serif;
  color: ${theme.colors.secondaryTextColor};
  text-align: right;
  min-width: 50px;
`;

const BarChartContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  flex: 1;
  height: 100%;
  gap: 0.25rem;
  padding: 1rem 0;
  min-width: 0;
`;

const BarGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
`;

const BarStack = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 0.25rem;
  height: 200px;
  width: 100%;
`;

const ChartBar = styled.div`
  position: relative;
  width: clamp(6px, 1.2vw, 14px);
  height: ${(props) => props.$height}%;
  background: ${(props) => props.$color};
  border-radius: 4px 4px 0 0;

  &:hover::after {
    content: "${(props) => props.$tooltip}";
    position: absolute;
    left: 50%;
    bottom: calc(100% + 8px);
    transform: translateX(-50%);
    z-index: 5;
    white-space: nowrap;
    padding: 6px 8px;
    border-radius: 5px;
    background: #1f2937;
    color: #fff;
    font-size: 11px;
    pointer-events: none;
  }
`;

const BarLabel = styled.span`
  font-size: 0.75rem;
  font-family: "Inter-Regular", sans-serif;
  color: ${theme.colors.secondaryTextColor};
`;

const BreakdownContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TotalAmountRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1rem;
`;

const TotalAmount = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const TotalLabel = styled.span`
  font-size: 0.875rem;
  font-family: "Inter-Regular", sans-serif;
  color: ${theme.colors.secondaryTextColor};
`;

const BreakdownBars = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  gap: 3px;
`;

const BreakdownBar = styled.div`
  flex: 1;
  background: ${(props) => props.$color};
  border-radius: 4px;
`;

const BreakdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const BreakdownItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
`;

const BreakdownItemHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
`;

const BreakdownLabel = styled.span`
  font-size: 0.875rem;
  font-family: "Inter-Regular", sans-serif;
  color: ${theme.colors.textColor};
`;

const BreakdownValue = styled.span`
  font-size: 0.875rem;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.secondaryTextColor};
`;

const TableSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

const TableTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const TableControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.textColor};
  cursor: pointer;
  height: 45px;

  &:hover {
    background: ${theme.colors.secondaryPrimary};
  }
`;

const AddPayrollButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: "Inter-SemiBold", sans-serif;
  font-weight: 600;
  cursor: pointer;
  height: 45px;

  &:hover {
    opacity: 0.9;
  }

  img {
    filter: brightness(0) invert(1);
  }
`;

const TableWrapper = styled.div`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 0.75rem;
  overflow: hidden;
  padding: 1rem;
`;

const EmployeeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-family: "Inter-SemiBold", sans-serif;
`;

const EmployeeDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const EmployeeName = styled.span`
  font-size: 0.875rem;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.textColor};
`;

const EmployeeId = styled.span`
  font-size: 0.75rem;
  font-family: "Inter-Regular", sans-serif;
  color: ${theme.colors.secondaryTextColor};
`;

const DepartmentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DepartmentName = styled.span`
  font-size: 0.875rem;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.textColor};
`;

const SubDepartment = styled.span`
  font-size: 0.75rem;
  font-family: "Inter-Regular", sans-serif;
  color: ${theme.colors.secondaryTextColor};
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${(props) => props.$color};
  background: ${(props) => `${props.$color}15`};
`;

const ActionButton = styled.button`
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

const ActionCell = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;

const ActionMenu = styled.div`
  position: absolute;
  top: 28px;
  right: 0;
  z-index: 20;
  width: 140px;
  padding: 5px;
  background: #fff;
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
`;

const MenuButton = styled.button`
  width: 100%;
  border: 0;
  background: transparent;
  text-align: left;
  padding: 9px 10px;
  border-radius: 6px;
  cursor: pointer;
  color: ${theme.colors.textColor};
  &:hover { background: #f3f6f6; }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.35);
`;

const SmallModal = styled.div`
  width: min(420px, 100%);
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`display:flex; align-items:center; justify-content:space-between; margin-bottom:18px;`;
const ModalTitle = styled.h3`margin:0; font-size:18px; color:${theme.colors.textColor};`;
const ModalClose = styled.button`border:0; background:transparent; font-size:24px; cursor:pointer; color:#64748b;`;
const DetailGrid = styled.div`display:grid; gap:12px;`;
const DetailRow = styled.div`display:flex; justify-content:space-between; gap:12px; font-size:13px; color:#64748b; strong{color:${theme.colors.textColor}; text-align:right;}`;
const StatusForm = styled.div`display:grid; gap:9px; label{font-size:13px; color:#475569;}`;
const ModalActions = styled.div`display:flex; justify-content:flex-end; gap:10px; margin-top:14px;`;
const SecondaryButton = styled.button`padding:9px 14px; border:1px solid ${theme.colors.border}; border-radius:7px; background:#fff; cursor:pointer;`;
const PrimaryButton = styled.button`padding:9px 14px; border:0; border-radius:7px; background:${theme.colors.primary}; color:#fff; cursor:pointer; &:disabled{opacity:.6;}`;

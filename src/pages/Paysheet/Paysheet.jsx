import { useState } from "react";
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

const Paysheet = () => {
  const [selectedMonth, setSelectedMonth] = useState("This Month");
  const [selectedYear, setSelectedYear] = useState("This Year");
  const [selectedPayrollMonth, setSelectedPayrollMonth] = useState("This Month");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);

  const handleFilterApply = (filters) => {
    setAppliedFilters(filters);
    setShowFilter(false);
    console.log("Applied filters:", filters);
  };

  const quickStats = [
    { label: "Total Salary", value: "₹20,20,000", percentage: "20.5 %", isPositive: true },
    { label: "Total Incentive", value: "₹90,000", percentage: "20.5 %", isPositive: true },
    { label: "Total Deductions", value: "20", percentage: "20.5 %", isPositive: true },
    { label: "Payable Employees", value: "456", percentage: "12 %", isPositive: false },
    { label: "On Hold Employees", value: "25", percentage: "20.5 %", isPositive: true },
  ];

  const payrollBreakdown = [
    { label: "Salary", value: "₹ 20,20,000", percentage: "89.3%", color: "#0B7A75" },
    { label: "Allowances", value: "₹ 20,20,000", percentage: "88.3%", color: "#FDB750" },
    { label: "Deduction", value: "₹ 20,30,000", percentage: "89.3%", color: "#E0E3E6" },
    { label: "Incentives", value: "₹ 20,20,000", percentage: "89.3%", color: "#0B7A75" },
    { label: "Overtime", value: "₹ 20,20,000", percentage: "88.3%", color: "#2C2C2C" },
  ];

  const payrollData = [
    {
      id: 1,
      name: "Manoj Kumar",
      employeeId: "#ST5683",
      department: "UI UX Designer",
      subDepartment: "Design",
      issueDate: "14-01-2026",
      ot: "₹42,853",
      total: "₹5683",
      amount: "₹48,486",
      status: "Paid",
      avatar: null,
    },
    {
      id: 2,
      name: "Cristofer Dias",
      employeeId: "#ST5683",
      department: "Web Developer",
      subDepartment: "Design",
      issueDate: "14-01-2026",
      ot: "₹42,853",
      total: "₹5683",
      amount: "₹48,486",
      status: "Pending",
      avatar: null,
    },
    {
      id: 3,
      name: "Hanna Lipshutz",
      employeeId: "#ST5683",
      department: "Marketing Ex",
      subDepartment: "Design",
      issueDate: "14-01-2026",
      ot: "₹42,853",
      total: "₹5683",
      amount: "₹48,486",
      status: "Canceled",
      avatar: null,
    },
    {
      id: 4,
      name: "Lydia Donin",
      employeeId: "#ST5683",
      department: "Business Development",
      subDepartment: "Design",
      issueDate: "14-01-2026",
      ot: "₹42,853",
      total: "₹5683",
      amount: "₹48,486",
      status: "Paid",
      avatar: null,
    },
    {
      id: 5,
      name: "Jaxson Carder",
      employeeId: "#ST5683",
      department: "UI UX Designer",
      subDepartment: "Design",
      issueDate: "14-01-2026",
      ot: "₹42,853",
      total: "₹5683",
      amount: "₹48,486",
      status: "Paid",
      avatar: null,
    },
    {
      id: 6,
      name: "Jaxson Carder",
      employeeId: "#ST5683",
      department: "UI UX Designer",
      subDepartment: "Design",
      issueDate: "14-01-2026",
      ot: "₹42,853",
      total: "₹5683",
      amount: "₹48,486",
      status: "Paid",
      avatar: null,
    },
    {
      id: 7,
      name: "Jaxson Carder",
      employeeId: "#ST5683",
      department: "UI UX Designer",
      subDepartment: "Design",
      issueDate: "14-01-2026",
      ot: "₹42,853",
      total: "₹5683",
      amount: "₹48,486",
      status: "Paid",
      avatar: null,
    },
  ];

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
        <ActionButton>
          <img src={DotMenuIcon} alt="menu" width="20" height="20" />
        </ActionButton>
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
      </QuickStatsSection>

      {/* Charts Section */}
      
      <ChartsSection>
        {/* Payroll Overview */}
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Payroll Overview</ChartTitle>
            <DropdownSelect value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
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
              <YAxisLabel>₹ 800K</YAxisLabel>
              <YAxisLabel>₹ 600K</YAxisLabel>
              <YAxisLabel>₹ 400K</YAxisLabel>
              <YAxisLabel>₹ 200K</YAxisLabel>
              <YAxisLabel>₹ 0</YAxisLabel>
            </YAxisLabels>
            <BarChartContainer>
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((month, idx) => (
                <BarGroup key={month}>
                  <BarStack>
                    <Bar $height={Math.random() * 60 + 20} $color="#E0E3E6" />
                    <Bar $height={Math.random() * 80 + 40} $color="#0B7A75" />
                    <Bar $height={Math.random() * 50 + 30} $color="#FDB750" />
                  </BarStack>
                  <BarLabel>{month}</BarLabel>
                </BarGroup>
              ))}
            </BarChartContainer>
          </ChartPlaceholder>
        </ChartCard>

        {/* Payroll Breakdown */}
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Payroll Breakdown</ChartTitle>
            <DropdownSelect value={selectedPayrollMonth} onChange={(e) => setSelectedPayrollMonth(e.target.value)}>
              <option>This Month</option>
              <option>Last Month</option>
            </DropdownSelect>
          </ChartHeader>
          <BreakdownContent>
            <TotalAmountRow>
              <TotalAmount>₹20,20,000</TotalAmount>
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
            <DropdownSelect value={selectedPayrollMonth} onChange={(e) => setSelectedPayrollMonth(e.target.value)}>
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
            <AddPayrollButton>
              <img src={PlusIcon} alt="add" width="16" height="16" />
              Add Payroll
            </AddPayrollButton>
          </TableControls>
        </TableHeader>

        <TableWrapper>
          <ReusableTable
            columns={columns}
            data={payrollData}
            rowsPerPage={5}
            alwaysShowPagination={true}
            paginationBorder={true}
          />
        </TableWrapper>
      </TableSection>

      {showFilter && (
        <Filter
          onClose={() => setShowFilter(false)}
          onApply={handleFilterApply}
        />
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
  gap: 1rem;
  padding: 1rem 0;
`;

const BarGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
`;

const BarStack = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 0.25rem;
  height: 200px;
  width: 100%;
`;

const Bar = styled.div`
  width: 20px;
  height: ${(props) => props.$height}%;
  background: ${(props) => props.$color};
  border-radius: 4px 4px 0 0;
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

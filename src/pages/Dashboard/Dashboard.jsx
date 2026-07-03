import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import theme from "../../theme/theme";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState("Today");
  const navigate = useNavigate();

  const quickStats = [
    { label: "Total Employees", value: "256", change: "26.5%", positive: true },
    { label: "Present Today", value: "250", change: "28.5%", positive: true },
    { label: "On Leave", value: "06", change: "20.5%", positive: true },
    { label: "OT Employees", value: "26", change: "5%", positive: false },
    { label: "Payroll", value: "₹20,20,000", change: "26.5%", positive: true }
  ];

  const attendanceData = [
    { date: "14-07", present: 200, onLeave: 100, late: 20 },
    { date: "15-07", present: 220, onLeave: 80, late: 25 },
    { date: "16-07", present: 210, onLeave: 95, late: 18 },
    { date: "17-07", present: 240, onLeave: 60, late: 22 },
    { date: "18-07", present: 195, onLeave: 110, late: 28 },
    { date: "19-07", present: 230, onLeave: 75, late: 20 },
    { date: "20-07", present: 250, onLeave: 50, late: 15 }
  ];

  const payrollData = [
    { name: "Salary", value: 88.3, percentage: "₹ 20,20,000", color: "#0B7A75" },
    { name: "Allowances", value: 8.3, percentage: "₹ 20,20,000", color: "#FDB750" },
    { name: "Deduction", value: 2.1, percentage: "₹ 20,20,000", color: "#E0E3E6" },
    { name: "Incentives", value: 0.5, percentage: "₹ 20,20,000", color: "#0B7A75" },
    { name: "Overtimes", value: 0.8, percentage: "₹ 20,20,000", color: "#2C2C2C" }
  ];

  const employees = [
    { id: 1, name: "Marlyn Pines", position: "UI/UX Designer", shift: "Morning", checkIn: "08:50 AM", checkOut: "06:45 PM", working: "8.36 hrs", status: "-" },
    { id: 2, name: "Arjun Stanton", position: "Developer", shift: "Afternoon", checkIn: "09:00 AM", checkOut: "06:45 PM", working: "8.36 hrs", status: "-" },
    { id: 3, name: "Marlyn Pines", position: "UI/UX Designer", shift: "Night", checkIn: "08:50 AM", checkOut: "06:45 PM", working: "8.36 hrs", status: "-" }
  ];

  return (
    <Container>
      {/* Quick Stats Section */}
      <QuickStatsSection>
        <SectionHeader>
          <SectionTitle>Quick Stats</SectionTitle>
          <HeaderRight>
            <DateSelect value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
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
      <SectionTitle style={{ marginTop: "1.5rem" }}>Attendance & Payroll</SectionTitle>
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
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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
              <PayrollAmount>₹20,20,000</PayrollAmount>
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
                    <PayrollLegendName>{item.name} · {item.value}%</PayrollLegendName>
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
        <SectionHeader>
          <SectionTitleWithTabs>
            <TabButton $active>Employees</TabButton>
            <TabButton>Staffs</TabButton>
          </SectionTitleWithTabs>
          <SectionRight>
            <DateText>Today (18 Aug 2025)</DateText>
            <AddEmployeeButton onClick={() => navigate("/admin/time-hub/attendance/add")}>
              + Add Manually
            </AddEmployeeButton>
          </SectionRight>
        </SectionHeader>
        <br />
        <FiltersRow>
          <FilterButton $active>
            <span>🔍</span> Search Employee
          </FilterButton>
          <FilterSelect>
            <option>All Department</option>
          </FilterSelect>
          <FilterSelect>
            <option>All Shifts</option>
          </FilterSelect>
          <FilterIconButton>⚙️ Filter</FilterIconButton>
        </FiltersRow>

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
            {employees.map((emp) => (
              <TableRow key={emp.id}>
                <Td>{emp.id}</Td>
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
            ))}
          </TableBody>
        </EmployeesTable>
      </EmployeesSection>
    </Container>
  );
};

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
  flex-wrap: wrap;
  gap: 1rem;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  font-family: "Inter", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const DateSelect = styled.select`
  padding: 0.5rem 1rem;
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
  gap: 1rem;

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
  border: 1px solid ${theme.colors.border};
  border-radius: 0.75rem;
  padding: 1rem;
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
  font-family: "Inter", sans-serif;
  color: ${theme.colors.secondaryTextColor};
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
  padding: 0.35rem 0.75rem;
  background: ${(props) => (props.$positive ? "#d1fae5" : "#fee2e2")};
  color: ${(props) => (props.$positive ? "#10B981" : "#dc2626")};
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
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
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const AttendanceCard = styled.div`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 0.75rem;
  padding: 1.5rem;
  width: 100%;
  flex: 1;
  overflow: hidden;
`;

const PayrollCard = styled.div`
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
  font-family: "Inter", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const PeriodSelect = styled.select`
  padding: 0.375rem 0.75rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 4px;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
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
  font-size: 0.875rem;
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
  gap: 1.5rem;
`;

const PayrollMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
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
  gap: 3px;
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
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid ${theme.colors.border};
`;

const SectionTitleWithTabs = styled.div`
  display: flex;
  gap: 0;
`;

const TabButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-bottom: ${(props) => (props.$active ? "3px solid #0B7A75" : "none")};
  background: none;
  color: ${(props) => (props.$active ? "#0B7A75" : theme.colors.secondaryTextColor)};
  font-family: "Inter", sans-serif;
  font-size: 0.9rem;
  font-weight: ${(props) => (props.$active ? "700" : "500")};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #0B7A75;
  }
`;

const SectionRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const DateText = styled.span`
  font-size: 0.875rem;
  color: ${theme.colors.secondaryTextColor};
  font-family: "Inter", sans-serif;
  font-weight: 500;
`;

const FiltersRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${(props) => (props.$active ? theme.colors.primary : theme.colors.border)};
  color: ${(props) => (props.$active ? "grey" : theme.colors.textColor)};
  border-radius: 6px;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
`;

const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
`;

const AddEmployeeButton = styled.button`
  padding: 0.5rem 1.25rem;
  background: #0B7A75;
  color: white;
  border: none;
  border-radius: 6px;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #065855;
  }
`;

const FilterIconButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${theme.colors.border};
  background: white;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
`;

const EmployeesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: #f9fafb;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${theme.colors.border};

  &:hover {
    background: #f9fafb;
  }
`;

const Th = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-family: "Inter", sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${theme.colors.secondaryTextColor};
`;

const TableBody = styled.tbody``;

const Td = styled.td`
  padding: 0.75rem 1rem;
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

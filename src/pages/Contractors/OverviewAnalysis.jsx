import { useState } from "react";
import styled from "styled-components";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import theme from "../../theme/theme";

// Colors
const COLORS = {
  primary: "#0047AB",
  secondary: "#066C78",
  tertiary: "#007DAB",
};

// Sample data
const contractorData = [
  { name: "Arjun Sharma", jobs: 85, primary: 65, secondary: 20, color1: COLORS.primary, color2: COLORS.secondary },
  { name: "Priya Patel", jobs: 72, primary: 50, secondary: 22, color1: COLORS.secondary, color2: COLORS.tertiary },
  { name: "Rajesh Gupta", jobs: 58, primary: 30, secondary: 28, color1: COLORS.tertiary, color2: COLORS.primary },
  { name: "Sita Singh", jobs: 92, primary: 70, secondary: 22, color1: COLORS.primary, color2: COLORS.tertiary },
  { name: "Vikram Dev", jobs: 45, primary: 30, secondary: 15, color1: COLORS.secondary, color2: COLORS.primary },
];

const earnedPaidData = [
  { name: "Jul", earned: 1200000, paid: 1000000 },
  { name: "Aug", earned: 1500000, paid: 1300000 },
  { name: "Sep", earned: 1800000, paid: 1600000 },
  { name: "Oct", earned: 1000000, paid: 800000 },
  { name: "Nov", earned: 2000000, paid: 1800000 },
  { name: "Dec", earned: 800000, paid: 600000 },
];

const workDistData = [
  { name: "Civil Works", value: 45, color: COLORS.primary },
  { name: "Electrical", value: 30, color: COLORS.secondary },
  { name: "Plumbing", value: 25, color: COLORS.tertiary },
];

const earningsTrendData = [
  { name: "2021", value: 1400000 },
  { name: "2022", value: 2400000 },
  { name: "2023", value: 3100000 },
  { name: "2024", value: 3800000 },
  { name: "2025", value: 4200000 },
  { name: "2026", value: 7000000 },
];

const OverviewAnalysis = () => {
  const [activeTab, setActiveTab] = useState("Month");

  return (
    <Container>
      <PageHeader>
        <HeaderTop>
          <TitleSection>
            <Title>Financial Summary</Title>
            <Subtitle>Current state of contractor accounts</Subtitle>
          </TitleSection>
          <FilterButton>Last 7 days</FilterButton>
        </HeaderTop>
      </PageHeader>

      <StatsGrid>
        <StatCard>
          <StatLabel>Active Contractors</StatLabel>
          <StatValue>24</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Total Payable</StatLabel>
          <StatValue>₹ 4,50,000</StatValue>
        </StatCard>
        <StatCardPaid>
          <StatLabel>Paid out</StatLabel>
          <StatValueGreen>₹ 3,85,000</StatValueGreen>
        </StatCardPaid>
        <StatCardOutstanding>
          <StatLabel>Outstanding</StatLabel>
          <StatValueOrange>₹ 65,000</StatValueOrange>
        </StatCardOutstanding>
      </StatsGrid>

      <MainGrid>
        <ContractorsCard>
          <CardHeader>
            <CardTitle>Contractor Specializations</CardTitle>
            <Dropdown>This Month</Dropdown>
          </CardHeader>
          <ContractorsList>
            {contractorData.map((contractor, index) => (
              <ContractorItem key={index}>
                <Avatar $bgColor={contractor.color1}>
                  {contractor.name.charAt(0)}{contractor.name.split(' ')[1]?.charAt(0) || ''}
                </Avatar>
                <ContractorNameWrapper>
                  <ContractorName>{contractor.name}</ContractorName>
                  <ProgressContainer>
                    <ProgressBar1 $width={`${contractor.primary}%`} $bgColor={contractor.color1} />
                    <ProgressBar2 $width={`${contractor.secondary}%`} $bgColor={contractor.color2} $offset={`${contractor.primary}%`} />
                  </ProgressContainer>
                </ContractorNameWrapper>
                <JobsCount>{contractor.jobs} jobs</JobsCount>
              </ContractorItem>
            ))}
          </ContractorsList>
          <LegendRow>
            <LegendItem><LegendDot $bgColor={COLORS.primary} /><span>Civil</span></LegendItem>
            <LegendItem><LegendDot $bgColor={COLORS.secondary} /><span>Electrical</span></LegendItem>
            <LegendItem><LegendDot $bgColor={COLORS.tertiary} /><span>Plumbing</span></LegendItem>
          </LegendRow>
        </ContractorsCard>

        <EarningsCard>
          <CardHeader>
            <CardTitle>Earned vs Paid Out</CardTitle>
            <HeaderControls>
              <LegendRow>
                <LegendItem><LegendDot $bgColor={COLORS.primary} /><span>Earned</span></LegendItem>
                <LegendItem><LegendDot $bgColor={COLORS.secondary} /><span>Paid</span></LegendItem>
              </LegendRow>
              <Dropdown>This Month</Dropdown>
            </HeaderControls>
          </CardHeader>
          <ChartArea>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={earnedPaidData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} horizontal stroke={theme.colors.border} />
                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 12,
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fill: theme.colors.textColor,
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fontSize: 12,
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fill: theme.colors.textColor,
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #E7E7E7" }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, ""]}
                />
                <Bar dataKey="earned" fill={COLORS.primary} radius={[4, 4, 0, 0]} barSize={24} name="Earned" />
                <Bar dataKey="paid" fill={COLORS.secondary} radius={[4, 4, 0, 0]} barSize={24} name="Paid Out" />
              </BarChart>
            </ResponsiveContainer>
          </ChartArea>
        </EarningsCard>
      </MainGrid>

      <BottomGrid>
        <WorkDistCard>
          <CardHeader>
            <CardTitle>Work Distribution</CardTitle>
            <Dropdown>This Month</Dropdown>
          </CardHeader>
          <WorkDistContent>
            <PieChartWrapper>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={workDistData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {workDistData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <CenterText>
                <CenterNumber>1,420</CenterNumber>
                <CenterLabel>Total Works</CenterLabel>
              </CenterText>
            </PieChartWrapper>
            <WorkDistLegend>
              {workDistData.map((item, index) => (
                <LegendItem key={index}>
                  <LegendDot $bgColor={item.color} />
                  <span>{item.name} {item.value}%</span>
                </LegendItem>
              ))}
            </WorkDistLegend>
          </WorkDistContent>
        </WorkDistCard>

        <EarningsTrendCard>
          <CardHeader>
            <CardTitle>Earnings Trend</CardTitle>
            <Tabs>
              {["Month", "Quarter", "Year"].map((tab) => (
                <Tab key={tab} $active={activeTab === tab} onClick={() => setActiveTab(tab)}>
                  {tab}
                </Tab>
              ))}
            </Tabs>
          </CardHeader>
          <ChartArea>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={earningsTrendData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} horizontal stroke={theme.colors.border} />
                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 12,
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fill: theme.colors.textColor,
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fontSize: 12,
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fill: theme.colors.textColor,
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `₹${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #E7E7E7" }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, "Earnings"]}
                />
                <Bar dataKey="value" fill={COLORS.primary} radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </ChartArea>
        </EarningsTrendCard>
      </BottomGrid>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  width: 100%;
`;

const PageHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Title = styled.h1`
  font-family: "Inter", sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const Subtitle = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  color: ${theme.colors.secondaryTextColor};
  margin: 0;
`;

const FilterButton = styled.button`
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  background-color: ${theme.colors.white};
  color: ${theme.colors.textColor};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${theme.colors.bgColor};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background-color: ${theme.colors.white};
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${theme.colors.border};
`;

const StatCardPaid = styled.div`
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${theme.colors.border};
`;

const StatCardOutstanding = styled.div`
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${theme.colors.border};
`;

const StatLabel = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  color: ${theme.colors.secondaryTextColor};
  margin: 0 0 0.75rem 0;
  font-weight: 500;
`;

const StatValue = styled.h3`
  font-family: "Inter", sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const StatValueGreen = styled.h3`
  font-family: "Inter", sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #166534;
  margin: 0;
`;

const StatValueOrange = styled.h3`
  font-family: "Inter", sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #92400e;
  margin: 0;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 1.25rem;
  margin-bottom: 1.25rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 1.25rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const ContractorsCard = styled.div`
  background-color: ${theme.colors.white};
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${theme.colors.border};
`;

const EarningsCard = styled.div`
  background-color: ${theme.colors.white};
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${theme.colors.border};
`;

const WorkDistCard = styled.div`
  background-color: ${theme.colors.white};
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${theme.colors.border};
`;

const EarningsTrendCard = styled.div`
  background-color: ${theme.colors.white};
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${theme.colors.border};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h3`
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const Dropdown = styled.button`
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  background-color: ${theme.colors.white};
  color: ${theme.colors.textColor};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${theme.colors.bgColor};
  }
`;

const ContractorsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ContractorItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ContractorNameWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  background-color: ${(props) => props.$bgColor};
  flex-shrink: 0;
`;

const ContractorName = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const JobsCount = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${theme.colors.secondaryTextColor};
  text-align: right;
  flex-shrink: 0;
  width: 50px;
`;

const ProgressContainer = styled.div`
  flex: 1;
  height: 8px;
  background-color: ${theme.colors.bgColor};
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const ProgressBar1 = styled.div`
  height: 100%;
  border-radius: 4px 0 0 4px;
  width: ${(props) => props.$width};
  background-color: ${(props) => props.$bgColor};
  position: absolute;
  left: 0;
  top: 0;
`;

const ProgressBar2 = styled.div`
  height: 100%;
  border-radius: 0 4px 4px 0;
  width: ${(props) => props.$width};
  background-color: ${(props) => props.$bgColor};
  position: absolute;
  left: ${(props) => props.$offset};
  top: 0;
`;

const LegendRow = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: "Inter", sans-serif;
  font-size: 0.75rem;
  color: ${theme.colors.secondaryTextColor};
`;

const LegendDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => props.$bgColor};
`;

const ChartArea = styled.div`
  width: 100%;
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const WorkDistContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PieChartWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  width: 220px;
  height: 220px;
`;

const CenterText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const CenterNumber = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const CenterLabel = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 0.75rem;
  color: ${theme.colors.secondaryTextColor};
  margin: 0;
`;

const WorkDistLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  background-color: ${theme.colors.bgColor};
  padding: 0.25rem;
  border-radius: 6px;
`;

const Tab = styled.button`
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background-color: ${(props) => (props.$active ? theme.colors.white : "transparent")};
  color: ${(props) => (props.$active ? "#0047AB" : theme.colors.textColor)};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${(props) => (props.$active ? "0 1px 3px rgba(0,0,0,0.1)" : "none")};

  &:hover {
    background-color: ${(props) => (props.$active ? theme.colors.white : theme.colors.bgColor)};
  }
`;

export default OverviewAnalysis;

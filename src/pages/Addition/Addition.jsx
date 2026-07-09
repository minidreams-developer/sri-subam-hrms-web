import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import GreenArrow from "../../assets/images/DashboardImages/green.svg";
import RedArrow from "../../assets/images/DashboardImages/red.svg";
import DotMenuIcon from "../../assets/images/DayOff/dot-menu.svg";
import TabSwitcher from "../../components/TabSwitcher";
import TableToolbar from "../../components/TableToolbar";
import PlusIcon from "../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import Adjustments from "./Adjustments";
import Pendings from "./Pendings";
import Filter from "../../components/filter";

const Addition = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState("This Month");
  const [activeTab, setActiveTab] = useState("adjustment");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonthFilter, setSelectedMonthFilter] = useState("This Month");
  const [showFilter, setShowFilter] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);

  const handleFilterApply = (filters) => {
    setAppliedFilters(filters);
    setShowFilter(false);
    console.log("Applied filters:", filters);
  };

  const quickStats = [
    { label: "Total Additions Amount", value: "₹12,50,000", percentage: "18.5 %", isPositive: true },
    { label: "Total Deductions Amount", value: "₹8,75,000", percentage: "10.2 %", isPositive: false },
    { label: "Pending Approvals", value: "₹3,75,000", percentage: "8.3 %", isPositive: true },
    { label: "Applied to Payroll", value: "285", percentage: "15.7 %", isPositive: true },
  ];

  const handleAddAdjustment = () => {
    navigate("/admin/pay-hub/additionDeductions/add");
  };

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
                          { label: "All Adjustment", value: "adjustment" },
                          { label: "Pending", value: "pending" },
                        ]}
                        active={activeTab}
                        onChange={setActiveTab}
                      />
        
        <TableToolbar
          searchPosition="left"
          searchPlaceholder="Search"
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          select1Options={["This Month", "Last Month", "Last 3 Months", "This Year"]}
          select1Value={selectedMonthFilter}
          onSelect1Change={setSelectedMonthFilter}
          select2Options={false}
          filterText="Filter"
          showFilter={true}
          actionText="Adjustment"
          actionIcon={<img src={PlusIcon} alt="add" width="16" height="16" />}
          onActionClick={handleAddAdjustment}
          onFilterClick={() => setShowFilter(true)}
          showDotIcon={false}
        />

        {activeTab === "adjustment" ? (
          <Adjustments searchQuery={searchQuery} selectedMonth={selectedMonthFilter} />
        ) : (
          <Pendings searchQuery={searchQuery} selectedMonth={selectedMonthFilter} />
        )}

      {showFilter && (
        <Filter
          onClose={() => setShowFilter(false)}
          onApply={handleFilterApply}
        />
      )}
      </QuickStatsSection>
    </Container>
  );
};

export default Addition;

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
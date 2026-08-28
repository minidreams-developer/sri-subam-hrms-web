import { useState, useEffect } from "react";
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
import { getAdjustmentStats } from "../../services/apiServices";
import { toast } from "react-toastify";

const fallbackStats = [
  { label: "Total Additions Amount", value: "₹20,20,000", percentage: "20.5 %", isPositive: true },
  { label: "Total Deductions Amount", value: "₹10,20,000", percentage: "20.5 %", isPositive: true },
  { label: "Pending Approvals", value: "₹2,20,000", percentage: "10.5 %", isPositive: false },
  { label: "Applied to Payroll", value: "20", percentage: "20.5 %", isPositive: true },
];

const Addition = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState("This Month");
  const [activeTab, setActiveTab] = useState("adjustment");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonthFilter, setSelectedMonthFilter] = useState("This Month");
  const [showFilter, setShowFilter] = useState(false);
  const [quickStats, setQuickStats] = useState([
    { label: "Total Additions Amount", value: "₹0", percentage: "0 %", isPositive: true },
    { label: "Total Deductions Amount", value: "₹0", percentage: "0 %", isPositive: false },
    { label: "Pending Approvals", value: "₹0", percentage: "0 %", isPositive: true },
    { label: "Applied to Payroll", value: "0", percentage: "0 %", isPositive: true },
  ]);
  const [_loadingStats, _setLoadingStats] = useState(false);

  // Fetch quick stats
  const fetchQuickStats = async () => {
    try {
      _setLoadingStats(true);
      
      // Call API without month/year parameters
      const response = await getAdjustmentStats();
      
      console.log("Quick stats response:", response);
      
      // Handle different response structures
      let stats = response?.data || response || {};

      if (!Object.values(stats).some((value) => Number(value) > 0)) {
        setQuickStats(fallbackStats);
        return;
      }
      
      setQuickStats([
        { 
          label: "Total Additions Amount", 
          value: stats.totalAdditionsAmount ? `₹${stats.totalAdditionsAmount.toLocaleString('en-IN')}` : "₹0", 
          percentage: stats.additionsPercentage ? `${stats.additionsPercentage}%` : "0%", 
          isPositive: true 
        },
        { 
          label: "Total Deductions Amount", 
          value: stats.totalDeductionsAmount ? `₹${stats.totalDeductionsAmount.toLocaleString('en-IN')}` : "₹0", 
          percentage: stats.deductionsPercentage ? `${stats.deductionsPercentage}%` : "0%", 
          isPositive: false 
        },
        { 
          label: "Pending Approvals", 
          value: stats.pendingApprovalsAmount ? `₹${stats.pendingApprovalsAmount.toLocaleString('en-IN')}` : "₹0", 
          percentage: stats.pendingPercentage ? `${stats.pendingPercentage}%` : "0%", 
          isPositive: true 
        },
        { 
          label: "Applied to Payroll", 
          value: stats.appliedToPayrollCount ? `${stats.appliedToPayrollCount}` : "0", 
          percentage: stats.appliedPercentage ? `${stats.appliedPercentage}%` : "0%", 
          isPositive: true 
        },
      ]);
    } catch (error) {
      console.error("Error fetching quick stats:", error);
      // Show error but don't crash the page
      if (error.response?.status === 500) {
        toast.error("Backend error: Please check the server logs");
      } else {
        toast.error("Failed to load quick stats");
      }
      // Set default stats to prevent page from breaking
      setQuickStats([
        { label: "Total Additions Amount", value: "₹0", percentage: "0%", isPositive: true },
        { label: "Total Deductions Amount", value: "₹0", percentage: "0%", isPositive: false },
        { label: "Pending Approvals", value: "₹0", percentage: "0%", isPositive: true },
        { label: "Applied to Payroll", value: "0", percentage: "0%", isPositive: true },
      ]);
      setQuickStats(fallbackStats);
    } finally {
      _setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchQuickStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddAdjustment = () => {
    navigate("/admin/pay-hub/additionDeductions/add");
  };

  const handleFilterApply = (filters) => {
    // TODO: Implement filter API call when needed
    console.log("Applied filters:", filters);
    setShowFilter(false);
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
  padding: 2.5rem 0 0;
`;

const QuickStatsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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
  font-size: 1.125rem;
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
  gap: 1.25rem;

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
  padding: 0.75rem 0.875rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2.5rem;
  height: 8.125rem;
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
  line-height: 1.6;
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
  background: ${(props) => (props.$isPositive ? "#D1FAE5" : "#FEE2E2")};
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  border: 1px solid ${(props) => (props.$isPositive ? "#10B981" : "#EF4444")};
  flex-shrink: 0;
  white-space: nowrap;
  height: 1.5rem;
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

import React from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import Button from "../../components/Button";
import TabSwitcher from "../../components/TabSwitcher";
import EmployeeLeaves from "./Employee Leaves/EmployeeLeaves";
import StaffLeaves from "./Staff Leaves/StaffLeaves";
import Permissions from "./Permissions/Permissions";
import { getLeaveRequestsQuickStats } from "../../services/apiServices";

const LeaveAttendance = () => {
  const { setHeaderTitle } = useOutletContext() || {};
  const location = useLocation();
  const [activeTab, setActiveTab] = React.useState(location.state?.activeTab || "Staffs Leaves");
  const [statsPeriod, setStatsPeriod] = React.useState("today");

  const [quickStats, setQuickStats] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    const today = new Date();
    const toDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const from = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    from.setDate(from.getDate() - ({ today: 0, last7days: 6, last30days: 29, last90days: 89 }[statsPeriod]));
    const fromDate = `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, "0")}-${String(from.getDate()).padStart(2, "0")}`;

    const loadQuickStats = async () => {
      try {
        const response = await getLeaveRequestsQuickStats({ fromDate, toDate });
        if (mounted) setQuickStats(response?.quickStats || response?.data || response || {});
      } catch {
        if (mounted) setQuickStats({});
      }
    };

    loadQuickStats();
    return () => {
      mounted = false;
    };
  }, [statsPeriod]);

  const stats = [
    { title: "Leaves Today", value: quickStats?.leavesToday ?? quickStats?.today ?? 0 },
    { title: "Pending Request", value: quickStats?.pendingRequests ?? quickStats?.pending ?? 0 },
    { title: "Approved Request", value: quickStats?.approvedRequests ?? quickStats?.approved ?? 0 },
    { title: "Rejected Request", value: quickStats?.rejectedRequests ?? quickStats?.rejected ?? 0 },
  ];

  React.useEffect(() => {
    setHeaderTitle?.("Leave Requests");
    return () => setHeaderTitle?.("");
  }, [setHeaderTitle]);

  return (
    <Container>
      <Top>
        <TopTitle>Quick Stats</TopTitle>
        <Controls>
          <FilterSelect>
            <select className="form-select" value={statsPeriod} onChange={(event) => setStatsPeriod(event.target.value)} aria-label="Statistics period">
              <option value="today">Today</option>
              <option value="last7days">Last 7 days</option>
              <option value="last30days">Last 30 days</option>
              <option value="last90days">Last 90 days</option>
            </select>
          </FilterSelect>
          <Button
            text="Export Data"
            bg={theme.colors.white}
            color={theme.colors.primary}
            border={`1px solid ${theme.colors.primary}`}
            width="9.625rem"
            radius="0.625rem"
          />
        </Controls>
      </Top>

      <StatsGrid>
        {stats.map((item, index) => (
          <StatCard key={index}>
            <CardTitle>{item.title}</CardTitle>
            <CardFooter>
              <CardValue>{item.value}</CardValue>
            </CardFooter>
          </StatCard>
        ))}
      </StatsGrid>
      <TabSwitcher
        tabs={[
          { label: "Employee Leaves", value: "Employee Leaves" },
          { label: "Staffs Leaves", value: "Staffs Leaves" },
          { label: "Permissions", value: "Permissions" },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />
      {activeTab === "Employee Leaves" && <EmployeeLeaves />}
      {activeTab === "Staffs Leaves" && <StaffLeaves />}
      {activeTab === "Permissions" && <Permissions />}
    </Container>
  );
};

export default LeaveAttendance;

const Container = styled.div`
  width: 100%;
  padding: 0;
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 0.75rem 0;

  @media (max-width: 640px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const TopTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  line-height: 160%;
  margin: 0;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const FilterSelect = styled.div`
  width: 8.125rem;

  select {
    width: 100%;
    height: 40px;
    padding: 0 2.25rem 0 0.75rem;
    border: 1px solid #e0e3e6;
    border-radius: 10px;
    background-color: ${theme.colors.white};
    color: ${theme.colors.textColor};
    font: 500 0.75rem/1.6 "Inter", sans-serif;
    cursor: pointer;
    outline: none;

    &:focus {
      border-color: ${theme.colors.primary};
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: #ffffff;
  min-height: 94px;
  padding: 0.75rem 0.875rem;
  border-radius: 0.625rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CardTitle = styled.p`
  font-size: 0.75rem;
  color: ${theme.colors.textColor};
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  margin: 0;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardValue = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  font-family: "Inter-Bold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
`;


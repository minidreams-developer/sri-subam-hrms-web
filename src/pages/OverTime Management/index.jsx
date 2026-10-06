import React from "react";
import styled from "styled-components";
import theme from "../../theme/theme";
import Button from "../../components/Button";
import { getOvertimeQuickStats } from "../../services/apiServices";
import TabSwitcher from "../../components/TabSwitcher";
import PlusIcon from "../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import actionIcon from "../../assets/images/Overtime/actionDot.svg";
import Pending from "./Pending/Pending";
import Approved from "./Approved/Approved";
import AddOvertimeModal from "./AddOvertimeModal";

const OverTimeManage = () => {
  const [statsPeriod, setStatsPeriod] = React.useState("last7days");
  const [quickStats, setQuickStats] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState("Pending");
  const [movedRequests, setMovedRequests] = React.useState([]);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  React.useEffect(() => {
    let mounted = true;
    const today = new Date();
    const toDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const from = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    from.setDate(from.getDate() - ({ today: 0, last7days: 6, last30days: 29, last90days: 89 }[statsPeriod]));
    const fromDate = `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, "0")}-${String(from.getDate()).padStart(2, "0")}`;

    getOvertimeQuickStats({ fromDate, toDate })
      .then((response) => {
        if (mounted) setQuickStats(response?.quickStats || response?.data || response || {});
      })
      .catch(() => {
        if (mounted) setQuickStats({});
      });

    return () => { mounted = false; };
  }, [statsPeriod]);

  const stats = [
    { title: "Requested", value: quickStats?.requested ?? quickStats?.total ?? 0 },
    { title: "Approved", value: quickStats?.approved ?? 0 },
    { title: "Rejected", value: quickStats?.rejected ?? 0 },
    { title: "Pending", value: quickStats?.pending ?? 0 },
  ];

  const moveRequest = (request, status) => {
    setMovedRequests((current) => [
      ...current.filter((item) => item.id !== request.id),
      { ...request, status, action: status.toLowerCase() },
    ]);
    setActiveTab(status);
  };

  const moveAllRequests = (requests) => {
    setMovedRequests((current) => {
      const requestIds = new Set(requests.map((item) => item.id));
      return [
        ...current.filter((item) => !requestIds.has(item.id)),
        ...requests.map((item) => ({
          ...item,
          status: "Approved",
          action: "approved",
        })),
      ];
    });
    setActiveTab("Approved");
  };

  return (
    <Container>
      <Top>
        <TopTitle>Quick Stats</TopTitle>
        <Controls>
          <FilterSelect>
            <select className="form-select" value={statsPeriod} onChange={(event) => setStatsPeriod(event.target.value)}>
              <option value="today">Today</option>
              <option value="last7days">Last 7 days</option>
              <option value="last30days">Last 30 days</option>
              <option value="last90days">Last 90 days</option>
            </select>
          </FilterSelect>
          <Button
            text="Add OT"
            bg={theme.colors.primary}
            color={theme.colors.white}
            border={`1px solid ${theme.colors.primary}`}
            icon={<img src={PlusIcon} alt="plus" />}
            width="9.625rem"
            radius="0.625rem"
            onClick={() => setIsAddOpen(true)}
          />
          <DotIcon src={actionIcon} alt="dot" />
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
          { label: "Pending", value: "Pending" },
          { label: "Approved", value: "Approved" },
          { label: "Rejected", value: "Rejected" },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />
      {activeTab === "Pending" && (
        <Pending refreshKey={refreshKey} onStatusChange={moveRequest} onApproveAll={moveAllRequests} />
      )}
      {activeTab === "Approved" && (
        <Approved
          statusFilter="approved"
          injectedRecords={movedRequests.filter(
            (item) => item.status === "Approved",
          )}
        />
      )}
      {activeTab === "Rejected" && (
        <Approved
          statusFilter="rejected"
          injectedRecords={movedRequests.filter(
            (item) => item.status === "Rejected",
          )}
        />
      )}
      <AddOvertimeModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdded={() => {
          setActiveTab("Pending");
          setRefreshKey((key) => key + 1);
        }}
      />
    </Container>
  );
};

export default OverTimeManage;

const Container = styled.div`
  width: 100%;
  padding: 1.5rem 0;
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 1.25rem 0;
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
`;

const FilterSelect = styled.div`
  width: 12rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div`
  background: #ffffff;
  padding: 0.704rem;
  border-radius: 0.625rem;
`;

const CardTitle = styled.p`
  font-size: 0.875rem;
  color: ${theme.colors.textColor};
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  margin-bottom: 3.125rem;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardValue = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  font-family: "Inter-Bold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const DotIcon = styled.img`
  width: 40px;
  height: 40px;
  cursor: pointer;
`;

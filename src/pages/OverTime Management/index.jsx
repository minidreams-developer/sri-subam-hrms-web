import React from "react";
import styled from "styled-components";
import theme from "../../theme/theme";
import Button from "../../components/Button";
import GreenArrow from "../../assets/images/DashboardImages/green.svg";
import RedArrow from "../../assets/images/DashboardImages/red.svg";
import { overTimeStats } from "../../utils/data";
import TabSwitcher from "../../components/TabSwitcher";
import PlusIcon from "../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import actionIcon from "../../assets/images/Overtime/actionDot.svg";
import Pending from "./Pending/Pending";
import Approved from "./Approved/Approved";

const OverTimeManage = () => {
  const stats = overTimeStats;
  const [activeTab, setActiveTab] = React.useState("Pending");

  return (
    <Container>
      <Top>
        <TopTitle>Quick Stats</TopTitle>
        <Controls>
          <FilterSelect>
            <select className="form-select" defaultValue="Last 7 days">
              <option>Today</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
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
              <Badge type={item.type}>
                {item.percent}
                <img
                  src={item.type === "up" ? GreenArrow : RedArrow}
                  alt="trend"
                />
              </Badge>
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
      {activeTab === "Pending" && <Pending />}
      {activeTab === "Approved" && <Approved statusFilter="approved" />}
      {activeTab === "Rejected" && <Approved statusFilter="rejected" />}
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

const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.2rem 0.45rem;
  border-radius: 999px;
  color: ${({ type }) => (type === "up" ? "#16a34a" : "#dc2626")};
  background: ${({ type }) => (type === "up" ? "#dcfce7" : "#fee2e2")};

  img {
    width: 12px;
    height: 12px;
  }
`;

const DotIcon = styled.img`
  width: 40px;
  height: 40px;
  cursor: pointer;
`;

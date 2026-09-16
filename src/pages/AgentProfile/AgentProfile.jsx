import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import TabSwitcher from "../../components/TabSwitcher";
import { PersonalDetails } from "../EmployeeProfile/Personal Details/PersonalDetails";
import EmploymentList from "./EmploymentList/EmploymentList";
import PayrollComponent from "../../components/payroll";
import Assets from "../../components/assets";
import { getUser } from "../../services/apiServices";
import { toast } from "react-toastify";

const AgentProfile = () => {
  const [active, setActive] = useState("Personal Details");
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const agentId = location.state?.agentId;

  const fetchAgent = async () => {
    if (!agentId) return;
      setLoading(true);
      try {
        const response = await getUser(agentId);
        const result = response?.data?.user || response?.data || response?.user || response?.result || response;
        setAgent(result && !Array.isArray(result) ? result : null);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch agent profile");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchAgent();
  }, [agentId]);

  return (
    <Container>
      <TabSwitcher
        tabs={[
          { label: "Personal Details", value: "Personal Details" },
          { label: "Employment List", value: "Employment List" },
          { label: "Payroll", value: "Payroll" },
          { label: "Report", value: "Report" },
        ]}
        active={active}
        onChange={setActive}
      />

      {loading ? <Section>Loading agent data...</Section> : active === "Personal Details" && <PersonalDetails employee={agent} onEmployeeUpdated={setAgent} onRefresh={fetchAgent} entity="agent" />}
      {active === "Employment List" && <EmploymentList agentId={agent?._id || agent?.id || agentId} />}
      {active === "Payroll" && (
        <PayrollComponent employee={agent} onEmployeeUpdated={setAgent} />
      )}
      {active === "Report" && <Section>Report content</Section>}
    </Container>
  );
};

export default AgentProfile;

const Container = styled.div`
  width: 100%;
  padding: 0;
`;

const Section = styled.div`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  padding: 1rem;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  color: ${theme.colors.textColor};
`;

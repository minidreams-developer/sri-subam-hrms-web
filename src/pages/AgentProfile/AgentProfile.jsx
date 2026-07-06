import React, { useState } from "react";
import styled from "styled-components";
import theme from "../../theme/theme";
import TabSwitcher from "../../components/TabSwitcher";
import { PersonalDetails } from "./Personal Details/PersonalDetails";
import EmploymentList from "./EmploymentList/EmploymentList";
import PayrollComponent from "../../components/payroll";
import Assets from "../../components/assets";

const AgentProfile = () => {
  const [active, setActive] = useState("Personal Details");

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

      {active === "Personal Details" && <PersonalDetails />}
      {active === "Employment List" && <EmploymentList />}
      {active === "Payroll" && <PayrollComponent />}
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

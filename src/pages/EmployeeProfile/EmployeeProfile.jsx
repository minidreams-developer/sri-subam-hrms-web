import React, { useState } from "react";
import styled from "styled-components";
import theme from "../../theme/theme";
import TabSwitcher from "../../components/TabSwitcher";
import { PersonalDetails } from "./Personal Details/PersonalDetails";
import { WorkDetails } from "./Work Details/WorkDetails";
import { Attendance } from "./Attendance/Attendance";

const EmployeeProfile = () => {
  const [active, setActive] = useState("Personal Details");

  return (
    <Container>
      <TabSwitcher
        tabs={[
          { label: "Personal Details", value: "Personal Details" },
          { label: "Work Details", value: "Work Details" },
          { label: "Attendance", value: "Attendance" },
          { label: "Payroll", value: "Payroll" },
          { label: "Assets", value: "Assets" },
          { label: "Report", value: "Report" },
        ]}
        active={active}
        onChange={setActive}
      />

      {active === "Personal Details" && <PersonalDetails />}
      {active === "Work Details" && <WorkDetails />}
      {active === "Attendance" && <Attendance />}
      {active === "Payroll" && <Section>Payroll content</Section>}
      {active === "Assets" && <Section>Assets content</Section>}
      {active === "Report" && <Section>Report content</Section>}
    </Container>
  );
};

export default EmployeeProfile;

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

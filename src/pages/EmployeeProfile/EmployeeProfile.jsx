import React, { useState, useEffect } from "react";
import styled from "styled-components";
import theme from "../../theme/theme";
import TabSwitcher from "../../components/TabSwitcher";
import { PersonalDetails } from "./Personal Details/PersonalDetails";
import { WorkDetails } from "./Work Details/WorkDetails";
import { Attendance } from "./Attendance/Attendance";
import PayrollComponent from "../../components/payroll";
import Assets from "../../components/assets";
import { getUser } from "../../services/apiServices";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const EmployeeProfile = () => {
  const location = useLocation();
  const [active, setActive] = useState(location.state?.activeTab || "Personal Details");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const userId = location.state?.employeeId;

  useEffect(() => {
    if (!userId) {
      setSelectedEmployee(null);
      return;
    }
    fetchEmployee(userId);
  }, [userId]);

  const fetchEmployee = async (employeeUserId) => {
    setLoading(true);
    try {
      const response = await getUser(employeeUserId);
      const employee = response?.data?.user || response?.data || response?.user || response?.result || response;
      setSelectedEmployee(employee && !Array.isArray(employee) ? employee : null);
    } catch (error) {
      setSelectedEmployee(null);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch employee profile";
      toast.error(errorMessage);
      console.error("Fetch employee profile error:", error);
    } finally {
      setLoading(false);
    }
  };

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

      {loading ? (
        <Section>Loading employee data...</Section>
      ) : selectedEmployee ? (
        <>
          {active === "Personal Details" && (
            <PersonalDetails employee={selectedEmployee} onEmployeeUpdated={setSelectedEmployee} />
          )}
          {active === "Work Details" && <WorkDetails employee={selectedEmployee} onEmployeeUpdated={setSelectedEmployee} />}
          {active === "Attendance" && <Attendance employee={selectedEmployee} />}
          {active === "Payroll" && <PayrollComponent employee={selectedEmployee} onEmployeeUpdated={setSelectedEmployee} />}
          {active === "Assets" && <Assets employee={selectedEmployee} />}
          {active === "Report" && <Section>Report content</Section>}
        </>
      ) : (
        <Section>No employee data available</Section>
      )}
    </Container>
  );
};

export default EmployeeProfile;

const Container = styled.div`
  width: 100%;
  padding: 0;
  font-family: "Inter", "Inter-Regular", sans-serif;

  *, *::before, *::after {
    box-sizing: border-box;
  }

  > div:first-child {
    gap: 32px;
    margin-bottom: 20px;

    button {
      padding: 8px 0 13px;
      border-bottom-width: 3px;
      font-family: "Inter-Medium", sans-serif;
      font-weight: 500;
    }
  }
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

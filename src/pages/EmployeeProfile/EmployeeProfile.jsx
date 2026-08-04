import React, { useState, useEffect } from "react";
import styled from "styled-components";
import theme from "../../theme/theme";
import TabSwitcher from "../../components/TabSwitcher";
import { PersonalDetails } from "./Personal Details/PersonalDetails";
import { WorkDetails } from "./Work Details/WorkDetails";
import { Attendance } from "./Attendance/Attendance";
import PayrollComponent from "../../components/payroll";
import Assets from "../../components/assets";
import { get } from "../../helpers/api_helper";
import { GET_EMPLOYEES_BY_ROLE } from "../../helpers/url_helper";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const EmployeeProfile = () => {
  const location = useLocation();
  const [active, setActive] = useState(location.state?.activeTab || "Personal Details");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await get(`${GET_EMPLOYEES_BY_ROLE}?role=employee&limit=100`);
      console.log("Employees API Response:", response);
      
      let employeeList = [];
      if (response && Array.isArray(response)) {
        employeeList = response;
      } else if (response?.results && Array.isArray(response.results)) {
        employeeList = response.results;
      } else if (response?.data && Array.isArray(response.data)) {
        employeeList = response.data;
      } else if (response?.users && Array.isArray(response.users)) {
        employeeList = response.users;
      }
      
      setEmployees(employeeList);
      
      // Open the employee selected in the table (fall back to the first result
      // for direct links/bookmarks).
      if (employeeList.length > 0) {
        const requestedId = location.state?.employeeId;
        setSelectedEmployee(
          employeeList.find((item) => (item.id || item._id) === requestedId) || employeeList[0]
        );
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch employees";
      toast.error(errorMessage);
      console.error("Fetch employees error:", error);
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
          {active === "Work Details" && <WorkDetails employee={selectedEmployee} />}
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

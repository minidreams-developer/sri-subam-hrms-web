import { useState } from "react";
import styled from "styled-components";
import theme from "../../theme/theme";
import ReusableTable from "../../components/ReusableTable";
import ProfileImage from "../../assets/images/employee/sampleProfile.jpg";
import DotMenuIcon from "../../assets/images/DayOff/dot-menu.svg";

const Adjustments = ({ searchQuery, selectedMonth }) => {
  const adjustmentsData = [
    {
      id: 1,
      employee: { name: "Manoj Kumar", role: "#ST5683", profileImage: null },
      type: "Bonus",
      component: "Performance Bonus",
      date: "14-01-2026",
      amount: "₹5,000",
      payrollMonth: "January 2026",
      status: "Approved",
    },
    {
      id: 2,
      employee: { name: "John Doe", role: "#ST5684", profileImage: null },
      type: "Deduction",
      component: "Late Penalty",
      date: "15-01-2026",
      amount: "₹2,000",
      payrollMonth: "January 2026",
      status: "Pending",
    },
    {
      id: 3,
      employee: { name: "Jane Smith", role: "#ST5685", profileImage: null },
      type: "Allowance",
      component: "Travel Allowance",
      date: "16-01-2026",
      amount: "₹3,500",
      payrollMonth: "January 2026",
      status: "Approved",
    },
    {
      id: 4,
      employee: { name: "Bob Johnson", role: "#ST5686", profileImage: null },
      type: "Overtime",
      component: "Weekend Work",
      date: "17-01-2026",
      amount: "₹4,200",
      payrollMonth: "January 2026",
      status: "Rejected",
    },
    {
      id: 5,
      employee: { name: "Alice Williams", role: "#ST5687", profileImage: null },
      type: "Bonus",
      component: "Annual Bonus",
      date: "18-01-2026",
      amount: "₹6,000",
      payrollMonth: "January 2026",
      status: "Approved",
    },
  ];

  const columns = [
    {
      header: "Name",
      key: "employee",
      render: (row) => (
        <EmployeeCell>
          <EmployeeAvatar
            src={row.employee.profileImage || ProfileImage}
            alt={row.employee.name}
          />
          <EmployeeInfo>
            <EmployeeName>{row.employee.name}</EmployeeName>
            <EmployeeRole>{row.employee.role}</EmployeeRole>
          </EmployeeInfo>
        </EmployeeCell>
      ),
    },
    {
      header: "Type",
      key: "type",
    },
    {
      header: "Component",
      key: "component",
    },
    {
      header: "Date",
      key: "date",
    },
    {
      header: "Amount",
      key: "amount",
    },
    {
      header: "Payroll Month",
      key: "payrollMonth",
    },
    {
      header: "Status",
      key: "status",
    },
    {
      header: "Action",
      key: "actions",
      render: (row) => (
        <ActionButton onClick={(e) => { e.stopPropagation(); console.log("Action clicked:", row); }}>
          <img src={DotMenuIcon} alt="menu" width="20" height="20" />
        </ActionButton>
      ),
    },
  ];

  const filteredData = adjustmentsData.filter((row) => {
    const matchesSearch =
      !searchQuery ||
      row.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleRowClick = (row) => {
    console.log("Row clicked:", row);
  };

  return (
    <Container>
      <ReusableTable
        columns={columns}
        data={filteredData}
        rowsPerPage={5}
        totalResults={filteredData.length}
        onRowClick={handleRowClick}
        alwaysShowPagination={true}
        paginationBorder={true}
      />
    </Container>
  );
};

export default Adjustments;

const Container = styled.div`
  width: 100%;
`;

const EmployeeCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const EmployeeAvatar = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const EmployeeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

const EmployeeName = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
  line-height: 1.2;
`;

const EmployeeRole = styled.p`
  font-size: 0.75rem;
  font-weight: 400;
  font-family: "Inter-Regular", sans-serif;
  color: ${theme.colors.secondaryText};
  margin: 0;
  line-height: 1.2;
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

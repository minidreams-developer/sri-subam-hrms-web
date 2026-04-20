import { useState } from "react";
import styled from "styled-components";
import theme from "../../theme/theme";
import ReusableTable from "../../components/ReusableTable";
import ProfileImage from "../../assets/images/employee/sampleProfile.jpg";
import ApproveIcon from "../../assets/images/Badges/approve.svg";
import CancelIcon from "../../assets/images/Badges/cancel.svg";

const Pendings = ({ searchQuery, selectedMonth }) => {
  const pendingsData = [
    {
      id: 1,
      employee: { name: "Sarah Connor", role: "#ST5690", profileImage: null },
      type: "Bonus",
      component: "Performance Bonus",
      date: "10-01-2026",
      amount: "₹7,500",
      payrollMonth: "January 2026",
      status: "Pending",
    },
    {
      id: 2,
      employee: { name: "Michael Scott", role: "#ST5691", profileImage: null },
      type: "Allowance",
      component: "Travel Allowance",
      date: "11-01-2026",
      amount: "₹4,000",
      payrollMonth: "January 2026",
      status: "Pending",
    },
    {
      id: 3,
      employee: { name: "Pam Beesly", role: "#ST5692", profileImage: null },
      type: "Overtime",
      component: "Weekend Work",
      date: "12-01-2026",
      amount: "₹3,200",
      payrollMonth: "January 2026",
      status: "Pending",
    },
    {
      id: 4,
      employee: { name: "Jim Halpert", role: "#ST5693", profileImage: null },
      type: "Bonus",
      component: "Annual Bonus",
      date: "13-01-2026",
      amount: "₹5,500",
      payrollMonth: "January 2026",
      status: "Pending",
    },
    {
      id: 5,
      employee: { name: "Dwight Schrute", role: "#ST5694", profileImage: null },
      type: "Commission",
      component: "Sales Commission",
      date: "14-01-2026",
      amount: "₹8,000",
      payrollMonth: "January 2026",
      status: "Pending",
    },
  ];

  const handleApprove = (row) => {
    console.log("Approve:", row);
  };

  const handleCancel = (row) => {
    console.log("Cancel:", row);
  };

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
        <ActionButtons>
          <ActionButton onClick={(e) => { e.stopPropagation(); handleCancel(row); }}>
            <img src={CancelIcon} alt="cancel" width="30" height="30" />
          </ActionButton>
          <ActionButton onClick={(e) => { e.stopPropagation(); handleApprove(row); }}>
            <img src={ApproveIcon} alt="approve" width="30" height="30" />
          </ActionButton>
        </ActionButtons>
      ),
    },
  ];

  const filteredData = pendingsData.filter((row) => {
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

export default Pendings;

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

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0rem;
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

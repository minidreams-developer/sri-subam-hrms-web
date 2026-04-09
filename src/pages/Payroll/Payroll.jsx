import { useState } from "react";
import styled from "styled-components";
import theme from "../../theme/theme";
import ReusableTable from "../../components/ReusableTable";
import TableToolbar from "../../components/TableToolbar";
import DotIcon from "../../assets/images/Overtime/actionDot.svg";

const Payroll = () => {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [shift, setShift] = useState("All Shifts");

  const departmentOptions = ["All Departments", "IT", "HR", "Sales", "Marketing", "Finance"];
  const shiftOptions = ["All Shifts", "Morning Shift", "Evening Shift", "Night Shift"];

  const columns = [
    { header: "Employee ID", accessor: "employeeId" },
    { header: "Name", accessor: "name" },
    { header: "Designation", accessor: "designation" },
    { header: "Dept.", accessor: "department" },
    { header: "Full Day", accessor: "fullDay" },
    { header: "Half Day", accessor: "halfDay" },
    { header: "Off Days", accessor: "offDays" },
    { header: "Paid Leaves", accessor: "paidLeaves" },
    { header: "Unpaid Leaves", accessor: "unpaidLeaves" },
    { header: "Daily Wages", accessor: "dailyWages" },
    { header: "Gross Wages", accessor: "grossWages" },
    { header: "Earned Wages", accessor: "earnedWages" },
    { header: "Other Wages", accessor: "otherWages" },
    { header: "Over Time", accessor: "overTime" },
    { header: "Extras", accessor: "extras" },
    { header: "Gross Earnings", accessor: "grossEarnings" },
    { header: "Penalties", accessor: "penalties" },
    { header: "Loan & Advance", accessor: "loanAdvance" },
    { header: "Other Deductions", accessor: "otherDeductions" },
    { header: "Take Home", accessor: "takeHome" },
    { header: "Preview", accessor: "preview" },
  ];

  const data = [
    {
      employeeId: "EMP001",
      name: "John Doe",
      designation: "Software Engineer",
      department: "IT",
      fullDay: 22,
      halfDay: 2,
      offDays: 4,
      paidLeaves: 2,
      unpaidLeaves: 0,
      dailyWages: "₹2,000",
      grossWages: "₹44,000",
      earnedWages: "₹46,000",
      otherWages: "₹2,000",
      overTime: "₹5,000",
      extras: "₹1,000",
      grossEarnings: "₹54,000",
      penalties: "₹500",
      loanAdvance: "₹2,000",
      otherDeductions: "₹1,500",
      takeHome: "₹50,000",
      preview: "₹50,000",
    },
    {
      employeeId: "EMP002",
      name: "Jane Smith",
      designation: "HR Manager",
      department: "HR",
      fullDay: 24,
      halfDay: 1,
      offDays: 4,
      paidLeaves: 1,
      unpaidLeaves: 0,
      dailyWages: "₹2,500",
      grossWages: "₹60,000",
      earnedWages: "₹62,500",
      otherWages: "₹2,500",
      overTime: "₹3,000",
      extras: "₹1,500",
      grossEarnings: "₹69,500",
      penalties: "₹0",
      loanAdvance: "₹0",
      otherDeductions: "₹1,000",
      takeHome: "₹68,500",
      preview: "₹68,500",
    },
    {
      employeeId: "EMP003",
      name: "Mike Johnson",
      designation: "Sales Executive",
      department: "Sales",
      fullDay: 20,
      halfDay: 3,
      offDays: 4,
      paidLeaves: 3,
      unpaidLeaves: 1,
      dailyWages: "₹1,800",
      grossWages: "₹36,000",
      earnedWages: "₹38,700",
      otherWages: "₹2,700",
      overTime: "₹4,000",
      extras: "₹2,000",
      grossEarnings: "₹47,400",
      penalties: "₹1,000",
      loanAdvance: "₹3,000",
      otherDeductions: "₹500",
      takeHome: "₹42,900",
      preview: "₹42,900",
    },
    {
      employeeId: "EMP004",
      name: "Sarah Williams",
      designation: "Marketing Manager",
      department: "Marketing",
      fullDay: 23,
      halfDay: 1,
      offDays: 4,
      paidLeaves: 2,
      unpaidLeaves: 0,
      dailyWages: "₹2,200",
      grossWages: "₹50,600",
      earnedWages: "₹51,700",
      otherWages: "₹1,100",
      overTime: "₹2,500",
      extras: "₹1,200",
      grossEarnings: "₹56,500",
      penalties: "₹300",
      loanAdvance: "₹1,500",
      otherDeductions: "₹800",
      takeHome: "₹53,900",
      preview: "₹53,900",
    },
    {
      employeeId: "EMP005",
      name: "David Brown",
      designation: "Finance Analyst",
      department: "Finance",
      fullDay: 25,
      halfDay: 0,
      offDays: 4,
      paidLeaves: 1,
      unpaidLeaves: 0,
      dailyWages: "₹2,300",
      grossWages: "₹57,500",
      earnedWages: "₹57,500",
      otherWages: "₹0",
      overTime: "₹3,500",
      extras: "₹1,000",
      grossEarnings: "₹62,000",
      penalties: "₹0",
      loanAdvance: "₹0",
      otherDeductions: "₹1,200",
      takeHome: "₹60,800",
      preview: "₹60,800",
    },
  ];

  return (
    <Container>
      <TableToolbar
        searchPlaceholder="Search employees"
        searchValue={search}
        onSearchChange={setSearch}
        select1Options={departmentOptions}
        select1Value={department}
        onSelect1Change={setDepartment}
        select2Options={shiftOptions}
        select2Value={shift}
        onSelect2Change={setShift}
        showFilter={true}
        filterText="Filter"
        showDotIcon={true}
        dotIcon={DotIcon}
        searchPosition="left"
      />

      <TableContainer>
        <ReusableTable columns={columns} data={data} />
      </TableContainer>
    </Container>
  );
};

export default Payroll;

const Container = styled.div`
  width: 100%;
  padding: 1.5rem 0;
`;

const TableContainer = styled.div`
  background: ${theme.colors.white};
  border-radius: 0.75rem;
  overflow: hidden;
`;


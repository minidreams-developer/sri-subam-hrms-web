import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ReusableTable from "../../components/ReusableTable";
import GreenArrow from "../../assets/images/dashboard Images/green.svg";
import RedArrow from "../../assets/images/dashboard Images/red.svg";
import theme from "../../theme/theme";
import Button from "../../components/Button";
import TableToolbar from "../../components/TableToolbar";
import PlusIcon from "../../assets/images/Dashboard Images/plus-large_svgrepo.com.svg";
import TabSwitcher from "../../components/TabSwitcher";
import {
  dashboardStats,
  employeeTableColumns,
  employeeTableData,
  staffTableColumns,
  staffTableData,
} from "../../utils/data";

const Employees = () => {
  const navigate = useNavigate();
  const stats = dashboardStats;

  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedRange, setSelectedRange] = useState("Last 7 days");
  const [activeTab, setActiveTab] = useState("Employee");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employeeDept, setEmployeeDept] = useState("All Department");
  const [employeeShift, setEmployeeShift] = useState("All Shifts");
  const [staffSearch, setStaffSearch] = useState("");
  const [staffRole, setStaffRole] = useState("All Roles");
  const [staffShift, setStaffShift] = useState("All Shifts");

  const handleRowClick = (row) => {
    navigate("/admin/peopleHub/employees/employeeProfile");
  };

  const filteredEmployeeData = employeeTableData.filter((row) => {
    const m1 =
      employeeDept === "All Department" || row.department === employeeDept;
    const m2 = employeeShift === "All Shifts" || row.shift === employeeShift;
    const m3 =
      !employeeSearch ||
      row.name.toLowerCase().includes(employeeSearch.toLowerCase());
    return m1 && m2 && m3;
  });

  const filteredStaffData = staffTableData.filter((row) => {
    const m1 = staffRole === "All Roles" || row.role === staffRole;
    const m2 = staffShift === "All Shifts" || row.shift === staffShift;
    const m3 =
      !staffSearch ||
      row.name.toLowerCase().includes(staffSearch.toLowerCase());
    return m1 && m2 && m3;
  });

  return (
    <Container>
      <Top>
        <TopTitle>Quick Stats</TopTitle>
        <Controls>
          <FilterSelect>
            <select
              className="form-select"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option>All</option>
              <option>Active</option>
              <option>In-Active</option>
            </select>
          </FilterSelect>
          <FilterSelect>
            <select
              className="form-select"
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </FilterSelect>
          <Button
            text="Export Data"
            bg={theme.colors.white}
            color={theme.colors.primary}
            border={`1px solid ${theme.colors.primary}`}
            width="9.625rem"
            radius="0.625rem"
          />
        </Controls>
      </Top>
      {/* QUICK STATS */}
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
          { label: "Employee", value: "Employee" },
          { label: "Staffs", value: "Staffs" },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "Employee" ? (
        <>
          <TableToolbar
            searchPlaceholder="Search Employee"
            searchValue={employeeSearch}
            onSearchChange={setEmployeeSearch}
            select1Options={["All Department", "HR", "IT", "Sales"]}
            select1Value={employeeDept}
            onSelect1Change={setEmployeeDept}
            select2Options={["All Shifts", "Day", "Night"]}
            select2Value={employeeShift}
            onSelect2Change={setEmployeeShift}
            filterText="Filter"
            actionText="New Employee"
            actionIcon={<img src={PlusIcon} alt="add" width="16" height="16" />}
          />
          <ReusableTable
            columns={employeeTableColumns}
            data={filteredEmployeeData}
            rowsPerPage={5}
            totalResults={filteredEmployeeData.length}
            onRowClick={handleRowClick}
          />
        </>
      ) : (
        <>
          <TableToolbar
            searchPlaceholder="Search Staff"
            searchValue={staffSearch}
            onSearchChange={setStaffSearch}
            select1Options={[
              "All Roles",
              "Office Admin",
              "Receptionist",
              "Facilities",
              "Security",
            ]}
            select1Value={staffRole}
            onSelect1Change={setStaffRole}
            select2Options={["All Shifts", "Day", "Night"]}
            select2Value={staffShift}
            onSelect2Change={setStaffShift}
            filterText="Filter"
            actionText="New Staff"
            actionIcon={<img src={PlusIcon} alt="add" width="16" height="16" />}
          />
          <ReusableTable
            columns={staffTableColumns}
            data={filteredStaffData}
            rowsPerPage={5}
            totalResults={filteredStaffData.length}
            onRowClick={handleRowClick}
          />
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 1.5rem 0;
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

export default Employees;

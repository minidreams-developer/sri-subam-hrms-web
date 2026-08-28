import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ReusableTable from "../../../components/ReusableTable";
import GreenArrow from "../../../assets/images/dashboardImages/green.svg";
import RedArrow from "../../../assets/images/dashboardImages/red.svg";
import theme from "../../../theme/theme";
import Button from "../../../components/Button";
import TableToolbar from "../../../components/TableToolbar";
import PlusIcon from "../../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import Filter from "../../../components/filter";
import { deleteUser, getUsers } from "../../../services/apiServices";
import { toast } from "react-toastify";

const employmentStats = [
  { title: "Total Employees", value: "300", percent: "12 %", type: "down" },
  { title: "Active Employees", value: "256", percent: "20.5 %", type: "up" },
  { title: "In-Active Employees", value: "39", percent: "12 %", type: "down" },
  { title: "New Employees", value: "03", percent: "20.5 %", type: "up" },
];

const employmentTableData = [
  {
    employeeId: "EMP001",
    name: "Manoj Kumar",
    designation: "UI/UX Designer",
    department: "Design",
    shift: "Shift 1",
    joinedDate: "12-12-2025",
    status: "Active",
  },
  {
    employeeId: "EMP002",
    name: "Adison Stanton",
    designation: "Procurement",
    department: "PP",
    shift: "Shift 3",
    joinedDate: "12-12-2025",
    status: "In-Active",
  },
  {
    employeeId: "EMP003",
    name: "Cheyenne Workman",
    designation: "Developer",
    department: "DT",
    shift: "Shift 4",
    joinedDate: "12-12-2025",
    status: "Relieved",
  },
  {
    employeeId: "EMP004",
    name: "Jocelyn Bergson",
    designation: "Sales Manager",
    department: "Rotational",
    shift: "Shift 1",
    joinedDate: "12-12-2025",
    status: "Active",
  },
  {
    employeeId: "EMP005",
    name: "Nolan Dokidis",
    designation: "UI/UX Designer",
    department: "Dev",
    shift: "Shift 1",
    joinedDate: "12-12-2025",
    status: "In-Active",
  },
  {
    employeeId: "EMP006",
    name: "Marilyn Press",
    designation: "Front end Developer",
    department: "MT",
    shift: "Shift 2",
    joinedDate: "12-12-2025",
    status: "In-Active",
  },
  {
    employeeId: "EMP007",
    name: "Cheyenne Workman",
    designation: "UI/UX Designer",
    department: "Design",
    shift: "Shift 3",
    joinedDate: "12-12-2025",
    status: "Active",
  },
];

const normalizeEmployeeStatus = (employee) => {
  const rawStatus = employee?.isActive ?? employee?.status;
  if (rawStatus === true) return "Active";
  if (rawStatus === false) return "In-Active";

  const normalized = String(rawStatus ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

  if (["inactive", "false", "disabled"].includes(normalized)) return "In-Active";
  if (["active", "true", "enabled"].includes(normalized)) return "Active";
  if (normalized === "relieved") return "Relieved";
  return rawStatus || "N/A";
};

const EmploymentList = ({ agentId }) => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedRange, setSelectedRange] = useState("Last 7 days");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employeeDept, setEmployeeDept] = useState("All Department");
  const [employeeShift, setEmployeeShift] = useState("All Shifts");
  const [showFilter, setShowFilter] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!agentId) {
      setEmployees([]);
      return;
    }
    const timeoutId = window.setTimeout(() => fetchEmployees(currentPage), employeeSearch.trim() ? 350 : 0);
    return () => window.clearTimeout(timeoutId);
  }, [agentId, currentPage, employeeSearch]);

  const fetchEmployees = async (page = 1) => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        contractAgent: agentId,
        page: String(page),
        limit: "10",
      });
      if (employeeSearch.trim()) query.set("search", employeeSearch.trim());
      const response = await getUsers(Object.fromEntries(query));
      const list = Array.isArray(response)
        ? response
        : response?.results || response?.data?.results || (Array.isArray(response?.data) ? response.data : []) || response?.users || [];
      const rows = list.map((employee) => {
        const work = employee.workInformation || {};
        const department = work.department || employee.department;
        const shift = work.shiftId || work.shift || employee.shift;
        const joinedDate = work.joinedDate || employee.dateOfJoining;
        return {
          id: employee._id || employee.id,
          employeeId: employee.employeeId || "N/A",
          name: employee.name || employee.employeeName || "N/A",
          designation: work.designation || employee.designation || "N/A",
          department: typeof department === "object" ? department?.departmentName || department?.name || "N/A" : department || "N/A",
          shift: typeof shift === "object" ? shift?.shiftName || shift?.name || "N/A" : shift || "N/A",
          joinedDate: joinedDate ? new Date(joinedDate).toLocaleDateString("en-GB") : "N/A",
          status: normalizeEmployeeStatus(employee),
        };
      });
      setEmployees(rows);
      setTotalResults(response?.totalResults ?? response?.data?.totalResults ?? rows.length);
      setTotalPages(response?.totalPages ?? response?.data?.totalPages ?? (rows.length ? 1 : 0));
    } catch (error) {
      setEmployees([]);
      setTotalResults(0);
      setTotalPages(0);
      toast.error(error.response?.data?.message || "Failed to fetch agent employees");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewEmployee = (employee) => {
    navigate("/admin/peopleHub/employees/employeeProfile", {
      state: { employeeId: employee.id || employee.employeeId },
    });
  };

  const handleDeleteEmployee = async (employee) => {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete ${employee.name}?`,
    );

    if (shouldDelete) {
      try {
        await deleteUser(employee.id);
        toast.success("Employee deleted successfully");
        await fetchEmployees(currentPage);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete employee");
      }
    }
  };

  const handleEditEmployee = (employee) => {
    navigate("/admin/peopleHub/employees/create", {
      state: {
        employeeId: employee.id || employee.employeeId,
        mode: "edit",
      },
    });
  };

  const employmentTableColumns = [
    { header: "Employee ID", accessor: "employeeId" },
    { header: "Name", accessor: "name" },
    { header: "Designation", accessor: "designation" },
    { header: "Dept.", accessor: "department" },
    { header: "Shift", accessor: "shift" },
    { header: "Joined Date", accessor: "joinedDate" },
    { header: "Status", accessor: "status" },
    { header: "Action", accessor: "action" },
  ];

  const handleFilterOpen = () => {
    setShowFilter(true);
  };

  const handleFilterClose = () => {
    setShowFilter(false);
  };

  const handleFilterApply = (filters) => {
    console.log("Applied filters:", filters);
    if (filters.department && filters.department.length > 0) {
      setEmployeeDept(filters.department[0]);
    }
    if (filters.shift && filters.shift.length > 0) {
      setEmployeeShift(filters.shift[0]);
    }
    setShowFilter(false);
  };

  const handleNewEmployee = () => {
    navigate("/admin/peopleHub/employees/create");
  };

  const filteredEmploymentData = employees.filter((row) => {
    const m1 = employeeDept === "All Department" || row.department === employeeDept;
    const m2 = employeeShift === "All Shifts" || row.shift === employeeShift;
    return m1 && m2;
  });

  return (
    <Container>
      {showFilter && <Filter onClose={handleFilterClose} onApply={handleFilterApply} />}
      <Top>
        <TopTitle>Quick Stats</TopTitle>
        <Controls>
          <FilterSelect>
            <select
              className="form-select"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
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
      <StatsGrid>
        {employmentStats.map((item, index) => (
          <StatCard key={index}>
            <CardTitle>{item.title}</CardTitle>
            <CardFooter>
              <CardValue>{item.value}</CardValue>
              <Badge type={item.type}>
                {item.percent}
                <img src={item.type === "up" ? GreenArrow : RedArrow} alt="trend" />
              </Badge>
            </CardFooter>
          </StatCard>
        ))}
      </StatsGrid>

      <SectionTitle>Total Employees</SectionTitle>

      <TableToolbar
        searchPlaceholder="Search Employee"
        searchValue={employeeSearch}
        onSearchChange={(value) => {
          setEmployeeSearch(value);
          setCurrentPage(1);
        }}
        select1Options={["All Department", "HR", "IT", "Sales", "Design", "PP", "DT", "Rotational", "Dev", "MT"]}
        select1Value={employeeDept}
        onSelect1Change={setEmployeeDept}
        select2Options={["All Shifts", "Shift 1", "Shift 2", "Shift 3", "Shift 4", "Day", "Night"]}
        select2Value={employeeShift}
        onSelect2Change={setEmployeeShift}
        filterText="Filter"
        onFilterClick={handleFilterOpen}
        actionText="New Employee"
        actionIcon={<img src={PlusIcon} alt="add" width="16" height="16" />}
        onActionClick={handleNewEmployee}
      />

      <ReusableTable
        columns={employmentTableColumns}
        data={filteredEmploymentData}
        rowsPerPage={10}
        totalResults={totalResults}
        totalPages={totalPages}
        currentPage={currentPage}
        server={true}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
        alwaysShowPagination
        onView={handleViewEmployee}
        onEdit={handleEditEmployee}
        onDelete={handleDeleteEmployee}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
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

const SectionTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0 0 1rem 0;
`;

export default EmploymentList;

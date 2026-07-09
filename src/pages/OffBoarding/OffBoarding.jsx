import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ReusableTable from "../../components/ReusableTable";
import GreenArrow from "../../assets/images/dashboardImages/green.svg";
import RedArrow from "../../assets/images/dashboardImages/red.svg";
import theme from "../../theme/theme";
import Button from "../../components/Button";
import TableToolbar from "../../components/TableToolbar";
import PlusIcon from "../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import TabSwitcher from "../../components/TabSwitcher";
import ProfileImage from "../../assets/images/employee/sampleProfile.jpg";
import { get } from "../../helpers/api_helper";
import { GET_OFFBOARDS } from "../../helpers/url_helper";
import { toast } from "react-toastify";
import Filter from "../../components/filter";
import {
  dashboardStats,
  offboardingEmployeeColumns,
  offboardingStaffColumns,
} from "../../utils/data";

const OffBoarding = () => {
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
  const [showFilter, setShowFilter] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  
  // API state
  const [offboardingData, setOffboardingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const handleFilterApply = (filters) => {
    setAppliedFilters(filters);
    setShowFilter(false);
    console.log("Applied filters:", filters);
  };

  // Fetch offboarding records on component mount
  useEffect(() => {
    fetchOffboardingRecords();
  }, [currentPage, pageSize]);

  const fetchOffboardingRecords = async () => {
    setLoading(true);
    try {
      const response = await get(`${GET_OFFBOARDS}?page=${currentPage}&limit=${pageSize}`);
      console.log("Offboarding records fetched:", response);
      
      let records = [];
      
      // Handle different response structures
      if (Array.isArray(response)) {
        records = response;
      } else if (response?.results && Array.isArray(response.results)) {
        records = response.results;
        setTotalResults(response.totalResults || 0);
        setTotalPages(response.totalPages || 0);
      } else if (response?.data && Array.isArray(response.data)) {
        records = response.data;
      }
      
      setOffboardingData(records);
    } catch (error) {
      console.error("Error fetching offboarding records:", error);
      
      // Check if it's a backend parsing error
      if (error?.response?.status === 400 && error?.response?.data?.message?.includes("Cast to ObjectId")) {
        console.error("Backend API Error: ObjectId parsing failed");
        console.error("This indicates the backend is incorrectly parsing query parameters as MongoDB IDs");
        toast.error("Backend API error: Please contact support");
      } else {
        toast.error("Failed to fetch offboarding records");
      }
      
      setOffboardingData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (row) => {
    navigate("/admin/peopleHub/off-boarding/EmployeeOffBoardingDetails", { state: { offboardId: row.id } });
  };

  const handleNewOffBoarding = () => {
    navigate("/admin/peopleHub/off-boarding/createEmployeeOffBoard");
  };

  // Transform API data to table format
  const transformedEmployeeData = offboardingData.map((record) => ({
    id: record._id,
    employee: {
      name: record.userId?.name || `${record.userId?.firstName || ""} ${record.userId?.lastName || ""}`.trim() || "N/A",
      role: record.userId?.employeeId || "N/A",
      profileImage: record.userId?.profileImage || ProfileImage,
    },
    exitType: record.exitInformation?.exitType || "N/A",
    exitReason: record.exitInformation?.exitReason || "N/A",
    lastWorkingDate: record.exitInformation?.lastWorkingDate || "N/A",
    exitApprovedBy: record.exitInformation?.exitApprovedBy || "N/A",
    status: record.isEmailVerified ? "Verified" : "Pending",
  }));

  const filteredEmployeeData = transformedEmployeeData.filter((row) => {
    const m3 =
      !employeeSearch ||
      row.employee.name.toLowerCase().includes(employeeSearch.toLowerCase());
    return m3;
  });

  // For staff tab, use same data (can be separated if needed)
  const filteredStaffData = transformedEmployeeData.filter((row) => {
    const m3 =
      !staffSearch ||
      row.employee.name.toLowerCase().includes(staffSearch.toLowerCase());
    return m3;
  });

  // Custom columns with employee renderer
  const employeeColumnsWithRenderer = offboardingEmployeeColumns.map((col) => {
    if (col.accessor === "employee") {
      return {
        ...col,
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
      };
    }
    return col;
  });

  const staffColumnsWithRenderer = offboardingStaffColumns.map((col) => {
    if (col.accessor === "staff") {
      return {
        ...col,
        render: (row) => (
          <EmployeeCell>
            <EmployeeAvatar
              src={row.staff.profileImage || ProfileImage}
              alt={row.staff.name}
            />
            <EmployeeInfo>
              <EmployeeName>{row.staff.name}</EmployeeName>
              <EmployeeRole>{row.staff.role}</EmployeeRole>
            </EmployeeInfo>
          </EmployeeCell>
        ),
      };
    }
    return col;
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
            actionText="New OffBoarding"
            actionIcon={<img src={PlusIcon} alt="add" width="16" height="16" />}
            onActionClick={handleNewOffBoarding}
            onFilterClick={() => setShowFilter(true)}
          />
          <ReusableTable
            columns={employeeColumnsWithRenderer}
            data={filteredEmployeeData}
            rowsPerPage={pageSize}
            totalResults={totalResults}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onRowClick={handleRowClick}
            server={true}
            loading={loading}
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
            onFilterClick={() => setShowFilter(true)}
          />
          <ReusableTable
            columns={staffColumnsWithRenderer}
            data={filteredStaffData}
            rowsPerPage={pageSize}
            totalResults={totalResults}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onRowClick={handleRowClick}
            server={true}
            loading={loading}
          />
        </>
      )}

      {showFilter && (
        <Filter
          onClose={() => setShowFilter(false)}
          onApply={handleFilterApply}
        />
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

export default OffBoarding;

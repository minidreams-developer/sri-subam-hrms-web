import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ReusableTable from "../../components/ReusableTable";
import theme from "../../theme/theme";
import Button from "../../components/Button";
import TableToolbar from "../../components/TableToolbar";
import PlusIcon from "../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import TabSwitcher from "../../components/TabSwitcher";
import ProfileImage from "../../assets/images/employee/sampleProfile.jpg";
import {
  deleteOffboard,
  finalizeOffboard,
  getDepartments,
  getOffboards,
  getOffboardSummary,
} from "../../services/apiServices";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";
import Filter from "../../components/filter";
import {
  offboardingEmployeeColumns,
  offboardingStaffColumns,
} from "../../utils/data";

const isApprovedOffboardingStatus = (status) =>
  String(status || "").trim().toLowerCase() === "approved";

const toLocalDateKey = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isLastWorkingDateDue = (lastWorkingDate) => {
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const lastWorkingDateKey = toLocalDateKey(lastWorkingDate);
  return Boolean(lastWorkingDateKey) && lastWorkingDateKey <= todayKey;
};

const OffBoarding = () => {
  const navigate = useNavigate();

  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedRange, setSelectedRange] = useState("Last 7 days");
  const [activeTab, setActiveTab] = useState("Employee");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employeeDept, setEmployeeDept] = useState("All Department");
  const [staffSearch, setStaffSearch] = useState("");
  const [staffRole, setStaffRole] = useState("All Roles");
  const [showFilter, setShowFilter] = useState(false);

  // API state
  const [offboardingData, setOffboardingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [offboardingStats, setOffboardingStats] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const handleFilterApply = (filters) => {
    setShowFilter(false);
    console.log("Applied filters:", filters);
  };

  const fetchDepartments = async () => {
    try {
      const deptResponse = await getDepartments();
      console.log("Departments response:", deptResponse);

      // Handle different response structures
      const deptList =
        deptResponse?.results || deptResponse?.data || deptResponse || [];

      // Transform to dropdown options
      const deptOptions = deptList.map((dept) => ({
        value: dept.departmentName || dept.name || "N/A",
        label: dept.departmentName || dept.name || "N/A",
      }));

      setDepartmentOptions(deptOptions);
      console.log("Department options:", deptOptions);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to load departments");
    }
  };

  // Fetch offboarding records on component mount
  useEffect(() => {
    fetchOffboardingRecords();
    fetchDepartments();
    fetchOffboardingSummary();
    // Both fetch functions are intentionally re-run only when pagination changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  const fetchOffboardingRecords = async () => {
    setLoading(true);
    try {
      const response = await getOffboards({
        page: currentPage,
        limit: pageSize,
      });
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
      if (
        error?.response?.status === 400 &&
        error?.response?.data?.message?.includes("Cast to ObjectId")
      ) {
        console.error("Backend API Error: ObjectId parsing failed");
        console.error(
          "This indicates the backend is incorrectly parsing query parameters as MongoDB IDs",
        );
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
    navigate("/admin/peopleHub/off-boarding/EmployeeOffBoardingDetails", {
      state: { offboardId: row.id },
    });
  };

  const fetchOffboardingSummary = async () => {
    setSummaryLoading(true);
    try {
      const response = await getOffboardSummary();
      const summary = response?.data || response || {};
      const value = (...keys) => {
        const key = keys.find((item) => summary[item] !== undefined && summary[item] !== null);
        return key ? summary[key] : "—";
      };
      setOffboardingStats([
        { title: "In Progress", value: value("inProgress", "in_progress") },
        { title: "Pending Clearance", value: value("pendingClearance", "pending_clearance") },
        { title: "FnF Pending", value: value("fnfPending", "fnf_pending", "pendingFnF") },
        { title: "Completed", value: value("completed", "totalCompleted") },
        { title: "Avg Exit Time", value: value("avgExitTime", "averageExitTime", "average_exit_time"), suffix: "Days" },
      ]);
    } catch (error) {
      console.error("Error fetching offboarding summary:", error);
      setOffboardingStats([]);
      toast.error("Failed to fetch offboarding quick stats");
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!recordToDelete?.id) return;
    setIsDeleting(true);
    try {
      await deleteOffboard(recordToDelete.id);
      toast.success("Offboarding record deleted successfully");
      setRecordToDelete(null);
      await fetchOffboardingRecords();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete offboarding record");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFinalize = async (row) => {
    if (!row?.id) return;

    try {
      await finalizeOffboard(row.id);
      toast.success("Employee relieved successfully");
      await fetchOffboardingRecords();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to relieve employee",
      );
    }
  };

  const handleNewOffBoarding = () => {
    navigate("/admin/peopleHub/off-boarding/createEmployeeOffBoard");
  };

  const handleExport = () => {
    const headings = [
      "Employee",
      "Department",
      "Exit Type",
      "LWD",
      "FnF",
      "Assets",
      "Status",
    ];
    const rows = filteredEmployeeData.map((row) => [
      row.employee.name,
      row.department,
      row.exitType,
      row.lwd,
      row.fnf,
      row.assets,
      row.status,
    ]);
    const csv = [headings, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    link.download = "off-boarding.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Transform API data to table format
  const transformedEmployeeData = offboardingData.map((record) => ({
    id: record._id || record.id,
    employee: {
      name:
        record.userId?.name ||
        `${record.userId?.firstName || ""} ${record.userId?.lastName || ""}`.trim() ||
        "N/A",
      role: record.userId?.employeeId || "N/A",
      profileImage: record.userId?.profileImage || ProfileImage,
    },
    department:
      record.userId?.department?.departmentName ||
      record.userId?.department?.name ||
      record.department?.name ||
      record.department ||
      "N/A",
    exitType: record.exitInformation?.exitType || record.exitType || "N/A",
    lwd:
      record.exitInformation?.lastWorkingDate ||
      record.lastWorkingDate ||
      "N/A",
    fnf: record.clearance?.fnf || record.fnf || "Pending",
    assets: record.clearance?.assets || record.assets || "Pending",
    status: record.status || (record.completedAt ? "Completed" : "Pending"),
    action: "•••",
  }));

  const filteredEmployeeData = transformedEmployeeData.filter((row) => {
    const m3 =
      !employeeSearch ||
      row.employee.name.toLowerCase().includes(employeeSearch.toLowerCase());
    const departmentMatches =
      employeeDept === "All Department" || row.department === employeeDept;
    return m3 && departmentMatches;
  });

  // For staff tab, use same data (can be separated if needed)
  const filteredStaffData = transformedEmployeeData.filter((row) => {
    const m3 =
      !staffSearch ||
      row.employee.name.toLowerCase().includes(staffSearch.toLowerCase());
    return m3;
  });

  // Custom columns with employee renderer
  const employeeColumnsWithRenderer = useMemo(
    () =>
      offboardingEmployeeColumns.map((col) => {
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
        if (col.accessor === "approval") return {
          ...col,
          align: "center",
          render: (row) => isApprovedOffboardingStatus(row.status) && isLastWorkingDateDue(row.lwd) ? (
            <ApprovalGroup>
              <ApprovalButton
                type="button"
                $approve
                title="Relieve"
                onClick={(event) => {
                  event.stopPropagation();
                  handleFinalize(row);
                }}
              >
                <FiCheck /> Relieve
              </ApprovalButton>
            </ApprovalGroup>
          ) : null,
        };
        return col;
      }),
    [handleFinalize],
  );

  const staffColumnsWithRenderer = offboardingStaffColumns.map((col) => {
    if (col.accessor === "staff") {
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
    if (col.accessor === "approval") return {
      ...col,
      align: "center",
      render: (row) => isApprovedOffboardingStatus(row.status) && isLastWorkingDateDue(row.lwd) ? (
        <ApprovalGroup>
          <ApprovalButton
            type="button"
            $approve
            title="Relieve"
            onClick={(event) => {
              event.stopPropagation();
              handleFinalize(row);
            }}
          >
            <FiCheck /> Relieve
          </ApprovalButton>
        </ApprovalGroup>
      ) : null,
    };
    return col;
  });

  return (
    <Container>
      <DeleteConfirmationModal
        isOpen={Boolean(recordToDelete)}
        title="Delete offboarding record?"
        message={`Are you sure you want to delete the offboarding record for ${recordToDelete?.employee?.name || "this user"}?`}
        isDeleting={isDeleting}
        onCancel={() => !isDeleting && setRecordToDelete(null)}
        onConfirm={handleDelete}
      />
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
              <option>Pending</option>
              <option>Approved</option>
              <option>Relieved</option>
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
            onClick={handleExport}
          />
        </Controls>
      </Top>
      {/* QUICK STATS */}
      <StatsGrid>
        {summaryLoading ? <StatsMessage>Loading quick stats...</StatsMessage> : offboardingStats.length ? offboardingStats.map((item, index) => (
          <StatCard key={index}>
            <CardTitle>{item.title}</CardTitle>

            <CardFooter>
              <CardValue>
                {item.value}
                {item.suffix && <CardSuffix>{item.suffix}</CardSuffix>}
              </CardValue>

            </CardFooter>
          </StatCard>
        )) : <StatsMessage>No quick stats available</StatsMessage>}
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
            select1Options={[
              "All Department",
              ...departmentOptions.map((d) => d.value),
            ]}
            select1Value={employeeDept}
            onSelect1Change={setEmployeeDept}
            filterText="Filter"
            actionText="New Off-Board"
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
            onView={handleRowClick}
            onDelete={setRecordToDelete}
            showEditAction={false}
            server={true}
            isLoading={loading}
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
            onView={handleRowClick}
            onDelete={setRecordToDelete}
            showEditAction={false}
            server={true}
            isLoading={loading}
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
  padding: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.25rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const StatsMessage = styled.div`
  grid-column: 1 / -1;
  color: ${theme.colors.textColor};
  padding: 1rem 0;
`;

const StatCard = styled.div`
  background: #ffffff;
  min-height: 132px;
  padding: 15px;
  border-radius: 0.625rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CardTitle = styled.p`
  font-size: 0.875rem;
  color: ${theme.colors.textColor};
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  margin: 0;
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

const CardSuffix = styled.span`
  margin-left: 0.4rem;
  font-size: 0.75rem;
  font-weight: 500;
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 1rem 0;
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
  width: 11.5rem;
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

const ApprovalGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  white-space: nowrap;
`;
const ApprovalButton = styled.button`
  min-width: 78px;
  height: 32px;
  padding: 0 8px;
  border: 0;
  border-radius: 6px;
  display: grid;
  place-items: center;
  background: ${({ $approve }) => ($approve ? "#e8f5e9" : "#fee2e2")};
  color: ${({ $approve }) => ($approve ? "#16803c" : "#dc2626")};
  cursor: pointer;
  font-size: 0.7rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

export default OffBoarding;

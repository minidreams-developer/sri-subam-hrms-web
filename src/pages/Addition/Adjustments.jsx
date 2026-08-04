import { useState, useEffect } from "react";
import styled from "styled-components";
import theme from "../../theme/theme";
import ReusableTable from "../../components/ReusableTable";
import ProfileImage from "../../assets/images/employee/sampleProfile.jpg";
import DotMenuIcon from "../../assets/images/DayOff/dot-menu.svg";
import DetailsSidebar from "../../components/DetailsSidebar";
import CardDetails from "../../components/CardDetails";
import EditIcon from "../../assets/images/employee/editIcon.svg";
import { MdDelete } from "react-icons/md";
import { get } from "../../helpers/api_helper";
import { GET_ADJUSTMENTS } from "../../helpers/url_helper";
import { toast } from "react-toastify";

const fallbackAdjustments = [
  ["Carl Logan", "Developer", "Addition", "Bonus", "12-01-2026", 52853, 2, "approved"],
  ["Deanna Curtis", "Designer", "Deduction", "Penalty", "13-01-2026", 42853, 2, "pending"],
  ["Jaxson Carder", "HR Executive", "Deduction", "Penalty", "14-01-2026", 42853, 3, "approved"],
  ["Mabel Bryan", "Accountant", "Addition", "Incentive", "15-01-2026", 32853, 3, "approved"],
  ["Della Wade", "Team Lead", "Addition", "Bonus", "16-01-2026", 22853, 3, "pending"],
].map(([name, role, type, component, date, amount, payrollMonth, status], index) => ({
  _id: `figma-${index + 1}`,
  teamId: { teamName: name },
  departmentId: { departmentName: role },
  type: type.toLowerCase(),
  component: component.toLowerCase(),
  date: date.split("-").reverse().join("-"),
  amount,
  payrollMonth,
  payrollYear: 2025,
  status,
}));

const Adjustments = ({ searchQuery, selectedMonth }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [adjustmentsData, setAdjustmentsData] = useState([]);
  const [_loading, _setLoading] = useState(false);

  // Fetch adjustments data
  const fetchAdjustments = async () => {
    try {
      _setLoading(true);
      
      // Call API without month/year parameters
      const response = await get(GET_ADJUSTMENTS);
      
      console.log("Full API Response:", response);
      
      // API returns { results: [...], page, limit, totalPages, totalResults }
      if (response?.results && Array.isArray(response.results)) {
        console.log("Adjustments data:", response.results);
        setAdjustmentsData(response.results.length ? response.results : fallbackAdjustments);
      } else if (response?.data && Array.isArray(response.data)) {
        console.log("Adjustments data:", response.data);
        setAdjustmentsData(response.data.length ? response.data : fallbackAdjustments);
      } else if (Array.isArray(response)) {
        console.log("Adjustments data:", response);
        setAdjustmentsData(response.length ? response : fallbackAdjustments);
      } else {
        console.warn("Unexpected response structure:", response);
        // Handle empty response
        setAdjustmentsData(fallbackAdjustments);
      }
    } catch (error) {
      console.error("Error fetching adjustments:", error);
      // Show error but don't crash the page
      if (error.response?.status === 500) {
        toast.error("Backend error: Please check the server logs");
      } else {
        toast.error("Failed to load adjustments");
      }
      // Set empty data to prevent page from breaking
      setAdjustmentsData(fallbackAdjustments);
    } finally {
      _setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdjustments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      header: "Name",
      key: "employee",
      render: (row) => (
        <EmployeeCell>
          <EmployeeAvatar
            src={ProfileImage}
            alt={row.teamId?.teamName || "Team"}
          />
          <EmployeeInfo>
            <EmployeeName>{row.teamId?.teamName || "N/A"}</EmployeeName>
            <EmployeeRole>{row.departmentId?.departmentName || "N/A"}</EmployeeRole>
          </EmployeeInfo>
        </EmployeeCell>
      ),
    },
    {
      header: "Type",
      key: "type",
      render: (row) => <span>{row.type ? row.type.charAt(0).toUpperCase() + row.type.slice(1) : "N/A"}</span>,
    },
    {
      header: "Component",
      key: "component",
      render: (row) => <span>{row.component ? row.component.charAt(0).toUpperCase() + row.component.slice(1) : "N/A"}</span>,
    },
    {
      header: "Date",
      key: "date",
      render: (row) => <span>{row.date ? new Date(row.date).toLocaleDateString() : "N/A"}</span>,
    },
    {
      header: "Amount",
      key: "amount",
      render: (row) => <span>₹{row.amount || 0}</span>,
    },
    {
      header: "Payroll Month",
      key: "payrollMonth",
      render: (row) => {
        const monthName = new Date(2026, (row.payrollMonth || 1) - 1, 1).toLocaleString('en-US', { month: 'short' });
        return <span>{monthName} {row.payrollYear || 2026}</span>;
      },
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <StatusBadge $status={row.status}>
          {row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : "N/A"}
        </StatusBadge>
      ),
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
      (row.teamId?.teamName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (row.type || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setSidebarOpen(true);
  };

  const handleDelete = () => {
    console.log("Delete adjustment:", selectedRow);
    setSidebarOpen(false);
  };

  const handleEdit = () => {
    console.log("Edit adjustment:", selectedRow);
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

      {/* Adjustment Details Sidebar */}
      <DetailsSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title="Adjustment Details"
      >
        <Section>
          <CardDetails
            title="Basic Details"
            columns={2}
            items={[
              { label: "Team Name", value: selectedRow?.teamId?.teamName || "N/A" },
              { label: "Team Code", value: selectedRow?.teamId?.teamCode || "N/A" },
              { label: "Department", value: selectedRow?.departmentId?.departmentName || "N/A" },
              { label: "Team Lead ID", value: selectedRow?.teamId?.teamLead || "N/A" },
              { 
                label: "Status", 
                value: (
                  <StatusText $status={selectedRow?.status || "Draft"}>
                    {selectedRow?.status ? selectedRow.status.charAt(0).toUpperCase() + selectedRow.status.slice(1) : "Draft"}
                  </StatusText>
                )
              },
            ]}
          />
        </Section>

        <Section>
          <CardDetails
            title="Adjustment Details"
            columns={2}
            items={[
              { label: "Type", value: selectedRow?.type ? selectedRow.type.charAt(0).toUpperCase() + selectedRow.type.slice(1) : "N/A" },
              { label: "Component", value: selectedRow?.component ? selectedRow.component.charAt(0).toUpperCase() + selectedRow.component.slice(1) : "N/A" },
              { label: "Date", value: selectedRow?.date ? new Date(selectedRow.date).toLocaleDateString() : "N/A" },
              { label: "Payroll Month", value: `${new Date(2026, (selectedRow?.payrollMonth || 1) - 1, 1).toLocaleString('en-US', { month: 'short' })} ${selectedRow?.payrollYear || 2026}` },
              { label: "Amount", value: `₹${selectedRow?.amount || 0}` },
              { label: "Applied to Payroll", value: selectedRow?.appliedToPayroll ? "Yes" : "No" },
              { label: "Created By", value: selectedRow?.createdBy || "System" },
              { label: "Remarks", value: selectedRow?.remarks || "N/A" },
            ]}
          />
        </Section>

        <ButtonRow>
          <DeleteButton onClick={handleDelete}>
            <MdDelete size={20} />
            Delete
          </DeleteButton>
          <EditButton onClick={handleEdit}>
            <img src={EditIcon} alt="edit" width="16" height="16" />
            Edit details
          </EditButton>
        </ButtonRow>
      </DetailsSidebar>
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

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  
  ${({ $status }) => {
    const status = String($status || "").toLowerCase();
    if (status === "pending") {
      return `
        background-color: #FEF3C7;
        color: #92400E;
        border: 1px solid #FCD34D;
      `;
    } else if (status === "approved") {
      return `
        background-color: #D1FAE5;
        color: #065F46;
        border: 1px solid #6EE7B7;
      `;
    } else if (status === "rejected") {
      return `
        background-color: #FEE2E2;
        color: #7F1D1D;
        border: 1px solid #FCA5A5;
      `;
    }
    return `
      background-color: #E5E7EB;
      color: #374151;
      border: 1px solid #D1D5DB;
    `;
  }}
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatusText = styled.span`
  color: ${({ $status }) => {
    const s = String($status || "").toLowerCase();
    if (s === "approved") return "#16a34a";
    if (s === "rejected") return "#dc2626";
    if (s === "pending" || s === "draft") return "#f59e0b";
    return theme.colors.textColor;
  }};
  font-weight: 600;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
`;

const DeleteButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: ${theme.colors.white};
  border: 1px solid #EF4444;
  border-radius: 8px;
  color: #EF4444;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;

  &:hover {
    background: #FEE2E2;
  }
`;

const EditButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.primary};
  border-radius: 8px;
  color: ${theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;

  &:hover {
    background: ${theme.colors.secondaryWhite};
  }
`;

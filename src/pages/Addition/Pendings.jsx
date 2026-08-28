import { useState, useEffect } from "react";
import styled from "styled-components";
import theme from "../../theme/theme";
import ReusableTable from "../../components/ReusableTable";
import ProfileImage from "../../assets/images/employee/sampleProfile.jpg";
import ApproveIcon from "../../assets/images/Badges/approve.svg";
import CancelIcon from "../../assets/images/Badges/cancel.svg";
import { getPendingAdjustments } from "../../services/apiServices";
import { toast } from "react-toastify";

const Pendings = ({ searchQuery, selectedMonth }) => {
  const [pendingsData, setPendingsData] = useState([]);
  const [_loading, _setLoading] = useState(false);

  // Fetch pending adjustments
  const fetchPendingAdjustments = async () => {
    try {
      _setLoading(true);
      
      // Call API without month/year parameters
      const response = await getPendingAdjustments();
      
      console.log("Full API Response:", response);
      
      // API returns { results: [...], page, limit, totalPages, totalResults }
      if (response?.results && Array.isArray(response.results)) {
        console.log("Pending adjustments data:", response.results);
        setPendingsData(response.results);
      } else if (response?.data && Array.isArray(response.data)) {
        console.log("Pending adjustments data:", response.data);
        setPendingsData(response.data);
      } else if (Array.isArray(response)) {
        console.log("Pending adjustments data:", response);
        setPendingsData(response);
      } else {
        console.warn("Unexpected response structure:", response);
        // Handle empty response
        setPendingsData([]);
      }
    } catch (error) {
      console.error("Error fetching pending adjustments:", error);
      // Show error but don't crash the page
      if (error.response?.status === 500) {
        toast.error("Backend error: Please check the server logs");
      } else {
        toast.error("Failed to load pending adjustments");
      }
      // Set empty data to prevent page from breaking
      setPendingsData([]);
    } finally {
      _setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAdjustments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      (row.teamId?.teamName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (row.type || "").toLowerCase().includes(searchQuery.toLowerCase());
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

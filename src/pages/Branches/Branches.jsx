import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import ReusableTable from "../../components/ReusableTable";
import PlusIcon from "../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import TableToolbar from "../../components/TableToolbar";
import BranchDetailsSidebar from "./BranchDetailsSidebar";
import { get } from "../../helpers/api_helper";
import { BRANCHES } from "../../helpers/url_helper";
import { toast } from "react-toastify";
import PageLoader from "../../components/PageLoader";

const Branches = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchesData, setBranchesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch branches on component mount
  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setIsLoading(true);
    try {
      const response = await get(BRANCHES);
      
      // Transform API response to match table format
      const transformedData = response?.results?.map((branch, index) => ({
        no: (index + 1).toString(),
        branchName: branch.branchName || "N/A",
        branchHead: branch.branchHead || "N/A",
        branchNumber: branch.branchNumber || branch.id || "N/A",
        noOfPeople: branch.departments?.length || 0,
        status: branch.branchStatus || branch.activeStatus || "Active",
        isPrimary: false,
        actions: "...",
        // Store original data for sidebar
        originalData: branch,
      })) || [];

      setBranchesData(transformedData);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch branches";
      toast.error(errorMessage);
      console.error("Fetch branches error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const branchesColumns = [
    { key: "no", label: "No." },
    { 
      key: "branchName", 
      label: "Branches Name",
      render: (row) => (
        <BranchNameCell>
          <span>{row.branchName}</span>
          {row.isPrimary && <PrimaryBadge>Primary</PrimaryBadge>}
        </BranchNameCell>
      )
    },
    { key: "branchHead", label: "Branch Head" },
    { key: "branchNumber", label: "Branch Number" },
    { key: "noOfPeople", label: "No. of People" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Action" },
  ];

  const filteredData = branchesData.filter((row) => {
    if (!searchValue) return true;
    const search = searchValue.toLowerCase();
    return (
      row.branchName.toLowerCase().includes(search) ||
      row.branchHead.toLowerCase().includes(search) ||
      row.branchNumber.toLowerCase().includes(search)
    );
  });

  const handleRowClick = (row) => {
    setSelectedBranch(row);
    setIsSidebarOpen(true);
  };

  const handleAddBranch = () => {
    navigate("/admin/peopleHub/branch/createBranch");
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Container>
      <TableToolbar
        title={"All Branches"}
        searchPosition="right"
        searchPlaceholder="Search Branches"
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        select1Value={""}
        onSelect1Change={""}
        showFilter={false}
        filterText="Filter"
        actionText="Add Branch"
        actionIcon={<img src={PlusIcon} alt="add" width="16" height="16" />}
        onActionClick={handleAddBranch}
      />

      <ReusableTable
        columns={branchesColumns}
        data={filteredData}
        rowsPerPage={5}
        totalResults={filteredData.length}
        onRowClick={handleRowClick}
      />

      <BranchDetailsSidebar
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        data={selectedBranch}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const BranchNameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PrimaryBadge = styled.span`
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 500;
  font-style: normal;
  font-size: 10px;
  line-height: 160%;
  letter-spacing: 0%;
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  padding: 4px 10px;
  border-radius: 4px;
  white-space: nowrap;
`;

export default Branches;

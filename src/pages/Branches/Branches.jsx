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
import { HiBuildingOffice2 } from "react-icons/hi2";
import { BsThreeDots } from "react-icons/bs";

const Branches = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchesData, setBranchesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt:desc");

  // Fetch branches on component mount and when pagination changes
  useEffect(() => {
    fetchBranches(currentPage, pageSize, sortBy);
  }, [currentPage, pageSize, sortBy]);

  const fetchBranches = async (page = 1, limit = 10, sort = "createdAt:desc") => {
    setIsLoading(true);
    try {
      const response = await get(`${BRANCHES}?page=${page}&limit=${limit}&sortBy=${sort}`);
      console.log("Branches fetched:", response);
      
      // Handle different response structures
      let branchList = [];
      let total = 0;
      let pages = 0;
      
      if (Array.isArray(response)) {
        branchList = response;
        total = response.length;
        pages = 1;
      } else if (response?.results && Array.isArray(response.results)) {
        branchList = response.results;
        total = response.totalResults || response.results.length;
        pages = response.totalPages || 1;
      } else if (response?.data && Array.isArray(response.data)) {
        branchList = response.data;
        total = response.totalResults || response.data.length;
        pages = response.totalPages || 1;
      }
      
      // Transform API response to match table format
      const transformedData = branchList.map((branch, index) => ({
        no: `${(page - 1) * limit + index + 1}.`.padStart(3, "0"),
        branchName: branch.branchName || branch.name || "N/A",
        branchHead: typeof branch.branchHead === 'object' 
          ? (branch.branchHead?.name || branch.branchHead?.firstName + ' ' + branch.branchHead?.lastName || "N/A")
          : (branch.branchHead || "N/A"),
        branchNumber: branch.branchNumber || branch.id || "N/A",
        noOfPeople: branch.noOfPeople || branch.totalEmployees || branch.employees?.length || 0,
        status: branch.branchStatus || branch.activeStatus || "Active",
        isPrimary: Boolean(branch.isPrimary || branch.primaryBranch || branch.branchType === "Head Office"),
        actions: <BsThreeDots size={20} aria-label="Branch actions" />,
        // Store original data for sidebar
        originalData: branch,
      }));

      setBranchesData(transformedData);
      setTotalResults(total);
      setTotalPages(pages);
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
    { key: "no", label: "No" },
    { 
      key: "branchName", 
      label: "Branch Name",
      render: (row) => (
        <BranchNameCell>
          <span>{row.branchName}</span>
          {row.isPrimary && <PrimaryBadge>(Primary)</PrimaryBadge>}
        </BranchNameCell>
      )
    },
    { key: "branchHead", label: "Branch Head" },
    { key: "branchNumber", label: "Branch Number" },
    { key: "noOfPeople", label: "No. of People" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Action" },
  ];

  const filteredData = branchesData.filter((branch) => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return true;
    return [branch.branchName, branch.branchHead, branch.branchNumber, branch.status]
      .some((value) => String(value ?? "").toLowerCase().includes(query));
  });

  const handleRowClick = (row) => {
    setSelectedBranch({ ...row.originalData, ...row });
    setIsSidebarOpen(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleAddBranch = () => {
    navigate("/admin/peopleHub/branch/createBranch");
  };

  const handleEditBranch = (branch = selectedBranch) => {
    if (!branch) {
      toast.error("Branch details are unavailable");
      return;
    }
    setIsSidebarOpen(false);
    navigate("/admin/peopleHub/branch/createBranch", {
      state: {
        mode: "edit",
        branch: branch.originalData || branch,
        branchId: branch.id || branch._id || branch.originalData?.id || branch.originalData?._id,
      },
    });
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Container>
      <TableToolbar
        title={"All Branches"}
        titleIcon={<HiBuildingOffice2 />}
        searchPosition="right"
        searchPlaceholder="Search Agents"
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
        rowsPerPage={pageSize}
        totalResults={totalResults}
        totalPages={totalPages}
        currentPage={currentPage}
        server={true}
        onPageChange={handlePageChange}
        alwaysShowPagination
        onRowClick={handleRowClick}
      />

      <BranchDetailsSidebar
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        data={selectedBranch}
        onEdit={handleEditBranch}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: calc(100vh - 130px);
  padding: 1.125rem 1.25rem;
  border-radius: 0.625rem;
  background: ${theme.colors.white};
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

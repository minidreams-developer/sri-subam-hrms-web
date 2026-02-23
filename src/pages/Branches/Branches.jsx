import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import ReusableTable from "../../components/ReusableTable";
import PlusIcon from "../../assets/images/Dashboard Images/plus-large_svgrepo.com.svg";
import TableToolbar from "../../components/TableToolbar";

const Branches = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

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

  const branchesData = [
    {
      no: "1",
      branchName: "Downtown Branch",
      branchHead: "John Doe",
      branchNumber: "BR001",
      noOfPeople: 45,
      status: "Active",
      isPrimary: true,
      actions: "...",
    },
    {
      no: "2",
      branchName: "Uptown Branch",
      branchHead: "Jane Smith",
      branchNumber: "BR002",
      noOfPeople: 32,
      status: "Active",
      isPrimary: false,
      actions: "...",
    },
    {
      no: "3",
      branchName: "East Side Branch",
      branchHead: "Mike Johnson",
      branchNumber: "BR003",
      noOfPeople: 28,
      status: "In-Active",
      isPrimary: false,
      actions: "...",
    },
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
    // Navigate to branch details if needed
    // navigate("/admin/peopleHub/branches/branchDetails");
  };

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
      />

      <ReusableTable
        columns={branchesColumns}
        data={filteredData}
        rowsPerPage={5}
        totalResults={filteredData.length}
        onRowClick={handleRowClick}
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

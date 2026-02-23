import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import ReusableTable from "../../components/ReusableTable";
import PlusIcon from "../../assets/images/Dashboard Images/plus-large_svgrepo.com.svg";
import TableToolbar from "../../components/TableToolbar";
import AddTeamModal from "../../components/AddTeamModal";

const Teams = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const teamsColumns = [
    { key: "teamId", label: "Team ID" },
    { key: "name", label: "Name" },
    { key: "department", label: "Department" },
    { key: "teamLead", label: "Team Lead" },
    { key: "totalMembers", label: "Total Members" },
    { key: "actions", label: "Action" },
  ];

  const teamsData = [
    {
      teamId: "T001",
      name: "Development Team",
      department: "IT",
      teamLead: "John Doe",
      totalMembers: 8,
      actions: "...",
    },
    {
      teamId: "T002",
      name: "Marketing Team",
      department: "Marketing",
      teamLead: "Jane Smith",
      totalMembers: 5,
      actions: "...",
    },
    {
      teamId: "T003",
      name: "Sales Team",
      department: "Sales",
      teamLead: "Mike Johnson",
      totalMembers: 12,
      actions: "...",
    },
  ];

  const filteredData = teamsData.filter((row) => {
    if (!searchValue) return true;
    const search = searchValue.toLowerCase();
    return (
      row.teamId.toLowerCase().includes(search) ||
      row.name.toLowerCase().includes(search) ||
      row.department.toLowerCase().includes(search) ||
      row.teamLead.toLowerCase().includes(search)
    );
  });

  const handleSaveTeam = (teamData) => {
    console.log("New team data:", teamData);
    // Add logic to save team data
  };

  const handleRowClick = (row) => {
    navigate("/admin/peopleHub/teams/teamDetails");
  };

  return (
    <Container>
       <TableToolbar
        title={"All Teams"}
        searchPosition="right"
        searchPlaceholder="Search Teams"
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        select1Value={""}
        onSelect1Change={""}
        showFilter={false}
        filterText="Filter"
        actionText="Add Team"
        actionIcon={<img src={PlusIcon} alt="add" width="16" height="16" />}
        onActionClick={() => setIsModalOpen(true)}
      />

      <ReusableTable
        columns={teamsColumns}
        data={filteredData}
        rowsPerPage={5}
        totalResults={filteredData.length}
        onRowClick={handleRowClick}
      />

      <AddTeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTeam}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

export default Teams;

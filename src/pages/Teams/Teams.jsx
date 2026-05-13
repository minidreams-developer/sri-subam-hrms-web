import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ReusableTable from "../../components/ReusableTable";
import PlusIcon from "../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import TeamsIcon from "../../assets/images/Team/teams.svg";
import TableToolbar from "../../components/TableToolbar";
import AddTeamModal from "../../components/AddTeamModal";
import { get, post } from "../../helpers/api_helper";
import { TEAMS, CREATE_TEAM } from "../../helpers/url_helper";
import { toast } from "react-toastify";
import PageLoader from "../../components/PageLoader";

const Teams = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [teamsData, setTeamsData] = useState([]);
  const [isFetchingTeams, setIsFetchingTeams] = useState(true);

  // Fetch teams on component mount
  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setIsFetchingTeams(true);
    try {
      const response = await get(TEAMS);
      
      // Transform API response to match table format
      const transformedData = response?.results?.map((team, index) => ({
        teamId: team.teamId || team.id || `T${String(index + 1).padStart(3, '0')}`,
        name: team.name || "N/A",
        department: team.department || "N/A",
        teamLead: team.teamLead || team.leadName || "N/A",
        totalMembers: team.totalMembers || team.memberCount || 0,
        actions: "...",
        // Store original data for details page
        originalData: team,
      })) || [];

      setTeamsData(transformedData);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch teams";
      toast.error(errorMessage);
      console.error("Fetch teams error:", error);
    } finally {
      setIsFetchingTeams(false);
    }
  };

  const teamsColumns = [
    { key: "teamId", label: "Team ID" },
    { key: "name", label: "Name" },
    { key: "department", label: "Department" },
    { key: "teamLead", label: "Team Lead" },
    { key: "totalMembers", label: "Total Members" },
    { key: "actions", label: "Action" },
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

  const handleSaveTeam = async (teamData) => {
    setIsLoading(true);

    try {
      // Prepare payload for API
      const payload = {
        teamId: teamData.teamId || undefined, // Optional field
        name: teamData.name,
        department: teamData.department?.value,
        leadDepartment: teamData.leadDepartment?.value,
        teamLead: teamData.teamLead?.value,
      };

      const response = await post(CREATE_TEAM, payload);

      if (response) {
        toast.success("Team created successfully!");
        setIsModalOpen(false);
        // Refresh the teams list
        fetchTeams();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create team. Please try again.";
      toast.error(errorMessage);
      console.error("Create team error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (row) => {
    navigate("/admin/peopleHub/teams/teamDetails");
  };

  if (isFetchingTeams) {
    return <PageLoader />;
  }

  return (
    <Container>
       <TableToolbar
        title={"All Teams"}
        titleIcon={TeamsIcon}
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
        isLoading={isLoading}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

export default Teams;

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
      console.log("Teams API response:", response);
      
      // Handle different response structures
      const teamsList = response?.results || response?.data || response || [];
      
      // Transform API response to match table format
      const transformedData = teamsList.map((team, index) => {
        console.log("Processing team:", team);
        
        // Extract department name if it's an object, otherwise use as string
        let departmentName = "N/A";
        if (team.department) {
          if (typeof team.department === "string") {
            departmentName = team.department;
          } else if (team.department.departmentName) {
            departmentName = team.department.departmentName;
          } else if (team.department.name) {
            departmentName = team.department.name;
          }
        }
        
        return {
          teamId: team.teamCode || team.teamId || team.id || `T${String(index + 1).padStart(3, '0')}`,
          name: team.teamName || team.name || "N/A",
          department: departmentName,
          teamLead: team.teamLead?.name || team.teamLead || team.leadName || "N/A",
          totalMembers: team.teamEmployees?.length || team.totalMembers || team.memberCount || 0,
          actions: "...",
          // Store original data for details page
          originalData: team,
        };
      });

      console.log("Transformed teams data:", transformedData);
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
    { key: "teamId", header: "Team ID" },
    { key: "name", header: "Name" },
    { key: "department", header: "Department" },
    { key: "teamLead", header: "Team Lead" },
    {
      key: "totalMembers",
      header: "Total Members",
      render: (row) => (
        <MembersCell>
          {row.totalMembers}
        </MembersCell>
      ),
    },
    {
      key: "actions",
      header: "Action",
      render: () => (
        <ActionButton onClick={(e) => {
          e.stopPropagation();
        }}>
          ⋮
        </ActionButton>
      ),
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

const ActionButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

const MembersCell = styled.div`
  font-size: 0.875rem;
  color: #0c0c0c;
  font-weight: 500;
  text-align: center;
  min-width: 60px;
`;

export default Teams;

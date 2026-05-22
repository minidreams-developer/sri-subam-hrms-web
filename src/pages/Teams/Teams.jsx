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
      console.log("Teams API response (full):", response);
      console.log("Teams API response (type):", typeof response);
      
      // Handle different response structures
      let teamsList = response?.results || response?.data || response || [];
      
      // If response is an array, use it directly
      if (Array.isArray(response)) {
        teamsList = response;
      }
      
      console.log("Teams list:", teamsList);
      console.log("Teams list (length):", teamsList?.length);
      
      // Transform API response to match table format
      const transformedData = teamsList.map((team, index) => {
        console.log(`Processing team ${index + 1}:`, team);
        
        // Extract Team ID/Code - Check all possible field names
        let displayTeamId = "N/A";
        if (team.teamCode) {
          displayTeamId = team.teamCode;
          console.log("Using teamCode:", team.teamCode);
        } else if (team.code) {
          displayTeamId = team.code;
          console.log("Using code:", team.code);
        } else if (team.teamId) {
          displayTeamId = team.teamId;
          console.log("Using teamId:", team.teamId);
        } else if (team.id && typeof team.id === "string" && team.id.match(/^[A-Z]+/)) {
          // If ID starts with letters, it might be a code
          displayTeamId = team.id;
          console.log("Using id (looks like code):", team.id);
        } else if (team.id) {
          // Last resort: use MongoDB ID
          displayTeamId = team.id;
          console.log("Using id (MongoDB):", team.id);
        }
        
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
        
        // Extract team name
        let teamName = team.teamName || team.name || "N/A";
        
        // Extract team lead name
        let teamLeadName = "N/A";
        if (team.teamLead) {
          if (typeof team.teamLead === "string") {
            teamLeadName = team.teamLead;
          } else if (team.teamLead.name) {
            teamLeadName = team.teamLead.name;
          }
        } else if (team.leadName) {
          teamLeadName = team.leadName;
        }
        
        // Extract total members
        let totalMembers = 0;
        if (team.teamEmployees?.length) {
          totalMembers = team.teamEmployees.length;
        } else if (typeof team.totalMembers === "number") {
          totalMembers = team.totalMembers;
        } else if (typeof team.memberCount === "number") {
          totalMembers = team.memberCount;
        }
        
        console.log(`Team ${index + 1} extracted: ID=${displayTeamId}, Name=${teamName}, Dept=${departmentName}, Lead=${teamLeadName}, Members=${totalMembers}`);
        
        return {
          teamId: displayTeamId,
          name: teamName,
          department: departmentName,
          teamLead: teamLeadName,
          totalMembers: totalMembers,
          actions: "...",
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
        teamCode: teamData.teamId || undefined, // Use the generated Team ID
        teamName: teamData.name,
        department: teamData.department?.value, // Department ID
        teamLead: teamData.teamLead?.value, // User ID
        teamDescription: "", // Optional description
      };

      console.log("Team payload:", payload);

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

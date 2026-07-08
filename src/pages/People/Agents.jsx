import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import GreenArrow from "../../assets/images/dashboardImages/green.svg";
import RedArrow from "../../assets/images/dashboardImages/red.svg";
import theme from "../../theme/theme";
import Button from "../../components/Button";
import TableToolbar from "../../components/TableToolbar";
import PlusIcon from "../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import Filter from "../../components/filter";
import ReusableTable from "../../components/ReusableTable";
import DotIcon from "../../assets/images/Overtime/actionDot.svg";
import { get } from "../../helpers/api_helper";
import { GET_AGENTS } from "../../helpers/url_helper";
import { toast } from "react-toastify";

// Agents table columns
const agentsTableColumns = [
  { header: "Agent ID", accessor: "agentId" },
  { header: "Name", accessor: "name" },
  { header: "Total Labours Count", accessor: "laboursCount" },
  { header: "Joined Date", accessor: "joinedDate" },
  { header: "Status", accessor: "status" },
  { header: "Action", accessor: "action", render: () => <img src={DotIcon} alt="action" width="20" height="20" /> },
];

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (error) {
    return "N/A";
  }
};

const Agents = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedRange, setSelectedRange] = useState("Last 7 days");
  const [agentSearch, setAgentSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [agentsData, setAgentsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [agentsStats, setAgentsStats] = useState([
    { title: "Total Agents", value: "0", percent: "12 %", type: "down" },
    { title: "Active Agents", value: "0", percent: "20.5 %", type: "up" },
    { title: "In-Active Agents", value: "0", percent: "12 %", type: "down" },
    { title: "New Agents", value: "0", percent: "20.5 %", type: "up" },
  ]);

  // Fetch agents from API on component mount
  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      console.log("=== Starting fetchAgents ===");
      console.log("GET_AGENTS endpoint:", GET_AGENTS);
      
      const response = await get(GET_AGENTS);
      console.log("=== Full Response ===", response);
      console.log("Response type:", typeof response);
      console.log("Response keys:", response ? Object.keys(response) : "null");
      
      // Try multiple ways to extract results
      let agentsList = [];
      
      // Method 1: Check response.data.results
      if (response?.data?.results) {
        console.log("✓ Using response.data.results");
        agentsList = response.data.results;
      }
      // Method 2: Check response.results
      else if (response?.results) {
        console.log("✓ Using response.results");
        agentsList = response.results;
      }
      // Method 3: Check if response is array
      else if (Array.isArray(response)) {
        console.log("✓ Using response as array");
        agentsList = response;
      }
      // Method 4: Check response.data
      else if (Array.isArray(response?.data)) {
        console.log("✓ Using response.data as array");
        agentsList = response.data;
      }
      
      console.log("Final agentsList:", agentsList);
      console.log("agentsList length:", agentsList?.length);
      console.log("agentsList is array:", Array.isArray(agentsList));

      if (!agentsList || agentsList.length === 0) {
        console.warn("⚠ No agents found in response");
        setAgentsData([]);
        setAgentsStats([
          { title: "Total Agents", value: "0", percent: "12 %", type: "down" },
          { title: "Active Agents", value: "0", percent: "20.5 %", type: "up" },
          { title: "In-Active Agents", value: "0", percent: "12 %", type: "down" },
          { title: "New Agents", value: "0", percent: "20.5 %", type: "up" },
        ]);
        setIsLoading(false);
        return;
      }

      // Transform API data to table format
      const transformed = agentsList.map((agent, idx) => {
        console.log(`Agent ${idx}:`, agent);
        return {
          agentId: agent?.agentId || "N/A",
          name: agent?.name || "N/A",
          laboursCount: "-",
          joinedDate: formatDate(agent?.workInformation?.joinedDate),
          status: agent?.isActive ? "Active" : "In-Active",
          action: "",
        };
      });

      console.log("✓ Transformed data:", transformed);
      setAgentsData(transformed);

      // Calculate statistics
      const total = agentsList.length;
      const active = agentsList.filter((a) => a.isActive === true).length;
      const inactive = agentsList.filter((a) => a.isActive === false).length;

      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const newCount = agentsList.filter((a) => {
        const createdDate = new Date(a.workInformation?.joinedDate || 0).getTime();
        return createdDate > sevenDaysAgo;
      }).length;

      console.log(`✓ Stats: Total=${total}, Active=${active}, Inactive=${inactive}, New=${newCount}`);

      setAgentsStats([
        { title: "Total Agents", value: total.toString(), percent: "12 %", type: "down" },
        { title: "Active Agents", value: active.toString(), percent: "20.5 %", type: "up" },
        { title: "In-Active Agents", value: inactive.toString(), percent: "12 %", type: "down" },
        { title: "New Agents", value: newCount.toString(), percent: "20.5 %", type: "up" },
      ]);
    } catch (error) {
      console.error("❌ Failed to fetch agents:", error);
      console.error("Error details:", error.message);
      console.error("Error response:", error.response);
      toast.error("Failed to fetch agents: " + error.message);
      setAgentsData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (row) => {
    navigate("/admin/people/agents/agentProfile");
  };

  const handleFilterOpen = () => {
    setShowFilter(true);
  };

  const handleFilterClose = () => {
    setShowFilter(false);
  };

  const handleFilterApply = (filters) => {
    console.log("Applied filters:", filters);
    setShowFilter(false);
  };

  // Filter agents based on search and status filter
  const filteredAgentsData = agentsData.filter((row) => {
    const matchesSearch =
      !agentSearch ||
      row.name.toLowerCase().includes(agentSearch.toLowerCase());

    const matchesFilter =
      selectedFilter === "All" ||
      row.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <Container>
      {showFilter && (
        <Filter onClose={handleFilterClose} onApply={handleFilterApply} />
      )}
      <Top>
        <TopTitle>Quick Stats</TopTitle>
        <Controls>
          <FilterSelect>
            <select
              className="form-select"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option>All</option>
              <option>Active</option>
              <option>In-Active</option>
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
          />
        </Controls>
      </Top>
      {/* QUICK STATS */}
      <StatsGrid>
        {agentsStats.map((item, index) => (
          <StatCard key={index}>
            <CardTitle>{item.title}</CardTitle>

            <CardFooter>
              <CardValue>{item.value}</CardValue>

              <Badge type={item.type}>
                {item.percent}
                <img
                  src={item.type === "up" ? GreenArrow : RedArrow}
                  alt="trend"
                />
              </Badge>
            </CardFooter>
          </StatCard>
        ))}
      </StatsGrid>

      <TableToolbar
        searchPlaceholder="Search Agents"
        searchValue={agentSearch}
        onSearchChange={setAgentSearch}
        filterText="Filter"
        onFilterClick={handleFilterOpen}
        actionText="New Agent"
        actionIcon={<img src={PlusIcon} alt="add" width="16" height="16" />}
        onActionClick={() => navigate("/admin/people/agents/create")}
      />

      <ReusableTable
        columns={agentsTableColumns}
        data={filteredAgentsData}
        rowsPerPage={7}
        totalResults={filteredAgentsData.length}
        onRowClick={handleRowClick}
      />
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  width: 100%;
  padding: 1.5rem 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div`
  background: #ffffff;
  padding: 0.704rem;
  border-radius: 0.625rem;
`;

const CardTitle = styled.p`
  font-size: 0.875rem;
  color: ${theme.colors.textColor};
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  margin-bottom: 3.125rem;
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

const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.2rem 0.45rem;
  border-radius: 999px;

  color: ${({ type }) => (type === "up" ? "#16a34a" : "#dc2626")};
  background: ${({ type }) => (type === "up" ? "#dcfce7" : "#fee2e2")};

  img {
    width: 12px;
    height: 12px;
  }
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 1.25rem 0;
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
  width: 12rem;
`;

export default Agents;

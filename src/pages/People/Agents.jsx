import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import Button from "../../components/Button";
import TableToolbar from "../../components/TableToolbar";
import PlusIcon from "../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import Filter from "../../components/filter";
import ReusableTable from "../../components/ReusableTable";
import { deleteUser, getUserCount, getUsers } from "../../services/apiServices";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

// Agents table columns
const agentsTableColumns = [
  { header: "Agent ID", accessor: "agentId" },
  { header: "Name", accessor: "name" },
  { header: "Total Labours Count", accessor: "laboursCount" },
  { header: "Joined Date", accessor: "joinedDate" },
  { header: "Status", accessor: "status" },
  { header: "Action", accessor: "action" },
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy] = useState("createdAt:desc");
  const [agentToDelete, setAgentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const statsRequestId = useRef(0);
  const [agentsStats, setAgentsStats] = useState([
    { title: "Total Agents", value: null },
    { title: "Active Agents", value: null },
    { title: "In-Active Agents", value: null },
    { title: "New Agents", value: null },
  ]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchAgents(currentPage, pageSize, sortBy);
    }, agentSearch.trim() ? 350 : 0);
    return () => window.clearTimeout(timeoutId);
  }, [currentPage, pageSize, sortBy, agentSearch, selectedFilter, selectedRange]);

  useEffect(() => {
    fetchAgentStats();
  }, [selectedFilter, selectedRange]);

  const fetchAgentStats = async () => {
    const requestId = ++statsRequestId.current;
    setAgentsStats((items) => items.map((item) => ({ ...item, value: null })));
    try {
      const query = new URLSearchParams({ role: "agent" });
      if (selectedFilter !== "All") {
        query.set("status", selectedFilter.toLowerCase().replace("-", ""));
      }
      const rangeDays = { "Last 7 days": 7, "Last 30 days": 30, "Last 90 days": 90 }[selectedRange];
      if (rangeDays) {
        const joinedTo = new Date();
        const joinedFrom = new Date(joinedTo);
        joinedFrom.setDate(joinedFrom.getDate() - rangeDays);
        query.set("joinedFrom", joinedFrom.toISOString().slice(0, 10));
        query.set("joinedTo", joinedTo.toISOString().slice(0, 10));
      }

      const response = await getUserCount(Object.fromEntries(query));
      if (requestId !== statsRequestId.current) return;
      const root = response?.data ?? response;
      const counts = root?.counts ?? root?.statusCounts ?? root;
      const valueOf = (keys) => {
        for (const key of keys) {
          if (counts?.[key] !== undefined && counts?.[key] !== null) return String(counts[key]);
        }
        return "0";
      };
      setAgentsStats([
        { title: "Total Agents", value: valueOf(["total", "totalCount", "count", "totalAgents"]) },
        { title: "Active Agents", value: valueOf(["active", "activeCount", "activeAgents"]) },
        { title: "In-Active Agents", value: valueOf(["inactive", "inActive", "inactiveCount", "inActiveCount", "inactiveAgents"]) },
        { title: "New Agents", value: valueOf(["new", "newCount", "newAgent", "newAgents"]) },
      ]);
    } catch (error) {
      if (requestId !== statsRequestId.current) return;
      console.error("Failed to fetch agent counts:", error);
      toast.error(error.response?.data?.message || "Failed to load agent status counts");
    }
  };

  const fetchAgents = async (page = 1, limit = 10, sort = "createdAt:desc") => {
    setIsLoading(true);
    try {
      console.log("=== Starting fetchAgents ===");
      
      const query = new URLSearchParams({
        role: "agent",
        page: String(page),
        limit: String(limit),
        sortBy: sort,
      });
      if (agentSearch.trim()) query.set("search", agentSearch.trim());
      if (selectedFilter !== "All") {
        query.set("status", selectedFilter.toLowerCase().replace("-", ""));
      }
      const rangeDays = { "Last 7 days": 7, "Last 30 days": 30, "Last 90 days": 90 }[selectedRange];
      if (rangeDays) {
        const joinedTo = new Date();
        const joinedFrom = new Date(joinedTo);
        joinedFrom.setDate(joinedFrom.getDate() - rangeDays);
        query.set("joinedFrom", joinedFrom.toISOString().slice(0, 10));
        query.set("joinedTo", joinedTo.toISOString().slice(0, 10));
      }

      const response = await getUsers(Object.fromEntries(query));
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
        setTotalResults(0);
        setTotalPages(0);
        setIsLoading(false);
        return;
      }

      // Transform API data to table format
      const transformed = agentsList.map((agent, idx) => {
        console.log(`Agent ${idx}:`, agent);
        return {
          id: agent?.id || agent?._id,
          agentId: agent?.agentId || "N/A",
          name: agent?.name || "N/A",
          laboursCount: Number(agent?.memberCount) || 0,
          joinedDate: formatDate(agent?.workInformation?.joinedDate),
          status: agent?.isActive ? "Active" : "In-Active",
          action: "",
        };
      });

      console.log("✓ Transformed data:", transformed);
      setAgentsData(transformed);
      setTotalResults(response?.totalResults ?? response?.data?.totalResults ?? agentsList.length);
      setTotalPages(response?.totalPages ?? response?.data?.totalPages ?? 1);

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
    navigate("/admin/people/agents/agentProfile", {
      state: { agentId: row.id },
    });
  };

  const handleDeleteAgent = async () => {
    const userId = agentToDelete?.id;
    if (!userId) {
      toast.error("Agent ID is missing");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteUser(userId);
      toast.success("Agent deleted successfully");
      setAgentToDelete(null);
      await fetchAgents(currentPage, pageSize, sortBy);
      await fetchAgentStats();
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Failed to delete agent",
      );
    } finally {
      setIsDeleting(false);
    }
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

  const filteredAgentsData = agentsData;

  return (
    <Container>
      <DeleteConfirmationModal
        isOpen={Boolean(agentToDelete)}
        title="Delete agent?"
        message={`Are you sure you want to delete ${agentToDelete?.name || "this agent"}? This action cannot be undone.`}
        isDeleting={isDeleting}
        onCancel={() => !isDeleting && setAgentToDelete(null)}
        onConfirm={handleDeleteAgent}
      />
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
              onChange={(e) => {
                setSelectedFilter(e.target.value);
                setCurrentPage(1);
              }}
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
              onChange={(e) => {
                setSelectedRange(e.target.value);
                setCurrentPage(1);
              }}
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
              <CardValue>{item.value ?? "—"}</CardValue>
            </CardFooter>
          </StatCard>
        ))}
      </StatsGrid>

      <TableToolbar
        searchPlaceholder="Search Agents"
        searchValue={agentSearch}
        onSearchChange={(value) => {
          setAgentSearch(value);
          setCurrentPage(1);
        }}
        filterText="Filter"
        onFilterClick={handleFilterOpen}
        actionText="New Agent"
        actionIcon={<img src={PlusIcon} alt="add" width="16" height="16" />}
        onActionClick={() => navigate("/admin/peopleHub/employees/create", { state: { from: "onboarding", employeeType: "agent" } })}
      />

      <ReusableTable
        columns={agentsTableColumns}
        data={filteredAgentsData}
        rowsPerPage={pageSize}
        totalResults={totalResults}
        totalPages={totalPages}
        currentPage={currentPage}
        server={true}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
        alwaysShowPagination
        onRowClick={handleRowClick}
        onDelete={setAgentToDelete}
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

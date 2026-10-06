import { useState, useEffect } from "react";
import styled from "styled-components";
import theme from "../../theme/theme";
import ReusableTable from "../../components/ReusableTable";
import TableToolbar from "../../components/TableToolbar";
import DotIcon from "../../assets/images/Overtime/actionDot.svg";
import PunctualPro from "../../assets/images/Badges/PunctualPro.svg";
import AttendanceStreak from "../../assets/images/Badges/AttendanceStreak.svg";
import ZeroAbsenceChamp from "../../assets/images/Badges/ZeroAbsenceChamp.svg";
import PerfectMonth from "../../assets/images/Badges/PerfectMonth.svg";
import NeverLate from "../../assets/images/Badges/NeverLate.svg";
import { getLeaderboard } from "../../services/apiServices";
import { toast } from "react-toastify";

const Leaderboard = () => {
  const badgeIcons = {
    "Punctual Pro": PunctualPro,
    "Attendance Streak": AttendanceStreak,
    "Zero Absence Champ": ZeroAbsenceChamp,
    "Perfect Month": PerfectMonth,
    "Never Late": NeverLate,
  };

  const [search, setSearch] = useState("");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch leaderboard data on component mount and when pagination changes
  useEffect(() => {
    fetchLeaderboard(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const fetchLeaderboard = async (page = 1, limit = 10) => {
    setIsLoading(true);
    try {
      const response = await getLeaderboard({ page, limit, sortBy: "totalPoints:desc" });
      console.log("Leaderboard API Response:", response);

      let leaderboardList = [];
      let total = 0;
      let pages = 0;

      // Handle different response structures
      if (response && Array.isArray(response)) {
        leaderboardList = response;
        total = response.length;
        pages = 1;
      } else if (response && response.results && Array.isArray(response.results)) {
        leaderboardList = response.results;
        total = response.totalResults || response.results.length;
        pages = response.totalPages || 1;
      } else if (response && response.data && Array.isArray(response.data)) {
        leaderboardList = response.data;
        total = response.totalResults || response.data.length;
        pages = response.totalPages || 1;
      }

      if (leaderboardList.length > 0) {
        // Transform API response to table format with rank
        const transformedData = leaderboardList.map((item, index) => {
          // Get user name
          const userName = item.name || "N/A";
          const earnedBadge = (item.badgeDetails || []).find((badge) => badge.earned);
          const primaryBadge = earnedBadge?.label || item.badges?.[0] || "N/A";
          const streakDisplay = `${item.currentStreak || 0} days`;

          return {
            id: item._id || item.id,
            rank: String(item.rank ?? (page - 1) * limit + index + 1),
            name: userName,
            totalPoints: String(item.totalPoints ?? item.weekTotalPoints ?? 0),
            weekTotalPoints: String(item.weekTotalPoints ?? 0),
            badges: primaryBadge,
            currentStreak: streakDisplay,
            action: "...",
            allBadges: item.badgeDetails || [],
            todayPoints: item.todayPoints || 0,
          };
        });

        console.log("Transformed Leaderboard Data:", transformedData);
        setLeaderboardData(transformedData);
        setTotalResults(total);
        setTotalPages(pages);
      } else {
        console.warn("No leaderboard entries found");
        setLeaderboardData([]);
        setTotalResults(0);
        setTotalPages(0);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch leaderboard";
      toast.error(errorMessage);
      console.error("Fetch leaderboard error:", error);
      setLeaderboardData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { header: "Rank", accessor: "rank" },
    { header: "Name", accessor: "name" },
    { header: "Total Points", accessor: "totalPoints" },
    { header: "Week Total Points", accessor: "weekTotalPoints" },
    { 
      header: "Badges", 
      accessor: "badges",
      render: (row) => (
        <BadgeContainer>
          <BadgeIcon
            src={badgeIcons[row.badges] || PunctualPro}
            alt={row.badges}
          />
          <BadgeName>{row.badges}</BadgeName>
        </BadgeContainer>
      )
    },
    { 
      header: "Current Streak", 
      accessor: "currentStreak",
      render: (row) => `🔥 ${row.currentStreak}`
    },
    { header: "Action", accessor: "action" },
  ];

  const filtered = leaderboardData.filter((row) =>
      !search ||
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.rank.toLowerCase().includes(search.toLowerCase())
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Container>
      <TableToolbar
        title={`Total Participate (${String(totalResults).padStart(3, "0")})`}
        searchPosition="right"
        searchPlaceholder="Search Employee"
        searchValue={search}
        onSearchChange={setSearch}
        showFilter={false}
        showDotIcon={true}
        dotIcon={DotIcon}
      />

      <ReusableTable
        columns={columns}
        data={filtered}
        rowsPerPage={pageSize}
        totalResults={totalResults}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={isLoading}
        alwaysShowPagination
      />
    </Container>
  );
};

export default Leaderboard;

const Container = styled.div`
  width: 100%;
  padding: 1.5rem 0;
`;

const BadgeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BadgeIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;

const BadgeName = styled.span`
  font-size: 0.875rem;
  font-family: "Inter-Regular", sans-serif;
  color: ${theme.colors.textColor};
`;

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
import { get } from "../../helpers/api_helper";
import { GET_LEADERBOARD, DEPARTMENTS, GET_SHIFTS } from "../../helpers/url_helper";
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
  const [department, setDepartment] = useState("All Department");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [loadingShifts, setLoadingShifts] = useState(false);

  // Fetch leaderboard data on component mount and when pagination changes
  useEffect(() => {
    fetchLeaderboard(currentPage, pageSize);
    fetchDepartmentsAndShifts();
  }, [currentPage, pageSize]);

  // Fetch departments and shifts for filter dropdowns
  const fetchDepartmentsAndShifts = async () => {
    // Fetch departments
    setLoadingDepts(true);
    try {
      const deptResponse = await get(DEPARTMENTS);
      console.log("Departments response:", deptResponse);
      
      // Handle different response structures
      const deptList = deptResponse?.results || deptResponse?.data || deptResponse || [];
      
      // Transform to dropdown options
      const deptOptions = deptList.map((dept) => ({
        value: dept.departmentName || dept.name || "N/A",
        label: dept.departmentName || dept.name || "N/A",
      }));
      
      setDepartmentOptions(deptOptions);
      console.log("Department options:", deptOptions);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to load departments");
    } finally {
      setLoadingDepts(false);
    }

    // Fetch shifts
    setLoadingShifts(true);
    try {
      const shiftResponse = await get(GET_SHIFTS);
      console.log("Shifts response:", shiftResponse);
      
      // Handle different response structures
      const shiftList = shiftResponse?.results || shiftResponse?.data || shiftResponse || [];
      
      // Transform to dropdown options
      const shiftOpts = shiftList.map((shift) => ({
        value: shift.shiftName || shift.name || "N/A",
        label: shift.shiftName || shift.name || "N/A",
      }));
      
      setShiftOptions(shiftOpts);
      console.log("Shift options:", shiftOpts);
    } catch (error) {
      console.error("Error fetching shifts:", error);
      toast.error("Failed to load shifts");
    } finally {
      setLoadingShifts(false);
    }
  };

  const fetchLeaderboard = async (page = 1, limit = 10) => {
    setIsLoading(true);
    try {
      const response = await get(`${GET_LEADERBOARD}?page=${page}&limit=${limit}&sortBy=totalPoints:desc`);
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
          const userName = item.user?.name || item.user?.firstName + " " + item.user?.lastName || "N/A";
          
          // Get primary badge (first one in array)
          const primaryBadge = item.badges && item.badges.length > 0 ? item.badges[0] : "N/A";
          
          // Format streak days
          const streakDisplay = item.streakDays ? `${item.streakDays} days` : "0 days";

          return {
            id: item._id || item.id,
            rank: String((page - 1) * limit + index + 1),
            name: userName,
            totalPoints: String(item.totalPoints || 0),
            weekTotalPoints: String(item.weekPoints || 0),
            badges: primaryBadge,
            currentStreak: streakDisplay,
            action: "...",
            allBadges: item.badges || [],
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

  const filtered = leaderboardData.filter((row) => {
    const m1 = department === "All Department" || row.department === department;
    const m2 =
      !search ||
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.rank.toLowerCase().includes(search.toLowerCase());
    return m1 && m2;
  });

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
        select1Options={["All Department", ...departmentOptions.map(d => d.value)]}
        select1Value={department}
        onSelect1Change={setDepartment}
        showFilter={true}
        filterText="Filter"
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

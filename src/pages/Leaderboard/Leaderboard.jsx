import { useState } from "react";
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

const Leaderboard = () => {
  const badgeIcons = {
    "Punctual Pro": PunctualPro,
    "Attendance Streak": AttendanceStreak,
    "Zero Absence Champ": ZeroAbsenceChamp,
    "Perfect Month": PerfectMonth,
    "Never Late": NeverLate,
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
            src={badgeIcons[row.badges]} 
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

  const leaderboardData = [
    {
      rank: "1",
      name: "John Doe",
      totalPoints: "950",
      weekTotalPoints: "120",
      badges: "Punctual Pro",
      currentStreak: "7 days",
      action: "...",
    },
    {
      rank: "2",
      name: "Jane Smith",
      totalPoints: "920",
      weekTotalPoints: "115",
      badges: "Attendance Streak",
      currentStreak: "5 days",
      action: "...",
    },
    {
      rank: "3",
      name: "Bob Johnson",
      totalPoints: "890",
      weekTotalPoints: "110",
      badges: "Zero Absence Champ",
      currentStreak: "10 days",
      action: "...",
    },
    {
      rank: "4",
      name: "Emily Richards",
      totalPoints: "850",
      weekTotalPoints: "105",
      badges: "Perfect Month",
      currentStreak: "3 days",
      action: "...",
    },
    {
      rank: "5",
      name: "Michael Brown",
      totalPoints: "820",
      weekTotalPoints: "100",
      badges: "Never Late",
      currentStreak: "4 days",
      action: "...",
    },
  ];

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Department");

  const filtered = leaderboardData.filter((row) => {
    const m1 =
      department === "All Department" || row.department === department;
    const m2 =
      !search ||
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.rank.toLowerCase().includes(search.toLowerCase());
    return m1 && m2;
  });

  return (
    <Container>
      <TableToolbar
        title={`Total Participate (${String(filtered.length).padStart(3, "0")})`}
        searchPosition="right"
        searchPlaceholder="Search Employee"
        searchValue={search}
        onSearchChange={setSearch}
        select1Options={["All Department", "IT", "HR", "Sales", "Marketing"]}
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
        rowsPerPage={10}
        totalResults={filtered.length}
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

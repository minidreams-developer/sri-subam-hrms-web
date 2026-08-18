import { useMemo, useState } from "react";
import styled from "styled-components";
import { FaUsers } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import AddTeamMemberModal from "../../components/AddTeamMemberModal";
import Button from "../../components/Button";
import ReusableTable from "../../components/ReusableTable";
import SearchInputComponent from "../../components/SearchInputComponent";
import theme from "../../theme/theme";

const TEAM = {
  teamId: "#TM879",
  name: "Jumakazoom",
  department: "Design Development",
  teamLead: "Manoj Kumar (Agent)",
  totalMembers: 36,
};

const MEMBERS = [
  ["#EMP8740", "Manoj Kumar", "UI/UX Designer", "Design", "Shift 1", "12-12-2025", "Active"],
  ["#EMP8740", "Adison Stanton", "Procurement", "PP", "Shift 3", "12-12-2025", "In-Active"],
  ["#EMP8740", "Cheyenne Workman", "Developer", "DT", "Shift 4", "12-12-2025", "Relieved"],
  ["#EMP8740", "Jocelyn Bergson", "Sales Manager", "DT", "Rotational", "12-12-2025", "Active"],
  ["#EMP8740", "Nolan Dokidis", "UI/UX Designer", "Dev", "Shift 1", "12-12-2025", "In-Active"],
  ["#EMP8740", "Marilyn Press", "Front end Developer", "MT", "Shift 2", "12-12-2025", "In-Active"],
  ["#EMP8740", "Cheyenne Workman", "UI/UX Designer", "Design", "Shift 3", "12-12-2025", "Active"],
].map(([employeeId, name, designation, dept, shift, joinedDate, status]) => ({
  employeeId,
  name,
  designation,
  dept,
  shift,
  joinedDate,
  status,
  actions: "",
}));

const Teams = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { key: "employeeId", header: "Employee ID" },
    {
      key: "name",
      header: (
        <SortableHeader>
          Name
          <SortMarks aria-hidden="true"><span>▲</span><span>▼</span></SortMarks>
        </SortableHeader>
      ),
    },
    { key: "designation", header: "Designation" },
    { key: "dept", header: "Dept." },
    { key: "shift", header: "Shift" },
    { key: "joinedDate", header: "Joined Date" },
    { key: "status", header: "Status" },
    {
      key: "actions",
      header: "Action",
      align: "right",
      useDefaultActionMenu: true,
    },
  ];

  const filteredMembers = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return MEMBERS;
    return MEMBERS.filter((member) =>
      Object.values(member).some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [searchValue]);

  return (
    <PageCard>
      <TopRow>
        <TitleGroup>
          <TeamIcon><FaUsers /></TeamIcon>
          <Title>Team Name</Title>
        </TitleGroup>

        <Actions>
          <SearchInputComponent
            placeholder="Search Employee"
            value={searchValue}
            onSearchChange={setSearchValue}
            width="356px"
            height="40px"
          />
          <Button
            text="Add New"
            icon={<Plus aria-hidden="true">＋</Plus>}
            onClick={() => setIsModalOpen(true)}
            bg={theme.colors.primary}
            color={theme.colors.white}
            width="154px"
            radius="10px"
            fontSize="0.875rem"
            fontWeight="600"
          />
          <MenuButton type="button" aria-label="Team actions"><FiMoreHorizontal /></MenuButton>
        </Actions>
      </TopRow>

      <TeamSummary>
        <SummaryColumn>
          <SummaryLine><Label>Team ID</Label><Colon>:</Colon><Value>{TEAM.teamId}</Value></SummaryLine>
          <SummaryLine><Label>Name</Label><Colon>:</Colon><Value>{TEAM.name}</Value></SummaryLine>
          <SummaryLine><Label>Department</Label><Colon>:</Colon><Value>{TEAM.department}</Value></SummaryLine>
        </SummaryColumn>
        <SummaryColumn>
          <SummaryLine><Label>Team Lead</Label><Colon>:</Colon><Value>{TEAM.teamLead}</Value></SummaryLine>
          <SummaryLine><Label>Total Members</Label><Colon>:</Colon><Value>{TEAM.totalMembers}</Value></SummaryLine>
        </SummaryColumn>
      </TeamSummary>

      <TableArea>
        <ReusableTable
          columns={columns}
          data={filteredMembers}
          rowsPerPage={7}
          totalResults={filteredMembers.length}
        />
      </TableArea>

      <AddTeamMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={() => setIsModalOpen(false)}
      />
    </PageCard>
  );
};

const PageCard = styled.section`
  width: 100%;
  min-height: calc(100vh - 130px);
  box-sizing: border-box;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  @media (max-width: 1000px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TeamIcon = styled.div`
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  color: ${theme.colors.primary};
  background: ${theme.colors.secondaryPrimary};
  border-radius: 6px;
  svg { width: 20px; height: 20px; }
`;

const Title = styled.h1`
  margin: 0;
  color: ${theme.colors.textColor};
  font: 600 18px/1.6 "Inter", sans-serif;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  > div:first-child { flex: 0 1 356px; }

  @media (max-width: 1000px) {
    width: 100%;
    flex-wrap: wrap;
  }
`;

const Plus = styled.span`
  font-size: 22px;
  font-weight: 300;
  line-height: 1;
`;

const MenuButton = styled.button`
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  padding: 0;
  color: ${theme.colors.textColor};
  background: #fff;
  border: 1px solid #e0e3e6;
  border-radius: 10px;
  cursor: pointer;
  svg { width: 20px; height: 20px; }
`;

const TeamSummary = styled.div`
  display: grid;
  grid-template-columns: 286px minmax(300px, 1fr);
  column-gap: 78px;
  margin-top: 26px;
  padding-bottom: 26px;
  border-bottom: 1px solid #e0e3e6;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
    row-gap: 15px;
  }
`;

const SummaryColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SummaryLine = styled.div`
  display: grid;
  grid-template-columns: 86px 12px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  min-height: 24px;
  font: 500 14px/1.6 "Inter", sans-serif;
`;

const Label = styled.span`color: #6b6b6b;`;
const Colon = styled.span`color: #6b6b6b;`;
const Value = styled.span`color: ${theme.colors.textColor}; white-space: nowrap;`;

const TableArea = styled.div`
  table { table-layout: auto; }
  th { height: 40px; padding: 10px; min-width: 80px; }
  td { height: 48px; padding: 12px 10px; min-width: 80px; white-space: nowrap; }
  th:first-child, td:first-child { width: 130px; }
  th:nth-child(2), td:nth-child(2) { width: 170px; }
  th:nth-child(3), td:nth-child(3) { width: 160px; }
  th:last-child, td:last-child { width: 60px; }
  thead p { color: #8a8a8a !important; font-size: 14px !important; }
  tbody tr:hover { background: #fafafc; }
`;

const SortableHeader = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const SortMarks = styled.span`
  display: inline-flex;
  flex-direction: column;
  color: #80cbd3;
  font-size: 6px;
  line-height: 6px;
`;

const RowAction = styled.button`
  display: grid;
  place-items: center;
  margin-left: auto;
  padding: 0;
  color: ${theme.colors.textColor};
  background: transparent;
  border: 0;
  cursor: pointer;
  svg { width: 20px; height: 20px; }
`;

export default Teams;

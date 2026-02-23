import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import ReusableTable from "../../components/ReusableTable";
import SearchInputComponent from "../../components/SearchInputComponent";
import Button from "../../components/Button";
import AddTeamMemberModal from "../../components/AddTeamMemberModal";
import { FaUsers } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";

const TeamDetails = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const teamInfo = {
    teamId: "#TM879",
    name: "Jumakazoom",
    department: "Design Development",
    teamLead: "Manoj Kumar (Agent)",
    totalMembers: 36,
  };

  const employeeColumns = [
    { key: "employeeId", label: "Employee ID" },
    { key: "name", label: "Name" },
    { key: "designation", label: "Designation" },
    { key: "dept", label: "Dept." },
    { key: "shift", label: "Shift" },
    { key: "joinedDate", label: "Joined Date" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Action" },
  ];

  const employeeData = [
    {
      employeeId: "#EMP8740",
      name: "Manoj Kumar",
      designation: "UI/UX Designer",
      dept: "Design",
      shift: "Shift 1",
      joinedDate: "12-12-2025",
      status: "Active",
      actions: "...",
    },
    {
      employeeId: "#EMP8740",
      name: "Adison Stanton",
      designation: "Procurement",
      dept: "PP",
      shift: "Shift 3",
      joinedDate: "12-12-2025",
      status: "In-Active",
      actions: "...",
    },
    {
      employeeId: "#EMP8740",
      name: "Cheyenne Workman",
      designation: "Developer",
      dept: "DT",
      shift: "Shift 4",
      joinedDate: "12-12-2025",
      status: "Relieved",
      actions: "...",
    },
    {
      employeeId: "#EMP8740",
      name: "Jocelyn Bergson",
      designation: "Sales Manager",
      dept: "DT",
      shift: "Rotational",
      joinedDate: "12-12-2025",
      status: "Active",
      actions: "...",
    },
    {
      employeeId: "#EMP8740",
      name: "Nolan Dokidis",
      designation: "UI/UX Designer",
      dept: "Dev",
      shift: "Shift 1",
      joinedDate: "12-12-2025",
      status: "In-Active",
      actions: "...",
    },
    {
      employeeId: "#EMP8740",
      name: "Marilyn Press",
      designation: "Front end Developer",
      dept: "MT",
      shift: "Shift 2",
      joinedDate: "12-12-2025",
      status: "In-Active",
      actions: "...",
    },
    {
      employeeId: "#EMP8740",
      name: "Cheyenne Workman",
      designation: "UI/UX Designer",
      dept: "Design",
      shift: "Shift 3",
      joinedDate: "12-12-2025",
      status: "Active",
      actions: "...",
    },
  ];

  const filteredData = employeeData.filter((row) => {
    if (!searchValue) return true;
    const search = searchValue.toLowerCase();
    return (
      row.employeeId.toLowerCase().includes(search) ||
      row.name.toLowerCase().includes(search) ||
      row.designation.toLowerCase().includes(search) ||
      row.dept.toLowerCase().includes(search)
    );
  });

  const handleSaveMember = (memberData) => {
    console.log("New member data:", memberData);
    // Add logic to save member data
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <IconWrapper>
            <FaUsers size={24} color={theme.colors.primary} />
          </IconWrapper>
          <HeaderTitle>Team Name</HeaderTitle>
        </HeaderLeft>
        <HeaderRight>
          <SearchInputComponent
            placeholder="Search Employee"
            value={searchValue}
            onSearchChange={setSearchValue}
            width="300px"
            height="40px"
          />
          <Button
            text="Add New"
            bg={theme.colors.primary}
            color={theme.colors.white}
            width="auto"
            radius="0.5rem"
            fontSize="0.875rem"
            fontWeight="600"
            fontFamily="Inter-SemiBold"
            icon={<span style={{ fontSize: "1.2rem" }}>+</span>}
            onClick={() => setIsModalOpen(true)}
          />
          <DotsButton>
            <BsThreeDotsVertical size={20} color={theme.colors.textColor} />
          </DotsButton>
        </HeaderRight>
      </Header>

      <InfoCard>
        <InfoRow>
          <InfoItem>
            <InfoLabel>Team ID</InfoLabel>
            <InfoValue>{teamInfo.teamId}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Team Lead</InfoLabel>
            <InfoValue>{teamInfo.teamLead}</InfoValue>
          </InfoItem>
        </InfoRow>
        <InfoRow>
          <InfoItem>
            <InfoLabel>Name</InfoLabel>
            <InfoValue>{teamInfo.name}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Total Members</InfoLabel>
            <InfoValue>{teamInfo.totalMembers}</InfoValue>
          </InfoItem>
        </InfoRow>
        <InfoRow>
          <InfoItem>
            <InfoLabel>Department</InfoLabel>
            <InfoValue>{teamInfo.department}</InfoValue>
          </InfoItem>
        </InfoRow>
      </InfoCard>

      <ReusableTable
        columns={employeeColumns}
        data={filteredData}
        rowsPerPage={7}
        totalResults={filteredData.length}
      />

      <AddTeamMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMember}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 1.5rem 0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const IconWrapper = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.primaryLight || "#e6f7ff"};
  border-radius: 0.5rem;
`;

const HeaderTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const DotsButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${theme.colors.secondaryWhite};
  }
`;

const InfoCard = styled.div`
  background: ${theme.colors.white};
  border-radius: 0.625rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoItem = styled.div`
  display: flex;
  gap: 1rem;
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 400;
  color: ${theme.colors.secondaryTextColor || "#6b7280"};
  min-width: 120px;
`;

const InfoValue = styled.span`
  font-size: 0.875rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 500;
  color: ${theme.colors.textColor};
`;

export default TeamDetails;

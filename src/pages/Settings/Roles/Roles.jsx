import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TableToolbar from "../../../components/TableToolbar";
import ReusableTable from "../../../components/ReusableTable";
import PlusIcon from "../../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import DotMenuIcon from "../../../assets/images/DayOff/dot-menu.svg";

const Roles = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const rolesData = [
    {
      roleId: "#RL8740",
      role: "Senior Manager",
      description: "Manages team operations and strategic planning",
      status: "Active",
    },
    {
      roleId: "#RL8741",
      role: "Team Lead",
      description: "Leads project teams and coordinates tasks",
      status: "Active",
    },
  ];

  const columns = [
    {
      header: "Role ID",
      key: "roleId",
    },
    {
      header: "Role",
      key: "role",
    },
    {
      header: "Description",
      key: "description",
    },
    {
      header: "Status",
      key: "status",
      render: (row) => <StatusBadge $status={row.status}>{row.status}</StatusBadge>,
    },
    {
      header: "Action",
      key: "actions",
      render: (row) => (
        <ActionButton onClick={(e) => { e.stopPropagation(); console.log("Action clicked:", row); }}>
          <img src={DotMenuIcon} alt="menu" width="20" height="20" />
        </ActionButton>
      ),
    },
  ];

  const handleNewRole = () => {
    console.log("New Role clicked");
    navigate("/admin/settings/roles/roleConfigure");
  };

  return (
    <Container>
      <TableToolbar
        searchPosition="left"
        searchPlaceholder="Search Roles"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        showFilter={false}
        actionText="New Role"
        actionIcon={<img src={PlusIcon} alt="add" width="16" height="16" />}
        onActionClick={handleNewRole}
        widths={{ search: "20rem" }}
      />

      <TableWrapper>
        <ReusableTable
          columns={columns}
          data={rolesData}
          itemsPerPage={10}
          enablePagination={true}
          alwaysShowPagination={true}
        />
      </TableWrapper>
    </Container>
  );
};

export default Roles;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem 0;
`;

const TableWrapper = styled.div`
  width: 100%;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-family: "Inter-Medium", sans-serif;
  font-weight: 500;
  color: ${(props) => (props.$status === "Active" ? "#10B981" : "#EF4444")};
  background: transparent;
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.7;
  }
`;

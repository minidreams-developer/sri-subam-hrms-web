import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TableToolbar from "../../../components/TableToolbar";
import ReusableTable from "../../../components/ReusableTable";
import PlusIcon from "../../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import DotMenuIcon from "../../../assets/images/DayOff/dot-menu.svg";
import { get, patch, del } from "../../../helpers/api_helper";
import { GET_ROLES, UPDATE_ROLE, DELETE_ROLE } from "../../../helpers/url_helper";
import { toast } from "react-toastify";
import theme from "../../../theme/theme";

const Roles = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [rolesData, setRolesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await get(GET_ROLES);
      if (response?.results) {
        setRolesData(response.results);
      } else if (Array.isArray(response)) {
        setRolesData(response);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch roles. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleEdit = (roleId) => {
    setOpenMenuId(null);
    navigate(`/admin/settings/roles/roleConfigure`, { state: { roleId } });
  };

  const handleDelete = async (roleId) => {
    setOpenMenuId(null);
    const confirmDelete = window.confirm("Are you sure you want to delete this role?");
    if (!confirmDelete) return;

    try {
      const url = DELETE_ROLE.replace(":roleId", roleId);
      await del(url);
      toast.success("Role deleted successfully!");
      fetchRoles(); // Refresh the list
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete role. Please try again."
      );
    }
  };

  const columns = [
    {
      header: "Role ID",
      key: "roleId",
    },
    {
      header: "Role",
      key: "name",
    },
    {
      header: "Description",
      key: "description",
    },
    {
      header: "Status",
      key: "isActive",
      render: (row) => (
        <StatusBadge $status={row.isActive ? "Active" : "Inactive"}>
          {row.isActive ? "Active" : "Inactive"}
        </StatusBadge>
      ),
    },
    {
      header: "Action",
      key: "actions",
      render: (row) => (
        <ActionMenuContainer>
          <ActionButton 
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === row.id ? null : row.id);
            }}
          >
            <img src={DotMenuIcon} alt="menu" width="20" height="20" />
          </ActionButton>
          {openMenuId === row.id && (
            <DropdownMenu>
              <MenuItem onClick={() => handleEdit(row.id || row._id)}>
                Edit
              </MenuItem>
              <MenuItem $danger onClick={() => handleDelete(row.id || row._id)}>
                Delete
              </MenuItem>
            </DropdownMenu>
          )}
        </ActionMenuContainer>
      ),
    },
  ];

  const handleNewRole = () => {
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
        {loading ? (
          <LoadingText>Loading roles...</LoadingText>
        ) : (
          <ReusableTable
            columns={columns}
            data={rolesData}
            itemsPerPage={10}
            enablePagination={true}
            alwaysShowPagination={true}
          />
        )}
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

const ActionMenuContainer = styled.div`
  position: relative;
  display: inline-block;
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

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 120px;
  z-index: 1000;
  margin-top: 0.5rem;
`;

const MenuItem = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 0.875rem;
  font-family: "Inter-Regular", sans-serif;
  color: ${(props) => (props.$danger ? "#EF4444" : theme.colors.textColor)};
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$danger ? "#FEE2E2" : "#F3F4F6")};
  }

  &:first-child {
    border-radius: 0.5rem 0.5rem 0 0;
  }

  &:last-child {
    border-radius: 0 0 0.5rem 0.5rem;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1rem;
  color: ${theme.colors.darkGrey};
  font-family: "Inter-Medium", sans-serif;
`;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TableToolbar from "../../../components/TableToolbar";
import ReusableTable from "../../../components/ReusableTable";
import PlusIcon from "../../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import { del, get } from "../../../helpers/api_helper";
import { DELETE_ROLE, GET_ROLES } from "../../../helpers/url_helper";
import { toast } from "react-toastify";
import theme from "../../../theme/theme";

const Roles = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [rolesData, setRolesData] = useState([]);
  const [loading, setLoading] = useState(false);

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
    },
  ];

  const handleNewRole = () => {
    navigate("/admin/settings/roles/roleConfigure");
  };

  const handleEditRole = (role) => {
    const roleId = role.id || role._id;
    if (!roleId) {
      toast.error("Role ID is missing");
      return;
    }
    navigate("/admin/settings/roles/roleConfigure", { state: { roleId } });
  };

  const handleDeleteRole = async (role) => {
    const roleId = role.id || role._id;
    if (!roleId) {
      toast.error("Role ID is missing");
      return;
    }

    if (!window.confirm(`Delete the ${role.name || "selected"} role?`)) return;

    try {
      await del(DELETE_ROLE.replace(":roleId", roleId));
      setRolesData((current) =>
        current.filter((item) => (item.id || item._id) !== roleId),
      );
      toast.success("Role deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete role");
    }
  };

  const filteredRoles = rolesData.filter((role) =>
    `${role.roleId || ""} ${role.name || ""} ${role.description || ""}`
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase()),
  );

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
            data={filteredRoles}
            itemsPerPage={10}
            enablePagination={true}
            alwaysShowPagination={true}
            onEdit={handleEditRole}
            onDelete={handleDeleteRole}
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

const LoadingText = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1rem;
  color: ${theme.colors.darkGrey};
  font-family: "Inter-Medium", sans-serif;
`;

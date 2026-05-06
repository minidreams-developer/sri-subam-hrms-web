import { useState } from "react";
import styled from "styled-components";
import TableToolbar from "../../../components/TableToolbar";
import ReusableTable from "../../../components/ReusableTable";
import AddDepartmentModal from "../../../components/AddDepartmentModal";
import PlusIcon from "../../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import DotMenuIcon from "../../../assets/images/DayOff/dot-menu.svg";

const Departments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const departmentsData = [
    {
      deptId: "#DPE8740",
      department: "Assistant Manager",
      head: "Manoj Kumar",
      status: "Active",
    },
    {
      deptId: "#DPE8740",
      department: "Admin",
      head: "Deepak Kumar",
      status: "Active",
    },
  ];

  const columns = [
    {
      header: "Dept ID",
      key: "deptId",
    },
    {
      header: "Department",
      key: "department",
    },
    {
      header: "Head",
      key: "head",
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

  const handleNewDepartment = () => {
    setIsModalOpen(true);
  };

  const handleSaveDepartment = (data) => {
    console.log("New department data:", data);
    // Add your save logic here
  };

  return (
    <Container>
      <TableToolbar
        searchPosition="left"
        searchPlaceholder="Search Department"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        showFilter={false}
        actionText="New Department"
        actionIcon={<img src={PlusIcon} alt="add" width="16" height="16" />}
        onActionClick={handleNewDepartment}
        widths={{ search: "20rem" }}
      />

      <TableWrapper>
        <ReusableTable
          columns={columns}
          data={departmentsData}
          itemsPerPage={10}
          enablePagination={true}
          alwaysShowPagination={true}
        />
      </TableWrapper>

      <AddDepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDepartment}
      />
    </Container>
  );
};

export default Departments;

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

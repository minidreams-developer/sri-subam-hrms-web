import { useState, useEffect } from "react";
import styled from "styled-components";
import TableToolbar from "../../../components/TableToolbar";
import ReusableTable from "../../../components/ReusableTable";
import AddDepartmentModal from "../../../components/AddDepartmentModal";
import PlusIcon from "../../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import { deleteDepartment, getDepartments, updateDepartment } from "../../../services/apiServices";
import { toast } from "react-toastify";

const Departments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);
  const [departmentsData, setDepartmentsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch departments when page changes
  useEffect(() => {
    fetchDepartments(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const fetchDepartments = async (page = 1, searchQuery = "") => {
    setIsLoading(true);
    try {
      const response = await getDepartments({ page, limit: itemsPerPage, search: searchQuery });
      console.log("Departments response:", response);

      // Extract pagination info from response
      const totalPagesFromAPI = response?.totalPages || 1;
      const departmentsList = response?.results || response?.data || response || [];

      // Map API response to table format
      const mappedData = departmentsList.map((dept) => {
        // Extract department head name from various possible structures
        let headName = "N/A";
        
        if (dept.departmentHead) {
          if (typeof dept.departmentHead === "string") {
            // If it's just an ID string, we can't display it
            headName = "N/A";
          } else if (dept.departmentHead.name) {
            headName = dept.departmentHead.name;
          } else if (dept.departmentHead.email) {
            headName = dept.departmentHead.email;
          } else if (dept.departmentHead.firstName && dept.departmentHead.lastName) {
            headName = `${dept.departmentHead.firstName} ${dept.departmentHead.lastName}`;
          }
        }

        console.log(`Department: ${dept.departmentName}, Head:`, dept.departmentHead, "Mapped to:", headName);

        return {
          id: dept.id || dept._id,
          deptId: dept.departmentCode,
          department: dept.departmentName,
          head: headName,
          status: dept.isActive === false ? "Inactive" : "Active",
          isActive: dept.isActive !== false,
          description: dept.departmentDescription,
          rawDept: dept, // Keep raw data for debugging
        };
      });

      console.log("Mapped departments data:", mappedData);
      setDepartmentsData(mappedData);
      setTotalPages(totalPagesFromAPI);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to fetch departments");
      // Reset on error
      setDepartmentsData([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

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
      render: (row) => (
        <HeadCell title={row.head}>
          {row.head || "—"}
        </HeadCell>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <StatusToggle
          type="button"
          role="switch"
          aria-checked={row.isActive}
          $active={row.isActive}
          onClick={() => handleToggleStatus(row)}
          title={`Set ${row.isActive ? "Inactive" : "Active"}`}
        >
          <ToggleKnob $active={row.isActive} />
          {row.isActive ? "Active" : "Inactive"}
        </StatusToggle>
      ),
    },
    {
      header: "Action",
      key: "actions",
      useDefaultActionMenu: true,
      align: "right",
    },
  ];

  const handleNewDepartment = () => {
    setIsEditMode(false);
    setEditingDepartmentId(null);
    setIsModalOpen(true);
  };

  const handleEditDepartment = (row) => {
    const departmentId = row.id;
    setEditingDepartmentId(departmentId);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteDepartment = async (row) => {
    const departmentId = row.id;
    // Confirmation dialog before delete
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDepartment(departmentId);
        toast.success("Department deleted successfully!");
        // Refresh the departments list
        setCurrentPage(1);
        fetchDepartments(1);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to delete department";
        toast.error(errorMessage);
        console.error("Delete department error:", error);
      }
    }
  };

  const handleToggleStatus = async (row) => {
    const nextIsActive = !row.isActive;
    try {
      await updateDepartment(row.id, { isActive: nextIsActive });
      toast.success(`Department ${nextIsActive ? "activated" : "deactivated"} successfully!`);
      fetchDepartments(currentPage, searchQuery);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update department status");
      console.error("Department status update error:", error);
    }
  };

  const handleSaveDepartment = (data) => {
    console.log("Department data:", data);
    // Refresh the departments list after saving (go back to page 1)
    setCurrentPage(1);
    setIsEditMode(false);
    setEditingDepartmentId(null);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Server-side search is handled in useEffect when searchQuery changes
  // No need for client-side filtering

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
        {isLoading ? (
          <LoadingText>Loading departments...</LoadingText>
        ) : (
          <ReusableTable
            columns={columns}
            data={departmentsData}
            isLoading={isLoading}
            server={true}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onEdit={handleEditDepartment}
            onDelete={handleDeleteDepartment}
            rowsPerPage={itemsPerPage}
            alwaysShowPagination={true}
          />
        )}
      </TableWrapper>

      <AddDepartmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setEditingDepartmentId(null);
        }}
        onSave={handleSaveDepartment}
        isEditMode={isEditMode}
        editingDepartmentId={editingDepartmentId}
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

const LoadingText = styled.div`
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
  font-size: 0.875rem;
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

const StatusToggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: none;
  background: transparent;
  color: ${({ $active }) => ($active ? "#10B981" : "#EF4444")};
  font: inherit;
  cursor: pointer;
  padding: 0.25rem 0;
`;

const ToggleKnob = styled.span`
  width: 28px;
  height: 16px;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? "#10B981" : "#9CA3AF")};
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 2px;
    left: ${({ $active }) => ($active ? "14px" : "2px")};
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    transition: left 0.2s ease;
  }
`;

const HeadCell = styled.div`
  font-size: 0.875rem;
  color: ${(props) => (props.children === "—" ? "#9ca3af" : "#0c0c0c")};
  font-weight: 500;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

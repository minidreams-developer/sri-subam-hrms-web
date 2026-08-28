import { useState, useEffect } from "react";
import styled from "styled-components";
import TableToolbar from "../../../components/TableToolbar";
import ReusableTable from "../../../components/ReusableTable";
import AddDepartmentModal from "../../../components/AddDepartmentModal";
import PlusIcon from "../../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import EditIcon from "../../../assets/images/employee/editIcon.svg";
import DeleteIcon from "../../../assets/images/employee/Cross.svg";
import { deleteDepartment, getDepartments } from "../../../services/apiServices";
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
          status: "Active",
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
      render: (row) => <StatusBadge $status={row.status}>{row.status}</StatusBadge>,
    },
    {
      header: "Action",
      key: "actions",
      render: (row) => (
        <ActionIcons>
          <IconButton 
            onClick={(e) => handleEditDepartment(e, row.id)}
            title="Edit"
          >
            <img src={EditIcon} alt="edit" width="18" height="18" />
          </IconButton>
          <IconButton 
            onClick={(e) => handleDeleteDepartment(e, row.id)}
            title="Delete"
            $delete
          >
            <img src={DeleteIcon} alt="delete" width="18" height="18" />
          </IconButton>
        </ActionIcons>
      ),
    },
  ];

  const handleNewDepartment = () => {
    setIsEditMode(false);
    setEditingDepartmentId(null);
    setIsModalOpen(true);
  };

  const handleEditDepartment = (e, departmentId) => {
    e.stopPropagation();
    setEditingDepartmentId(departmentId);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteDepartment = async (e, departmentId) => {
    e.stopPropagation();
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

const ActionIcons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.5rem;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: ${({ $delete }) => $delete ? "#fee2e2" : "#edf6f9"};
  border: 1px solid ${({ $delete }) => $delete ? "#fecaca" : "#d1e7ed"};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ $delete }) => $delete ? "#fecaca" : "#d1e7ed"};
    transform: scale(1.05);
  }

  img {
    width: 18px;
    height: 18px;
    object-fit: contain;
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

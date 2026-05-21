import { useState, useEffect } from "react";
import styled from "styled-components";
import TableToolbar from "../../../components/TableToolbar";
import ReusableTable from "../../../components/ReusableTable";
import AddDepartmentModal from "../../../components/AddDepartmentModal";
import PlusIcon from "../../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import DotMenuIcon from "../../../assets/images/DayOff/dot-menu.svg";
import { get } from "../../../helpers/api_helper";
import { DEPARTMENTS } from "../../../helpers/url_helper";
import { toast } from "react-toastify";

const Departments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departmentsData, setDepartmentsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const response = await get(DEPARTMENTS);
      console.log("Departments response:", response);

      // Map API response to table format
      // Handle different possible response structures
      const departmentsList = response?.results || response?.data || response || [];
      
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
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to fetch departments");
      // Set fallback data for demo
      setDepartmentsData([
        {
          id: "1",
          deptId: "#DPE8740",
          department: "Assistant Manager",
          head: "Manoj Kumar",
          status: "Active",
        },
        {
          id: "2",
          deptId: "#DPE8741",
          department: "Admin",
          head: "Deepak Kumar",
          status: "Active",
        },
      ]);
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
    // Refresh the departments list after saving
    fetchDepartments();
  };

  // Filter departments based on search query
  const filteredData = departmentsData.filter((dept) =>
    dept.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.deptId.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            data={filteredData}
            itemsPerPage={10}
            enablePagination={true}
            alwaysShowPagination={true}
          />
        )}
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

const HeadCell = styled.div`
  font-size: 0.875rem;
  color: ${(props) => (props.children === "—" ? "#9ca3af" : "#0c0c0c")};
  font-weight: 500;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

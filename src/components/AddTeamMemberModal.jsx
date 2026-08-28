import { useEffect, useState } from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import Button from "./Button";
import Select from "react-select";
import { customSelectStyles } from "../theme/reactSelectStyles";
import { getDepartments, getUsers } from "../services/apiServices";
import { toast } from "react-toastify";

const AddTeamMemberModal = ({ isOpen, onClose, onSave, isLoading = false }) => {
  const [formData, setFormData] = useState({
    employment: null,
    employee: null,
    department: null,
  });

  const [users, setUsers] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  useEffect(() => { if (!isOpen) return; Promise.all([getUsers({ page: 1, limit: 100 }), getDepartments({ page: 1, limit: 100 })]).then(([users, departments]) => {
    const userList = users?.results || users?.data?.results || users?.data || users || [];
    const departmentList = departments?.results || departments?.data?.results || departments?.data || departments || [];
    setUsers(Array.isArray(userList) ? userList : []);
    setDepartmentOptions((Array.isArray(departmentList) ? departmentList : []).map((department) => ({ value:department.id||department._id,label:department.departmentName||department.name })));
  }).catch(() => toast.error("Failed to load members")); }, [isOpen]);

  useEffect(() => {
    const role = formData.employment?.value;
    const departmentId = formData.department?.value;
    const options = users.filter((user) => {
      const userRole = String(user.role?.name || user.role || user.userType || user.employeeType || "").toLowerCase();
      const userDepartment = user.workInformation?.department || user.department;
      const userDepartmentId = userDepartment?.id || userDepartment?._id || userDepartment;
      return (!role || userRole.includes(role)) && (!departmentId || String(userDepartmentId) === String(departmentId));
    }).map((user) => ({ value:user.id||user._id,label:user.name||user.email,raw:user }));
    setEmployeeOptions(options);
    setFormData((current) => ({ ...current, employee: options.some((option) => option.value === current.employee?.value) ? current.employee : null }));
  }, [users, formData.employment, formData.department]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.employee) return toast.error("Please select an employee");
    onSave && onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Add New Member</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          <SelectWrapper>
            <Label>Employment</Label>
            <Select
              options={[{value:"employee",label:"Employee"},{value:"staff",label:"Staff"},{value:"agent",label:"Agent"}]}
              value={formData.employment}
              onChange={(value) => handleChange("employment", value)}
              placeholder="Select Employment"
              styles={customSelectStyles}
              isSearchable
            />
          </SelectWrapper>

          <SelectWrapper>
            <Label>Department</Label>
            <Select
              options={departmentOptions}
              value={formData.department}
              onChange={(value) => handleChange("department", value)}
              placeholder="Select Department"
              styles={customSelectStyles}
              isSearchable
            />
          </SelectWrapper>

          <SelectWrapper><Label>Name</Label><Select options={employeeOptions} value={formData.employee} onChange={(value) => handleChange("employee", value)} placeholder="Select Name" styles={customSelectStyles} isSearchable /></SelectWrapper>
        </ModalBody>

        <ModalFooter>
          <Button
            text="Cancel"
            bg={theme.colors.white}
            color={theme.colors.primary}
            border={`2px solid ${theme.colors.primary}`}
            width="48%"
            radius="0.625rem"
            fontSize="0.875rem"
            fontWeight="600"
            fontFamily="Inter-SemiBold"
            onClick={onClose}
          />
          <Button
            text="Add"
            bg={theme.colors.primary}
            color={theme.colors.white}
            width="48%"
            radius="0.625rem"
            fontSize="0.875rem"
            fontWeight="600"
            fontFamily="Inter-SemiBold"
            onClick={handleSave}
            loading={isLoading}
            disabled={isLoading}
          />
        </ModalFooter>
      </ModalContainer>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: #f7f8fc;
  border-radius: 10px;
  width: 440px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid ${theme.colors.border};
`;

const ModalTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  line-height: 1;
  color: #9ca3af;
  transition: color 0.2s;

  &:hover {
    color: ${theme.colors.textColor};
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const SelectWrapper = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 500;
  line-height: 160%;
  color: #0c0c0c;
  margin-bottom: 0.625rem;
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  border-top: 1px solid ${theme.colors.border};
`;

export default AddTeamMemberModal;

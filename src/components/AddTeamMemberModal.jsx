import { useState } from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import Button from "./Button";
import InputComponent from "./InputComponent";
import Select from "react-select";
import { customSelectStyles } from "../theme/reactSelectStyles";

const AddTeamMemberModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    employee: null,
    department: null,
    name: "",
  });

  const employeeOptions = [
    { value: "emp001", label: "John Doe" },
    { value: "emp002", label: "Jane Smith" },
    { value: "emp003", label: "Mike Johnson" },
    { value: "emp004", label: "Sarah Williams" },
    { value: "emp005", label: "David Brown" },
  ];

  const departmentOptions = [
    { value: "IT", label: "IT" },
    { value: "HR", label: "HR" },
    { value: "Sales", label: "Sales" },
    { value: "Marketing", label: "Marketing" },
    { value: "Finance", label: "Finance" },
    { value: "Design", label: "Design" },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave && onSave(formData);
    onClose();
    // Reset form
    setFormData({
      employee: null,
      department: null,
      name: "",
    });
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
            <Label>Employee</Label>
            <Select
              options={employeeOptions}
              value={formData.employee}
              onChange={(value) => handleChange("employee", value)}
              placeholder="Select Employee"
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

          <InputComponent
            label="Name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            labelMargin="1rem 0 0.625rem 0"
          />
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
            text="Save"
            bg={theme.colors.primary}
            color={theme.colors.white}
            width="48%"
            radius="0.625rem"
            fontSize="0.875rem"
            fontWeight="600"
            fontFamily="Inter-SemiBold"
            onClick={handleSave}
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
  background: ${theme.colors.white};
  border-radius: 1rem;
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
  font-size: 1.25rem;
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

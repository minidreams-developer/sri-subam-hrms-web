import { useState } from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import Button from "./Button";
import InputComponent from "./InputComponent";
import Select from "react-select";
import { customSelectStyles } from "../theme/reactSelectStyles";

const AddDepartmentModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    departmentId: "#TM879",
    departmentName: "",
    departmentHead: null,
  });

  const departmentHeadOptions = [
    { value: "manoj_kumar", label: "Manoj Kumar" },
    { value: "deepak_kumar", label: "Deepak Kumar" },
    { value: "john_doe", label: "John Doe" },
    { value: "jane_smith", label: "Jane Smith" },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave && onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Add New Department</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          <InputComponent
            label="Department ID"
            placeholder="#TM879"
            value={formData.departmentId}
            onChange={(e) => handleChange("departmentId", e.target.value)}
            labelMargin="0 0 0.625rem 0"
            height="50px"
          />

          <InputComponent
            label="Department"
            placeholder="Enter Department Name"
            value={formData.departmentName}
            onChange={(e) => handleChange("departmentName", e.target.value)}
            labelMargin="1rem 0 0.625rem 0"
            height="50px"
          />

          <SelectWrapper>
            <Label>Department Head</Label>
            <Select
              options={departmentHeadOptions}
              value={formData.departmentHead}
              onChange={(value) => handleChange("departmentHead", value)}
              placeholder="Select Department Head"
              styles={customSelectStyles}
              isSearchable
            />
          </SelectWrapper>
        </ModalBody>

        <ModalFooter>
          <Button
            text="Cancel"
            bg={theme.colors.white}
            color={theme.colors.primary}
            border={`1px solid ${theme.colors.primary}`}
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
  margin-top: 1rem;
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

export default AddDepartmentModal;

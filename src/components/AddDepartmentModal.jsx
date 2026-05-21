import { useState, useEffect } from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import Button from "./Button";
import InputComponent from "./InputComponent";
import Select from "react-select";
import { customSelectStyles } from "../theme/reactSelectStyles";
import { post, get } from "../helpers/api_helper";
import { GENERATE_DEPARTMENT_ID, CREATE_DEPARTMENT, GET_ALL_EMPLOYEES } from "../helpers/url_helper";
import { toast } from "react-toastify";

const AddDepartmentModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    departmentCode: "",
    departmentName: "",
    departmentDescription: "",
    departmentHead: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingId, setIsGeneratingId] = useState(false);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [departmentHeadOptions, setDepartmentHeadOptions] = useState([]);

  // Generate department ID on modal open
  useEffect(() => {
    if (isOpen && !formData.departmentCode) {
      generateDepartmentId();
      fetchDepartmentHeads();
    }
  }, [isOpen]);

  // GET /v1/users - Fetch all users for Department Head dropdown
  const fetchDepartmentHeads = async () => {
    setIsFetchingUsers(true);
    try {
      console.log("Fetching users from GET /v1/users");
      const response = await get(GET_ALL_EMPLOYEES);
      console.log("Users fetched:", response);

      // Map users to dropdown options
      const users = response?.results || response || [];
      const options = users.map((user) => ({
        value: user.id || user._id,
        label: user.name || user.email || "Unknown",
      }));

      console.log("Department head options:", options);
      setDepartmentHeadOptions(options);

      if (options.length === 0) {
        console.warn("No users found in response");
      }
    } catch (error) {
      console.error("Error fetching department heads:", error);
      toast.error("Failed to fetch users for department head");
      // Set fallback options
      setDepartmentHeadOptions([
        { value: "manoj_kumar", label: "Manoj Kumar" },
        { value: "deepak_kumar", label: "Deepak Kumar" },
        { value: "john_doe", label: "John Doe" },
        { value: "jane_smith", label: "Jane Smith" },
      ]);
    } finally {
      setIsFetchingUsers(false);
    }
  };

  // GET /v1/departments/generate-id - Fetch unique department code
  const generateDepartmentId = async () => {
    setIsGeneratingId(true);
    try {
      console.log("Fetching department code from GET /v1/departments/generate-id");
      const response = await get(GENERATE_DEPARTMENT_ID);
      console.log("Department code generated:", response);
      
      if (response?.departmentCode) {
        setFormData((prev) => ({ ...prev, departmentCode: response.departmentCode }));
        console.log("Department code set to:", response.departmentCode);
      } else {
        toast.error("No department code received from server");
      }
    } catch (error) {
      console.error("Error generating department ID:", error);
      toast.error("Failed to generate department ID");
    } finally {
      setIsGeneratingId(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Validation
    if (!formData.departmentName?.trim()) {
      toast.error("Department name is required");
      return;
    }
    if (!formData.departmentCode?.trim()) {
      toast.error("Department code is required");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        departmentName: formData.departmentName,
        departmentCode: formData.departmentCode,
        departmentDescription: formData.departmentDescription || "",
        departmentHead: formData.departmentHead?.value || null,
      };

      console.log("Creating department with payload:", payload);

      const response = await post(CREATE_DEPARTMENT, payload);
      console.log("Department created:", response);

      toast.success("Department created successfully!");
      onSave && onSave(response);
      onClose();
      
      // Reset form
      setFormData({
        departmentCode: "",
        departmentName: "",
        departmentDescription: "",
        departmentHead: null,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create department";
      toast.error(errorMessage);
      console.error("Create department error:", error);
    } finally {
      setIsLoading(false);
    }
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
          <CodeInputWrapper>
            <InputComponent
              label="Department Code"
              placeholder="Auto-generated"
              value={formData.departmentCode}
              onChange={(e) => handleChange("departmentCode", e.target.value)}
              labelMargin="0 0 0.625rem 0"
              height="50px"
              disabled
            />
            <RegenerateButton
              onClick={generateDepartmentId}
              disabled={isGeneratingId}
              title="Fetch a new department code"
            >
              {isGeneratingId ? "..." : "↻"}
            </RegenerateButton>
          </CodeInputWrapper>

          <InputComponent
            label="Department Name"
            placeholder="Enter Department Name"
            value={formData.departmentName}
            onChange={(e) => handleChange("departmentName", e.target.value)}
            labelMargin="1rem 0 0.625rem 0"
            height="50px"
          />

          <InputComponent
            label="Department Description"
            placeholder="Enter Department Description (optional)"
            value={formData.departmentDescription}
            onChange={(e) => handleChange("departmentDescription", e.target.value)}
            labelMargin="1rem 0 0.625rem 0"
            height="50px"
          />

          <SelectWrapper>
            <Label>Department Head</Label>
            <Select
              options={departmentHeadOptions}
              value={formData.departmentHead}
              onChange={(value) => handleChange("departmentHead", value)}
              placeholder={isFetchingUsers ? "Loading users..." : "Select Department Head (optional)"}
              styles={customSelectStyles}
              isSearchable
              isClearable
              isLoading={isFetchingUsers}
              isDisabled={isFetchingUsers}
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
            disabled={isLoading}
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
            loading={isLoading}
            disabled={isLoading || isGeneratingId || isFetchingUsers}
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

const CodeInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
`;

const RegenerateButton = styled.button`
  padding: 0.75rem 1rem;
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.625rem;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.2s;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;

  &:hover:not(:disabled) {
    background: ${theme.colors.primaryDark || "#0a5f5f"};
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
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

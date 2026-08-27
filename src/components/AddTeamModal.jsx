import { useState, useEffect } from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import Button from "./Button";
import InputComponent from "./InputComponent";
import Select from "react-select";
import { customSelectStyles } from "../theme/reactSelectStyles";
import { get } from "../helpers/api_helper";
import { GENERATE_TEAM_ID, DEPARTMENTS, GET_ALL_EMPLOYEES } from "../helpers/url_helper";
import { toast } from "react-toastify";

const AddTeamModal = ({ isOpen, onClose, onSave, isLoading = false }) => {
  const [formData, setFormData] = useState({
    teamId: "",
    name: "",
    department: null,
    leadDepartment: null,
    teamLead: null,
  });

  const [isGeneratingId, setIsGeneratingId] = useState(false);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [teamLeadOptions, setTeamLeadOptions] = useState([]);
  const [isLoadingTeamLeads, setIsLoadingTeamLeads] = useState(false);

  // Generate Team ID and fetch departments/team leads when modal opens
  useEffect(() => {
    if (isOpen) {
      generateTeamId();
      fetchDepartments();
      fetchTeamLeads();
    }
  }, [isOpen]);

  const fetchDepartments = async () => {
    setIsLoadingDepartments(true);
    try {
      const response = await get(DEPARTMENTS);
      console.log("Departments response:", response);
      
      // Handle different response structures
      const departmentsList = response?.results || response?.data || response || [];
      
      // Transform departments to select options
      const options = departmentsList.map((dept) => ({
        value: dept.id || dept._id,
        label: dept.departmentName || dept.name || "N/A",
      }));
      
      console.log("Department options:", options);
      setDepartmentOptions(options);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to fetch departments");
    } finally {
      setIsLoadingDepartments(false);
    }
  };

  const fetchTeamLeads = async () => {
    setIsLoadingTeamLeads(true);
    try {
      const response = await get(GET_ALL_EMPLOYEES);
      console.log("Team leads response:", response);
      
      // Handle different response structures
      const usersList = response?.results || response?.data || response || [];
      
      // Transform users to select options
      const options = usersList.map((user) => ({
        value: user.id || user._id,
        label: user.name || user.firstName + " " + user.lastName || user.email || "N/A",
      }));
      
      console.log("Team lead options:", options);
      setTeamLeadOptions(options);
    } catch (error) {
      console.error("Error fetching team leads:", error);
      toast.error("Failed to fetch team leads");
    } finally {
      setIsLoadingTeamLeads(false);
    }
  };

  const generateTeamId = async () => {
    setIsGeneratingId(true);
    try {
      const response = await get(GENERATE_TEAM_ID);
      console.log("Generated Team ID response:", response);
      
      // Handle different response structures
      const teamId = response?.teamCode || response?.teamId || response?.id || response?.data?.teamCode || response?.data?.teamId || "";
      
      if (teamId) {
        setFormData((prev) => ({ ...prev, teamId }));
      }
    } catch (error) {
      console.error("Error generating team ID:", error);
      toast.error("Failed to generate team ID");
    } finally {
      setIsGeneratingId(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Validate required fields
    if (!formData.name) {
      alert("Team name is required");
      return;
    }
    if (!formData.department) {
      alert("Department is required");
      return;
    }
    if (!formData.teamLead) {
      alert("Team lead is required");
      return;
    }

    onSave && onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Add New Team</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          <TeamIdWrapper>
            <InputComponent
              label="Team ID"
              placeholder=""
              value={formData.teamId}
              onChange={(e) => handleChange("teamId", e.target.value)}
              labelMargin="0 0 0.625rem 0"
              disabled={isGeneratingId}
            />
            <RegenerateButton
              onClick={generateTeamId}
              disabled={isGeneratingId}
              title="Regenerate Team ID"
            >
              ↻
            </RegenerateButton>
          </TeamIdWrapper>

          <InputComponent
            label="Name"
            placeholder="Enter Team Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            labelMargin="1rem 0 0.625rem 0"
          />

          <SelectWrapper>
            <Label>Department</Label>
            <Select
              options={departmentOptions}
              value={formData.department}
              onChange={(value) => handleChange("department", value)}
              placeholder={isLoadingDepartments ? "Loading departments..." : "Select Department"}
              styles={customSelectStyles}
              isSearchable
              isDisabled={isLoadingDepartments}
              isLoading={isLoadingDepartments}
            />
          </SelectWrapper>

          {/* <SelectWrapper>
            <Label>Lead Department</Label>
            <Select
              options={departmentOptions}
              value={formData.leadDepartment}
              onChange={(value) => handleChange("leadDepartment", value)}
              placeholder={isLoadingDepartments ? "Loading departments..." : "Select Lead Department"}
              styles={customSelectStyles}
              isSearchable
              isDisabled={isLoadingDepartments}
              isLoading={isLoadingDepartments}
            />
          </SelectWrapper> */}

          <SelectWrapper>
            <Label>Team Lead</Label>
            <Select
              options={teamLeadOptions}
              value={formData.teamLead}
              onChange={(value) => handleChange("teamLead", value)}
              placeholder={isLoadingTeamLeads ? "Loading team leads..." : "Select Lead"}
              styles={customSelectStyles}
              isSearchable
              isDisabled={isLoadingTeamLeads}
              isLoading={isLoadingTeamLeads}
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

const TeamIdWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const RegenerateButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 2.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.2rem;
  color: ${theme.colors.primary};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;

  &:hover:not(:disabled) {
    opacity: 0.7;
    transform: rotate(180deg);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default AddTeamModal;

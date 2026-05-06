import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../../theme/theme";
import InputComponent from "../../../components/InputComponent";
import Button from "../../../components/Button";
import ModuleAccessRow from "../../../components/ModuleAccessRow";
import { MdDelete } from "react-icons/md";
import Switch from "react-switch";

const RolesConfig = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    roleId: "",
    roleName: "",
    description: "",
  });

  const [moduleToggles, setModuleToggles] = useState({
    peopleHub: false,
    timeHub: false,
    payHub: false,
  });

  const [permissions, setPermissions] = useState({
    // Dashboard
    dashboard: { view: false, add: false, edit: false, delete: false, all: false },
    // Announcement
    announcement: { view: false, add: false, edit: false, delete: false, all: false },
    // People Hub
    onboarding: { view: false, add: false, edit: false, delete: false, all: false },
    employees: { view: false, add: false, edit: false, delete: false, all: false },
    agents: { view: false, add: false, edit: false, delete: false, all: false },
    teams: { view: false, add: false, edit: false, delete: false, all: false },
    branch: { view: false, add: false, edit: false, delete: false, all: false },
    hierarchy: { view: false, add: false, edit: false, delete: false, all: false },
    offBoarding: { view: false, add: false, edit: false, delete: false, all: false },
    // Time Hub
    attendance: { view: false, add: false, edit: false, delete: false, all: false },
    leaveAttendance: { view: false, add: false, edit: false, delete: false, all: false },
    overtimeManagement: { view: false, add: false, edit: false, delete: false, all: false },
    shiftManagement: { view: false, add: false, edit: false, delete: false, all: false },
    leaderboard: { view: false, add: false, edit: false, delete: false, all: false },
    dayOffHolidays: { view: false, add: false, edit: false, delete: false, all: false },
    // Pay Hub
    payroll: { view: false, add: false, edit: false, delete: false, all: false },
    paysheet: { view: false, add: false, edit: false, delete: false, all: false },
    stopPayroll: { view: false, add: false, edit: false, delete: false, all: false },
    additionDeductions: { view: false, add: false, edit: false, delete: false, all: false },
  });

  const handlePermissionChange = (module, permission) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [permission]: !prev[module][permission],
      },
    }));
  };

  const handleModuleToggle = (module) => {
    setModuleToggles((prev) => ({
      ...prev,
      [module]: !prev[module],
    }));
  };

  const handleCancel = () => {
    navigate("/admin/settings/roles");
  };

  const handleSave = () => {
    console.log("Form data:", formData);
    console.log("Permissions:", permissions);
    // Add your save logic here
  };

  const handleDelete = () => {
    console.log("Delete role");
    // Add your delete logic here
  };

  return (
    <Container>
      <ContentWrapper>
        {/* Role Information */}
        <Section>
          <Row>
            <Col>
              <InputComponent
                label="Role ID"
                placeholder="Enter Role ID"
                value={formData.roleId}
                onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                labelMargin="0 0 0.625rem 0"
                height="50px"
              />
            </Col>
            <Col>
              <InputComponent
                label="Role Name"
                placeholder="Enter Role Name"
                value={formData.roleName}
                onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                labelMargin="0 0 0.625rem 0"
                height="50px"
              />
            </Col>
          </Row>
          <FullRow>
            <TextAreaWrapper>
              <Label>Description</Label>
              <TextArea
                placeholder="Enter Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </TextAreaWrapper>
          </FullRow>
        </Section>

        {/* Module Access Settings */}
        <Section>
          <SectionTitle>Module Access Settings</SectionTitle>
          
          <TableContainer>
            <TableHeader>
              <HeaderCell $first>Module</HeaderCell>
              <HeaderCell>View</HeaderCell>
              <HeaderCell>Add</HeaderCell>
              <HeaderCell>Edit</HeaderCell>
              <HeaderCell>Delete</HeaderCell>
              <HeaderCell>All</HeaderCell>
            </TableHeader>

            {/* Dashboard */}
            <ModuleAccessRow
              module="Dashboard"
              permissions={permissions.dashboard}
              onPermissionChange={handlePermissionChange}
              disabled={false}
            />

            {/* Announcement */}
            <ModuleAccessRow
              module="Announcement"
              permissions={permissions.announcement}
              onPermissionChange={handlePermissionChange}
              disabled={false}
            />

            {/* People Hub */}
            <ModuleSection>
              <ModuleSectionHeader>
                <ModuleSectionTitle>People Hub</ModuleSectionTitle>
                <Switch
                  checked={moduleToggles.peopleHub}
                  onChange={() => handleModuleToggle("peopleHub")}
                  onColor={theme.colors.primary}
                  offColor="#ccc"
                  height={24}
                  width={48}
                  handleDiameter={20}
                  uncheckedIcon={false}
                  checkedIcon={false}
                />
              </ModuleSectionHeader>
            </ModuleSection>

            <ModuleAccessRow
              module="Onboarding"
              permissions={permissions.onboarding}
              onPermissionChange={handlePermissionChange}
              disabled={!moduleToggles.peopleHub}
            />
            <ModuleAccessRow
              module="Employees"
              permissions={permissions.employees}
              onPermissionChange={handlePermissionChange}
              disabled={!moduleToggles.peopleHub}
            />
            <ModuleAccessRow
              module="Agents"
              permissions={permissions.agents}
              onPermissionChange={handlePermissionChange}
              disabled={!moduleToggles.peopleHub}
            />
            <ModuleAccessRow
              module="Teams"
              permissions={permissions.teams}
              onPermissionChange={handlePermissionChange}
              disabled={!moduleToggles.peopleHub}
            />
            <ModuleAccessRow
              module="Branch"
              permissions={permissions.branch}
              onPermissionChange={handlePermissionChange}
              disabled={!moduleToggles.peopleHub}
            />
            <ModuleAccessRow
              module="Hierarchy"
              permissions={permissions.hierarchy}
              onPermissionChange={handlePermissionChange}
              disabled={!moduleToggles.peopleHub}
            />
            <ModuleAccessRow
              module="Off-Boarding"
              permissions={permissions.offBoarding}
              onPermissionChange={handlePermissionChange}
              disabled={!moduleToggles.peopleHub}
            />

            {/* Time Hub */}
            <ModuleSection>
              <ModuleSectionHeader>
                <ModuleSectionTitle>Time Hub</ModuleSectionTitle>
                <Switch
                  checked={moduleToggles.timeHub}
                  onChange={() => handleModuleToggle("timeHub")}
                  onColor={theme.colors.primary}
                  offColor="#ccc"
                  height={24}
                  width={48}
                  handleDiameter={20}
                  uncheckedIcon={false}
                  checkedIcon={false}
                />
              </ModuleSectionHeader>
            </ModuleSection>

            <ModuleAccessRow
              module="Attendance"
              permissions={permissions.attendance}
              onPermissionChange={handlePermissionChange}
              disabled={!moduleToggles.timeHub}
            />
            <ModuleAccessRow
              module="Leave Attendance"
              permissions={permissions.leaveAttendance}
              onPermissionChange={handlePermissionChange}
              disabled={!moduleToggles.timeHub}
            />
            <ModuleAccessRow
              module="Overtime Management"
              permissions={permissions.overtimeManagement}
              onPermissionChange={handlePermissionChange}
              disabled={!moduleToggles.timeHub}
            />
            <ModuleAccessRow
              module="Shift Management"
              permissions={permissions.shiftManagement}
              onPermissionChange={handlePermissionChange}
              disabled={!moduleToggles.timeHub}
            />
            <ModuleAccessRow
              module="Leaderboard"
              permissions={permissions.leaderboard}
              onPermissionChange={handlePermissionChange}
              disabled={!moduleToggles.timeHub}
            />
            <ModuleAccessRow
              module="Day Off & Holidays"
              permissions={permissions.dayOffHolidays}
              onPermissionChange={handlePermissionChange}
              disabled={!moduleToggles.timeHub}
            />

            {/* Pay Hub */}
            <ModuleSection>
              <ModuleSectionHeader>
                <ModuleSectionTitle>Pay Hub</ModuleSectionTitle>
                <Switch
                  checked={moduleToggles.payHub}
                  onChange={() => handleModuleToggle("payHub")}
                  onColor={theme.colors.primary}
                  offColor="#ccc"
                  height={24}
                  width={48}
                  handleDiameter={20}
                  uncheckedIcon={false}
                  checkedIcon={false}
                />
              </ModuleSectionHeader>
            </ModuleSection>

            <ModuleAccessRow
              module="Payroll"
              permissions={permissions.payroll}
              onPermissionChange={handlePermissionChange}
              disabled={!moduleToggles.payHub}
            />
            <ModuleAccessRow
              module="Paysheet"
              permissions={permissions.paysheet}
              onPermissionChange={handlePermissionChange}
              disabled={!moduleToggles.payHub}
            />
            <ModuleAccessRow
              module="Stop Payroll"
              permissions={permissions.stopPayroll}
              onPermissionChange={handlePermissionChange}
              disabled={!moduleToggles.payHub}
            />
            <ModuleAccessRow
              module="Addition & Deductions"
              permissions={permissions.additionDeductions}
              onPermissionChange={handlePermissionChange}
              disabled={!moduleToggles.payHub}
            />
          </TableContainer>
        </Section>

        {/* Action Buttons */}
        <ButtonRow>
          <DeleteButton onClick={handleDelete}>
            <MdDelete size={20} />
            Delete
          </DeleteButton>
          <RightButtons>
            <Button
              text="Cancel"
              bg="transparent"
              color={theme.colors.primary}
              border={`1px solid ${theme.colors.primary}`}
              width="150px"
              radius="0.5rem"
              fontSize="0.875rem"
              fontWeight="600"
              fontFamily="Inter-SemiBold"
              onClick={handleCancel}
            />
            <Button
              text="Save Changes"
              bg={theme.colors.primary}
              color={theme.colors.white}
              width="150px"
              radius="0.5rem"
              fontSize="0.875rem"
              fontWeight="600"
              fontFamily="Inter-SemiBold"
              onClick={handleSave}
            />
          </RightButtons>
        </ButtonRow>
      </ContentWrapper>
    </Container>
  );
};

export default RolesConfig;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem 0;
`;

const ContentWrapper = styled.div`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 0.75rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0 0 1rem 0;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Col = styled.div`
  width: 100%;
`;

const FullRow = styled.div`
  width: 100%;
`;

const TextAreaWrapper = styled.div`
  width: 100%;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 500;
  line-height: 160%;
  color: ${theme.colors.primaryGreen};
  margin-bottom: 0.625rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: "Inter-Regular", sans-serif;
  color: ${theme.colors.textColor};
  resize: vertical;
  outline: none;

  &::placeholder {
    color: ${theme.colors.searchInputText};
  }

  &:focus {
    border-color: ${theme.colors.primary};
  }
`;

const TableContainer = styled.div`
  border: 1px solid ${theme.colors.border};
  border-radius: 0.5rem;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  background: ${theme.colors.secondaryWhite};
  padding: 1rem;
  border-bottom: 1px solid ${theme.colors.border};
`;

const HeaderCell = styled.div`
  font-size: 0.875rem;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  text-align: ${(props) => (props.$first ? "left" : "center")};
`;

const ModuleSection = styled.div`
  background: #EDF6F9;
  border-bottom: 1px solid ${theme.colors.border};
`;

const ModuleSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
`;

const ModuleSectionTitle = styled.h3`
  font-size: 0.875rem;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0;
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${theme.colors.border};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${theme.colors.white};
  border: 1px solid #EF4444;
  border-radius: 0.5rem;
  color: #EF4444;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;

  &:hover {
    background: #FEE2E2;
  }
`;

const RightButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

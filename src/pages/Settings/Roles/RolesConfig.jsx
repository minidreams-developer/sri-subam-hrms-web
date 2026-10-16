import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import theme from "../../../theme/theme";
import InputComponent from "../../../components/InputComponent";
import Button from "../../../components/Button";
import ModuleAccessRow from "../../../components/ModuleAccessRow";
import { MdDelete } from "react-icons/md";
import Switch from "react-switch";
import { toast } from "react-toastify";
import {
  createRole,
  deleteRole,
  getRoles,
  updateRole,
} from "../../../services/apiServices";
import { getStoredAuthUser } from "../../../helpers/auth_helper";

const RolesConfig = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = getStoredAuthUser();

  const roleId = location.state?.roleId;
  const isEditMode = !!roleId;

  const [formData, setFormData] = useState({
    roleId: "",
    roleName: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  const [permissions, setPermissions] = useState({
    dashboard: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      all: false,
    },
    announcement: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      all: false,
    },
    contractorOverview: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      all: false,
    },
    contractorContractors: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      all: false,
    },
    contractorPayments: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      all: false,
    },
    onboarding: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      all: false,
    },
    employees: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      all: false,
    },
    agents: { view: false, add: false, edit: false, delete: false, all: false },
    teams: { view: false, add: false, edit: false, delete: false, all: false },
    branch: { view: false, add: false, edit: false, delete: false, all: false },
    hierarchy: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      all: false,
    },
    offBoarding: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      all: false,
    },
    attendance: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      all: false,
    },
    leaveAttendance: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      all: false,
    },
    overtimeManagement: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      all: false,
    },
    shiftManagement: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      all: false,
    },
    leaderboard: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      all: false,
    },
    dayOffHolidays: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      all: false,
    },
    payroll: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      all: false,
    },
    paysheet: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      all: false,
    },
    stopPayroll: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      all: false,
    },
    additionDeductions: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      all: false,
    },
    generalSettings: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      all: false,
    },
    organizationDetails: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      all: false,
    },
    daySettings: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      all: false,
    },
    seriesConfiguration: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      all: false,
    },
    departments: {
      view: false,
      add: false,
      edit: false,
      delete: false,
      all: false,
    },
    roles: { view: false, add: false, edit: false, delete: false, all: false },
  });

  const [moduleToggles, setModuleToggles] = useState({
    contractors: false,
    peopleHub: false,
    timeHub: false,
    payHub: false,
    settings: false,
  });

  useEffect(() => {
    if (isEditMode) {
      fetchRoleData();
    }
  }, [roleId]);

  const fetchRoleData = async () => {
    try {
      setInitialLoading(true);
      const response = await getRoles();
      const rolesArray = Array.isArray(response)
        ? response
        : response?.results || [];
      const roleData = rolesArray.find(
        (r) => r.id === roleId || r._id === roleId,
      );

      if (roleData) {
        setFormData({
          roleId: roleData.roleId || "",
          roleName: roleData.name || "",
          description: roleData.description || "",
        });

        if (roleData.permissions && Array.isArray(roleData.permissions)) {
          const newPermissions = { ...permissions };

          roleData.permissions.forEach((group) => {
            if (group.modules && Array.isArray(group.modules)) {
              group.modules.forEach((module) => {
                if (newPermissions[module.module]) {
                  newPermissions[module.module] = {
                    view: module.permissions?.view || false,
                    add: module.permissions?.add || false,
                    edit: module.permissions?.edit || false,
                    delete: module.permissions?.delete || false,
                    all: false,
                  };
                }
              });
            }
          });

          setPermissions(newPermissions);

          const newToggles = { ...moduleToggles };
          Object.keys(newToggles).forEach((module) => {
            const hasPermissions = Object.keys(newPermissions).some(
              (key) =>
                key.startsWith(module) &&
                Object.values(newPermissions[key]).some((val) => val === true),
            );
            newToggles[module] = hasPermissions;
          });
          setModuleToggles(newToggles);
        }
      } else {
        toast.error("Role not found");
        navigate("/admin/settings/roles");
      }
    } catch (error) {
      console.error("Error fetching role data:", error);
      toast.error("Failed to load role data");
      navigate("/admin/settings/roles");
    } finally {
      setInitialLoading(false);
    }
  };

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

  const preparePermissionsPayload = () => {
    const modulesByGroup = {
      dashboard: ["dashboard"],
      announcement: ["announcement"],
      contractors: [
        "contractorOverview",
        "contractorContractors",
        "contractorPayments",
      ],
      peopleHub: [
        "onboarding",
        "employees",
        "agents",
        "teams",
        "branch",
        "hierarchy",
        "offBoarding",
      ],
      timeHub: [
        "attendance",
        "leaveAttendance",
        "shiftManagement",
        "overtimeManagement",
        "leaderboard",
        "dayOffHolidays",
      ],
      payHub: ["payroll", "paysheet", "stopPayroll", "additionDeductions"],
      settings: [
        "generalSettings",
        "organizationDetails",
        "daySettings",
        "seriesConfiguration",
        "departments",
        "roles",
      ],
    };

    const permissionsArray = [];

    Object.entries(modulesByGroup).forEach(([group, moduleKeys]) => {
      const modules = moduleKeys
        .map((moduleKey) => {
          const modulePermissions = permissions[moduleKey];
          if (!modulePermissions) return null;

          const hasAnyPermission = Object.values(modulePermissions).some(
            (val) => val === true,
          );

          return {
            module: moduleKey,
            enabled: hasAnyPermission,
            permissions: {
              view: modulePermissions.view || false,
              add: modulePermissions.add || false,
              edit: modulePermissions.edit || false,
              delete: modulePermissions.delete || false,
            },
          };
        })
        .filter(Boolean);

      if (modules.length > 0) {
        permissionsArray.push({
          group: group,
          modules: modules,
        });
      }
    });

    return permissionsArray;
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const payload = {
        name: formData.roleName,
        description: formData.description,
        user: authUser?.user?._id || authUser?.user?.id || "",
        roleId: formData.roleId,
        isSystemRole: false,
        isDefault: false,
        isActive: true,
        permissions: preparePermissionsPayload(),
      };

      console.log("Submitting payload:", payload);

      let response;
      if (isEditMode) {
        response = await updateRole(roleId, payload);
        toast.success("Role updated successfully!");
      } else {
        response = await createRole(payload);
        toast.success("Role created successfully!");
      }

      console.log("Response:", response);
      navigate("/admin/settings/roles");
    } catch (error) {
      console.error("Error saving role:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to save role. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditMode) {
      toast.info("Delete only available when editing an existing role");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this role? This action cannot be undone.",
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await deleteRole(roleId);
      toast.success("Role deleted successfully!");
      navigate("/admin/settings/roles");
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete role. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <Container>
      <ContentWrapper>
        {initialLoading ? (
          <LoadingContainer>
            <LoadingText>Loading role data...</LoadingText>
          </LoadingContainer>
        ) : (
          <>
            {/* Role Information */}
            <Section>
              <Row>
                <Col>
                  <InputComponent
                    label="Role ID"
                    placeholder="Enter Role ID"
                    value={formData.roleId}
                    onChange={(e) =>
                      setFormData({ ...formData, roleId: e.target.value })
                    }
                    labelMargin="0 0 0.625rem 0"
                    height="50px"
                  />
                </Col>
                <Col>
                  <InputComponent
                    label="Role Name"
                    placeholder="Enter Role Name"
                    value={formData.roleName}
                    onChange={(e) =>
                      setFormData({ ...formData, roleName: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
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

                <ModuleAccessRow
                  moduleKey="dashboard"
                  moduleName="Dashboard"
                  permissions={permissions.dashboard}
                  onPermissionChange={handlePermissionChange}
                  disabled={false}
                />
                <ModuleAccessRow
                  moduleKey="announcement"
                  moduleName="Announcement"
                  permissions={permissions.announcement}
                  onPermissionChange={handlePermissionChange}
                  disabled={false}
                />

                <ModuleSection>
                  <ModuleSectionHeader>
                    <ModuleSectionTitle>Contractors</ModuleSectionTitle>
                    <Switch
                      checked={moduleToggles.contractors}
                      onChange={() => handleModuleToggle("contractors")}
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
                  moduleKey="contractorOverview"
                  moduleName="Overview"
                  permissions={permissions.contractorOverview}
                  onPermissionChange={handlePermissionChange}
                  disabled={!moduleToggles.contractors}
                />
                <ModuleAccessRow
                  moduleKey="contractorContractors"
                  moduleName="Contractors"
                  permissions={permissions.contractorContractors}
                  onPermissionChange={handlePermissionChange}
                  disabled={!moduleToggles.contractors}
                />
                <ModuleAccessRow
                  moduleKey="contractorPayments"
                  moduleName="Payments"
                  permissions={permissions.contractorPayments}
                  onPermissionChange={handlePermissionChange}
                  disabled={!moduleToggles.contractors}
                />

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
                  moduleKey="onboarding"
                  moduleName="Onboarding"
                  permissions={permissions.onboarding}
                  onPermissionChange={handlePermissionChange}
                  disabled={!moduleToggles.peopleHub}
                />
                <ModuleAccessRow
                  moduleKey="employees"
                  moduleName="Employees"
                  permissions={permissions.employees}
                  onPermissionChange={handlePermissionChange}
                  disabled={!moduleToggles.peopleHub}
                />
                <ModuleAccessRow
                  moduleKey="agents"
                  moduleName="Agents"
                  permissions={permissions.agents}
                  onPermissionChange={handlePermissionChange}
                  disabled={!moduleToggles.peopleHub}
                />
                <ModuleAccessRow
                  moduleKey="teams"
                  moduleName="Teams"
                  permissions={permissions.teams}
                  onPermissionChange={handlePermissionChange}
                  disabled={!moduleToggles.peopleHub}
                />
                <ModuleAccessRow
                  moduleKey="branch"
                  moduleName="Branch"
                  permissions={permissions.branch}
                  onPermissionChange={handlePermissionChange}
                  disabled={!moduleToggles.peopleHub}
                />
                <ModuleAccessRow
                  moduleKey="hierarchy"
                  moduleName="Hierarchy"
                  permissions={permissions.hierarchy}
                  onPermissionChange={handlePermissionChange}
                  disabled={!moduleToggles.peopleHub}
                />
                <ModuleAccessRow
                  moduleKey="offBoarding"
                  moduleName="Off-Boarding"
                  permissions={permissions.offBoarding}
                  onPermissionChange={handlePermissionChange}
                  disabled={!moduleToggles.peopleHub}
                />

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
                  moduleKey="attendance"
                  moduleName="Attendance"
                  permissions={permissions.attendance}
                  onPermissionChange={handlePermissionChange}
                  disabled={!moduleToggles.timeHub}
                />
                <ModuleAccessRow
                  moduleKey="leaveAttendance"
                  moduleName="Leave Attendance"
                  permissions={permissions.leaveAttendance}
                  onPermissionChange={handlePermissionChange}
                  disabled={!moduleToggles.timeHub}
                />
                <ModuleAccessRow
                  moduleKey="shiftManagement"
                  moduleName="Shift Management"
                  permissions={permissions.shiftManagement}
                  onPermissionChange={handlePermissionChange}
                  disabled={!moduleToggles.timeHub}
                />
                <ModuleAccessRow
                  moduleKey="overtimeManagement"
                  moduleName="Overtime Management"
                  permissions={permissions.overtimeManagement}
                  onPermissionChange={handlePermissionChange}
                  disabled={!moduleToggles.timeHub}
                />
                <ModuleAccessRow
                  moduleKey="leaderboard"
                  moduleName="Leaderboard"
                  permissions={permissions.leaderboard}
                  onPermissionChange={handlePermissionChange}
                  disabled={!moduleToggles.timeHub}
                />
                <ModuleAccessRow
                  moduleKey="dayOffHolidays"
                  moduleName="Day Off & Holidays"
                  permissions={permissions.dayOffHolidays}
                  onPermissionChange={handlePermissionChange}
                  disabled={!moduleToggles.timeHub}
                />

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
                  moduleKey="payroll"
                  moduleName="Payroll"
                  permissions={permissions.payroll}
                  onPermissionChange={handlePermissionChange}
                  disabled={!moduleToggles.payHub}
                />
                <ModuleAccessRow
                  moduleKey="paysheet"
                  moduleName="Paysheet"
                  permissions={permissions.paysheet}
                  onPermissionChange={handlePermissionChange}
                  disabled={!moduleToggles.payHub}
                />
                <ModuleAccessRow
                  moduleKey="stopPayroll"
                  moduleName="Stop Payroll"
                  permissions={permissions.stopPayroll}
                  onPermissionChange={handlePermissionChange}
                  disabled={!moduleToggles.payHub}
                />
                <ModuleAccessRow
                  moduleKey="additionDeductions"
                  moduleName="Addition & Deductions"
                  permissions={permissions.additionDeductions}
                  onPermissionChange={handlePermissionChange}
                  disabled={!moduleToggles.payHub}
                />

                <ModuleSection>
                  <ModuleSectionHeader>
                    <ModuleSectionTitle>Settings</ModuleSectionTitle>
                    <Switch
                      checked={moduleToggles.settings}
                      onChange={() => handleModuleToggle("settings")}
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
                  moduleKey="generalSettings"
                  moduleName="General Settings"
                  permissions={permissions.generalSettings}
                  onPermissionChange={handlePermissionChange}
                  disabled={!moduleToggles.settings}
                />
                <ModuleAccessRow
                  moduleKey="organizationDetails"
                  moduleName="Organization Details"
                  permissions={permissions.organizationDetails}
                  onPermissionChange={handlePermissionChange}
                  disabled={!moduleToggles.settings}
                />
                <ModuleAccessRow
                  moduleKey="daySettings"
                  moduleName="Day Settings"
                  permissions={permissions.daySettings}
                  onPermissionChange={handlePermissionChange}
                  disabled={!moduleToggles.settings}
                />
                <ModuleAccessRow
                  moduleKey="seriesConfiguration"
                  moduleName="Series Configuration"
                  permissions={permissions.seriesConfiguration}
                  onPermissionChange={handlePermissionChange}
                  disabled={!moduleToggles.settings}
                />
                <ModuleAccessRow
                  moduleKey="departments"
                  moduleName="Departments"
                  permissions={permissions.departments}
                  onPermissionChange={handlePermissionChange}
                  disabled={!moduleToggles.settings}
                />
                <ModuleAccessRow
                  moduleKey="roles"
                  moduleName="Roles"
                  permissions={permissions.roles}
                  onPermissionChange={handlePermissionChange}
                  disabled={!moduleToggles.settings}
                />
              </TableContainer>
            </Section>

            {/* Action Buttons */}
            <ButtonRow>
              <DeleteButton
                onClick={handleDelete}
                disabled={loading || !isEditMode}
                title={
                  isEditMode
                    ? "Delete this role"
                    : "Delete only available when editing"
                }
              >
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
                  disabled={loading}
                />
                <Button
                  text={
                    loading
                      ? isEditMode
                        ? "Updating..."
                        : "Saving..."
                      : isEditMode
                        ? "Update Role"
                        : "Create Role"
                  }
                  bg={theme.colors.primary}
                  color={theme.colors.white}
                  width="150px"
                  radius="0.5rem"
                  fontSize="0.875rem"
                  fontWeight="600"
                  fontFamily="Inter-SemiBold"
                  onClick={handleSave}
                  disabled={loading}
                />
              </RightButtons>
            </ButtonRow>
          </>
        )}
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
  background: #edf6f9;
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
  border: 1px solid #ef4444;
  border-radius: 0.5rem;
  color: #ef4444;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #fee2e2;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const RightButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;

const LoadingText = styled.div`
  font-size: 1rem;
  color: ${theme.colors.textColor};
  font-family: "Inter-Medium", sans-serif;
`;

import styled from "styled-components";
import theme from "../theme/theme";

const ModuleAccessRow = ({ moduleKey, moduleName, permissions, onPermissionChange, disabled = false }) => {
  const handleCheckboxChange = (permission) => {
    if (!disabled) {
      onPermissionChange(moduleKey, permission);
    }
  };

  return (
    <Row>
      <ModuleName>{moduleName}</ModuleName>
      <CheckboxCell>
        <Checkbox
          type="checkbox"
          checked={permissions.view || false}
          onChange={() => handleCheckboxChange("view")}
          disabled={disabled}
        />
      </CheckboxCell>
      <CheckboxCell>
        <Checkbox
          type="checkbox"
          checked={permissions.add || false}
          onChange={() => handleCheckboxChange("add")}
          disabled={disabled}
        />
      </CheckboxCell>
      <CheckboxCell>
        <Checkbox
          type="checkbox"
          checked={permissions.edit || false}
          onChange={() => handleCheckboxChange("edit")}
          disabled={disabled}
        />
      </CheckboxCell>
      <CheckboxCell>
        <Checkbox
          type="checkbox"
          checked={permissions.delete || false}
          onChange={() => handleCheckboxChange("delete")}
          disabled={disabled}
        />
      </CheckboxCell>
      <CheckboxCell>
        <Checkbox
          type="checkbox"
          checked={permissions.all || false}
          onChange={() => handleCheckboxChange("all")}
          disabled={disabled}
        />
      </CheckboxCell>
    </Row>
  );
};

export default ModuleAccessRow;

const Row = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${theme.colors.border};

  &:hover {
    background: ${theme.colors.secondaryWhite};
  }
`;

const ModuleName = styled.span`
  font-size: 0.875rem;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.textColor};
`;

const CheckboxCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${theme.colors.primary};

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

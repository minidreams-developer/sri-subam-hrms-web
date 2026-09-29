import React from "react";
import Select from "react-select";
import styled from "styled-components";
import theme from "../theme/theme";

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  line-height: 160%;
  color: ${(props) =>
    props.isFocused ? theme.colors.textColor : theme.colors.primaryGreen};
  margin: 1rem 0 0.625rem 0;
`;

const DropdownComponent = ({
  title,
  options,
  value,
  onChange,
  placeholder,
}) => {
  const selectOptions = options.map((option) =>
    typeof option === "object" ? option : { value: option, label: option },
  );
  const selected = selectOptions.find(
    (option) => String(option.value) === String(value),
  );

  return (
    <DropdownContainer>
      {title && <Label>{title}</Label>}
      <Select
        value={selected || null}
        options={selectOptions}
        placeholder={placeholder}
        onChange={(option) => onChange(option?.value || "")}
        styles={dropdownStyles}
        isSearchable={false}
      />
    </DropdownContainer>
  );
};

const dropdownStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: 44,
    borderRadius: 10,
    borderColor: state.isFocused ? theme.colors.primary : theme.colors.border,
    boxShadow: state.isFocused ? `0 0 0 3px rgba(8,121,133,.15)` : "none",
    "&:hover": { borderColor: theme.colors.primary },
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    borderRadius: 10,
    overflow: "hidden",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? theme.colors.primary
      : state.isFocused
        ? "#e8f5f4"
        : "#fff",
    color: state.isSelected ? "#fff" : theme.colors.textColor,
    cursor: "pointer",
  }),
};

export default DropdownComponent;

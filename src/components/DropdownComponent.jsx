import React, { useState } from "react";
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

const Select = styled.select`
  width: 100%;
  padding: 0.875rem;
  border-radius: 6px;
  border: 1px solid ${theme.colors.border};
  font-size: 16px;
  color: ${theme.colors.textColor};
  outline: none;
  appearance: none;
  cursor: pointer;

  &:focus {
    border-color: ${theme.colors.primaryGreen};
  }
`;

const DropdownComponent = ({
  title,
  options,
  value,
  onChange,
  placeholder,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <DropdownContainer>
      {title && <Label isFocused={isFocused}>{title}</Label>}
      <Select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </DropdownContainer>
  );
};

export default DropdownComponent;

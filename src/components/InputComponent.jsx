import React from "react";
import theme from "../theme/theme";
import styled from "styled-components";

const InputComponent = ({
  label = "",
  placeholder = "Enter",
  width = "100%",
  labelMargin = "1rem 0 0.625rem 0",
  height,
  suffix,
  ...rest
}) => {
  return (
    <FieldWrapper>
      {label && <Label margin={labelMargin}>{label}</Label>}
      <InputWrapper width={width} height={height}>
        <Input placeholder={placeholder} {...rest} />
        {suffix && <Suffix>{suffix}</Suffix>}
      </InputWrapper>
    </FieldWrapper>
  );
};

const Suffix = styled.span`
  font-size: 0.875rem;
  font-family: "Inter", sans-serif;
  color: ${theme.colors.secondaryTextColor};
  margin-left: 0.5rem;
  white-space: nowrap;
`;

const Label = styled.p`
  font-size: 0.875rem;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  line-height: 160%;
  color: #0c0c0c;
  margin: ${(props) => props.margin};
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  &:focus-within ${Label} {
    color: ${theme.colors.primary};
  }
`;

const InputWrapper = styled.div`
  max-width: ${(props) => props.width};
  width: 100%;
  height: ${(props) => props.height || "auto"};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.625rem;
  border: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.searchBackground};
  position: relative;
  padding: 0.75rem 1rem;

  &:focus-within {
    border: 2px solid ${theme.colors.primary};
  }
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  font-size: 0.875rem;
  font-family: "Inter", sans-serif;
  font-weight: 400;
  line-height: 160%;
  color: ${theme.colors.textColor};
  border: none;
  border-radius: 0.625rem;
  outline: none;
  background: transparent;
  box-sizing: border-box;

  ::placeholder {
    font-family: "Inter", sans-serif;
    opacity: 1;
  }
`;

export default InputComponent;

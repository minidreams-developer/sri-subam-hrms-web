import React from "react";
import theme from "../theme/theme";
import styled from "styled-components";

const InputWithActive = ({
  label = "Enter",
  placeholder = "Enter",
  width = "51.25rem",
}) => {
  return (
    <FieldWrapper>
      <Label>{label}</Label>
      <InputWrapper width={width}>
        <Input placeholder={placeholder} />
      </InputWrapper>
    </FieldWrapper>
  );
};

const Label = styled.p`
  font-size: 0.875rem;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  line-height: 160%;
  color: ${theme.colors.primaryGreen};
  margin: 1rem 0 0.625rem 0;
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
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.white};

  &:focus-within {
    border: 1px solid ${theme.colors.primaryGreen};
  }

  transition: border 0.3s ease;
`;

const Input = styled.input`
  width: 100%;
  font-size: 0.875rem;
  font-family: "Inter", sans-serif;
  font-weight: 400;
  line-height: 160%;
  color: ${theme.colors.textColor};
  padding: 0.875rem;
  border: none;
  border-radius: 6px;
  outline: none;

  ::placeholder {
    font-family: "Inter", sans-serif;
    font-weight: 400;
    opacity: 1;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  font-size: 0.875rem;
  font-family: "Inter", sans-serif;
  font-weight: 400;
  line-height: 160%;
  color: ${theme.colors.textColor};
  padding: 0.875rem;
  border: none;
  border-radius: 6px;
  outline: none;
  resize: vertical;
  min-height: 5rem;

  ::placeholder {
    font-family: "Inter", sans-serif;
    font-weight: 400;
    opacity: 1;
  }
`;

export default InputWithActive;

import { useState } from "react";
import styled from "styled-components";
import theme from "../theme/theme";

const CheckboxGroup = ({ title, options, defaultChecked = [] }) => {
  const [checkedItems, setCheckedItems] = useState(
    options.reduce((acc, option) => {
      acc[option] = defaultChecked.includes(option);
      return acc;
    }, {})
  );

  const handleCheckboxChange = (option) => {
    setCheckedItems((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  return (
    <Container>
      {title && <SectionTitle>{title}</SectionTitle>}
      <CheckboxContainer>
        {options.map((option, index) => (
          <CheckboxWrapper key={index}>
            <HiddenCheckbox
              type="checkbox"
              id={`${title}-${option}`}
              checked={checkedItems[option]}
              onChange={() => handleCheckboxChange(option)}
            />
            <StyledCheckbox
              htmlFor={`${title}-${option}`}
              $checked={checkedItems[option]}
            >
              {checkedItems[option] && (
                <CheckIcon viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </CheckIcon>
              )}
            </StyledCheckbox>
            <Label htmlFor={`${title}-${option}`}>{option}</Label>
          </CheckboxWrapper>
        ))}
      </CheckboxContainer>
    </Container>
  );
};

export default CheckboxGroup;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0;
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`;

const StyledCheckbox = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid ${(props) => (props.$checked ? theme.colors.primary : "#D0D5DD")};
  border-radius: 4px;
  background-color: ${(props) => (props.$checked ? theme.colors.primary : theme.colors.bgColor)};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.primary};
  }
`;

const CheckIcon = styled.svg`
  width: 0.875rem;
  height: 0.875rem;
  fill: none;
  stroke: white;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.textColor};
  cursor: pointer;
  user-select: none;
`;

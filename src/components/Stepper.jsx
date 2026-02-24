import styled from "styled-components";
import theme from "../theme/theme";

const Stepper = ({ steps, currentStep }) => {
  return (
    <StepperContainer>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <StepWrapper key={index}>
            <StepItem>
              <StepCircle $isActive={isActive} $isCompleted={isCompleted}>
                {stepNumber}
              </StepCircle>
              <StepLabel $isActive={isActive}>{step}</StepLabel>
            </StepItem>
            {index < steps.length - 1 && <StepLine />}
          </StepWrapper>
        );
      })}
    </StepperContainer>
  );
};

const StepperContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 2.5rem;
`;

const StepWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;

  &:last-child {
    flex: 0;
  }
`;

const StepItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const StepCircle = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  min-width: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  transition: all 0.3s ease;

  ${(props) => {
    if (props.$isActive) {
      return `
        background: ${theme.colors.primary};
        color: ${theme.colors.white};
      `;
    } else if (props.$isCompleted) {
      return `
        background: ${theme.colors.primary};
        color: ${theme.colors.white};
      `;
    } else {
      return `
        background: #e5e7eb;
        color: #6b7280;
      `;
    }
  }}
`;

const StepLabel = styled.span`
  font-size: 0.875rem;
  font-weight: ${(props) => (props.$isActive ? "600" : "500")};
  font-family: ${(props) =>
    props.$isActive ? '"Inter-SemiBold", sans-serif' : '"Inter_18pt-Medium", sans-serif'};
  color: ${(props) =>
    props.$isActive ? theme.colors.primary : theme.colors.secondaryTextColor || "#6b7280"};
  white-space: nowrap;
`;

const StepLine = styled.div`
  flex: 1;
  height: 2px;
  background: #e5e7eb;
  margin: 0 1rem;
`;

export default Stepper;

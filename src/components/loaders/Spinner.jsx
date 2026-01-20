import React from "react";
import styled from "styled-components";
import theme from "../../theme/theme";

const Spinner = ({ isLoading }) => {
  if (!isLoading) {
    return null;
  }

  return (
    <LoadingWrapper>
      <LoadingSpinner />
      <LoadingText>Loading data...</LoadingText>
    </LoadingWrapper>
  );
};

export default Spinner;

// Add these new styled components for loading state
const LoadingWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: ${theme.colors.white};
  border-radius: 4px;
`;

const LoadingSpinner = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid ${theme.colors.border};
  border-top: 3px solid ${theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 1rem;
  color: ${theme.colors.textColor};
`;

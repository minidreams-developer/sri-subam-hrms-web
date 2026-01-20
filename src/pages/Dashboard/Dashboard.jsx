import React from "react";
import styled from "styled-components";
import theme from "../../theme/theme";

const Dashboard = () => {
  return (
    <Container>
      <WelcomeText>Welcome to Dashboard</WelcomeText>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 1.5rem 0;
`;

const WelcomeText = styled.h1`
  font-family: "Inter", sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.primary};
`;

export default Dashboard;

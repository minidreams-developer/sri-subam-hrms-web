import React from "react";
import styled from "styled-components";

const Payments = () => {
  return (
    <Container>
      <Title>Payments</Title>
      <Content>
        <p>Payments page content</p>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const Title = styled.h2`
  font-family: "Inter", sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
`;

const Content = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
`;

export default Payments;

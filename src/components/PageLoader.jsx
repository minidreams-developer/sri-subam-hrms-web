import React from "react";
import styled, { keyframes } from "styled-components";
import theme from "../theme/theme";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const Spinner = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border: 4px solid #e0e0e0;
  border-top: 4px solid ${theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const PageLoader = ({ visible = true }) => {
  if (!visible) return null;
  return (
    <Overlay>
      <Spinner />
    </Overlay>
  );
};

export default PageLoader;

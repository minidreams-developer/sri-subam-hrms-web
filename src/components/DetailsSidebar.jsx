import React from "react";
import styled from "styled-components";
import { MdClose } from "react-icons/md";
import theme from "../theme/theme";

const DetailsSidebar = ({ open, onClose, data, title = "Details", children, variant }) => {
  const compact = variant === "stop-payroll";
  return (
    <>
      <Overlay $open={open} $compact={compact} onClick={onClose} />
      <Container $open={open}>
        <Header $compact={compact}>
          <Title>{title}</Title>
          <CloseBtn onClick={onClose}>
            <MdClose size={24} color={theme.colors.textColor} />
          </CloseBtn>
        </Header>

        <ScrollContent $compact={compact}>
          {children}
        </ScrollContent>
      </Container>
    </>
  );
};

export default DetailsSidebar;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${({ $compact }) => $compact ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.3)"};
  z-index: 998;
  display: ${({ $open }) => ($open ? "block" : "none")};
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 584px;
  height: 100vh;
  background: ${theme.colors.white};
  z-index: 999;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transform: ${({ $open }) => ($open ? "translateX(0)" : "translateX(100%)")};
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;

  @media (max-width: 500px) {
    width: 100%;
  }
`;

const Header = styled.div`
  min-height: ${({ $compact }) => $compact ? "74px" : "auto"};
  padding: ${({ $compact }) => $compact ? "20px" : "1.5rem"};
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${theme.colors.textColor};
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`;

const ScrollContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${({ $compact }) => $compact ? "16px 20px 20px" : "1.5rem"};
  padding-bottom: ${({ $compact }) => $compact ? "20px" : "2rem"};
  display: flex;
  flex-direction: column;
  gap: ${({ $compact }) => $compact ? "16px" : "1.5rem"};

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
`;

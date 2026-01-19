import React from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import { Spinner } from "reactstrap";

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 0.5rem 0.875rem;
  background-color: ${(props) => props.bg || theme.colors.primary};
  color: ${(props) => props.color || theme.colors.secondary};
  font-size: 0.75rem;
  font-weight: 500;
  font-family: "Metropolis-Medium", sans-serif;
  line-height: 160%;
  border: ${(props) => props.border || "none"};
  border-radius: 6px;
  width: ${(props) => props.width || "auto"};
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:active {
    transform: scale(0.98);
  }

  svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`;

const Button = ({ type = "button",
  text,
  icon,
  onClick,
  bg,
  color,
  hoverBg,
  fontSize,
  width = "",
  border,
  loading = false,
  disabled = false,
}) => {
  return (
    <StyledButton
      onClick={onClick}
      bg={bg}
      color={color}
      hoverBg={hoverBg}
      fontSize={fontSize}
      width={width}
      border={border}
      disabled={disabled || loading}
      type={type}
    >
      {loading ? (
        <Spinner size="sm" color={color || theme.colors.white} />
      ) : (
        <>
          {icon && icon}
          {text}
        </>
      )}
    </StyledButton>
  );
};

export default Button;

import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import theme from "../theme/theme";

const OtpInput = ({ length = 6, onChange }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Allow only one digit
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (onChange) onChange(newOtp.join(""));

    // Focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").slice(0, length);
    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = [...otp];
    pasteData.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    if (onChange) onChange(newOtp.join(""));

    if (pasteData.length < length) {
      inputRefs.current[pasteData.length].focus();
    } else {
      inputRefs.current[length - 1].focus();
    }
  };

  return (
    <Container onPaste={handlePaste}>
      {otp.map((data, index) => (
        <Input
          key={index}
          type="text"
          maxLength="1"
          value={data}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputRefs.current[index] = el)}
          placeholder="-"
        />
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 0.625rem;
  margin: 0;
`;

const Input = styled.input`
  width: 100%;
  height: 3rem;
  border-radius: 0.625rem;
  border: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.white};
  font-family: "Inter", sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  color: ${theme.colors.textColor};
  outline: none;

  &:focus {
    border: 1px solid ${theme.colors.primary};
  }

  ::placeholder {
    color: #b1b1b1;
    opacity: 0.5;
  }

  @media (max-width: 480px) {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }
`;

export default OtpInput;

import { useState } from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import { IoClose } from "react-icons/io5";
import InputComponent from "./InputComponent";
import Button from "./Button";

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");

  if (!isOpen) return null;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendOtp = () => {
    setEmailError("");
    
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    
    setShowOtpInput(true);
    // Here you can add logic to send OTP to the email
    console.log("Sending OTP to:", email);
  };

  const handleConfirm = () => {
    setOtpError("");
    
    if (!otp.trim()) {
      setOtpError("OTP is required");
      return;
    }
    
    if (otp.length < 4) {
      setOtpError("Please enter a valid OTP");
      return;
    }
    
    onConfirm({ email, otp });
    // Reset fields
    setEmail("");
    setOtp("");
    setShowOtpInput(false);
    setEmailError("");
    setOtpError("");
  };

  const handleCancel = () => {
    setEmail("");
    setOtp("");
    setShowOtpInput(false);
    setEmailError("");
    setOtpError("");
    onClose();
  };

  return (
    <Overlay onClick={handleCancel}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Confirmation</Title>
          <CloseButton onClick={handleCancel}>
            <IoClose size={24} color={theme.colors.textColor} />
          </CloseButton>
        </Header>

        <Divider />

        <Content>
          <InputWrapper>
            <InputComponent
              label="Email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              labelMargin="0 0 0.625rem 0"
              height="50px"
              disabled={showOtpInput}
            />
            {emailError && <ErrorText>{emailError}</ErrorText>}
          </InputWrapper>

          {showOtpInput && (
            <InputWrapper>
              <InputComponent
                label="OTP"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setOtpError("");
                }}
                labelMargin="0 0 0.625rem 0"
                height="50px"
              />
              {otpError && <ErrorText>{otpError}</ErrorText>}
            </InputWrapper>
          )}
        </Content>

        <ButtonRow>
          <Button
            text="Cancel"
            bg="transparent"
            color={theme.colors.primary}
            border={`2px solid ${theme.colors.primary}`}
            width="48%"
            radius="0.5rem"
            fontSize="1rem"
            fontWeight="600"
            fontFamily="Inter-SemiBold"
            onClick={handleCancel}
          />
          <Button
            text={showOtpInput ? "Confirm" : "Send OTP"}
            bg={theme.colors.primary}
            color={theme.colors.white}
            width="48%"
            radius="0.5rem"
            fontSize="1rem"
            fontWeight="600"
            fontFamily="Inter-SemiBold"
            onClick={showOtpInput ? handleConfirm : handleSendOtp}
          />
        </ButtonRow>
      </ModalContainer>
    </Overlay>
  );
};

export default ConfirmationModal;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: ${theme.colors.white};
  border-radius: 1rem;
  width: 90%;
  max-width: 600px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #E0E3E6;
  margin-bottom: 2rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ErrorText = styled.span`
  font-size: 0.75rem;
  color: #dc2626;
  font-family: "Inter-Regular", sans-serif;
  margin-top: 0.25rem;
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

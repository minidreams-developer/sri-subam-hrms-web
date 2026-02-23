import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import theme from "../../theme/theme";
import HrmsLogo from "../../assets/images/Dashboard Images/main_logo.svg";
import InputComponent from "../../components/InputComponent";
import OtpInput from "../../components/OtpInput";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleNext = () => {
    if (step === 1) {
      if (email) {
        setStep(2);
      }
    } else if (step === 2) {
      // Handle OTP submission validation here
      setStep(3);
    } else {
      // Handle Password Reset
      console.log("Password Reset");
    }
  };

  return (
    <Container>
      <Logo src={HrmsLogo} alt="Logo" />
      <ContentWrapper>
        {step === 1 ? (
          <>
            <HeadText>Forgot your password?</HeadText>
            <SubText>
              Enter your email address and we’ll send you a OTP to reset your
              Password.
            </SubText>
            <InputComponent
              label="Email"
              placeholder="Enter email address"
              type="email"
              labelMargin="0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={handleNext}>Send Verification Code</Button>
            <BackText onClick={() => navigate("/login")}>Back</BackText>
          </>
        ) : step === 2 ? (
          <>
            <HeadText>Enter OTP</HeadText>
            <SubText>
              We sent OTP to{" "}
              <span
                style={{ color: theme.colors.textColor, fontWeight: "600" }}
              >
                {email || "Manoj******@gamil.com"}
              </span>{" "}
              Please check and enter OTP Here
            </SubText>
            <Label>OTP</Label>
            <OtpInput length={6} onChange={(otp) => console.log(otp)} />
            <Button onClick={handleNext}>Next</Button>
            <BackText onClick={() => setStep(1)}>Back</BackText>
          </>
        ) : (
          <>
            <HeadText>Enter New Password</HeadText>
            <SubText>Reset Password to Access HRMS Sowftware</SubText>
            <InputGroup>
              <InputComponent
                label="New Password"
                placeholder="Enter new password"
                type="password"
                labelMargin="0"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <InputComponent
                label="Confirm Password"
                placeholder="Enter confirm password"
                type="password"
                labelMargin="0"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </InputGroup>
            <Button onClick={handleNext}>Save</Button>
            <BackText onClick={() => setStep(2)}>Cancel</BackText>
          </>
        )}
      </ContentWrapper>
      <NeedText>Need Support?</NeedText>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  background-color: ${theme.colors.bgColor};
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  max-width: 426px;
  padding: 0 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1.25rem;
`;

const Button = styled.button`
  border-radius: 0.625rem;
  border: none;
  background: ${theme.colors.primary};
  padding: 14px 1rem;
  width: 100%;
  margin: 1.75rem 0 0 0;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter_18pt-SemiBold", sans-serif;
  color: #ffffff;
  line-height: 100%;
  margin: 2rem 0 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    padding: 0.875rem 1rem;
    font-size: 0.75rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 0.875rem;
    font-size: 0.7rem;
  }
`;

const BackText = styled.p`
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 160%;
  color: ${theme.colors.primary};
  margin: 1.5rem 0 0 0;
  cursor: pointer;
  width: 100%;
  text-align: center;
`;

const NeedText = styled.p`
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 160%;
  color: ${theme.colors.primary};
  margin: 0 0 2rem 0;
  cursor: pointer;
  width: 100%;
  text-align: center;
`;

const HeadText = styled.h1`
  font-family: "Inter_18pt-Bold", sans-serif;
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 120%;
  color: ${theme.colors.textColor};
  margin: 0 0 0.625rem 0;
`;

const SubText = styled.p`
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  color: #b1b1b1;
  margin: 0 0 1.75rem 0;
`;

const Label = styled.p`
  font-size: 0.875rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 500;
  line-height: 160%;
  color: ${theme.colors.primary};
  margin: 0 0 0.625rem 0;
`;

const Logo = styled.img`
  height: 2.5rem;
  width: 11.75rem;
  margin: 2rem 0.75rem 0 0;

  @media (max-width: 768px) {
    height: 1.25rem;
    margin: 0 0.5rem 0 0;
  }
`;

export default ForgotPassword;

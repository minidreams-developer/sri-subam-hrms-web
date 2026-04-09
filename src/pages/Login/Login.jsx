import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import HrmsLogo from "../../assets/images/DashboardImages/main_logo.svg";
import BGImage from "../../assets/images/Login/loginImage.jpg";
import InputComponent from "../../components/InputComponent";
import { Spinner } from "reactstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

export const Login = () => {
  const navigate = useNavigate();

  const handleLoginSubmit = (values, { setStatus }) => {
    setStatus("");
    navigate("/admin/dashboard");
  };

  return (
    <ParentContainer>
      <LoginContainer>
        <LeftContainer />
        <RightContainer>
          <LogoSection>
            <LogoAndName>
              <Logo src={HrmsLogo} alt="Logo" />
            </LogoAndName>
          </LogoSection>
          <FormSection>
            <HeadText>Login Into Airtable</HeadText>
            <SubText>
              Enter your email and password to access your account{" "}
            </SubText>

            <Formik
              initialValues={{
                username: "admin@ricemill",
                password: "admin1234",
              }}
              validationSchema={validationSchema}
              onSubmit={handleLoginSubmit}
            >
              {({
                values,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                errors,
                touched,
                status,
              }) => (
                <StyledForm onSubmit={handleSubmit}>
                  <InputWraper>
                    <div>
                      <InputComponent
                        name="username"
                        label="Username"
                        placeholder="Enter username"
                        value={values.username}
                        type="text"
                        language="en"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {touched.username && errors.username && (
                        <ErrorText>{errors.username}</ErrorText>
                      )}
                    </div>
                    <div>
                      <InputComponent
                        name="password"
                        label="Password"
                        placeholder="Password"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {touched.password && errors.password && (
                        <ErrorText>{errors.password}</ErrorText>
                       )}
                      <ForgotPasswordText
                        onClick={() => navigate("/forgot-password")}
                      >
                        Forgot your password?
                      </ForgotPasswordText>
                    </div>
                    {status && <ErrorText>{status}</ErrorText>}
                  </InputWraper>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Spinner size="sm" /> : "Login"}
                  </Button>
                </StyledForm>
              )}
            </Formik>
          </FormSection>
        </RightContainer>
      </LoginContainer>
      <FooterLinks></FooterLinks>
    </ParentContainer>
  );
};

const StyledForm = styled(Form)`
  width: 100%;
`;

const ParentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${theme.colors.bgColor};
  position: relative;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const LoginContainer = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  min-height: 70vh;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    max-width: 500px;
    min-height: auto;
    gap: 1rem;
  }
`;

const LeftContainer = styled.div`
  background-image: url(${BGImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 47.125rem;
  max-width: 100%;
  height: 60.25rem;
  border-radius: 1.25rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: end;

  @media (min-width: 1440px) {
    width: 810px;
    height: 964px;
  }

  @media (max-width: 1200px) {
    width: 810px;
    height: 964px;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 400px;
    height: 250px;
    order: 2;
    margin: 1rem 0;
    border-radius: 15px;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 450px;
  background-color: ${theme.colors.bgColor};
  flex-shrink: 0;
  position: relative;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  margin: auto 0;
`;

const Logo = styled.img`
  height: 2.5rem;
  width: 11.75rem;
  margin: 0 0.75rem 0 0;

  @media (max-width: 768px) {
    height: 1.25rem;
    margin: 0 0.5rem 0 0;
  }
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0;
  width: 100%;

  @media (max-width: 768px) {
    margin: 0 0 1.25rem 0;
    align-items: center;
  }
`;

const LogoAndName = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const HeadText = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  font-family: "Inter", sans-serif;
  line-height: 160%;
  margin: 0 0 0.5rem 0;
  color: #0c0c0c;

  @media (max-width: 768px) {
    font-size: 1.125rem;
    text-align: center;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const SubText = styled.p`
  font-size: 14px;
  font-weight: 500;
  font-family: "Inter-Medium18", sans-serif;
  line-height: 160%;
  margin: 0 0 2rem 0;
  color: #b1b1b1;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin: 0 0 1.5rem 0;
    text-align: center;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    line-height: 140%;
  }
`;

const InputWraper = styled.div`
  display: flex;
  align-items: stretch;
  flex-direction: column;
  // gap: 0.875rem;
  width: 100%;
  margin: 0 0 2rem 0;

  @media (max-width: 768px) {
    gap: 1rem;
    margin: 0 0 1.5rem 0;
  }
`;

const Button = styled.button`
  border-radius: 0.625rem;
  border: none;
  background: ${theme.colors.primary};
  padding: 1.063rem 1rem;
  width: 100%;
  box-sizing: border-box;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter", sans-serif;
  color: #ffffff;
  line-height: 100%;
  margin: 0 0 0 0;
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

const ErrorText = styled.p`
  color: #ff4d4f;
  font-size: 0.875rem;
  margin: 0.5rem 0 0;
  font-family: "Inter", sans-serif;
  font-weight: 400;
`;

const FooterLinks = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  position: absolute;
  bottom: 2rem;
  right: 125px;

  @media (min-width: 1440px) {
    right: 125px;
  }

  @media (max-width: 1200px) {
    right: 125px;
  }

  @media (max-width: 768px) {
    right: 50%;
    transform: translateX(50%);
    bottom: 1rem;
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
    bottom: 0.75rem;
  }
`;

const FooterLink = styled.a`
  font-size: 0.875rem;
  font-weight: 400;
  font-family: "Inter", sans-serif;
  color: #666666;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: ${theme.colors.primary};
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

const EllipseIcon = styled.img`
  width: 4px;
  height: 4px;

  @media (max-width: 480px) {
    display: none;
  }
`;

const ForgotPasswordText = styled.p`
  color: ${theme.colors.primary};
  font-weight: 500;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  line-height: 160%;
  text-align: right;
  margin: 0.5rem 0 0 0;
  cursor: pointer;
  display: block;
  z-index: 10;
  position: relative;
`;

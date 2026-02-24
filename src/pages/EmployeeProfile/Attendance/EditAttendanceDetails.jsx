import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../../theme/theme";
import Button from "../../../components/Button";
import InputComponent from "../../../components/InputComponent";
import CalenderInput from "../../../components/CalenderInput";
import TimeInputComponent from "../../../components/TimeInputComponent";
import Select from "react-select";
import { customSelectStyles } from "../../../theme/reactSelectStyles";
import ProfileImage from "../../../assets/images/employee/sampleProfile.jpg";

const EditAttendanceDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeName: null,
    employeeId: null,
    position: null,
    department: { value: "ui_ux", label: "UI UX Design" },
    date: null,
    shift: { value: "morning", label: "Morning" },
    category: { value: "half_day", label: "Half-Day" },
    login: "",
    logout: "",
    breakLogin: "",
    breakLogout: "",
    overTime: "4.00",
    workingHrs: "12.00",
    remarks: "",
  });

  const employeeOptions = [
    { value: "john_doe", label: "John Doe" },
    { value: "jane_smith", label: "Jane Smith" },
  ];

  const departmentOptions = [
    { value: "ui_ux", label: "UI UX Design" },
    { value: "development", label: "Development" },
    { value: "marketing", label: "Marketing" },
  ];

  const shiftOptions = [
    { value: "morning", label: "Morning" },
    { value: "evening", label: "Evening" },
    { value: "night", label: "Night" },
  ];

  const categoryOptions = [
    { value: "full_day", label: "Full Day" },
    { value: "half_day", label: "Half-Day" },
    { value: "absent", label: "Absent" },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSave = () => {
    console.log("Form data:", formData);
    // Add save logic here
    navigate(-1);
  };

  return (
    <Container>
      <FormContent>
        <LeftSection>
          <Section>
            <SectionTitle>Employee Details</SectionTitle>
            <Row>
              <Col>
                <SelectWrapper>
                  <Label>Employee Name</Label>
                  <Select
                    options={employeeOptions}
                    value={formData.employeeName}
                    onChange={(value) => handleChange("employeeName", value)}
                    placeholder="Select Type"
                    styles={customSelectStyles}
                    isSearchable
                  />
                </SelectWrapper>
              </Col>
              <Col>
                <SelectWrapper>
                  <Label>Employee ID</Label>
                  <Select
                    options={employeeOptions}
                    value={formData.employeeId}
                    onChange={(value) => handleChange("employeeId", value)}
                    placeholder="Select Type"
                    styles={customSelectStyles}
                    isSearchable
                  />
                </SelectWrapper>
              </Col>
            </Row>
            <Row>
              <Col>
                <SelectWrapper>
                  <Label>Position</Label>
                  <Select
                    options={departmentOptions}
                    value={formData.position}
                    onChange={(value) => handleChange("position", value)}
                    placeholder="Select Department"
                    styles={customSelectStyles}
                    isSearchable
                  />
                </SelectWrapper>
              </Col>
              <Col>
                <SelectWrapper>
                  <Label>Department</Label>
                  <Select
                    options={departmentOptions}
                    value={formData.department}
                    onChange={(value) => handleChange("department", value)}
                    placeholder="Select Department"
                    styles={customSelectStyles}
                    isSearchable
                  />
                </SelectWrapper>
              </Col>
            </Row>
          </Section>

          <Section>
            <SectionTitle>Attendance Details</SectionTitle>
            <Row>
              <Col>
                <CalenderInput
                  label="Date"
                  onDateSelect={(date) => handleChange("date", date)}
                  initialDate={formData.date}
                  labelMargin="0 0 0.625rem 0"
                />
              </Col>
              <Col>
                <SelectWrapper>
                  <Label>Shift</Label>
                  <Select
                    options={shiftOptions}
                    value={formData.shift}
                    onChange={(value) => handleChange("shift", value)}
                    placeholder="Select Shift"
                    styles={customSelectStyles}
                    isSearchable
                  />
                </SelectWrapper>
              </Col>
            </Row>
            <Row>
              <Col>
                <SelectWrapper>
                  <Label>Select Category</Label>
                  <Select
                    options={categoryOptions}
                    value={formData.category}
                    onChange={(value) => handleChange("category", value)}
                    placeholder="Select Category"
                    styles={customSelectStyles}
                    isSearchable
                  />
                </SelectWrapper>
              </Col>
            </Row>
            <Row>
              <Col>
                <TimeInputComponent
                  label="Login"
                  onTimeSelect={(time) => handleChange("login", time)}
                  initialTime={formData.login}
                />
              </Col>
              <Col>
                <TimeInputComponent
                  label="Log Out"
                  onTimeSelect={(time) => handleChange("logout", time)}
                  initialTime={formData.logout}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <TimeInputComponent
                  label="Break Login"
                  onTimeSelect={(time) => handleChange("breakLogin", time)}
                  initialTime={formData.breakLogin}
                />
              </Col>
              <Col>
                <TimeInputComponent
                  label="Break Logout"
                  onTimeSelect={(time) => handleChange("breakLogout", time)}
                  initialTime={formData.breakLogout}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <InputComponent
                  label="Over Time"
                  placeholder="0.00"
                  value={formData.overTime}
                  onChange={(e) => handleChange("overTime", e.target.value)}
                  labelMargin="0 0 0.625rem 0"
                  suffix="Hrs"
                />
              </Col>
              <Col>
                <InputComponent
                  label="Working Hrs"
                  placeholder="0.00"
                  value={formData.workingHrs}
                  onChange={(e) => handleChange("workingHrs", e.target.value)}
                  labelMargin="0 0 0.625rem 0"
                  suffix="Hrs"
                />
              </Col>
            </Row>
            <Row>
              <FullCol>
                <RemarksLabel>Remarks (Optional)</RemarksLabel>
                <RemarksTextarea
                  placeholder="Enter Remarks"
                  value={formData.remarks}
                  onChange={(e) => handleChange("remarks", e.target.value)}
                />
              </FullCol>
            </Row>
          </Section>
        </LeftSection>

        <RightSection>
          <ProfileCard>
            <ProfileImageWrapper>
              <ProfileImg src={ProfileImage} alt="profile" />
            </ProfileImageWrapper>
          </ProfileCard>
        </RightSection>
      </FormContent>

      <ButtonRow>
        <Button
          text="Cancel"
          bg="transparent"
          color={theme.colors.primary}
          border={`1px solid ${theme.colors.primary}`}
          width="150px"
          radius="0.5rem"
          fontSize="0.875rem"
          fontWeight="600"
          fontFamily="Inter-SemiBold"
          onClick={handleCancel}
        />
        <Button
          text="Save"
          bg={theme.colors.primary}
          color={theme.colors.white}
          width="150px"
          radius="0.5rem"
          fontSize="0.875rem"
          fontWeight="600"
          fontFamily="Inter-SemiBold"
          onClick={handleSave}
        />
      </ButtonRow>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const FormContent = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const RightSection = styled.div`
  width: 300px;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const Section = styled.div`
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 600;
  color: ${theme.colors.primary};
  margin: 0 0 1.5rem 0;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Col = styled.div`
  width: 100%;
`;

const FullCol = styled.div`
  width: 100%;
  grid-column: 1 / -1;
`;

const SelectWrapper = styled.div`
  width: 100%;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 500;
  line-height: 160%;
  color: ${theme.colors.primaryGreen};
  margin-bottom: 0.625rem;
`;

const RemarksLabel = styled.p`
  font-size: 0.875rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 500;
  line-height: 160%;
  color: ${theme.colors.primaryGreen};
  margin: 0 0 0.625rem 0;
`;

const RemarksTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem 1rem;
  border-radius: 0.625rem;
  border: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.searchBackground};
  font-size: 0.875rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  color: ${theme.colors.textColor};
  outline: none;
  resize: vertical;

  &:focus {
    border: 2px solid ${theme.colors.primary};
  }

  ::placeholder {
    color: ${theme.colors.textGray || "#9ca3af"};
    font-family: "Inter_18pt-Medium", sans-serif;
  }
`;

const ProfileCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  `;

const ProfileImageWrapper = styled.div`
  width: 180px;
  height: 180px;
  overflow: hidden;
  border: 1px solid ${theme.colors.primary};
  border-radius: 6px;
`;

const ProfileImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${theme.colors.border};
`;

export default EditAttendanceDetails;

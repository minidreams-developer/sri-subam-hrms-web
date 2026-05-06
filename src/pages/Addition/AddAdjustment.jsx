import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import InputComponent from "../../components/InputComponent";
import CalenderInput from "../../components/CalenderInput";
import Button from "../../components/Button";
import Select from "react-select";
import { customSelectStyles } from "../../theme/reactSelectStyles";

const AddAdjustment = () => {
  const navigate = useNavigate();
  const [forWhom, setForWhom] = useState(null);
  const [formData, setFormData] = useState({
    // Team fields
    department: null,
    team: null,
    teamId: "",
    teamLead: "",
    // Individual fields
    employeeId: "",
    employee: null,
    designation: "",
    // Adjustment Details
    type: null,
    component: null,
    date: null,
    amount: "",
    affectFrom: null,
    to: null,
    totalMonths: "",
    perMonthDeduction: "",
    payrollMonth: null,
    appliedToPayroll: null,
    remarks: "",
  });

  const forWhomOptions = [
    { value: "team", label: "Team" },
    { value: "individual", label: "Individual" },
  ];

  const departmentOptions = [
    { value: "ui_ux", label: "UI UX Design" },
    { value: "development", label: "Development" },
    { value: "marketing", label: "Marketing" },
  ];

  const teamOptions = [
    { value: "ui_ux_design", label: "UI UX Design" },
    { value: "frontend", label: "Frontend Team" },
    { value: "backend", label: "Backend Team" },
  ];

  const employeeOptions = [
    { value: "manoj", label: "Manoj Kumar" },
    { value: "john", label: "John Doe" },
    { value: "jane", label: "Jane Smith" },
  ];

  const typeOptions = [
    { value: "addiction", label: "Addiction" },
    { value: "deduction", label: "Deduction" },
  ];

  const componentOptions = [
    { value: "emi", label: "EMI" },
    { value: "bonus", label: "Bonus" },
    { value: "incentive", label: "Incentive" },
    { value: "allowance", label: "Allowance" },
  ];

  const generateMonthOptions = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-11
    
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    const options = [];
    
    // Add remaining months of current year (from current month onwards)
    for (let i = currentMonth; i < 12; i++) {
      options.push({
        value: `${months[i].toLowerCase()}${currentYear}`,
        label: `${months[i]} ${currentYear}`
      });
    }
    
    // Add all months of next year
    for (let i = 0; i < 12; i++) {
      options.push({
        value: `${months[i].toLowerCase()}${currentYear + 1}`,
        label: `${months[i]} ${currentYear + 1}`
      });
    }
    
    return options;
  };

  const monthOptions = generateMonthOptions();

  const yesNoOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    navigate("/admin/pay-hub/additionDeductions");
  };

  const handleSave = () => {
    console.log("Form data:", formData);
    // Add your save logic here
  };

  return (
    <Container>
      <FormContainer>
        <Section>
          <SectionTitle>Adjustment Type</SectionTitle>
          <Row>
            <Col>
              <SelectWrapper>
                <Label>For Whom</Label>
                <Select
                  options={forWhomOptions}
                  value={forWhom}
                  onChange={(value) => setForWhom(value)}
                  placeholder="Team"
                  styles={customSelectStyles}
                  isSearchable
                />
              </SelectWrapper>
            </Col>
          </Row>
        </Section>

        {forWhom?.value === "team" && (
          <Section>
            <SectionTitle>Team Details</SectionTitle>
            <Row>
              <Col>
                <SelectWrapper>
                  <Label>Department</Label>
                  <Select
                    options={departmentOptions}
                    value={formData.department}
                    onChange={(value) => handleChange("department", value)}
                    placeholder="UI UX Design"
                    styles={customSelectStyles}
                    isSearchable
                  />
                </SelectWrapper>
              </Col>
              <Col>
                <SelectWrapper>
                  <Label>Team</Label>
                  <Select
                    options={teamOptions}
                    value={formData.team}
                    onChange={(value) => handleChange("team", value)}
                    placeholder="UI UX Design"
                    styles={customSelectStyles}
                    isSearchable
                  />
                </SelectWrapper>
              </Col>
            </Row>
            <Row>
              <Col>
                <InputComponent
                  label="Team ID"
                  placeholder="#1253366"
                  value={formData.teamId}
                  onChange={(e) => handleChange("teamId", e.target.value)}
                  labelMargin="0 0 0.625rem 0"
                  height="50px"
                />
              </Col>
              <Col>
                <InputComponent
                  label="Team lead"
                  placeholder="Manoj Kumar"
                  value={formData.teamLead}
                  onChange={(e) => handleChange("teamLead", e.target.value)}
                  labelMargin="0 0 0.625rem 0"
                  height="50px"
                />
              </Col>
            </Row>
          </Section>
        )}

        {forWhom?.value === "individual" && (
          <Section>
            <SectionTitle>Employee Details</SectionTitle>
            <Row>
              <Col>
                <InputComponent
                  label="Employee ID"
                  placeholder="Enter Employee ID"
                  value={formData.employeeId}
                  onChange={(e) => handleChange("employeeId", e.target.value)}
                  labelMargin="0 0 0.625rem 0"
                  height="50px"
                />
              </Col>
              <Col>
                <SelectWrapper>
                  <Label>Employee</Label>
                  <Select
                    options={employeeOptions}
                    value={formData.employee}
                    onChange={(value) => handleChange("employee", value)}
                    placeholder="Select Employee"
                    styles={customSelectStyles}
                    isSearchable
                  />
                </SelectWrapper>
              </Col>
            </Row>
            <Row>
              <Col>
                <InputComponent
                  label="Designation"
                  placeholder="Enter Designation"
                  value={formData.designation}
                  onChange={(e) => handleChange("designation", e.target.value)}
                  labelMargin="0 0 0.625rem 0"
                  height="50px"
                />
              </Col>
            </Row>
          </Section>
        )}

        <Section>
          <SectionTitle>Adjustment Details</SectionTitle>
          <Row>
            <Col>
              <SelectWrapper>
                <Label>Type</Label>
                <Select
                  options={typeOptions}
                  value={formData.type}
                  onChange={(value) => handleChange("type", value)}
                  placeholder="Addiction"
                  styles={customSelectStyles}
                  isSearchable
                />
              </SelectWrapper>
            </Col>
            <Col>
              <SelectWrapper>
                <Label>Component</Label>
                <Select
                  options={componentOptions}
                  value={formData.component}
                  onChange={(value) => handleChange("component", value)}
                  placeholder={forWhom?.value === "team" ? "EMI" : "Bonus"}
                  styles={customSelectStyles}
                  isSearchable
                />
              </SelectWrapper>
            </Col>
          </Row>

          {/* Bonus Component Fields */}
          {formData.component?.value === "bonus" && (
            <>
              <Row>
                <Col>
                  <CalenderInput
                    label="Date"
                    placeholder="Select date"
                    onDateSelect={(date) => handleChange("date", date)}
                    initialDate={formData.date}
                    labelMargin="0 0 0.625rem 0"
                  />
                </Col>
                <Col>
                  <SelectWrapper>
                    <Label>Payroll Month</Label>
                    <Select
                      options={monthOptions}
                      value={formData.payrollMonth}
                      onChange={(value) => handleChange("payrollMonth", value)}
                      placeholder="Jan 2026"
                      styles={customSelectStyles}
                      isSearchable
                    />
                  </SelectWrapper>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputComponent
                    label="Amount"
                    placeholder="₹ Enter Amount"
                    value={formData.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    labelMargin="0 0 0.625rem 0"
                    height="50px"
                  />
                </Col>
                <Col>
                  <SelectWrapper>
                    <Label>Applied to Payroll</Label>
                    <Select
                      options={yesNoOptions}
                      value={formData.appliedToPayroll}
                      onChange={(value) => handleChange("appliedToPayroll", value)}
                      placeholder="Yes"
                      styles={customSelectStyles}
                      isSearchable
                    />
                  </SelectWrapper>
                </Col>
              </Row>
              <Row>
                <FullCol>
                  <InputComponent
                    label="Remarks (Optional)"
                    placeholder="Enter Remarks"
                    value={formData.remarks}
                    onChange={(e) => handleChange("remarks", e.target.value)}
                    labelMargin="0 0 0.625rem 0"
                    height="50px"
                  />
                </FullCol>
              </Row>
            </>
          )}

          {/* EMI Component Fields */}
          {formData.component?.value === "emi" && (
            <>
              <Row>
                <Col>
                  <CalenderInput
                    label="Date"
                    placeholder="Select date"
                    onDateSelect={(date) => handleChange("date", date)}
                    initialDate={formData.date}
                    labelMargin="0 0 0.625rem 0"
                  />
                </Col>
                <Col>
                  <InputComponent
                    label="Amount"
                    placeholder="₹ Enter Amount"
                    value={formData.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    labelMargin="0 0 0.625rem 0"
                    height="50px"
                  />
                </Col>
              </Row>
              <ThreeColRow>
                <SmallCol>
                  <SelectWrapper>
                    <Label>Affect From</Label>
                    <Select
                      options={monthOptions}
                      value={formData.affectFrom}
                      onChange={(value) => handleChange("affectFrom", value)}
                      placeholder="Jan 2026"
                      styles={customSelectStyles}
                      isSearchable
                    />
                  </SelectWrapper>
                </SmallCol>
                <SmallCol>
                  <SelectWrapper>
                    <Label>To</Label>
                    <Select
                      options={monthOptions}
                      value={formData.to}
                      onChange={(value) => handleChange("to", value)}
                      placeholder="May 2026"
                      styles={customSelectStyles}
                      isSearchable
                    />
                  </SelectWrapper>
                </SmallCol>
                <LargeCol>
                  <InputComponent
                    label="Total Months"
                    placeholder="Enter Total Months"
                    value={formData.totalMonths}
                    onChange={(e) =>
                      handleChange("totalMonths", e.target.value)
                    }
                    labelMargin="0 0 0.625rem 0"
                    height="50px"
                  />
                </LargeCol>
              </ThreeColRow>
              <Row>
                <Col>
                  <InputComponent
                    label="Per Month Deduction"
                    placeholder="₹ Enter Amount"
                    value={formData.perMonthDeduction}
                    onChange={(e) =>
                      handleChange("perMonthDeduction", e.target.value)
                    }
                    labelMargin="0 0 0.625rem 0"
                    height="50px"
                  />
                </Col>
                <Col>
                  <SelectWrapper>
                    <Label>Applied to Payroll</Label>
                    <Select
                      options={yesNoOptions}
                      value={formData.appliedToPayroll}
                      onChange={(value) => handleChange("appliedToPayroll", value)}
                      placeholder="Yes"
                      styles={customSelectStyles}
                      isSearchable
                    />
                  </SelectWrapper>
                </Col>
              </Row>
              <Row>
                <FullCol>
                  <InputComponent
                    label="Remarks (Optional)"
                    placeholder="Enter Remarks"
                    value={formData.remarks}
                    onChange={(e) => handleChange("remarks", e.target.value)}
                    labelMargin="0 0 0.625rem 0"
                    height="50px"
                  />
                </FullCol>
              </Row>
            </>
          )}

          {/* Other Components (Incentive, Allowance) - Show Bonus-like fields */}
          {formData.component && 
           formData.component.value !== "bonus" && 
           formData.component.value !== "emi" && (
            <>
              <Row>
                <Col>
                  <CalenderInput
                    label="Date"
                    placeholder="Select date"
                    onDateSelect={(date) => handleChange("date", date)}
                    initialDate={formData.date}
                    labelMargin="0 0 0.625rem 0"
                  />
                </Col>
                <Col>
                  <SelectWrapper>
                    <Label>Payroll Month</Label>
                    <Select
                      options={monthOptions}
                      value={formData.payrollMonth}
                      onChange={(value) => handleChange("payrollMonth", value)}
                      placeholder="Jan 2026"
                      styles={customSelectStyles}
                      isSearchable
                    />
                  </SelectWrapper>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputComponent
                    label="Amount"
                    placeholder="₹ Enter Amount"
                    value={formData.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    labelMargin="0 0 0.625rem 0"
                    height="50px"
                  />
                </Col>
                <Col>
                  <SelectWrapper>
                    <Label>Applied to Payroll</Label>
                    <Select
                      options={yesNoOptions}
                      value={formData.appliedToPayroll}
                      onChange={(value) => handleChange("appliedToPayroll", value)}
                      placeholder="Yes"
                      styles={customSelectStyles}
                      isSearchable
                    />
                  </SelectWrapper>
                </Col>
              </Row>
              <Row>
                <FullCol>
                  <InputComponent
                    label="Remarks (Optional)"
                    placeholder="Enter Remarks"
                    value={formData.remarks}
                    onChange={(e) => handleChange("remarks", e.target.value)}
                    labelMargin="0 0 0.625rem 0"
                    height="50px"
                  />
                </FullCol>
              </Row>
            </>
          )}
        </Section>

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
      </FormContainer>
    </Container>
  );
};

export default AddAdjustment;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  width: 80%;
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
  gap: 1.5rem;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ThreeColRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: 1.5rem;
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

const SmallCol = styled.div`
  width: 100%;
`;

const LargeCol = styled.div`
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

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${theme.colors.border};
`;

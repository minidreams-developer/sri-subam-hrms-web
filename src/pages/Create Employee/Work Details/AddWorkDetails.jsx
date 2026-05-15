import { useState, forwardRef, useImperativeHandle } from "react";
import styled from "styled-components";
import theme from "../../../theme/theme";
import CalenderInput from "../../../components/CalenderInput";
import InputComponent from "../../../components/InputComponent";
import Select from "react-select";
import { customSelectStyles } from "../../../theme/reactSelectStyles";

const AddWorkDetails = forwardRef(({ onNext, onBack }, ref) => {
  const [formData, setFormData] = useState({
    dateOfJoining: null,
    experienceType: null,
    department: null,
    designation: null,
    team: null,
    branch: null,
    contractAgent: null,
    reportingPerson: null,
    attendanceType: null,
    totalYearsOfExperience: "",
    lastCompanyName: "",
    experience: "",
    location: "",
    shift: null,
    attendancePermission: null,
    esiNumber: "",
    pfNumber: "",
    ctcAnnual: "",
    monthlyCTC: "",
    basicSalary: "",
    hra: "",
    conveyanceAllowance: "",
    specialAllowance: "",
    specialAllowance2: "",
    otherFixedAllowances: "",
    salaryDisbursementType: null,
    accHolderName: "",
    bank: "",
    accNumber: "",
    ifscCode: "",
    bankBranch: "",
    remarks: "",
  });

  // Expose form data via ref
  useImperativeHandle(ref, () => ({
    formData,
  }));

  const experienceTypeOptions = [
    { value: "fresher", label: "Fresher" },
    { value: "experienced", label: "Experienced" },
  ];

  const departmentOptions = [
    { value: "hr", label: "HR" },
    { value: "it", label: "IT" },
    { value: "sales", label: "Sales" },
    { value: "marketing", label: "Marketing" },
  ];

  const designationOptions = [
    { value: "manager", label: "Manager" },
    { value: "developer", label: "Developer" },
    { value: "designer", label: "Designer" },
  ];

  const teamOptions = [
    { value: "team_a", label: "Team A" },
    { value: "team_b", label: "Team B" },
    { value: "team_c", label: "Team C" },
  ];

  const branchOptions = [
    { value: "main", label: "Main Branch" },
    { value: "branch_1", label: "Branch 1" },
    { value: "branch_2", label: "Branch 2" },
  ];

  const contractAgentOptions = [
    { value: "agent_1", label: "Agent 1" },
    { value: "agent_2", label: "Agent 2" },
  ];

  const reportingPersonOptions = [
    { value: "person_1", label: "John Doe" },
    { value: "person_2", label: "Jane Smith" },
  ];

  const attendanceTypeOptions = [
    { value: "bio_metric", label: "Bio Metric" },
    { value: "manual", label: "Manual" },
  ];

  const shiftOptions = [
    { value: "morning", label: "Morning" },
    { value: "evening", label: "Evening" },
    { value: "night", label: "Night" },
  ];

  const attendancePermissionOptions = [
    { value: "auto", label: "Auto" },
    { value: "manual", label: "Manual" },
  ];

  const salaryDisbursementOptions = [
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "cash", label: "Cash" },
    { value: "cheque", label: "Cheque" },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Container>
      <Section>
        <SectionTitle>Work Information</SectionTitle>
        <Row>
          <Col>
            <CalenderInput
              label="Date Of Joining"
              onDateSelect={(date) => handleChange("dateOfJoining", date)}
              initialDate={formData.dateOfJoining}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <SelectWrapper>
              <Label>Experience Type</Label>
              <Select
                options={experienceTypeOptions}
                value={formData.experienceType}
                onChange={(value) => handleChange("experienceType", value)}
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
          <Col>
            <SelectWrapper>
              <Label>Designation</Label>
              <Select
                options={designationOptions}
                value={formData.designation}
                onChange={(value) => handleChange("designation", value)}
                placeholder="Select Designation"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
        </Row>
        <Row>
          <Col>
            <SelectWrapper>
              <Label>Team</Label>
              <Select
                options={teamOptions}
                value={formData.team}
                onChange={(value) => handleChange("team", value)}
                placeholder="Select Team"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
          <Col>
            <SelectWrapper>
              <Label>Branch</Label>
              <Select
                options={branchOptions}
                value={formData.branch}
                onChange={(value) => handleChange("branch", value)}
                placeholder="Select Branch"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
        </Row>
        <Row>
          <Col>
            <SelectWrapper>
              <Label>Contract Agent</Label>
              <Select
                options={contractAgentOptions}
                value={formData.contractAgent}
                onChange={(value) => handleChange("contractAgent", value)}
                placeholder="Select Agent"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
          <Col>
            <SelectWrapper>
              <Label>Reporting Person</Label>
              <Select
                options={reportingPersonOptions}
                value={formData.reportingPerson}
                onChange={(value) => handleChange("reportingPerson", value)}
                placeholder="Select"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
        </Row>
        <Row>
          <Col>
            <SelectWrapper>
              <Label>Attendance Type</Label>
              <Select
                options={attendanceTypeOptions}
                value={formData.attendanceType}
                onChange={(value) => handleChange("attendanceType", value)}
                placeholder="Bio Metric"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
        </Row>
      </Section>

      <Divider />

      <Section>
        <SectionTitle>Experience Details</SectionTitle>
        <Row>
          <Col>
            <InputComponent
              label="Total Years of Experience"
              placeholder="Enter PF Number"
              value={formData.totalYearsOfExperience}
              onChange={(e) => handleChange("totalYearsOfExperience", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <InputComponent
              label="Last Company Name"
              placeholder="Enter Company Name"
              value={formData.lastCompanyName}
              onChange={(e) => handleChange("lastCompanyName", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputComponent
              label="Experience"
              placeholder="Enter experience"
              value={formData.experience}
              onChange={(e) => handleChange("experience", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <InputComponent
              label="Location"
              placeholder="Enter Location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
      </Section>

      <Divider />

      <Section>
        <SectionTitle>Shift & Attendance Details</SectionTitle>
        <Row>
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
          <Col>
            <SelectWrapper>
              <Label>Attendance Permission</Label>
              <Select
                options={attendancePermissionOptions}
                value={formData.attendancePermission}
                onChange={(value) => handleChange("attendancePermission", value)}
                placeholder="Auto"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
        </Row>
      </Section>

      <Divider />

      <Section>
        <SectionTitle>ESI & PF Details</SectionTitle>
        <Row>
          <Col>
            <InputComponent
              label="ESI Number"
              placeholder="Enter ESI Number"
              value={formData.esiNumber}
              onChange={(e) => handleChange("esiNumber", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <InputComponent
              label="PF Number"
              placeholder="Enter PF Number"
              value={formData.pfNumber}
              onChange={(e) => handleChange("pfNumber", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
      </Section>

      <Divider />

      <Section>
        <SectionTitle>Salary Details</SectionTitle>
        <Row>
          <Col>
            <InputComponent
              label="CTC (Annual)"
              placeholder="4,00,000"
              value={formData.ctcAnnual}
              onChange={(e) => handleChange("ctcAnnual", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <InputComponent
              label="Monthly CTC"
              placeholder="33,333"
              value={formData.monthlyCTC}
              onChange={(e) => handleChange("monthlyCTC", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputComponent
              label="Basic Salary"
              placeholder="1500"
              value={formData.basicSalary}
              onChange={(e) => handleChange("basicSalary", e.target.value)}
              labelMargin="0 0 0.625rem 0"
              prefix="₹"
            />
          </Col>
          <Col>
            <InputComponent
              label="HRA (House Rent Allowance)"
              placeholder="1500"
              value={formData.hra}
              onChange={(e) => handleChange("hra", e.target.value)}
              labelMargin="0 0 0.625rem 0"
              prefix="₹"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputComponent
              label="Conveyance Allowance"
              placeholder="1500"
              value={formData.conveyanceAllowance}
              onChange={(e) => handleChange("conveyanceAllowance", e.target.value)}
              labelMargin="0 0 0.625rem 0"
              prefix="₹"
            />
          </Col>
          <Col>
            <InputComponent
              label="Special Allowance"
              placeholder="0"
              value={formData.specialAllowance}
              onChange={(e) => handleChange("specialAllowance", e.target.value)}
              labelMargin="0 0 0.625rem 0"
              prefix="₹"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputComponent
              label="Special Allowance"
              placeholder="0"
              value={formData.specialAllowance2}
              onChange={(e) => handleChange("specialAllowance2", e.target.value)}
              labelMargin="0 0 0.625rem 0"
              prefix="₹"
            />
          </Col>
          <Col>
            <InputComponent
              label="Other Fixed Allowances"
              placeholder="0"
              value={formData.otherFixedAllowances}
              onChange={(e) => handleChange("otherFixedAllowances", e.target.value)}
              labelMargin="0 0 0.625rem 0"
              prefix="₹"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <SelectWrapper>
              <Label>Salary Disbursement Type</Label>
              <Select
                options={salaryDisbursementOptions}
                value={formData.salaryDisbursementType}
                onChange={(value) => handleChange("salaryDisbursementType", value)}
                placeholder="Select Type"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
        </Row>
      </Section>

      <Divider />

      <Section>
        <SectionTitle>Bank Details</SectionTitle>
        <Row>
          <Col>
            <InputComponent
              label="Acc Holder Name"
              placeholder="Enter Acc Holder Name"
              value={formData.accHolderName}
              onChange={(e) => handleChange("accHolderName", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <InputComponent
              label="Bank"
              placeholder="Enter Bank"
              value={formData.bank}
              onChange={(e) => handleChange("bank", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputComponent
              label="Acc Number"
              placeholder="Enter Acc Number"
              value={formData.accNumber}
              onChange={(e) => handleChange("accNumber", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <InputComponent
              label="IFSC Code"
              placeholder="Enter IFSC Code"
              value={formData.ifscCode}
              onChange={(e) => handleChange("ifscCode", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputComponent
              label="Branch"
              placeholder="Enter Branch"
              value={formData.bankBranch}
              onChange={(e) => handleChange("bankBranch", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
      </Section>

      <Divider />

      <Section>
        <SectionTitle>Reference Details</SectionTitle>
        <Row>
          <FullCol>
            <RemarksLabel>Remarks</RemarksLabel>
            <RemarksTextarea
              placeholder="Enter Remarks"
              value={formData.remarks}
              onChange={(e) => handleChange("remarks", e.target.value)}
            />
          </FullCol>
        </Row>
      </Section>
    </Container>
  );
});

const Container = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #E0E3E6;

  &:last-of-type {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
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

const Col = styled.div`
  width: 100%;
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

const FullCol = styled.div`
  width: 100%;
  grid-column: 1 / -1;
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

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #E0E3E6;
  margin: 1rem 0;
`;

export default AddWorkDetails;

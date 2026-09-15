import { useState, forwardRef, useImperativeHandle } from "react";
import styled from "styled-components";
import theme from "../../../theme/theme";
import InputComponent from "../../../components/InputComponent";
import Select from "react-select";
import { customSelectStyles } from "../../../theme/reactSelectStyles";

const CommissionDetails = forwardRef((_, ref) => {
  const [formData, setFormData] = useState(() => ({
    commissionPercentage: "10",
    allowance: "5000",
    salaryDisbursementType: { value: "monthly", label: "Monthly" },
    accHolderName: "Test Agent",
    bank: "State Bank of India",
    accNumber: String(Date.now()).slice(-12),
    ifscCode: "SBIN0001234",
    branch: "Chengalpattu",
    remarks: "Test agent record",
  }));

  useImperativeHandle(ref, () => ({
    formData,
  }));

  const salaryDisbursementTypeOptions = [
    { value: "monthly", label: "Monthly" },
    { value: "weekly", label: "Weekly" },
    { value: "fortnightly", label: "Fortnightly" },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Container>
      <Section>
        <SectionTitle>Commission Details</SectionTitle>
        <Row>
          <Col>
            <InputComponent
              label="Commission (%)"
              placeholder="Enter Commission Percentage (e.g., 10)"
              value={formData.commissionPercentage}
              onChange={(e) => handleChange("commissionPercentage", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <InputComponent
              label="Allowance"
              placeholder="₹ 5000"
              value={formData.allowance}
              onChange={(e) => handleChange("allowance", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <SelectWrapper>
              <Label>Salary Disbursement Type</Label>
              <Select
                options={salaryDisbursementTypeOptions}
                value={formData.salaryDisbursementType}
                onChange={(v) => handleChange("salaryDisbursementType", v)}
                placeholder="Select Type"
                styles={customSelectStyles}
                isSearchable
              />
            </SelectWrapper>
          </Col>
        </Row>
      </Section>

      <Section>
        <SectionTitle>Bank Details</SectionTitle>
        <Row>
          <Col>
            <InputComponent
              label="Account Holder Name"
              placeholder="Enter Account Holder Name"
              value={formData.accHolderName}
              onChange={(e) => handleChange("accHolderName", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
          <Col>
            <InputComponent
              label="Bank Name"
              placeholder="Enter Bank Name"
              value={formData.bank}
              onChange={(e) => handleChange("bank", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputComponent
              label="Account Number"
              placeholder="Enter Account Number"
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
              placeholder="Enter Branch Name"
              value={formData.branch}
              onChange={(e) => handleChange("branch", e.target.value)}
              labelMargin="0 0 0.625rem 0"
            />
          </Col>
        </Row>
      </Section>

      <Section>
        <SectionTitle>Reference Details</SectionTitle>
        <Row>
          <FullCol>
            <RemarksLabel>Remarks</RemarksLabel>
            <RemarksTextarea
              placeholder="Enter Reference Details (e.g., Referred by branch manager)"
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

export default CommissionDetails;

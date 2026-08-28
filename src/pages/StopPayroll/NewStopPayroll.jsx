import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import InputComponent from "../../components/InputComponent";
import CalenderInput from "../../components/CalenderInput";
import Button from "../../components/Button";
import Select from "react-select";
import { customSelectStyles } from "../../theme/reactSelectStyles";
import { getUsers, stopPayroll } from "../../services/apiServices";
import { toast } from "react-toastify";

const NewStopPayroll = () => {
  const navigate = useNavigate();
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    employee: null,
    department: "",
    designation: "",
    currentSalary: "",
    payCycle: "",
    stopType: null,
    reason: null,
    effectiveFrom: null,
    resumeOn: null,
    impactMonth: null,
    remarks: "",
    // Resume Payroll fields
    resumeStopType: null,
    resumeReason: null,
    resumeDate: null,
    resumeReasonText: null,
    adjustArrears: null,
    payPendingSalary: null,
    comments: "",
  });

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const response = await getUsers();
      console.log("Employees fetched:", response);
      
      let employees = [];
      
      // Handle different response structures
      if (Array.isArray(response)) {
        employees = response;
      } else if (response?.results && Array.isArray(response.results)) {
        employees = response.results;
      } else if (response?.data && Array.isArray(response.data)) {
        employees = response.data;
      }
      
      // Transform employees to select options format
      const options = employees.map((emp) => ({
        value: emp.id || emp._id,
        label: emp.name || `${emp.firstName || ""} ${emp.lastName || ""}`.trim(),
        employeeId: emp.employeeId || emp.id,
        department: emp.department || "N/A",
        designation: emp.workInformation?.designation || emp.designation || "employee",
        email: emp.email,
        phone: emp.phone,
        joinedDate: emp.workInformation?.joinedDate,
        fullData: emp, // Store full employee data for later use
      }));
      
      setEmployeeOptions(options);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employees");
      setEmployeeOptions([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const stopTypeOptions = [
    { value: "resignation", label: "Resignation / Offboarding" },
    { value: "absconding", label: "Absconding" },
    { value: "unpaid_leave", label: "Unpaid Leave" },
    { value: "suspension", label: "Suspension" },
    { value: "termination", label: "Termination" },
    { value: "hr_legal", label: "HR/Legal Issues" },
    { value: "payroll_corrections", label: "Payroll Corrections" },
  ];

  const reasonOptions = [
    { value: "notice", label: "Notice Period" },
    { value: "policy", label: "Policy Issues" },
    { value: "performance", label: "Performance Issue" },
    { value: "disciplinary", label: "Disciplinary Action" },
  ];

  const monthOptions = [
    { value: "jan2026", label: "January 2026" },
    { value: "feb2026", label: "February 2026" },
    { value: "mar2026", label: "March 2026" },
    { value: "apr2026", label: "April 2026" },
  ];

  const yesNoOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const resumeReasonOptions = [
    { value: "completed", label: "Suspension Completed" },
    { value: "resolved", label: "Issue Resolved" },
    { value: "approved", label: "Approved by Management" },
    { value: "other", label: "Other" },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // When employee is selected, auto-populate other fields
    if (field === "employee" && value) {
      // Get the full employee data
      const selectedEmployee = value.fullData || value;
      
      setFormData((prev) => ({
        ...prev,
        employee: value,
        employeeId: value.employeeId || selectedEmployee?.employeeId || selectedEmployee?.id || "",
        department: value.department || selectedEmployee?.department || "N/A",
        designation: value.designation || selectedEmployee?.designation || selectedEmployee?.workInformation?.designation || "N/A",
        currentSalary: selectedEmployee?.workInformation?.salaryDetails?.baseSalary || selectedEmployee?.salary || "",
        payCycle: selectedEmployee?.workInformation?.salaryDetails?.payCycle || selectedEmployee?.paymentCycle || "Monthly",
      }));
    }
  };

  const handleCancel = () => {
    navigate("/admin/pay-hub/stopPayroll");
  };

  const handleNext = async () => {
    try {
      // Validate required fields
      if (!formData.employee) {
        toast.error("Please select an employee");
        return;
      }

      if (!formData.stopType) {
        toast.error("Please select a stop type");
        return;
      }

      if (!formData.reason) {
        toast.error("Please select a reason");
        return;
      }

      if (!formData.effectiveFrom) {
        toast.error("Please select an effective from date");
        return;
      }

      // Extract month and year from effectiveFrom date
      const effectiveDate = new Date(formData.effectiveFrom);
      const month = effectiveDate.getMonth() + 1; // getMonth() is 0-indexed
      const year = effectiveDate.getFullYear();

      // Format the ISO date string for API
      const isoEffectiveFrom = effectiveDate.toISOString();
      
      // Format resume date if provided
      let isoResumeOn = null;
      if (formData.resumeOn) {
        const resumeDate = new Date(formData.resumeOn);
        isoResumeOn = resumeDate.toISOString();
      }

      // Build the payload object matching API structure
      const payload = {
        month: month,
        year: year,
        stopType: formData.stopType?.value || formData.stopType,
        reason: formData.reason?.value || formData.reason,
        effectiveFrom: isoEffectiveFrom,
        resumeOn: isoResumeOn,
        impactMonth: formData.impactMonth?.label || formData.impactMonth,
        stopRemarks: formData.remarks || "",
      };

      // Replace :employeeId in endpoint with actual employee ID
      const employeeId = formData.employee?.value || formData.employeeId;

      setSubmitting(true);

      // Call POST API
      const response = await stopPayroll(employeeId, payload);

      // Handle success response
      toast.success("Stop Payroll created successfully");
      console.log("Stop Payroll response:", response);
      
      // Navigate back to stop payroll list
      navigate("/admin/pay-hub/stopPayroll");
    } catch (error) {
      console.error("Error creating stop payroll:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create stop payroll";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={handleCancel}>
          ← New Stop Payroll
        </BackButton>
      </Header>

      <FormContainer>
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
                  isLoading={loadingEmployees}
                  isClearable
                />
              </SelectWrapper>
            </Col>
          </Row>
          <Row>
            <Col>
              <InputComponent
                label="Department"
                placeholder="Enter Department"
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
                labelMargin="0 0 0.625rem 0"
                height="50px"
              />
            </Col>
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
          <Row>
            <Col>
              <InputComponent
                label="Current Salary"
                placeholder="Enter Team"
                value={formData.currentSalary}
                onChange={(e) => handleChange("currentSalary", e.target.value)}
                labelMargin="0 0 0.625rem 0"
                height="50px"
              />
            </Col>
            <Col>
              <InputComponent
                label="Pay Cycle"
                placeholder="Reporting Person"
                value={formData.payCycle}
                onChange={(e) => handleChange("payCycle", e.target.value)}
                labelMargin="0 0 0.625rem 0"
                height="50px"
              />
            </Col>
          </Row>
        </Section>

        <Section>
          <SectionTitle>Stop Details</SectionTitle>
          <Row>
            <Col>
              <SelectWrapper>
                <Label>Stop Type</Label>
                <Select
                  options={stopTypeOptions}
                  value={formData.stopType}
                  onChange={(value) => handleChange("stopType", value)}
                  placeholder="Select Type"
                  styles={customSelectStyles}
                  isSearchable
                />
              </SelectWrapper>
            </Col>
            <Col>
              <SelectWrapper>
                <Label>
                  Reason<Required>*</Required>
                </Label>
                <Select
                  options={reasonOptions}
                  value={formData.reason}
                  onChange={(value) => handleChange("reason", value)}
                  placeholder="Select Type"
                  styles={customSelectStyles}
                  isSearchable
                />
              </SelectWrapper>
            </Col>
          </Row>
          <Row>
            <Col>
              <CalenderInput
                label="Effective From"
                placeholder="Select date"
                onDateSelect={(date) => handleChange("effectiveFrom", date)}
                initialDate={formData.effectiveFrom}
                labelMargin="0 0 0.625rem 0"
              />
            </Col>
            <Col>
              <CalenderInput
                label="Resume On (Optional)"
                placeholder="Select date"
                onDateSelect={(date) => handleChange("resumeOn", date)}
                initialDate={formData.resumeOn}
                labelMargin="0 0 0.625rem 0"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <SelectWrapper>
                <Label>Impact Month</Label>
                <Select
                  options={monthOptions}
                  value={formData.impactMonth}
                  onChange={(value) => handleChange("impactMonth", value)}
                  placeholder="March 2026"
                  styles={customSelectStyles}
                  isSearchable
                />
              </SelectWrapper>
            </Col>
            <Col>
              <InputComponent
                label="Remarks"
                placeholder="Enter Remarks"
                value={formData.remarks}
                onChange={(e) => handleChange("remarks", e.target.value)}
                labelMargin="0 0 0.625rem 0"
                height="50px"
              />
            </Col>
          </Row>
        </Section>

        <Section>
          <SectionTitle>Resume Payroll</SectionTitle>
          <Row>
            <Col>
              <SelectWrapper>
                <Label>Stop Type</Label>
                <Select
                  options={stopTypeOptions}
                  value={formData.resumeStopType}
                  onChange={(value) => handleChange("resumeStopType", value)}
                  placeholder="Select Type"
                  styles={customSelectStyles}
                  isSearchable
                />
              </SelectWrapper>
            </Col>
            <Col>
              <SelectWrapper>
                <Label>Reason</Label>
                <Select
                  options={reasonOptions}
                  value={formData.resumeReason}
                  onChange={(value) => handleChange("resumeReason", value)}
                  placeholder="Select Reason"
                  styles={customSelectStyles}
                  isSearchable
                />
              </SelectWrapper>
            </Col>
          </Row>
          <Row>
            <Col>
              <CalenderInput
                label="Resume Date"
                placeholder="Select date"
                onDateSelect={(date) => handleChange("resumeDate", date)}
                initialDate={formData.resumeDate}
                labelMargin="0 0 0.625rem 0"
              />
            </Col>
            <Col>
              <SelectWrapper>
                <Label>Resume Reason</Label>
                <Select
                  options={resumeReasonOptions}
                  value={formData.resumeReasonText}
                  onChange={(value) => handleChange("resumeReasonText", value)}
                  placeholder="Select Reason"
                  styles={customSelectStyles}
                  isSearchable
                />
              </SelectWrapper>
            </Col>
          </Row>
          <Row>
            <Col>
              <SelectWrapper>
                <Label>Adjust Arrears</Label>
                <Select
                  options={yesNoOptions}
                  value={formData.adjustArrears}
                  onChange={(value) => handleChange("adjustArrears", value)}
                  placeholder="Yes"
                  styles={customSelectStyles}
                  isSearchable
                />
              </SelectWrapper>
            </Col>
            <Col>
              <SelectWrapper>
                <Label>Pay Pending Salary</Label>
                <Select
                  options={yesNoOptions}
                  value={formData.payPendingSalary}
                  onChange={(value) => handleChange("payPendingSalary", value)}
                  placeholder="Yes"
                  styles={customSelectStyles}
                  isSearchable
                />
              </SelectWrapper>
            </Col>
          </Row>
          <Row>
            <Col>
              <InputComponent
                label="Comments"
                placeholder="Reporting Person"
                value={formData.comments}
                onChange={(e) => handleChange("comments", e.target.value)}
                labelMargin="0 0 0.625rem 0"
                height="50px"
              />
            </Col>
          </Row>
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
            text={submitting ? "Submitting..." : "Next"}
            bg={theme.colors.primary}
            color={theme.colors.white}
            width="150px"
            radius="0.5rem"
            fontSize="0.875rem"
            fontWeight="600"
            fontFamily="Inter-SemiBold"
            onClick={handleNext}
            disabled={submitting}
          />
        </ButtonRow>
      </FormContainer>
    </Container>
  );
};

export default NewStopPayroll;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.125rem;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;

  &:hover {
    opacity: 0.7;
  }
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

const Required = styled.span`
  color: #EF4444;
  margin-left: 0.25rem;
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import Select from "react-select";
import { customSelectStyles } from "../../theme/reactSelectStyles";
import InputComponent from "../../components/InputComponent";
import CalenderInput from "../../components/CalenderInput";
import Button from "../../components/Button";

const AddHoliday = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    month: "",
    date: "",
    name: "",
    people: "",
    leaveType: "",
    nextWorkingDay: "",
    remarks: "",
  });

  const monthOptions = [
    { value: "january", label: "January" },
    { value: "february", label: "February" },
    { value: "march", label: "March" },
    { value: "april", label: "April" },
    { value: "may", label: "May" },
    { value: "june", label: "June" },
    { value: "july", label: "July" },
    { value: "august", label: "August" },
    { value: "september", label: "September" },
    { value: "october", label: "October" },
    { value: "november", label: "November" },
    { value: "december", label: "December" },
  ];

  const peopleOptions = [
    { value: "all", label: "All Employees" },
    { value: "staff", label: "Staff Only" },
    { value: "employees", label: "Employees Only" },
  ];

  const leaveTypeOptions = [
    { value: "shift1", label: "Shift 1" },
    { value: "shift2", label: "Shift 2" },
    { value: "shift3", label: "Shift 3" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    navigate("/admin/time-hub/dayOffHolidays");
  };

  const handleSave = () => {
    // Validate required fields
    if (!formData.month || !formData.date || !formData.name) {
      alert("Please fill in all required fields");
      return;
    }

    // Create new holiday object
    const newHoliday = {
      id: Date.now(),
      month: formData.month,
      date: formData.date,
      name: formData.name,
      people: formData.people,
      leaveType: formData.leaveType,
      nextWorkingDay: formData.nextWorkingDay,
      remarks: formData.remarks,
    };

    console.log("Holiday saved:", newHoliday);
    
    // Navigate back with the new holiday data
    navigate("/admin/time-hub/dayOffHolidays", { state: { newHoliday } });
  };

  return (
    <>
    <Container>
        <Title>Holiday Details</Title>

        <FormGrid>
          <FormGroup>
            <FieldLabel>Month</FieldLabel>
            <Select
              options={monthOptions}
              value={monthOptions.find((opt) => opt.value === formData.month)}
              onChange={(option) => handleInputChange("month", option?.value)}
              placeholder="Select Month"
              styles={customSelectStyles}
            />
          </FormGroup>

          <FormGroup>
            <CalenderInput
              label="Date"
              onDateSelect={(value) => handleInputChange("date", value)}
              initialDate={formData.date}
              labelMargin="0 0 0.625rem 0"
            />
          </FormGroup>

          <FormGroup>
            <InputComponent
              label="Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Holiday event"
              labelMargin="0 0 0.625rem 0"
              height="45px"
            />
          </FormGroup>

          <FormGroup>
            <FieldLabel>People</FieldLabel>
            <Select
              options={peopleOptions}
              value={peopleOptions.find((opt) => opt.value === formData.people)}
              onChange={(option) => handleInputChange("people", option?.value)}
              placeholder="Select People"
              styles={customSelectStyles}
            />
          </FormGroup>

          <FormGroup>
            <FieldLabel>Leave Type</FieldLabel>
            <Select
              options={leaveTypeOptions}
              value={leaveTypeOptions.find((opt) => opt.value === formData.leaveType)}
              onChange={(option) => handleInputChange("leaveType", option?.value)}
              placeholder="Select Shift"
              styles={customSelectStyles}
            />
          </FormGroup>

          <FormGroup>
            <CalenderInput
              label="Next Working Day"
              onDateSelect={(value) => handleInputChange("nextWorkingDay", value)}
              initialDate={formData.nextWorkingDay}
              labelMargin="0 0 0.625rem 0"
            />
          </FormGroup>
        </FormGrid>

        <FormGroup $fullWidth>
          <FieldLabel>Remarks (Optional)</FieldLabel>
          <TextArea
            value={formData.remarks}
            onChange={(e) => handleInputChange("remarks", e.target.value)}
            placeholder="Enter Remarks"
            rows={4}
          />
        </FormGroup>

    </Container>
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
    </>
  );
};

export default AddHoliday;

const Container = styled.div`
  width: 80%;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0 0 2rem 0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: ${(props) => (props.$fullWidth ? "1 / -1" : "auto")};
`;

const FieldLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Inter_18pt-Medium", sans-serif;
  color: ${theme.colors.textColor};
  margin-bottom: 0.5rem;
  display: block;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: "Inter", sans-serif;
  color: ${theme.colors.textColor};
  resize: vertical;
  
  &::placeholder {
    color: ${theme.colors.secondaryText};
  }
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
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

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import Select from "react-select";
import { customSelectStyles } from "../../theme/reactSelectStyles";
import InputComponent from "../../components/InputComponent";
import CalenderInput from "../../components/CalenderInput";
import Button from "../../components/Button";
import { patch, post } from "../../helpers/api_helper";
import { CREATE_HOLIDAY } from "../../helpers/url_helper";
import { toast } from "react-toastify";

const AddHoliday = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editHoliday = location.state?.mode === "edit" ? location.state.holiday : null;
  const [formData, setFormData] = useState({
    month: editHoliday?.month || (editHoliday?.date ? new Date(editHoliday.date).getMonth() + 1 : ""),
    date: editHoliday?.date || "",
    holidayTitle: editHoliday?.holidayTitle || "",
    people: [],
    description: editHoliday?.description || "",
    nextWorkingDay: editHoliday?.nextWorkingDay || "",
    Remarks: editHoliday?.Remarks || editHoliday?.remarks || "",
    status: editHoliday?.status ?? true,
    holidayImage: editHoliday?.holidayImage || "",
  });
  const [loading, setLoading] = useState(false);

  const monthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const descriptionOptions = [
    { value: "National Holiday", label: "National Holiday" },
    { value: "Festival", label: "Festival" },
    { value: "Company Holiday", label: "Company Holiday" },
    { value: "Special Day", label: "Special Day" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    navigate("/admin/time-hub/dayOffHolidays");
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.month || !formData.date || !formData.holidayTitle) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      // Format dates to ISO string format
      const dateObj = new Date(formData.date);
      const nextWorkingDayObj = formData.nextWorkingDay ? new Date(formData.nextWorkingDay) : null;

      // Create payload matching API spec
      const payload = {
        holidayTitle: formData.holidayTitle,
        description: formData.description,
        month: formData.month,
        date: dateObj.toISOString(),
        nextWorkingDay: nextWorkingDayObj ? nextWorkingDayObj.toISOString() : null,
        status: formData.status,
        holidayImage: formData.holidayImage,
        Remarks: formData.Remarks,
      };

      // Submit to API
      const holidayId = editHoliday?.id || editHoliday?._id;
      const response = editHoliday ? await patch(`${CREATE_HOLIDAY}/${holidayId}`, payload) : await post(CREATE_HOLIDAY, payload);

      if (response) {
        toast.success(`Holiday ${editHoliday ? "updated" : "created"} successfully`);
        navigate("/admin/time-hub/dayOffHolidays");
      } else {
        toast.error(`Failed to ${editHoliday ? "update" : "create"} holiday`);
      }
    } catch (error) {
      console.error("Error creating holiday:", error);
      toast.error(error?.response?.data?.message || "Error creating holiday");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Container>
        <Title>{editHoliday ? "Edit Holiday" : "Holiday Details"}</Title>

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
              label="Holiday Title"
              value={formData.holidayTitle}
              onChange={(e) => handleInputChange("holidayTitle", e.target.value)}
              placeholder="e.g., New Year"
              labelMargin="0 0 0.625rem 0"
              height="45px"
            />
          </FormGroup>

          <FormGroup>
            <FieldLabel>Description</FieldLabel>
            <Select
              options={descriptionOptions}
              value={descriptionOptions.find((opt) => opt.value === formData.description)}
              onChange={(option) => handleInputChange("description", option?.value)}
              placeholder="Select Description"
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

          <FormGroup>
            <InputComponent
              label="Holiday Image URL (Optional)"
              value={formData.holidayImage}
              onChange={(e) => handleInputChange("holidayImage", e.target.value)}
              placeholder="https://example.com/image.png"
              labelMargin="0 0 0.625rem 0"
              height="45px"
            />
          </FormGroup>
        </FormGrid>

        <FormGroup $fullWidth>
          <FieldLabel>Remarks (Optional)</FieldLabel>
          <TextArea
            value={formData.Remarks}
            onChange={(e) => handleInputChange("Remarks", e.target.value)}
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
            disabled={loading}
          />
          <Button
            text={loading ? "Saving..." : "Save"}
            bg={theme.colors.primary}
            color={theme.colors.white}
            width="150px"
            radius="0.5rem"
            fontSize="0.875rem"
            fontWeight="600"
            fontFamily="Inter-SemiBold"
            onClick={handleSave}
            disabled={loading}
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

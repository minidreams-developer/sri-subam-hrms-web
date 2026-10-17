import { useState, useEffect } from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import { createSeriesConfiguration, updateSeriesConfiguration } from "../services/apiServices";
import { toast } from "react-toastify";

const AddNewSeries = ({ onClose, onSave, initialData, mode = "add" }) => {
  const [formData, setFormData] = useState({
    seriesName: "",
    voucherType: "",
    prefix: "",
    suffix: "",
    startingNo: "",
    lengthOfZero: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const isViewMode = mode === "view";

  useEffect(() => {
    if (!initialData) return;
    setFormData({
      seriesName: initialData.seriesName || "",
      voucherType: initialData.voucherType || "",
      prefix: initialData.prefix || "",
      suffix: initialData.suffix || "",
      startingNo: initialData.startingNo === null || initialData.startingNo === undefined
        ? ""
        : String(initialData.startingNo),
      lengthOfZero: initialData.lengthOfZero === null || initialData.lengthOfZero === undefined
        ? ""
        : String(initialData.lengthOfZero),
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.seriesName.trim()) {
      newErrors.seriesName = "Series Name is required";
    }
    if (!formData.prefix.trim()) {
      newErrors.prefix = "Prefix is required";
    }
    if (!formData.startingNo.trim()) {
      newErrors.startingNo = "Starting No is required";
    }
    return newErrors;
  };

  const handleSave = async () => {
    if (isViewMode) return;
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      
      // Prepare payload - convert startingNo and lengthOfZero to numbers
      const payload = {
        seriesName: formData.seriesName,
        voucherType: formData.voucherType || undefined,
        prefix: formData.prefix,
        suffix: formData.suffix || undefined,
        startingNo: parseInt(formData.startingNo) || 1,
        lengthOfZero: formData.lengthOfZero ? parseInt(formData.lengthOfZero) : undefined,
      };

      // Remove undefined values
      Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

      const seriesId = initialData?._id || initialData?.id || initialData?.seriesId;
      const response = mode === "edit"
        ? await updateSeriesConfiguration(seriesId, payload)
        : await createSeriesConfiguration(payload);
      
      toast.success(mode === "edit" ? "Series updated successfully!" : "Series added successfully!");
      onSave(response);
      
      // Reset form
      setFormData({
        seriesName: "",
        voucherType: "",
        prefix: "",
        suffix: "",
        startingNo: "",
        lengthOfZero: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error saving series:", error);
      toast.error(
        error.response?.data?.message || "Failed to save series"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      seriesName: "",
      voucherType: "",
      prefix: "",
      suffix: "",
      startingNo: "",
      lengthOfZero: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Container>
      <PageTitle>{isViewMode ? "View Series" : mode === "edit" ? "Edit Series" : "Auto Numbering Info"}</PageTitle>
      <ContentArea>
        <FormGrid>
          <FormGroup>
            <Label>
              Series Name
              <Required>*</Required>
            </Label>
            <Input
              type="text"
              name="seriesName"
              placeholder="Series Name"
              value={formData.seriesName}
              onChange={handleChange}
              readOnly={isViewMode}
              $hasError={!!errors.seriesName}
            />
            {errors.seriesName && (
              <ErrorText>{errors.seriesName}</ErrorText>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Voucher Type</Label>
            <Input
              type="text"
              name="voucherType"
              placeholder="Enter Name"
              value={formData.voucherType}
              onChange={handleChange}
              readOnly={isViewMode}
            />
          </FormGroup>

          <FormGroup>
            <Label>
              Prefix
              <Required>*</Required>
            </Label>
            <Input
              type="text"
              name="prefix"
              placeholder="Prefix"
              value={formData.prefix}
              onChange={handleChange}
              readOnly={isViewMode}
              $hasError={!!errors.prefix}
            />
            {errors.prefix && <ErrorText>{errors.prefix}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>Suffix</Label>
            <Input
              type="text"
              name="suffix"
              placeholder="Suffix"
              value={formData.suffix}
              onChange={handleChange}
              readOnly={isViewMode}
            />
          </FormGroup>

          <FormGroup>
            <Label>
              Starting No
              <Required>*</Required>
            </Label>
            <Input
              type="text"
              name="startingNo"
              placeholder="Starting no"
              value={formData.startingNo}
              onChange={handleChange}
              readOnly={isViewMode}
              $hasError={!!errors.startingNo}
            />
            {errors.startingNo && (
              <ErrorText>{errors.startingNo}</ErrorText>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Length of Zero</Label>
            <Input
              type="text"
              name="lengthOfZero"
              placeholder="Length of Zero"
              value={formData.lengthOfZero}
              onChange={handleChange}
              readOnly={isViewMode}
            />
          </FormGroup>
        </FormGrid>
      </ContentArea>

      <ButtonGroup>
        <CancelButton onClick={handleCancel} disabled={isLoading}>Cancel</CancelButton>
        {!isViewMode && (
          <SaveButton onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </SaveButton>
        )}
      </ButtonGroup>
    </Container>
  );
};

export default AddNewSeries;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 0;
`;

const PageTitle = styled.h1`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0;
  flex-shrink: 0;
`;

const ContentArea = styled.div`
  background: transparent;
  padding: 0;
  border-radius: 0;
  box-shadow: none;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 40% 40%;
  gap: 2rem 3rem;
  row-gap: 2.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

const Label = styled.label`
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  color: #333;
  letter-spacing: 0.3px;
`;

const Required = styled.span`
  color: #ef4444;
  margin-left: 0.25rem;
`;

const Input = styled.input`
  padding: 0.625rem 0.875rem;
  border: 1px solid ${(props) => (props.$hasError ? "#ef4444" : "#e5e5e5")};
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-family: "Inter-Regular", sans-serif;
  color: ${theme.colors.textColor};
  background: #ffff;
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: #bbb;
  }

  &:focus {
    border-color: ${(props) =>
      props.$hasError ? "#ef4444" : theme.colors.primary};
    background: #f5f5f5;
    box-shadow: 0 0 0 3px ${(props) =>
      props.$hasError ? "rgba(239, 68, 68, 0.1)" : "rgba(0, 128, 128, 0.1)"};
  }
`;

const ErrorText = styled.span`
  font-size: 0.75rem;
  color: #ef4444;
  font-family: "Inter-Regular", sans-serif;
  margin-top: 0.25rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e5e5;
`;

const CancelButton = styled.button`
  padding: 0.625rem 1.5rem;
  border: 1.5px solid ${theme.colors.primary};
  background: white;
  color: ${theme.colors.primary};
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 8rem;

  &:hover:not(:disabled) {
    background: #f9f9f9;
  }

  &:active:not(:disabled) {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SaveButton = styled.button`
  padding: 0.625rem 1.5rem;
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 8rem;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:active:not(:disabled) {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

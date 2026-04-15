import { useState } from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import UploadIcon from "../assets/images/employee/upload-filled.svg";

const UploadComponent = ({ label, onFileSelect, showKeepOriginal = true, isEditable = false, onLabelChange }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [keepOriginal, setKeepOriginal] = useState(false);
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [editedLabel, setEditedLabel] = useState(label);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (onFileSelect) {
        onFileSelect(file, keepOriginal);
      }
    }
  };

  const handleCheckboxChange = (e) => {
    setKeepOriginal(e.target.checked);
  };

  const handleLabelEdit = () => {
    if (isEditable) {
      setIsEditingLabel(true);
    }
  };

  const handleLabelSave = () => {
    setIsEditingLabel(false);
    if (onLabelChange) {
      onLabelChange(editedLabel);
    }
  };

  const handleLabelKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLabelSave();
    }
  };

  return (
    <Container>
      {isEditingLabel ? (
        <LabelInput
          type="text"
          value={editedLabel}
          onChange={(e) => setEditedLabel(e.target.value)}
          onBlur={handleLabelSave}
          onKeyPress={handleLabelKeyPress}
          autoFocus
        />
      ) : (
        <Label onClick={handleLabelEdit} $editable={isEditable}>
          {editedLabel || label}
        </Label>
      )}
      <UploadArea>
        <input
          type="file"
          id={`upload-${label}`}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <label htmlFor={`upload-${label}`} style={{ cursor: "pointer", width: "100%", height: "100%" }}>
          <UploadContent>
            <IconWrapper>
              <img src={UploadIcon} alt="upload" />
            </IconWrapper>
            <UploadText>Add File</UploadText>
          </UploadContent>
        </label>
      </UploadArea>
      {showKeepOriginal && (
        <CheckboxWrapper>
          <Checkbox
            type="checkbox"
            id={`keep-original-${label}`}
            checked={keepOriginal}
            onChange={handleCheckboxChange}
          />
          <CheckboxLabel htmlFor={`keep-original-${label}`}>
            Keep Original
          </CheckboxLabel>
        </CheckboxWrapper>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const Label = styled.p`
  font-size: 1rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 400;
  line-height: 160%;
  color: ${theme.colors.textColor};
  margin: 0 0 0.625rem 0;
  cursor: ${(props) => (props.$editable ? 'pointer' : 'default')};
  
  ${(props) => props.$editable && `
    &:hover {
      color: ${theme.colors.primary};
    }
  `}
`;

const LabelInput = styled.input`
  font-size: 1rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 400;
  line-height: 160%;
  color: ${theme.colors.textColor};
  margin: 0 0 0.625rem 0;
  padding: 0.25rem 0.5rem;
  border: 1px solid ${theme.colors.primary};
  border-radius: 0.25rem;
  width: 100%;
  
  &:focus {
    outline: none;
  }
`;

const UploadArea = styled.div`
  width: 100%;
  height: 3rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 0.625rem;
  background: ${theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${theme.colors.primary};
    background: #f9fafb;
  }
`;

const UploadContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  height: 100%;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const UploadText = styled.p`
  font-size: 0.875rem;
  font-family: "Inter-SemiBold", sans-serif;
  font-weight: 600;
  line-height: 160%;
  letter-spacing: 0%;
  text-align: center;
  color: ${theme.colors.primary};
  margin: 0;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-top: 1rem;
`;

const Checkbox = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  accent-color: ${theme.colors.primary};
  border-radius: 4px;
  background-color: ${theme.colors.bgColor};
`;

const CheckboxLabel = styled.label`
  font-size: 1rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 400;
  color: ${theme.colors.textColor};
  cursor: pointer;
  user-select: none;
`;

export default UploadComponent;

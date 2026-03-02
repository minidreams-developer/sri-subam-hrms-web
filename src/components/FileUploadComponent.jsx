import React, { useEffect, useState } from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import EyeIcon from "../assets/images/employee/eye.svg";
import CrossIcon from "../assets/images/employee/cross.svg";
import DocIcon from "../assets/images/employee/document.svg";

const FileUploadComponent = ({
  label = "File Name",
  fileName = "",
  fileType,
  onView,
  onRemove,
  showEye = true,
  showCross = false,
  showKeepOriginal = false,
  keepOriginal = false,
  onKeepOriginalChange,
}) => {
  const [localName, setLocalName] = useState(fileName);
  const [labelText, setLabelText] = useState(label);

  useEffect(() => {
    setLocalName(fileName);
    const ext = String(fileName || "")
      .split(".")
      .pop()
      .toLowerCase();
    let type =
      fileType ||
      (ext
        ? ext === "pdf"
          ? "PDF"
          : ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)
            ? "Image"
            : ["doc", "docx"].includes(ext)
              ? "Word"
              : ["xls", "xlsx"].includes(ext)
                ? "Excel"
                : ["txt"].includes(ext)
                  ? "Text"
                  : ext.toUpperCase()
        : label);
    setLabelText(type);
  }, [fileName]);

  const handleView = () => {
    if (onView) {
      onView();
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
  };

  const handleCheckboxChange = (e) => {
    if (onKeepOriginalChange) {
      onKeepOriginalChange(e.target.checked);
    }
  };

  return (
    <Wrapper>
      {labelText && <Label>{labelText}</Label>}
      <BoxWrapper>
        <Box>
          <Left>
            <DocBadge src={DocIcon} alt="doc" width="16" height="16" />
            <FileName>{localName || "File Name"}</FileName>
          </Left>
          {showEye && (
            <EyeButton
              onClick={(e) => {
                e.stopPropagation();
                handleView();
              }}
              src={EyeIcon}
              alt="view"
              width="16"
              height="16"
            />
          )}
        </Box>
        {showCross && (
          <CrossButton
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            src={CrossIcon}
            alt="remove"
            width="16"
            height="16"
          />
        )}
      </BoxWrapper>
      {showKeepOriginal && (
        <CheckboxWrapper>
          <Checkbox
            type="checkbox"
            id={`keep-original-${fileName}`}
            checked={keepOriginal}
            onChange={handleCheckboxChange}
          />
          <CheckboxLabel htmlFor={`keep-original-${fileName}`}>
            Keep Original
          </CheckboxLabel>
        </CheckboxWrapper>
      )}
    </Wrapper>
  );
};

export default FileUploadComponent;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Label = styled.p`
  font-size: 1rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 400;
  line-height: 160%;
  color: ${theme.colors.textColor};
  margin: 0 0 0.625rem 0;
`;

const BoxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
`;

const Box = styled.div`
  flex: 1;
  height: 48px;
  border: 1px solid ${theme.colors.border};
  background: #edf6f966;
  border-radius: 12px;
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: default;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
`;

const DocBadge = styled.img`
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const FileName = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EyeButton = styled.img`
  width: 28px;
  height: 28px;
  cursor: pointer;
`;

const CrossButton = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
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

import React, { useRef, useState } from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import EyeIcon from "../assets/images/employee/eye.svg";
import DocIcon from "../assets/images/employee/document.svg";

const FileUploadComponent = ({
  label = "File Name",
  fileName = "",
  accept = "*",
  onChange,
  onView,
}) => {
  const inputRef = useRef(null);
  const [localName, setLocalName] = useState(fileName);

  const handleBoxClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLocalName(file.name);
      onChange && onChange(file);
    }
  };

  const handleView = () => {
    if (onView) {
      onView();
      return;
    }
    // fallback preview when a file was recently chosen
    const file = inputRef.current?.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Wrapper>
      {label && <Label>{label}</Label>}
      <Box onClick={handleBoxClick} role="button" tabIndex={0}>
        <Left>
          <DocBadge src={DocIcon} alt="doc" width="16" height="16" />
          <FileName>{localName || "File Name"}</FileName>
        </Left>
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
        <HiddenInput
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
        />
      </Box>
    </Wrapper>
  );
};

export default FileUploadComponent;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0 0 0.3rem 0;
`;

const Box = styled.div`
  width: 100%;
  min-height: 48px;
  border: 1px solid ${theme.colors.border};
  background: #edf6f966;
  border-radius: 12px;
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
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

const HiddenInput = styled.input`
  display: none;
`;

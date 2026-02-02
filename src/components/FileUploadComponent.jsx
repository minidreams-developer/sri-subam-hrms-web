import React, { useEffect, useState } from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import EyeIcon from "../assets/images/employee/eye.svg";
import DocIcon from "../assets/images/employee/document.svg";

const FileUploadComponent = ({
  label = "File Name",
  fileName = "",
  fileType,
  onView,
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

  return (
    <Wrapper>
      {labelText && <Label>{labelText}</Label>}
      <Box>
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

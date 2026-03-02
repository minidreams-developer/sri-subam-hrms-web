import { useState } from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import Button from "./Button";

const AddNewFieldModal = ({ isOpen, onClose, onSubmit }) => {
  const [documentName, setDocumentName] = useState("");

  const handleSubmit = () => {
    if (documentName.trim()) {
      onSubmit(documentName.trim());
      setDocumentName("");
      onClose();
    }
  };

  const handleCancel = () => {
    setDocumentName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={handleCancel}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Add New Field</Title>
          <CloseButton onClick={handleCancel}>×</CloseButton>
        </Header>
        
        <Content>
          <Label>Document Name</Label>
          <Input
            type="text"
            placeholder="Enter Document Name"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
        </Content>

        <ButtonRow>
          <Button
            text="Cancel"
            bg="transparent"
            color={theme.colors.primary}
            border={`1px solid ${theme.colors.primary}`}
            width="48%"
            radius="0.5rem"
            fontSize="1rem"
            fontWeight="600"
            fontFamily="Inter-SemiBold"
            onClick={handleCancel}
          />
          <Button
            text="Next"
            bg={theme.colors.primary}
            color={theme.colors.white}
            width="48%"
            radius="0.5rem"
            fontSize="1rem"
            fontWeight="600"
            fontFamily="Inter-SemiBold"
            onClick={handleSubmit}
          />
        </ButtonRow>
      </ModalContainer>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: ${theme.colors.white};
  border-radius: 1rem;
  width: 90%;
  max-width: 27.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${theme.colors.border};
`;

const Title = styled.h2`
  font-size: 1rem;
  font-family: "Inter-SemiBold", sans-serif;
  font-weight: 600;
  line-height: 160%;
  letter-spacing: 0%;
  color: ${theme.colors.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 2rem;
  color: ${theme.colors.textGray || "#9ca3af"};
  cursor: pointer;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: ${theme.colors.textColor};
  }
`;

const Content = styled.div`
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: block;
  font-size: 1rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 500;
  color: ${theme.colors.textColor};
  margin-bottom: 0.75rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 0.625rem;
  font-size: 1rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  color: ${theme.colors.textColor};
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${theme.colors.primary};
  }

  &::placeholder {
    color: ${theme.colors.textGray || "#9ca3af"};
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
`;

export default AddNewFieldModal;

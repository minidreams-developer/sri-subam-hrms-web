import React, { useState } from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import CalenderInput from "./CalenderInput";
import Button from "./Button";

const SelectDateModal = ({ isOpen, onClose, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleConfirm = () => {
    if (selectedDate) {
      onConfirm(selectedDate);
      setSelectedDate(null);
    }
  };

  const handleClose = () => {
    setSelectedDate(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <Overlay onClick={handleClose} />
      <ModalContainer>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Select Date</ModalTitle>
            <CloseButton onClick={handleClose}>×</CloseButton>
          </ModalHeader>

          <ModalBody>
            <FieldWrapper>
              <Label>Date</Label>
              <CalenderInput
                label=""
                onDateSelect={setSelectedDate}
                initialDate={selectedDate}
                labelMargin="0"
              />
            </FieldWrapper>

            <InfoText>
              These timings are applicable only on the selected day for all employees.
            </InfoText>
          </ModalBody>

          <ModalFooter>
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
              onClick={handleClose}
            />
            <Button
              text="Confirm"
              bg={theme.colors.primary}
              color={theme.colors.white}
              width="150px"
              radius="0.5rem"
              fontSize="0.875rem"
              fontWeight="600"
              fontFamily="Inter-SemiBold"
              onClick={handleConfirm}
              disabled={!selectedDate}
            />
          </ModalFooter>
        </ModalContent>
      </ModalContainer>
    </>
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
  z-index: 999;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${theme.colors.white};
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${theme.colors.textGray};
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${theme.colors.textColor};
  }
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.primaryGreen};
`;

const InfoText = styled.p`
  font-size: 0.875rem;
  font-weight: 400;
  font-family: "Inter", sans-serif;
  color: ${theme.colors.textGray};
  margin: 0;
  line-height: 1.5;
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${theme.colors.border};
`;

export default SelectDateModal;

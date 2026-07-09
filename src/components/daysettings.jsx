import React, { useState } from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import TimePickerComponent from "./TimePickerComponent";
import Button from "./Button";
import EditIcon from "../assets/images/employee/editIcon.svg";
import SelectDateModal from "./SelectDateModal";

const DaySettings = ({ onSave, onCancel, initialData = {}, isLoading = false }) => {
  const [dayStart, setDayStart] = useState(initialData.dayStart || null);
  const [dayEnd, setDayEnd] = useState(initialData.dayEnd || null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDateForOneDay, setSelectedDateForOneDay] = useState(null);

  const handleSave = () => {
    if (onSave && !isLoading) {
      onSave({
        dayStart,
        dayEnd,
        selectedDateForOneDay,
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedDateForOneDay(null);
    if (onCancel) {
      onCancel();
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleForOneDay = () => {
    setShowDateModal(true);
  };

  const handleDateModalClose = () => {
    setShowDateModal(false);
  };

  const handleDateModalConfirm = (date) => {
    // Format date to YYYY-MM-DD format for API
    const formattedDate = date instanceof Date 
      ? date.toISOString().split('T')[0]
      : date;
    setSelectedDateForOneDay(formattedDate);
    setShowDateModal(false);
    console.log("Selected date for one day:", formattedDate);
  };

  return (
    <Container>
      <SelectDateModal
        isOpen={showDateModal}
        onClose={handleDateModalClose}
        onConfirm={handleDateModalConfirm}
      />

      <Header>
        <Title>Personal Information</Title>
        {!isEditing && (
          <EditButton onClick={handleEditClick}>
            <img src={EditIcon} alt="edit" width="16" height="16" />
            <span>Edit Timings</span>
          </EditButton>
        )}
      </Header>

      <Content>
        <FieldsGrid>
          <FieldColumn>
            <TimePickerComponent
              label="Day Starts"
              placeholder="08:00 AM"
              initialTime={dayStart}
              onTimeSelect={setDayStart}
            />
          </FieldColumn>
          <FieldColumn>
            <TimePickerComponent
              label="Day End"
              placeholder="Select Day End Timing"
              initialTime={dayEnd}
              onTimeSelect={setDayEnd}
            />
          </FieldColumn>
        </FieldsGrid>
      </Content>

      <Footer>
        {isEditing && (
          <ForOneDayButton onClick={handleForOneDay}>
            For one day
          </ForOneDayButton>
        )}
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
          disabled={isLoading}
        />
        <Button
          text={isLoading ? "Saving..." : "Save"}
          bg={theme.colors.primary}
          color={theme.colors.white}
          width="150px"
          radius="0.5rem"
          fontSize="0.875rem"
          fontWeight="600"
          fontFamily="Inter-SemiBold"
          onClick={handleSave}
          disabled={isLoading}
        />
      </Footer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  background: ${theme.colors.white};
  border-radius: 12px;
  border: 1px solid ${theme.colors.border};
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0;
`;

const EditButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  height: 40px;
  padding: 0 0.875rem;
  background: ${theme.colors.secondaryPrimary};
  border: none;
  border-radius: 0.5rem;
  color: ${theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;

  img {
    width: 1rem;
    height: 1rem;
  }
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 200px;
`;

const FieldsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FieldColumn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${theme.colors.border};
  width: 100%;
`;

const ForOneDayButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 1.5rem;
  background: transparent;
  border: 1px solid ${theme.colors.primary};
  border-radius: 0.5rem;
  color: ${theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: auto;

  &:hover {
    background: ${theme.colors.secondaryPrimary};
  }
`;

export default DaySettings;

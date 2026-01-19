import React, { useEffect, useRef, useState } from "react";
import theme from "../theme/theme";
import styled from "styled-components";
import CalenderIcon from "../assets/images/Race Manage/calendarIcon.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CalenderInput = ({ onDateSelect, initialDate }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const datePickerRef = useRef(null);

  useEffect(() => {
    if (initialDate) {
      // Ensure we have a valid Date object
      const date = new Date(initialDate);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        onDateSelect(date);
      }
    }
  }, []);

  const handleIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setFocus();
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  return (
    <FieldWrapper>
      <Label>Date</Label>
      <InputWrapper>
        <img src={CalenderIcon} alt="icon" onClick={handleIconClick} />
        <StyledDatePicker
          ref={datePickerRef}
          selected={selectedDate}
          onChange={handleDateChange}
          placeholderText="Select Date"
          dateFormat="dd/MM/yyyy"
          popperPlacement="bottom-start"
        />
      </InputWrapper>
    </FieldWrapper>
  );
};

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  font-size: 0.875rem;
  font-family: "Metropolis-Medium", sans-serif;
  padding: 0.875rem;
  border: none;
  outline: none;
  background: transparent;
`;

const Label = styled.p`
  font-size: 0.875rem;
  font-family: "Metropolis-Medium", sans-serif;
  font-weight: 500;
  line-height: 160%;
  color: ${theme.colors.primaryGreen};
  margin: 1rem 0 0.625rem 0;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  &:focus-within ${Label} {
    color: ${theme.colors.primary};
  }
`;

const InputWrapper = styled.div`
  position: relative;
  /* max-width: 25rem; */
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 6px;
  border: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.white};

  &:focus-within {
    border: 1px solid ${theme.colors.primaryGreen};
  }

  transition: border 0.3s ease;

  img {
    position: absolute;
    right: 0.5rem;
    width: 2rem;
    height: 2rem;
    cursor: pointer;
  }
`;

const Input = styled.input`
  width: 100%;
  font-size: 0.875rem;
  font-family: "Metropolis-Medium", sans-serif;
  font-weight: 400;
  line-height: 160%;
  color: ${theme.colors.textColor};
  padding: 0.875rem;
  border: none;
  border-radius: 6px;
  outline: none;

  ::placeholder {
    font-family: "Metropolis-Medium", sans-serif;
    opacity: 1;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  font-size: 0.875rem;
  font-family: "Metropolis-Medium", sans-serif;
  font-weight: 400;
  line-height: 160%;
  color: ${theme.colors.textColor};
  padding: 0.875rem;
  border: none;
  border-radius: 6px;
  outline: none;
  resize: vertical;
  min-height: 5rem;

  ::placeholder {
    font-family: "Metropolis-Medium", sans-serif;
    opacity: 1;
  }
`;

export default CalenderInput;

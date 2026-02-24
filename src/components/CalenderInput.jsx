import React, { useEffect, useRef, useState } from "react";
import theme from "../theme/theme";
import styled from "styled-components";
import CalenderIcon from "../assets/images/Leave manage/calendar.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CalenderInput = ({ onDateSelect, initialDate, label = "Date", labelMargin = "1rem 0 0.625rem 0" }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const datePickerRef = useRef(null);

  useEffect(() => {
    if (initialDate) {
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
    if (onDateSelect) onDateSelect(date);
  };

  return (
    <FieldWrapper>
      <Label $margin={labelMargin}>{label}</Label>
      <InputWrapper>
        <StyledDatePicker
          ref={datePickerRef}
          selected={selectedDate}
          onChange={handleDateChange}
          placeholderText="Select Date"
          dateFormat="dd/MM/yyyy"
          popperPlacement="bottom-start"
          showPopperArrow={false}
          calendarClassName="custom-calendar"
        />
        <img src={CalenderIcon} alt="icon" onClick={handleIconClick} />
      </InputWrapper>
    </FieldWrapper>
  );
};

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  height: 100%;
  font-size: 0.875rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 500;
  color: ${theme.colors.textColor};
  padding: 0 0.875rem;
  border: none;
  outline: none;
  background: transparent;
  box-sizing: border-box;

  ::placeholder {
    color: ${theme.colors.textGray || "#9ca3af"};
    font-family: "Inter_18pt-Medium", sans-serif;
  }
`;

const Label = styled.p`
  font-size: 0.875rem;
  font-family: "Inter_18pt-Medium", sans-serif;
  font-weight: 500;
  line-height: 160%;
  color: ${theme.colors.primaryGreen};
  margin: ${(props) => props.$margin || "1rem 0 0.625rem 0"};
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  &:focus-within ${Label} {
    color: ${theme.colors.primary};
  }

  /* Custom Calendar Styles */
  .custom-calendar {
    font-family: "Inter_18pt-Medium", sans-serif;
    border: 1px solid ${theme.colors.border};
    border-radius: 0.625rem;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);

    .react-datepicker__header {
      background-color: white;
      border-bottom: 1px solid ${theme.colors.border};
      border-top-left-radius: 0.625rem;
      border-top-right-radius: 0.625rem;
    }

    .react-datepicker__day--selected,
    .react-datepicker__day--keyboard-selected {
      background-color: ${theme.colors.primary};
      color: white;
      border-radius: 50%;
    }

    .react-datepicker__day:hover {
      border-radius: 50%;
      background-color: ${theme.colors.secondaryPrimary || "#f3f4f6"};
    }

    .react-datepicker__triangle {
      display: none;
    }
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 45px;
  display: flex;
  align-items: center;
  border-radius: 0.625rem;
  border: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.searchBackground};
  transition: border 0.3s ease;

  &:focus-within {
    border: 1px solid ${theme.colors.primary};
  }

  img {
    position: absolute;
    right: 0.875rem;
    width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;
    z-index: 1;
  }

  .react-datepicker-wrapper {
    width: 100%;
    height: 100%;
  }

  .react-datepicker__input-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }
`;

export default CalenderInput;

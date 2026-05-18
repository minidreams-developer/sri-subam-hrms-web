import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import ClockIcon from "../assets/images/Leavemanage/clock-circle.svg";

const TimePickerComponent = ({
  onTimeSelect,
  initialTime,
  label = "Time",
  placeholder = "Select Time",
  labelMargin = "0 0 0.625rem 0",
}) => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [displayTime, setDisplayTime] = useState("");
  const timeListRef = useRef(null);

  // Generate time list (00:00 to 23:45 in 15-minute intervals)
  const generateTimeList = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const h = String(hour).padStart(2, "0");
        const m = String(minute).padStart(2, "0");
        const time24 = `${h}:${m}`;
        
        // Convert to 12-hour format
        let hour12 = hour;
        let period = "AM";
        if (hour >= 12) {
          period = "PM";
          if (hour > 12) hour12 = hour - 12;
        } else if (hour === 0) {
          hour12 = 12;
        }
        
        const time12 = `${String(hour12).padStart(2, "0")}:${m} ${period}`;
        times.push({ time24, time12 });
      }
    }
    return times;
  };

  const timeList = generateTimeList();

  useEffect(() => {
    if (initialTime) {
      const date = new Date(initialTime);
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const time24 = `${hours}:${minutes}`;
      
      // Convert to 12-hour format
      let hour12 = date.getHours();
      let period = "AM";
      if (hour12 >= 12) {
        period = "PM";
        if (hour12 > 12) hour12 = hour12 - 12;
      } else if (hour12 === 0) {
        hour12 = 12;
      }
      
      const time12 = `${String(hour12).padStart(2, "0")}:${minutes} ${period}`;
      setSelectedTime(time24);
      setDisplayTime(time12);
    }
  }, [initialTime]);

  const handleTimeSelect = (time24, time12) => {
    setSelectedTime(time24);
    setDisplayTime(time12);
    setIsOpen(false);
    
    // Create a date object with the selected time
    const now = new Date();
    const [hours, minutes] = time24.split(":");
    now.setHours(parseInt(hours), parseInt(minutes), 0);
    
    if (onTimeSelect) onTimeSelect(now);
  };

  const handleIconClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <FieldWrapper>
      {label && <Label>{label}</Label>}
      <InputWrapper>
        <TimeInput
          type="text"
          placeholder={placeholder}
          value={displayTime}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
        />
        <img src={ClockIcon} alt="clock" onClick={handleIconClick} />
        
        {isOpen && (
          <TimeListContainer ref={timeListRef}>
            {timeList.map((item, index) => (
              <TimeOption
                key={index}
                isSelected={selectedTime === item.time24}
                onClick={() => handleTimeSelect(item.time24, item.time12)}
              >
                {item.time12}
              </TimeOption>
            ))}
          </TimeListContainer>
        )}
      </InputWrapper>
    </FieldWrapper>
  );
};

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Label = styled.p`
  font-size: 0.875rem;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  line-height: 160%;
  color: ${theme.colors.primaryGreen};
  margin: ${(props) => props.margin || "1rem 0 0.625rem 0"};
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
`;

const TimeInput = styled.input`
  width: 100%;
  height: 100%;
  font-size: 0.875rem;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  color: ${theme.colors.textColor};
  padding: 0 0.875rem;
  border: none;
  outline: none;
  background: transparent;
  box-sizing: border-box;
  cursor: pointer;

  ::placeholder {
    color: ${theme.colors.textGray || "#9ca3af"};
    font-family: "Inter", sans-serif;
  }
`;

const TimeListContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-top: none;
  border-radius: 0 0 0.625rem 0.625rem;
  max-height: 250px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.colors.searchBackground};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.border};
    border-radius: 3px;

    &:hover {
      background: ${theme.colors.textGray};
    }
  }
`;

const TimeOption = styled.div`
  padding: 0.75rem 0.875rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  color: ${(props) => (props.isSelected ? theme.colors.white : theme.colors.textColor)};
  background: ${(props) => (props.isSelected ? theme.colors.primary : "transparent")};
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.isSelected ? theme.colors.primary : theme.colors.searchBackground)};
  }
`;

export default TimePickerComponent;

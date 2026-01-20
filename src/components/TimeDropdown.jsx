import React, { useState, useEffect } from "react";
import styled from "styled-components";

const TimeDropdown = ({
  hourPlaceholder = "",
  setFieldValue,
  fieldName,
  selectedDate,
  initialTime,
}) => {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [period, setPeriod] = useState("AM");

  // Initialize with initialTime if provided
  useEffect(() => {
    if (initialTime) {
      const date = new Date(initialTime);
      let hours = date.getHours();
      const minutes = date.getMinutes();

      // Convert to 12-hour format
      const period = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12; // Convert 0 to 12

      setHours(hours.toString().padStart(2, "0"));
      setMinutes(minutes.toString().padStart(2, "0"));
      setPeriod(period);
    }
  }, [initialTime]);

  // Update formik when time changes
  useEffect(() => {
    if (hours && minutes && selectedDate) {
      let hour24 = parseInt(hours);

      // Convert to 24-hour format
      if (period === "PM" && hour24 !== 12) {
        hour24 += 12;
      } else if (period === "AM" && hour24 === 12) {
        hour24 = 0;
      }

      const dateWithTime = new Date(selectedDate);
      dateWithTime.setHours(hour24);
      dateWithTime.setMinutes(parseInt(minutes));
      dateWithTime.setSeconds(0);

      setFieldValue(fieldName, dateWithTime.toISOString());
    }
  }, [hours, minutes, period, selectedDate, setFieldValue, fieldName]);

  const handleHoursChange = (e) => {
    const value = e.target.value;
    if (value === "" || (parseInt(value) >= 1 && parseInt(value) <= 12)) {
      setHours(value);
    }
  };

  const handleMinutesChange = (e) => {
    const value = e.target.value;
    if (value === "" || (parseInt(value) >= 0 && parseInt(value) <= 59)) {
      setMinutes(value);
    }
  };

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };

  return (
    <FieldWrapper>
      <TimeWrapper>
        <TimeInput
          type="text"
          placeholder={hourPlaceholder === "From" ? "HH" : "HH"}
          value={hours}
          onChange={handleHoursChange}
          maxLength={2}
        />
        <Colon>:</Colon>
        <TimeInput
          type="text"
          placeholder="MM"
          value={minutes}
          onChange={handleMinutesChange}
          maxLength={2}
        />
        <PeriodSelect value={period} onChange={handlePeriodChange}>
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </PeriodSelect>
      </TimeWrapper>
    </FieldWrapper>
  );
};

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TimeWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 3rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #fff;
  padding: 0 0.875rem;
  gap: 0.25rem;
`;

const TimeInput = styled.input`
  width: 2rem;
  border: none;
  outline: none;
  text-align: center;
  font-size: 0.875rem;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  color: #333;

  &::placeholder {
    color: #999;
  }
`;

const Colon = styled.span`
  font-size: 0.875rem;
  color: #333;
`;

const PeriodSelect = styled.select`
  border: none;
  outline: none;
  font-size: 0.875rem;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  color: #333;
  background: transparent;
  cursor: pointer;
`;

export default TimeDropdown;

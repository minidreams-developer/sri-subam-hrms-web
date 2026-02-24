import { useState } from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import { BsThreeDots } from "react-icons/bs";
import GreenTik from "../assets/images/Team/greenTik.svg";
import RedTik from "../assets/images/Team/redTik.svg";
import InfoTik from "../assets/images/Team/infoTik.svg";

const CalendarView = () => {
  const [currentDate] = useState(new Date());

  // Sample data for demonstration
  const calendarData = {
    "2026-01": {
      1: { type: "holiday", label: "New Year", hours: null, description: "New Year Holiday for staffs Only" },
      2: { type: "present", label: "8.23 Hrs", hours: "8.23" },
      4: { type: "half-day", label: "4.26 Hrs", hours: "4.26" },
      5: { type: "present", label: "8.23 Hrs", hours: "8.23" },
      6: { type: "present", label: "8.23 Hrs", hours: "8.23" },
      7: { type: "present", label: "8.23 Hrs", hours: "8.23" },
      8: { type: "present", label: "8.23 Hrs", hours: "8.23" },
      9: { type: "present", label: "8.23 Hrs", hours: "8.23" },
      11: { type: "present", label: "8.23 Hrs", hours: "8.23" },
      12: { type: "absent", label: "Absent", hours: null },
      14: { type: "holiday", label: "Pongal", hours: null, description: "Pongal Holiday for every staff and employees" },
      15: { type: "holiday", label: "Mattu Pongal", hours: null, description: "Pongal Holiday for every staff and employees" },
      26: { type: "holiday", label: "Republic day", hours: null, description: "Republic day Holiday for every staff and emplo..." },
    },
    "2025-12": {
      1: { type: "holiday", label: "New Year", hours: null, description: "New Year Holiday for staffs Only" },
      2: { type: "present", label: "8.23 Hrs", hours: "8.23" },
      4: { type: "half-day", label: "4.28 Hrs", hours: "4.28" },
      5: { type: "present", label: "8.23 Hrs", hours: "8.23" },
    },
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendar = (year, month) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const calendar = [];
    const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendar.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayData = calendarData[monthKey]?.[day] || null;
      calendar.push({ day, data: dayData });
    }

    return calendar;
  };

  const renderMonth = (year, month, monthName) => {
    const calendar = generateCalendar(year, month);
    const weeks = [];
    
    for (let i = 0; i < calendar.length; i += 7) {
      weeks.push(calendar.slice(i, i + 7));
    }

    return (
      <MonthSection key={`${year}-${month}`}>
        <MonthTitle>{monthName}</MonthTitle>
        <MonthGrid>
          {weeks.map((week, weekIndex) => (
            <WeekRow key={weekIndex}>
              {week.map((cell, cellIndex) => {
                if (!cell) {
                  return <DayCell key={cellIndex} $empty />;
                }

                const { day, data } = cell;
                const isWeekOff = cellIndex === 3; // Thursday as week off

                return (
                  <DayCell key={cellIndex} $weekOff={isWeekOff && !data}>
                    <DayNumber>
                      {day}
                      {data && data.type !== "present" && (
                        <DotsIcon>
                          <BsThreeDots size={14} />
                        </DotsIcon>
                      )}
                    </DayNumber>
                    {data && (
                      <>
                        <StatusBadge $type={data.type}>
                          {data.type === "present" && (
                            <TickIcon src={GreenTik} alt="present" />
                          )}
                          {data.type === "absent" && (
                            <TickIcon src={RedTik} alt="absent" />
                          )}
                          {data.type === "half-day" && (
                            <TickIcon src={InfoTik} alt="half-day" />
                          )}
                          {data.type === "holiday" && "🎉"}
                          {" "}
                          {data.label}
                        </StatusBadge>
                        {data.description && (
                          <Description>{data.description}</Description>
                        )}
                      </>
                    )}
                  </DayCell>
                );
              })}
            </WeekRow>
          ))}
        </MonthGrid>
      </MonthSection>
    );
  };

  return (
    <Container>
      <WeekDaysRow>
        <WeekDay>Sunday</WeekDay>
        <WeekDay>Monday</WeekDay>
        <WeekDay>Tuesday</WeekDay>
        <WeekDay>Wednesday</WeekDay>
        <WeekDay>Thursday</WeekDay>
        <WeekDay>Friday</WeekDay>
        <WeekDay>Saturday</WeekDay>
      </WeekDaysRow>
      {renderMonth(2026, 0, "January 2026")}
      {renderMonth(2025, 11, "December 2025")}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const WeekDaysRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #FFFFFF;
  border: 1px solid ${theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 10;
`;

const WeekDay = styled.div`
  padding: 0.75rem;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Inter_18pt-Medium", sans-serif;
  color: ${theme.colors.secondaryTextColor || "#6b7280"};
  border-right: 1px solid ${theme.colors.border};

  &:last-child {
    border-right: none;
  }
`;

const MonthSection = styled.div`
  width: 100%;
`;

const MonthTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0 0 1rem 0;
`;

const MonthGrid = styled.div`
  width: 100%;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
`;

const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid ${theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const DayCell = styled.div`
  min-height: 120px;
  padding: 0.75rem;
  border-right: 1px solid ${theme.colors.border};
  background: ${(props) => {
    if (props.$empty) return "transparent";
    if (props.$weekOff) return "repeating-linear-gradient(45deg, #f9fafb, #f9fafb 10px, #ffffff 10px, #ffffff 20px)";
    return theme.colors.white;
  }};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &:last-child {
    border-right: none;
  }
`;

const DayNumber = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DotsIcon = styled.span`
  display: flex;
  align-items: center;
  color: ${theme.colors.textColor};
  opacity: 0.5;
`;

const StatusBadge = styled.div`
  padding: 0.375rem 0.625rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  font-family: "Inter_18pt-Medium", sans-serif;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  width: fit-content;
  
  ${(props) => {
    switch (props.$type) {
      case "present":
        return `
          background: #d1fae5;
          color: #065f46;
        `;
      case "absent":
        return `
          background: #fee2e2;
          color: #991b1b;
        `;
      case "half-day":
        return `
          background: #fed7aa;
          color: #9a3412;
        `;
      case "holiday":
        return `
          background: #e0e7ff;
          color: #3730a3;
        `;
      default:
        return `
          background: #f3f4f6;
          color: ${theme.colors.textColor};
        `;
    }
  }}
`;

const TickIcon = styled.img`
  width: 0.875rem;
  height: 0.875rem;
`;

const Description = styled.p`
  font-size: 0.75rem;
  font-weight: 400;
  font-family: "Inter_18pt-Medium", sans-serif;
  color: ${theme.colors.secondaryTextColor || "#6b7280"};
  margin: 0;
  line-height: 1.4;
`;

export default CalendarView;

import React from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import EventIcon from "../assets/images/employee/calendar.svg";

const AttendanceCalendar = ({
  startYear = new Date().getFullYear(),
  endYear = 2000,
  entries,
  hashedDays,
  highlightDates,
  onReady,
}) => {
  const defaultEntries = {
    "2026-01-01": {
      type: "event",
      title: "New Year",
      desc: "New Year Holiday for staffs Only",
      color: "#FBAE7A",
    },
    "2026-01-02": { type: "hours", value: "8.23 Hrs", color: "#22C55E" },
    "2026-01-04": { type: "hours", value: "4.26 Hrs", color: "#F59E0B" },
    "2026-01-05": { type: "hours", value: "8.23 Hrs", color: "#22C55E" },
    "2026-01-08": { type: "hours", value: "8.23 Hrs", color: "#22C55E" },
    "2026-01-09": { type: "hours", value: "8.23 Hrs", color: "#22C55E" },
    "2026-01-11": { type: "hours", value: "8.23 Hrs", color: "#22C55E" },
    "2026-01-12": { type: "absent", value: "Absent", color: "#EF4444" },
    "2026-01-14": {
      type: "event",
      title: "Pongal",
      desc: "Pongal Holiday for every staff and employees",
      color: "#A78BFA",
    },
    "2026-01-15": {
      type: "event",
      title: "Mattu Pongal",
      desc: "Pongal Holiday for every staff and employees",
      color: "#A78BFA",
    },
    "2026-01-26": {
      type: "event",
      title: "Republic day",
      desc: "Republic day Holiday for every staff and employees",
      color: "#7C3AED",
    },
    "2025-12-01": {
      type: "event",
      title: "New Year",
      desc: "New Year Holiday for staffs Only",
      color: "#FBAE7A",
    },
    "2025-12-02": { type: "hours", value: "8.23 Hrs", color: "#22C55E" },
    "2025-12-04": { type: "hours", value: "4.26 Hrs", color: "#F59E0B" },
    "2025-12-05": { type: "hours", value: "8.23 Hrs", color: "#22C55E" },
  };
  const mapEntries = entries || defaultEntries;
  const hashed =
    hashedDays || new Set(["2026-01-03", "2026-01-17", "2026-01-24"]);
  const highlights = highlightDates || new Set(["2026-01-12"]);

  const years = [];
  for (let y = startYear; y >= endYear; y--) years.push(y);

  React.useEffect(() => {
    if (onReady) onReady();
  }, []);

  return (
    <Container>
      {years.map((year) => (
        <YearBlock key={year}>
          {Array.from({ length: 12 }).map((_, m) => {
            const monthCells = buildMonth(year, m);
            return (
              <MonthSection key={`${year}-${m}`}>
                <MonthTitle>
                  {monthName(m)} {year}
                </MonthTitle>
                <WeekHeader>
                  {[
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ].map((d) => (
                    <HeaderCell key={d}>{d}</HeaderCell>
                  ))}
                </WeekHeader>
                <Grid>
                  {monthCells.map((cell, idx) => (
                    <DayCell
                      key={idx}
                      $empty={!cell.date}
                      $hashed={cell.date && hashed.has(cell.date)}
                      $highlight={cell.date && highlights.has(cell.date)}
                    >
                      {cell.date && (
                        <>
                          <CellTop>
                            <DayNumber>{cell.day}</DayNumber>
                            <Dots>···</Dots>
                          </CellTop>
                          <CellContent>
                            {renderEntry(mapEntries[cell.date])}
                          </CellContent>
                        </>
                      )}
                    </DayCell>
                  ))}
                </Grid>
              </MonthSection>
            );
          })}
          <Divider />
        </YearBlock>
      ))}
    </Container>
  );
};

export default AttendanceCalendar;

function buildMonth(year, month) {
  const first = new Date(year, month, 1);
  const startOffset = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array(42)
    .fill(null)
    .map(() => ({ date: null, day: null }));
  for (let d = 1; d <= daysInMonth; d++) {
    const idx = startOffset + d - 1;
    const date = new Date(year, month, d);
    const dateStr = `${date.getFullYear()}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells[idx] = { date: dateStr, day: d };
  }
  return cells;
}

function renderEntry(entry) {
  if (!entry) return null;
  if (entry.type === "hours") {
    return <HoursChip $color={entry.color}>{entry.value}</HoursChip>;
  }
  if (entry.type === "absent") {
    return <AbsentChip>{entry.value}</AbsentChip>;
  }
  if (entry.type === "event") {
    return (
      <EventCard $color={entry.color}>
        <EventTag>
          <img src={EventIcon} alt="event" />
          <span>{entry.title}</span>
        </EventTag>
        <EventDesc>{entry.desc}</EventDesc>
      </EventCard>
    );
  }
  return null;
}

function monthName(m) {
  const names = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return names[m] || "";
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const YearBlock = styled.div`
  width: 100%;
`;

const MonthSection = styled.div`
  width: 100%;
  margin: 0 0 2rem 0;
`;

const MonthTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0 0 0 0;
  position: sticky;
  top: 0;
  z-index: 3;
  background: ${theme.colors.white};
  padding: 0.325rem 0;
`;

const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  padding: 0.5rem 0;
  position: sticky;
  top: 2rem;
  z-index: 2;
  background: ${theme.colors.white};
`;

const HeaderCell = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.secondaryTextColor};
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
`;

const DayCell = styled.div`
  min-height: 130px;
  background: ${(p) =>
    p.$empty ? theme.colors.secondaryWhite : theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  padding: 0.5rem;
  position: relative;

  ${(p) =>
    p.$hashed &&
    `
    background-image: repeating-linear-gradient(
      -45deg,
      ${theme.colors.white},
      ${theme.colors.white} 8px,
      #f4f6f8 8px,
      #f4f6f8 16px
    );
  `}

  ${(p) =>
    p.$highlight &&
    `
    box-shadow: inset 0 0 0 9999px rgba(64, 156, 255, 0.15);
    border-color: #bcd8ff;
  `}
`;

const CellTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
`;

const DayNumber = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
`;

const Dots = styled.span`
  color: ${theme.colors.secondaryTextColor};
`;

const CellContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const HoursChip = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 0.75rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${(p) => p.$color || "#22C55E"};
  border: 1.5px solid ${(p) => p.$color || "#22C55E"};
  background: ${theme.colors.white};
`;

const AbsentChip = styled(HoursChip)`
  color: #ef4444;
  border-color: #ef4444;
`;

const EventCard = styled.div`
  background: ${(p) => p.$color || "#A78BFA"};
  border-radius: 10px;
  padding: 0.5rem;
  color: ${theme.colors.white};
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const EventTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;

  img {
    width: 14px;
    height: 14px;
  }
`;

const EventDesc = styled.p`
  margin: 0;
  font-size: 0.75rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  line-height: 140%;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${theme.colors.border};
  margin: 1.25rem 0;
`;

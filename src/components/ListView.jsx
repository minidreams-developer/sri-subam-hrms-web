import { useState } from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";

const ListView = () => {
  const [expandedYears, setExpandedYears] = useState(["2025"]);
  const [expandedMonths, setExpandedMonths] = useState(["April 2025"]);

  const attendanceData = {
    2025: {
      "April 2025": {
        totalWorkingDay: 31,
        fullDays: 26,
        halfDays: 2,
        absent: 2,
        overTime: "12 Hrs",
        dayOff: 3,
        holidays: 0,
      },
      "March 2025": {
        totalWorkingDay: 31,
        fullDays: 28,
        halfDays: 1,
        absent: 1,
        overTime: "8 Hrs",
        dayOff: 2,
        holidays: 1,
      },
      "February 2025": {
        totalWorkingDay: 28,
        fullDays: 25,
        halfDays: 1,
        absent: 0,
        overTime: "10 Hrs",
        dayOff: 2,
        holidays: 0,
      },
    },
    2024: {
      "December 2024": {
        totalWorkingDay: 31,
        fullDays: 27,
        halfDays: 2,
        absent: 1,
        overTime: "15 Hrs",
        dayOff: 3,
        holidays: 1,
      },
    },
  };

  const toggleYear = (year) => {
    setExpandedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  const toggleMonth = (month) => {
    setExpandedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  };

  return (
    <Container>
      {Object.keys(attendanceData).map((year) => (
        <YearSection key={year}>
          <YearHeader onClick={() => toggleYear(year)}>
            <YearTitle>{year}</YearTitle>
            {expandedYears.includes(year) ? (
              <IoChevronUp size={20} color={theme.colors.textColor} />
            ) : (
              <IoChevronDown size={20} color={theme.colors.textColor} />
            )}
          </YearHeader>

          {expandedYears.includes(year) && (
            <MonthsContainer>
              {Object.keys(attendanceData[year]).map((month) => (
                <MonthSection key={month}>
                  <MonthHeader onClick={() => toggleMonth(month)}>
                    <MonthTitle>{month}</MonthTitle>
                    <MonthActions>
                      <EditButton onClick={(e) => e.stopPropagation()}>
                        <MdEdit size={18} color={theme.colors.primary} />
                      </EditButton>
                      {expandedMonths.includes(month) ? (
                        <IoChevronUp size={20} color={theme.colors.textColor} />
                      ) : (
                        <IoChevronDown size={20} color={theme.colors.textColor} />
                      )}
                    </MonthActions>
                  </MonthHeader>

                  {expandedMonths.includes(month) && (
                    <MonthDetails>
                      <StatsGrid>
                        <StatItem>
                          <StatLabel>Total Working Day</StatLabel>
                          <StatValue>
                            {attendanceData[year][month].totalWorkingDay}
                          </StatValue>
                        </StatItem>
                        <StatItem>
                          <StatLabel>Full Days</StatLabel>
                          <StatValue>
                            {attendanceData[year][month].fullDays}
                          </StatValue>
                        </StatItem>
                        <StatItem>
                          <StatLabel>Half Days</StatLabel>
                          <StatValue>
                            {attendanceData[year][month].halfDays}
                          </StatValue>
                        </StatItem>
                        <StatItem>
                          <StatLabel>Absent</StatLabel>
                          <StatValue>
                            {attendanceData[year][month].absent}
                          </StatValue>
                        </StatItem>
                        <StatItem>
                          <StatLabel>Over Time</StatLabel>
                          <StatValue>
                            {attendanceData[year][month].overTime}
                          </StatValue>
                        </StatItem>
                        <StatItem>
                          <StatLabel>Day Off</StatLabel>
                          <StatValue>
                            {attendanceData[year][month].dayOff}
                          </StatValue>
                        </StatItem>
                        <StatItem>
                          <StatLabel>Holidays</StatLabel>
                          <StatValue>
                            {attendanceData[year][month].holidays}
                          </StatValue>
                        </StatItem>
                      </StatsGrid>
                    </MonthDetails>
                  )}
                </MonthSection>
              ))}
            </MonthsContainer>
          )}
        </YearSection>
      ))}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const YearSection = styled.div`
  width: 100%;
  border-bottom: 1px solid #E0E3E6;
  
  &:last-child {
    border-bottom: none;
  }
`;

const YearHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  background: ${theme.colors.white};
  transition: background 0.2s;
  margin-bottom: 1rem;

  &:hover {
    background: ${theme.colors.secondaryWhite};
  }
`;

const YearTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0;
`;

const MonthsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MonthSection = styled.div`
  width: 100%;
  background: #f9fafb;
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
`;

const MonthHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f3f4f6;
  }
`;

const MonthTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0;
`;

const MonthActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

const MonthDetails = styled.div`
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  background: #ffffff;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StatLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 400;
  font-family: "Inter_18pt-Medium", sans-serif;
  color: ${theme.colors.secondaryTextColor || "#6b7280"};
  line-height: 160%;
`;

const StatValue = styled.span`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  line-height: 160%;
`;

export default ListView;

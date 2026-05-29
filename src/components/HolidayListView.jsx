import { useState, useEffect } from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import DotMenuIcon from "../assets/images/DayOff/dot-menu.svg";

const HolidayListView = ({ holidays = [], currentYear }) => {
  const [expandedMonths, setExpandedMonths] = useState([]);
  const [groupedHolidays, setGroupedHolidays] = useState({});

  useEffect(() => {
    // Group holidays by month
    const grouped = {};

    // Transform API holidays to display format
    const transformedHolidays = holidays.map((holiday) => ({
      date: new Date(holiday.date),
      holidayTitle: holiday.holidayTitle,
      description: holiday.description || "Holiday",
      remarks: holiday.Remarks,
      id: holiday.id,
    }));

    // Filter by current year and group by month
    transformedHolidays.forEach((holiday) => {
      const holidayYear = holiday.date.getFullYear();
      if (holidayYear === currentYear) {
        const monthName = holiday.date.toLocaleString("en-US", { month: "long", year: "numeric" });
        const monthKey = holiday.date.toLocaleString("en-US", { month: "long" });
        
        if (!grouped[monthKey]) {
          grouped[monthKey] = {
            fullName: monthName,
            holidays: [],
          };
        }
        
        grouped[monthKey].holidays.push(holiday);
      }
    });

    // Sort holidays within each month by date
    Object.keys(grouped).forEach((month) => {
      grouped[month].holidays.sort((a, b) => a.date - b.date);
    });

    setGroupedHolidays(grouped);
    
    // Expand first month by default
    if (Object.keys(grouped).length > 0) {
      setExpandedMonths([Object.keys(grouped)[0]]);
    }
  }, [holidays, currentYear]);

  const toggleMonth = (month) => {
    setExpandedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  };

  const totalHolidays = Object.values(groupedHolidays).reduce(
    (sum, month) => sum + month.holidays.length,
    0
  );

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Container>
      <Header>
        <Title>Total Leaves ({totalHolidays})</Title>
      </Header>

      <MonthsContainer>
        {Object.keys(groupedHolidays).map((monthKey) => {
          const monthData = groupedHolidays[monthKey];
          const isExpanded = expandedMonths.includes(monthKey);

          return (
            <MonthSection key={monthKey}>
              <MonthHeader onClick={() => toggleMonth(monthKey)}>
                <MonthInfo>
                  <MonthName>{monthData.fullName}</MonthName>
                  <LeaveCount>
                    {String(monthData.holidays.length).padStart(2, "0")} Leaves
                  </LeaveCount>
                </MonthInfo>
                {isExpanded ? (
                  <IoChevronUp size={20} color={theme.colors.textColor} />
                ) : (
                  <IoChevronDown size={20} color={theme.colors.textColor} />
                )}
              </MonthHeader>

              {isExpanded && (
                <HolidayList>
                  {monthData.holidays.map((holiday, index) => (
                    <HolidayItem key={index}>
                      <HolidayDate>{formatDate(holiday.date)}</HolidayDate>
                      <HolidayName>{holiday.holidayTitle}</HolidayName>
                      <HolidayDescription>{holiday.description}</HolidayDescription>
                      <MenuIcon>
                        <img src={DotMenuIcon} alt="menu" />
                      </MenuIcon>
                    </HolidayItem>
                  ))}
                </HolidayList>
              )}
            </MonthSection>
          );
        })}
      </MonthsContainer>
    </Container>
  );
};

export default HolidayListView;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: ${theme.colors.white};
  padding: 1.25rem;
  border-radius: 10px;
`;

const Header = styled.div`
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0;
`;

const MonthsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MonthSection = styled.div`
  width: 100%;
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
  background: #EDF6F966;

  &:hover {
    background: #ffffff;
  }
`;

const MonthInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const MonthName = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  font-family: "Inter_18pt-Medium", sans-serif;
  color: ${theme.colors.primary};
  margin: 0;
  min-width: 150px;
`;

const LeaveCount = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Inter_18pt-Medium", sans-serif;
  color: ${theme.colors.textColor};
`;

const HolidayList = styled.div`
  background: ${theme.colors.white};
  padding: 0;
`;

const HolidayItem = styled.div`
  display: grid;
  grid-template-columns: 120px 200px 1fr 40px;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${theme.colors.border};
  background: #EDF6F966;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #ffffff;
  }
`;

const HolidayDate = styled.span`
  font-size: 0.875rem;
  font-weight: 400;
  font-family: "Inter", sans-serif;
  color: ${theme.colors.textColor};
`;

const HolidayName = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
`;

const HolidayDescription = styled.span`
  font-size: 0.875rem;
  font-weight: 400;
  font-family: "Inter", sans-serif;
  color: ${theme.colors.secondaryTextColor || "#6b7280"};
`;

const MenuIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  img {
    width: 20px;
    height: 20px;
  }
`;

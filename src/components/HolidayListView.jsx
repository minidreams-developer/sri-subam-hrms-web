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
    
    // Sample holidays for demonstration
    const sampleHolidays = [
      // January
      { date: new Date(2026, 0, 1), name: "New Year", description: "New Year Holiday for staffs Only" },
      { date: new Date(2026, 0, 14), name: "Pongal", description: "Pongal Holiday for every staff and employees" },
      { date: new Date(2026, 0, 15), name: "Mattupongal", description: "Pongal Holiday for every staff and employees" },
      { date: new Date(2026, 0, 26), name: "Republic Day", description: "Republic Day Holiday for every staff and employees" },
      
      // February
      { date: new Date(2026, 1, 14), name: "Valentine's Day", description: "Valentine's Day Holiday for all staff" },
      { date: new Date(2026, 1, 20), name: "Maha Shivaratri", description: "Maha Shivaratri Holiday for every staff and employees" },
      { date: new Date(2026, 1, 28), name: "National Science Day", description: "Science Day Holiday for technical staff" },
      
      // March
      { date: new Date(2026, 2, 8), name: "International Women's Day", description: "Women's Day Holiday for female staff" },
      { date: new Date(2026, 2, 14), name: "Holi", description: "Holi Holiday for every staff and employees" },
      { date: new Date(2026, 2, 25), name: "Ugadi", description: "Ugadi Holiday for every staff and employees" },
      
      // April
      { date: new Date(2026, 3, 2), name: "Good Friday", description: "Good Friday Holiday for every staff and employees" },
      { date: new Date(2026, 3, 14), name: "Tamil New Year", description: "Tamil New Year Holiday for every staff and employees" },
      { date: new Date(2026, 3, 21), name: "Mahavir Jayanti", description: "Mahavir Jayanti Holiday for every staff and employees" },
      
      // May
      { date: new Date(2026, 4, 1), name: "May Day", description: "Labour Day Holiday for all staff" },
      { date: new Date(2026, 4, 12), name: "Buddha Purnima", description: "Buddha Purnima Holiday for every staff and employees" },
      { date: new Date(2026, 4, 26), name: "Eid al-Fitr", description: "Eid Holiday for every staff and employees" },
      
      // June
      { date: new Date(2026, 5, 15), name: "Eid al-Adha", description: "Bakrid Holiday for every staff and employees" },
      { date: new Date(2026, 5, 21), name: "International Yoga Day", description: "Yoga Day Holiday for all staff" },
      
      // July
      { date: new Date(2026, 6, 4), name: "Guru Purnima", description: "Guru Purnima Holiday for every staff and employees" },
      { date: new Date(2026, 6, 15), name: "Muharram", description: "Muharram Holiday for every staff and employees" },
      
      // August
      { date: new Date(2026, 7, 15), name: "Independence Day", description: "Independence Day Holiday for every staff and employees" },
      { date: new Date(2026, 7, 22), name: "Raksha Bandhan", description: "Raksha Bandhan Holiday for all staff" },
      { date: new Date(2026, 7, 30), name: "Janmashtami", description: "Janmashtami Holiday for every staff and employees" },
      
      // September
      { date: new Date(2026, 8, 5), name: "Teachers' Day", description: "Teachers Day Holiday for educational staff" },
      { date: new Date(2026, 8, 13), name: "Onam", description: "Onam Holiday for every staff and employees" },
      { date: new Date(2026, 8, 24), name: "Milad un-Nabi", description: "Prophet's Birthday Holiday for every staff and employees" },
      
      // October
      { date: new Date(2026, 9, 2), name: "Gandhi Jayanti", description: "Gandhi Jayanti Holiday for every staff and employees" },
      { date: new Date(2026, 9, 13), name: "Dussehra", description: "Dussehra Holiday for every staff and employees" },
      { date: new Date(2026, 9, 23), name: "Diwali", description: "Diwali Holiday for every staff and employees" },
      { date: new Date(2026, 9, 24), name: "Diwali (Second Day)", description: "Diwali Holiday for every staff and employees" },
      
      // November
      { date: new Date(2026, 10, 1), name: "Karnataka Rajyotsava", description: "Karnataka Formation Day Holiday for Karnataka staff" },
      { date: new Date(2026, 10, 12), name: "Guru Nanak Jayanti", description: "Guru Nanak Birthday Holiday for every staff and employees" },
      { date: new Date(2026, 10, 26), name: "Constitution Day", description: "Constitution Day Holiday for all staff" },
      
      // December
      { date: new Date(2026, 11, 25), name: "Christmas", description: "Christmas Holiday for every staff and employees" },
      { date: new Date(2026, 11, 31), name: "New Year's Eve", description: "Year End Holiday for all staff" },
    ];

    // Combine sample holidays with passed holidays
    const allHolidays = [...sampleHolidays];
    
    holidays.forEach((holiday) => {
      if (holiday.date) {
        allHolidays.push({
          date: new Date(holiday.date),
          name: holiday.name,
          description: holiday.remarks || `Holiday for ${holiday.people || "all"}`,
        });
      }
    });

    // Filter by current year and group by month
    allHolidays.forEach((holiday) => {
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
                      <HolidayName>{holiday.name}</HolidayName>
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

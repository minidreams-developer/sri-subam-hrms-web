import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme/theme";
import SearchInputComponent from "../../components/SearchInputComponent";
import Button from "../../components/Button";
import PlusIcon from "../../assets/images/DashboardImages/plus-large_svgrepo.com.svg";
import DotIcon from "../../assets/images/Overtime/actionDot.svg";
import Arrow from "../../assets/images/DayOff/arrow.svg";
import CalendarView from "../../components/CalendarView";
import HolidayListView from "../../components/HolidayListView";
import { deleteHoliday as removeHoliday, getHolidays } from "../../services/apiServices";
import { toast } from "react-toastify";

const DayOffAndHoliday = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const actualCurrentYear = currentDate.getFullYear();
  const [currentYear, setCurrentYear] = useState(actualCurrentYear);
  const [search, setSearch] = useState("");
  const [viewType, setViewType] = useState("Calendar View");
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [totalResults, setTotalResults] = useState(0);

  // Fetch holidays from API
  useEffect(() => {
    fetchHolidays();
  }, [currentPage, search]);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", pageSize);
      
      if (search) {
        params.append("holidayTitle", search);
      }

      const response = await getHolidays(Object.fromEntries(params));

      if (response?.results) {
        setHolidays(response.results);
        setTotalResults(response.totalResults || 0);
      } else if (Array.isArray(response)) {
        setHolidays(response);
      }
    } catch (error) {
      console.error("Error fetching holidays:", error);
      toast.error("Failed to fetch holidays");
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevYear = () => {
    setCurrentYear(currentYear - 1);
  };

  const handleNextYear = () => {
    setCurrentYear(currentYear + 1);
  };

  const handleAddHoliday = () => {
    navigate("/admin/time-hub/dayOffHolidays/createNewHoliday");
  };
  const editHoliday = (holiday) => navigate("/admin/time-hub/dayOffHolidays/createNewHoliday", { state: { holiday, mode: "edit" } });
  const deleteHoliday = async (holiday) => { if (!window.confirm(`Delete ${holiday.holidayTitle || "this holiday"}?`)) return; try { await removeHoliday(holiday.id || holiday._id); toast.success("Holiday deleted"); fetchHolidays(); } catch (error) { toast.error(error.response?.data?.message || "Failed to delete holiday"); } };

  return (
    <Container>
      <Toolbar>
        <LeftSection>
          <YearNavigation>
              <ArrowIcon src={Arrow} alt="previous" onClick={handlePrevYear}/>
            <Year>{currentYear}</Year>
              <ArrowIcon src={Arrow} alt="next" $rotate onClick={handleNextYear}/>
          </YearNavigation>
        </LeftSection>
        <RightSection>
          <ViewDropdown>
            <select
              className="form-select"
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
            >
              <option>Calendar View</option>
              <option>List View</option>
            </select>
          </ViewDropdown>
          <SearchWrap>
            <SearchInputComponent
              placeholder="Search Holidays"
              value={search}
              onSearchChange={setSearch}
              width="100%"
              height="40px"
            />
          </SearchWrap>
          <Button
            text="Add Holidays"
            bg={theme.colors.primary}
            color={theme.colors.white}
            width="10rem"
            radius="0.625rem"
            icon={<img src={PlusIcon} alt="add" width="16" height="16" />}
            onClick={handleAddHoliday}
          />
          <DotIconImg src={DotIcon} alt="menu" />
        </RightSection>
      </Toolbar>

      {viewType === "Calendar View" ? (
        <CalendarView currentYear={currentYear} showAttendance={false} holidays={holidays} />
      ) : (
        <HolidayListView holidays={holidays} currentYear={currentYear} onEdit={editHoliday} onDelete={deleteHoliday} />
      )}
    </Container>
  );
};

export default DayOffAndHoliday;

const Container = styled.div`
  width: 100%;
  padding: 1.5rem 0;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const YearNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ArrowIcon = styled.img`
  width: 2rem;
  height: 2rem;
  transform: ${(props) => (props.$rotate ? "rotate(180deg)" : "rotate(0deg)")};
  cursor: pointer;
`;

const Year = styled.span`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  min-width: 3rem;
  text-align: center;
`;

const ViewDropdown = styled.div`
  .form-select {
    height: 40px;
    border: 1px solid ${theme.colors.border};
    border-radius: 8px;
    color: ${theme.colors.textColor};
    font-size: 0.875rem;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SearchWrap = styled.div`
  width: 16rem;
`;

const DotIconImg = styled.img`
  width: 40px;
  height: 40px;
  cursor: pointer;
`;

const ComingSoonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: ${theme.colors.white};
  border-radius: 0.75rem;
  padding: 2rem;
`;

const ComingSoonText = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.secondaryText};
  margin: 0;
`;

const CalendarWrapper = styled.div`
  background: ${theme.colors.white};
  border-radius: 0.75rem;
  padding: 1.5rem;

  .fc {
    font-family: "Inter", sans-serif;
  }

  .fc-theme-standard td,
  .fc-theme-standard th {
    border: 1px solid ${theme.colors.border};
  }

  .fc-col-header-cell {
    background: ${theme.colors.white};
    padding: 1rem;
    font-weight: 400;
    font-size: 0.875rem;
    color: ${theme.colors.secondaryText};
    text-transform: capitalize;
  }

  .fc-daygrid-day {
    background: ${theme.colors.white};
    min-height: 120px;
  }

  .fc-daygrid-day-number {
    padding: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: ${theme.colors.textColor};
  }

  .fc-daygrid-day-top {
    flex-direction: row;
    justify-content: space-between;
  }

  .saturday-cell {
    background: repeating-linear-gradient(
      45deg,
      ${theme.colors.white},
      ${theme.colors.white} 10px,
      #f8f9fa 10px,
      #f8f9fa 20px
    );
  }

  .fc-event {
    border-radius: 0.375rem;
    padding: 0;
    margin: 0.25rem;
    border: none;
    overflow: hidden;
  }

  .fc-daygrid-event-harness {
    margin-bottom: 0.25rem;
  }

  .fc-event-main {
    overflow: hidden;
  }
`;

const EventCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  position: relative;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  
  &:hover {
    .dot-menu {
      opacity: 1;
    }
  }
`;


const DotMenu = styled.img`
  width: 1rem;
  height: 1rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
  
  ${EventCard}:hover & {
    opacity: 1;
  }
`;

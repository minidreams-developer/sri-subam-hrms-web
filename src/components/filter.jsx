import { useState, useEffect } from "react";
import styled from "styled-components";
import theme from "../theme/theme";
import { IoClose, IoSearch } from "react-icons/io5";
import { get } from "../helpers/api_helper";
import { GET_USERS, GET_DEPARTMENTS } from "../helpers/url_helper";
import { toast } from "react-toastify";

const Filter = ({ onClose, onApply }) => {
  const [filters, setFilters] = useState({
    departmentId: [],
    designation: [],
    joinedFrom: "",
    joinedTo: "",
    status: [],
    shiftId: [],
    sortBy: "",
  });

  const [searchDept, setSearchDept] = useState("");
  const [expandedSection, setExpandedSection] = useState("department");
  const [departmentsData, setDepartmentsData] = useState([]);
  const [designationsData, setDesignationsData] = useState([]);
  const [shiftsData, setShiftsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const statuses = [
    { label: "Active", value: "active" },
    { label: "In-Active", value: "inactive" },
    { label: "Relieved", value: "relieved" },
  ];
  const sortOptions = [
    { label: "Name (A-Z)", value: "name:asc" },
    { label: "Name (Z-A)", value: "name:desc" },
    { label: "Date (Oldest)", value: "date:asc" },
    { label: "Date (Newest)", value: "date:desc" },
  ];

  // Fetch filter data on component mount
  useEffect(() => {
    fetchFilterData();
  }, []);

  const fetchFilterData = async () => {
    setLoading(true);
    try {
      // Fetch departments
      const deptResponse = await get(GET_DEPARTMENTS);
      if (deptResponse && Array.isArray(deptResponse)) {
        setDepartmentsData(deptResponse);
      } else if (deptResponse?.results && Array.isArray(deptResponse.results)) {
        setDepartmentsData(deptResponse.results);
      } else if (deptResponse?.data && Array.isArray(deptResponse.data)) {
        setDepartmentsData(deptResponse.data);
      }

      // Fetch shifts
      const shiftResponse = await get("/v1/shifts");
      if (shiftResponse && Array.isArray(shiftResponse)) {
        setShiftsData(shiftResponse);
      } else if (shiftResponse?.results && Array.isArray(shiftResponse.results)) {
        setShiftsData(shiftResponse.results);
      } else if (shiftResponse?.data && Array.isArray(shiftResponse.data)) {
        setShiftsData(shiftResponse.data);
      }

      // Fetch unique designations (max limit is 100)
      const usersResponse = await get(`${GET_USERS}?limit=100`);
      if (usersResponse && usersResponse.results && Array.isArray(usersResponse.results)) {
        const uniqueDesignations = [...new Set(
          usersResponse.results
            .map(user => user.workInformation?.designation)
            .filter(Boolean)
        )];
        setDesignationsData(uniqueDesignations);
      }
    } catch (error) {
      console.error("Error fetching filter data:", error);
      toast.error("Failed to load filter options");
    } finally {
      setLoading(false);
    }
  };

  const filteredDepartments = departmentsData.filter((dept) => {
    const deptName = dept.departmentName || dept.name || "";
    return deptName.toLowerCase().includes(searchDept.toLowerCase());
  });

  const handleDepartmentChange = (deptId) => {
    setFilters((prev) => ({
      ...prev,
      departmentId: prev.departmentId.includes(deptId)
        ? prev.departmentId.filter((d) => d !== deptId)
        : [...prev.departmentId, deptId],
    }));
  };

  const handleDesignationChange = (designation) => {
    setFilters((prev) => ({
      ...prev,
      designation: prev.designation.includes(designation)
        ? prev.designation.filter((d) => d !== designation)
        : [...prev.designation, designation],
    }));
  };

  const handleStatusChange = (statusValue) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(statusValue)
        ? prev.status.filter((s) => s !== statusValue)
        : [...prev.status, statusValue],
    }));
  };

  const handleShiftChange = (shiftId) => {
    setFilters((prev) => ({
      ...prev,
      shiftId: prev.shiftId.includes(shiftId)
        ? prev.shiftId.filter((s) => s !== shiftId)
        : [...prev.shiftId, shiftId],
    }));
  };

  const handleClearAll = () => {
    setFilters({
      departmentId: [],
      designation: [],
      joinedFrom: "",
      joinedTo: "",
      status: [],
      shiftId: [],
      sortBy: "",
    });
    setSearchDept("");
  };

  const handleApply = () => {
    if (onApply) {
      onApply(filters);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <FilterContainer onClick={(e) => e.stopPropagation()}>
        <FilterHeader>
          <FilterTitle>Filter</FilterTitle>
          <CloseButton onClick={onClose}>
            <IoClose size={24} />
          </CloseButton>
        </FilterHeader>

        <FilterContent>
          <LeftPanel>
            <FilterOption
              active={expandedSection === "department"}
              onClick={() => setExpandedSection("department")}
            >
              Department
            </FilterOption>
            <FilterOption
              active={expandedSection === "designations"}
              onClick={() => setExpandedSection("designations")}
            >
              Designations
            </FilterOption>
            <FilterOption
              active={expandedSection === "dateRange"}
              onClick={() => setExpandedSection("dateRange")}
            >
              Date Range
            </FilterOption>
            <FilterOption
              active={expandedSection === "status"}
              onClick={() => setExpandedSection("status")}
            >
              Status
            </FilterOption>
            <FilterOption
              active={expandedSection === "shift"}
              onClick={() => setExpandedSection("shift")}
            >
              Shift
            </FilterOption>
            <FilterOption
              active={expandedSection === "sortBy"}
              onClick={() => setExpandedSection("sortBy")}
            >
              Sort By
            </FilterOption>
          </LeftPanel>

          <RightPanel>
            {expandedSection === "department" && (
              <FilterSection>
                <SectionTitle>Select Department</SectionTitle>
                <SearchBox>
                  <IoSearch size={18} color={theme.colors.primary} />
                  <SearchInput
                    type="text"
                    placeholder="Search"
                    value={searchDept}
                    onChange={(e) => setSearchDept(e.target.value)}
                  />
                </SearchBox>
                <OptionsList>
                  {filteredDepartments.map((dept) => (
                    <OptionItem key={dept.id || dept._id}>
                      <Checkbox
                        type="checkbox"
                        checked={filters.departmentId.includes(dept.id || dept._id)}
                        onChange={() => handleDepartmentChange(dept.id || dept._id)}
                      />
                      <OptionLabel>{dept.departmentName || dept.name}</OptionLabel>
                    </OptionItem>
                  ))}
                </OptionsList>
              </FilterSection>
            )}

            {expandedSection === "designations" && (
              <FilterSection>
                <SectionTitle>Select Designation</SectionTitle>
                <OptionsList>
                  {designationsData.map((designation) => (
                    <OptionItem key={designation}>
                      <Checkbox
                        type="checkbox"
                        checked={filters.designation.includes(designation)}
                        onChange={() => handleDesignationChange(designation)}
                      />
                      <OptionLabel>{designation}</OptionLabel>
                    </OptionItem>
                  ))}
                </OptionsList>
              </FilterSection>
            )}

            {expandedSection === "dateRange" && (
              <FilterSection>
                <SectionTitle>Select Date Range</SectionTitle>
                <DateInputGroup>
                  <DateInput
                    type="date"
                    value={filters.joinedFrom}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        joinedFrom: e.target.value,
                      }))
                    }
                    placeholder="Start Date"
                  />
                  <DateInput
                    type="date"
                    value={filters.joinedTo}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        joinedTo: e.target.value,
                      }))
                    }
                    placeholder="End Date"
                  />
                </DateInputGroup>
              </FilterSection>
            )}

            {expandedSection === "status" && (
              <FilterSection>
                <SectionTitle>Select Status</SectionTitle>
                <OptionsList>
                  {statuses.map((statusItem) => (
                    <OptionItem key={statusItem.value}>
                      <Checkbox
                        type="checkbox"
                        checked={filters.status.includes(statusItem.value)}
                        onChange={() => handleStatusChange(statusItem.value)}
                      />
                      <OptionLabel>{statusItem.label}</OptionLabel>
                    </OptionItem>
                  ))}
                </OptionsList>
              </FilterSection>
            )}

            {expandedSection === "shift" && (
              <FilterSection>
                <SectionTitle>Select Shift</SectionTitle>
                <OptionsList>
                  {shiftsData.map((shift) => (
                    <OptionItem key={shift.id || shift._id}>
                      <Checkbox
                        type="checkbox"
                        checked={filters.shiftId.includes(shift.id || shift._id)}
                        onChange={() => handleShiftChange(shift.id || shift._id)}
                      />
                      <OptionLabel>{shift.shiftName || shift.name}</OptionLabel>
                    </OptionItem>
                  ))}
                </OptionsList>
              </FilterSection>
            )}

            {expandedSection === "sortBy" && (
              <FilterSection>
                <SectionTitle>Sort By</SectionTitle>
                <OptionsList>
                  {sortOptions.map((option) => (
                    <OptionItem key={option.value}>
                      <RadioButton
                        type="radio"
                        name="sortBy"
                        value={option.value}
                        checked={filters.sortBy === option.value}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            sortBy: e.target.value,
                          }))
                        }
                      />
                      <OptionLabel>{option.label}</OptionLabel>
                    </OptionItem>
                  ))}
                </OptionsList>
              </FilterSection>
            )}
          </RightPanel>
        </FilterContent>

        <FilterFooter>
          <ClearButton onClick={handleClearAll}>Clear All</ClearButton>
          <ApplyButton onClick={handleApply}>Apply</ApplyButton>
        </FilterFooter>
      </FilterContainer>
    </Overlay>
  );
};

export default Filter;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const FilterContainer = styled.div`
  background: ${theme.colors.white};
  width: 620px;
  height: 527px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

  @media (max-width: 768px) {
    width: 95%;
    height: auto;
    max-height: 95vh;
  }
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${theme.colors.border};
`;

const FilterTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.secondaryText};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.colors.primary};
  }
`;

const FilterContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftPanel = styled.div`
  width: 25%;
  background-color: ${theme.colors.bgColor};
  border-right: 1px solid ${theme.colors.border};
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid ${theme.colors.border};
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
  }
`;

const FilterOption = styled.button`
  padding: 1rem 1.5rem;
  background: ${(props) =>
    props.active ? theme.colors.white : theme.colors.bgColor};
  border: none;
  border-left: 3px solid
    ${(props) => (props.active ? theme.colors.primary : "transparent")};
  color: ${(props) =>
    props.active ? theme.colors.primary : theme.colors.secondaryText};
  font-size: 0.875rem;
  font-weight: ${(props) => (props.active ? 600 : 500)};
  font-family: "Inter-Medium", sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  white-space: nowrap;

  &:hover {
    background-color: ${theme.colors.white};
    color: ${theme.colors.primary};
  }

  @media (max-width: 768px) {
    border-left: none;
    border-bottom: 3px solid
      ${(props) => (props.active ? theme.colors.primary : "transparent")};
    padding: 1rem;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background-color: ${theme.colors.bgColor};
  border: 1px solid ${theme.colors.border};
  border-radius: 0.5rem;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.875rem;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.textColor};
  outline: none;

  &::placeholder {
    color: ${theme.colors.secondaryText};
  }
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const OptionItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 0.5rem;

  &:hover {
    background-color: ${theme.colors.bgColor};
  }
`;

const Checkbox = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  accent-color: ${theme.colors.primary};
`;

const RadioButton = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  accent-color: ${theme.colors.primary};
`;

const OptionLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.textColor};
`;

const DateInputGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;
`;

const DateInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: "Inter-Medium", sans-serif;
  color: ${theme.colors.textColor};
  background-color: ${theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px ${theme.colors.primary}20;
  }

  &::placeholder {
    color: ${theme.colors.secondaryText};
  }
`;

const FilterFooter = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid ${theme.colors.border};
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const ClearButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: ${theme.colors.primary};
  border: 2px solid ${theme.colors.primary};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${theme.colors.primary}10;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ApplyButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;
